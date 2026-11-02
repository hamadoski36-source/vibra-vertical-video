import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { VibraShare } from '@/components/vibra-share';
import { clipShare } from '@/lib/vibra-sharing';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const share = clipShare('https://vibra-vertical-video.lovable.app', { id: 99, caption: 'My clip', cloud: true });
it('copies the selected public video link', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  const notice = vi.fn();
  render(<VibraShare share={share} onClose={vi.fn()} onNotice={notice} />);
  fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith('https://vibra-vertical-video.lovable.app/?video=99'));
  expect(notice).toHaveBeenCalledWith('Link copied!');
});
it('uses the phone sharing menu for Instagram, without a fabricated posting URL', async () => {
  const native = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'share', { configurable: true, value: native });
  render(<VibraShare share={share} onClose={vi.fn()} onNotice={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Instagram' }));
  await waitFor(() => expect(native).toHaveBeenCalledWith({ title: share.title, text: share.text, url: share.url }));
});
it('offers a copy fallback when Instagram app sharing is unsupported', () => {
  Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
  render(<VibraShare share={share} onClose={vi.fn()} onNotice={vi.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: 'Instagram' }));
  expect(screen.getByRole('status')).toHaveTextContent('Copy the link and paste it in Instagram.');
});