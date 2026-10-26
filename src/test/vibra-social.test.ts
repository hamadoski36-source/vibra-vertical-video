import { describe, expect, it } from 'vitest';
import { cleanFollows, followGraph, followStats, socialUrl } from '@/lib/vibra-social';

describe('Local follow relationships', () => {
  it('prevents self-following including normalized handles', () => {
    expect(cleanFollows(['me', '@ME', 'friend'], 'me')).toEqual(['friend']);
  });
  it('counts duplicate follows once', () => {
    const graph = followGraph('me', ['friend', 'friend', '@FRIEND']);
    expect(followStats('me', graph).following).toBe(1);
    expect(followStats('friend', graph).followers).toBe(1);
  });
  it('defines Friends exclusively as mutual follows', () => {
    const graph = followGraph('me', ['mutual', 'outgoing'], [{ from: 'mutual', to: 'me' }, { from: 'incoming', to: 'me' }]);
    expect(followStats('me', graph)).toEqual({ followers: 2, following: 2, friends: 1 });
  });
  it('unfollowing removes the mutual friend but preserves incoming followers', () => {
    const graph = followGraph('me', [], [{ from: 'mutual', to: 'me' }, { from: 'me', to: 'mutual' }]);
    expect(followStats('me', graph)).toEqual({ followers: 1, following: 0, friends: 0 });
  });
});
describe('Social profile links', () => {
  it('supports each requested social platform', () => {
    expect(socialUrl('youtube', 'youtube.com/@creator')).toBe('https://youtube.com/@creator');
    expect(socialUrl('instagram', 'https://instagram.com/creator')).toBe('https://instagram.com/creator');
    expect(socialUrl('x', 'https://twitter.com/creator')).toBe('https://twitter.com/creator');
    expect(socialUrl('tiktok', 'https://www.tiktok.com/@creator')).toBe('https://www.tiktok.com/@creator');
  });
  it('rejects unsafe or impersonating URLs while allowing removal', () => {
    expect(socialUrl('youtube', 'javascript:alert(1)')).toBeNull();
    expect(socialUrl('youtube', 'https://youtube.com.evil.example/')).toBeNull();
    expect(socialUrl('youtube', 'http://youtube.com/')).toBeNull();
    expect(socialUrl('youtube', '')).toBe('');
  });
});