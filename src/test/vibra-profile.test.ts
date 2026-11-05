import { beforeEach, expect, it, vi } from 'vitest';
import { readCreatorAvatar, safeAvatarUrl } from '@/lib/vibra-profile';
const db=vi.hoisted(()=>({single:vi.fn(),eq:vi.fn(),select:vi.fn(),from:vi.fn()}));
vi.mock('@/lib/supabase',()=>({supabase:{from:db.from}}));
beforeEach(()=>{
  vi.clearAllMocks();
  db.from.mockReturnValue({select:db.select});
  db.select.mockReturnValue({eq:db.eq});
  db.eq.mockReturnValue({maybeSingle:db.single});
});
it('selects the avatar for only the current authenticated creator ID',async()=>{
  db.single.mockResolvedValue({data:{avatar_url:'https://example.com/logo.png'},error:null});
  expect(await readCreatorAvatar('current-user-id')).toBe('https://example.com/logo.png');
  expect(db.from).toHaveBeenCalledWith('creator_profiles');
  expect(db.eq).toHaveBeenCalledWith('user_id','current-user-id');
  expect(db.select).toHaveBeenCalledWith('avatar_url');
});
it('does not query creator profiles without an authenticated ID',async()=>{
  expect(await readCreatorAvatar('')).toBeNull();
  expect(db.from).not.toHaveBeenCalled();
});
it('rejects unsafe avatar URLs',()=>{
  expect(safeAvatarUrl('javascript:alert(1)')).toBeNull();
  expect(safeAvatarUrl('https://user:password@example.com/logo')).toBeNull();
});
it('returns no avatar for an absent profile and reports access errors',async()=>{
  db.single.mockResolvedValue({data:null,error:null});
  expect(await readCreatorAvatar('current-user-id')).toBeNull();
  db.single.mockResolvedValue({data:null,error:{message:'Denied'}});
  await expect(readCreatorAvatar('current-user-id')).rejects.toThrow('Denied');
});