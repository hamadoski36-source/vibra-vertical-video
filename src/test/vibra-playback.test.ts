import { expect, it, vi } from 'vitest';
import { silenceVideo, startActiveVideo } from '@/lib/vibra-playback';

function media(play = vi.fn().mockResolvedValue(undefined)) {
  return { muted: false, playsInline: false, play, pause: vi.fn() } as unknown as HTMLVideoElement;
}
it('starts the active video muted without a user tap', async () => {
  const video = media();
  expect(await startActiveVideo(video, false, () => true)).toBe('playing');
  expect(video.muted).toBe(true);
  expect(video.play).toHaveBeenCalledOnce();
});
it('keeps the sound-on choice for the next active video', async () => {
  const video = media();
  await startActiveVideo(video, true, () => true);
  expect(video.muted).toBe(false);
});
it('falls back to muted autoplay when a browser blocks sound', async () => {
  const play = vi.fn().mockRejectedValueOnce(new DOMException('Blocked', 'NotAllowedError')).mockResolvedValueOnce(undefined);
  const video = media(play);
  expect(await startActiveVideo(video, true, () => true)).toBe('muted-fallback');
  expect(video.muted).toBe(true);
  expect(play).toHaveBeenCalledTimes(2);
});
it('reports browsers that block even muted autoplay', async () => {
  const video = media(vi.fn().mockRejectedValue(new DOMException('Blocked', 'NotAllowedError')));
  expect(await startActiveVideo(video, false, () => true)).toBe('blocked');
});
it('pauses and mutes the previous video', () => {
  const video = media();
  silenceVideo(video);
  expect(video.muted).toBe(true);
  expect(video.pause).toHaveBeenCalledOnce();
});
it('silences a pending play request that completes after a swipe', async () => {
  let complete: (() => void) | undefined;
  let active = true;
  const video = media(vi.fn(() => new Promise<void>(resolve => { complete = resolve; })));
  const result = startActiveVideo(video, true, () => active);
  active = false;
  complete?.();
  expect(await result).toBe('inactive');
  expect(video.muted).toBe(true);
  expect(video.pause).toHaveBeenCalledOnce();
});