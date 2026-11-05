import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Route } from '@/routes/index';
const avatar=vi.hoisted(()=>vi.fn());
vi.mock('@/hooks/use-auth',()=>({useAuth:()=>({user:{id:'signed-in-creator'}})}));
vi.mock('@/lib/vibra-profile',()=>({readCreatorAvatar:avatar}));
vi.mock('@/lib/vibra-cloud',()=>({readCloudVideos:vi.fn().mockRejectedValue(Error('Local mode')),uploadCloudVideo:vi.fn()}));
beforeEach(()=>{
  vi.stubGlobal('ResizeObserver',class {observe(){} unobserve(){} disconnect(){}});
  avatar.mockResolvedValue('https://example.com/creator-logo.png');
  vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals()});
it('shows the selected authenticated creator logo on Me',async()=>{
  const App=Route.options.component;if(!App)throw Error('Missing app');render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:'👤 Me'}));
  await waitFor(()=>expect(screen.getByRole('img',{name:'Profile logo'})).toHaveAttribute('src','https://example.com/creator-logo.png'));
  expect(avatar).toHaveBeenCalledWith('signed-in-creator');
  fireEvent.click(screen.getByRole('button',{name:'Edit profile photo'}));
  expect(screen.getByRole('dialog',{name:'Edit Profile'})).toBeInTheDocument();
});