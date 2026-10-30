import { cleanup, fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Route } from '@/routes/index';
const FIRST = 'Watu wa Mombasa 🔥 Vibra Familia!';
const SECOND = 'Bear Love Story 🐻❤️';
let observeCallback: IntersectionObserverCallback;
let observed: Element[];
beforeEach(() => {
  observed = [];
  vi.stubGlobal('IntersectionObserver', class {
    constructor(cb: IntersectionObserverCallback) { observeCallback = cb; }
    observe(el: Element) { observed.push(el); }
    disconnect() {} unobserve() {}
  });
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  Object.defineProperty(URL, 'createObjectURL', { value: vi.fn(() => 'blob:upload'), configurable: true });
  Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), configurable: true });
  Object.defineProperty(document, 'hidden', { value: false, configurable: true });
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
function start() {
  const App = Route.options.component;
  if (!App) throw new Error('Missing app');
  render(<App />);
}
function intersect(index: number) {
  const target = observed[index];
  if (!target) throw new Error('Missing feed clip');
  observeCallback([{ target, isIntersecting: true, intersectionRatio: 0.6 } as IntersectionObserverEntry], {} as IntersectionObserver);
}
it('profile likes, saves and comments apply to the selected clip', async () => {
  start();
  fireEvent.click(screen.getByRole('button', { name: `Like ${FIRST}` }));
  expect(screen.getByRole('button', { name: `Like ${FIRST}` })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: `Like ${SECOND}` })).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(screen.getByRole('button', { name: `Save ${FIRST}` }));
  expect(screen.getByRole('button', { name: `Save ${FIRST}` })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: `Comments for ${FIRST}` }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Add comment' }), { target: { value: 'Hello worldwide' } });
  fireEvent.click(screen.getByRole('button', { name: 'Post' }));
  expect(screen.getByText('Hello worldwide')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));
  fireEvent.click(screen.getByRole('button', { name: `Comments for ${SECOND}` }));
  expect(screen.queryByText('Hello worldwide')).toBeNull();
});
it('cancel keeps all clips and confirmed deletion removes only the selected owned clip', () => {
  start();
  fireEvent.click(screen.getByRole('button', { name: `Delete ${FIRST}` }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(screen.getByRole('article', { name: `Video ${FIRST}` })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: `Delete ${FIRST}` }));
  fireEvent.click(screen.getByRole('button', { name: 'Delete video' }));
  expect(screen.queryByRole('article', { name: `Video ${FIRST}` })).toBeNull();
  expect(screen.getByRole('article', { name: `Video ${SECOND}` })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Home', exact: true }));
  expect(screen.queryByRole('button', { name: 'Delete Vibra Familia Worldwide' })).toBeNull();
});
it('stats dialogs use actual session relationships and unfollow updates the counter', () => {
  start();
  fireEvent.click(screen.getByRole('button', { name: '1 Following' }));
  expect(screen.getByText('@mombasa_star')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Unfollow' }));
  fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));
  expect(screen.getByRole('button', { name: '0 Following' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '0 Followers' }));
  expect(screen.getByRole('dialog', { name: 'Followers' })).toBeInTheDocument();
});
it('only the 0.6-visible Home video gets sound and the previous element is silenced', async () => {
  start();
  fireEvent.click(screen.getByRole('button', { name: 'Home', exact: true }));
  intersect(0);
  const first = within(screen.getByRole('article', { name: `Video ${FIRST}` })).getByRole('button', { name: `Like ${FIRST}` }).closest('article')?.querySelector('video');
  const second = screen.getByRole('article', { name: `Video ${SECOND}` }).querySelector('video');
  if (!first || !second) throw new Error('Missing media');
  fireEvent.click(screen.getByRole('button', { name: 'Sound off' }));
  await waitFor(() => expect(first.muted).toBe(false));
  expect(second.muted).toBe(true);
  intersect(1);
  await waitFor(() => expect(second.muted).toBe(false));
  expect(first.muted).toBe(true);
  expect(first.pause).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Me', exact: true }));
  expect(first.muted).toBe(true);
  expect(second.muted).toBe(true);
});
it.each(['blur', 'pagehide', 'visibilitychange'])('silences every media element on %s', event => {
  start();
  const videos = [...document.querySelectorAll('video')];
  videos.forEach(video => { video.muted = false; });
  if (event === 'visibilitychange') {
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    fireEvent(document, new Event(event));
  } else fireEvent(window, new Event(event));
  videos.forEach(video => { expect(video.muted).toBe(true); expect(video.pause).toHaveBeenCalled(); });
});
it('preserves local upload composer and adds the selected file to the profile', () => {
  start();
  fireEvent.change(screen.getByLabelText('Upload file'), { target: { files: [new File(['video'], 'clip.webm', { type: 'video/webm' })] } });
  expect(screen.getByRole('dialog', { name: 'Upload' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox', { name: 'Caption' }), { target: { value: 'Fresh upload' } });
  fireEvent.click(screen.getByRole('button', { name: 'Post', exact: true }));
  expect(screen.getByRole('article', { name: 'Video Fresh upload' }).querySelector('video')).toHaveAttribute('src', 'blob:upload');
  expect(screen.getByRole('article', { name: `Video ${FIRST}` })).toBeInTheDocument();
});
