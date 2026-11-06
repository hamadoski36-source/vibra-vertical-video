import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { VibraLive } from '@/components/vibra-live';

const getUserMedia = vi.fn();
const stopTrack = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(navigator, 'mediaDevices', { value: { getUserMedia }, configurable: true });
  getUserMedia.mockResolvedValue({ getTracks: () => [{ stop: stopTrack }] });
});

afterEach(cleanup);

describe('VibraLive camera', () => {
  it('starts the phone camera when the user taps the camera button', async () => {
    render(<VibraLive open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /washa kamera/i }));
    expect(getUserMedia).toHaveBeenCalledWith({ video: { facingMode: 'user' }, audio: true });
    expect(await screen.findByLabelText('Camera preview')).toBeTruthy();
  });

  it('stops every camera track when the panel closes', async () => {
    const { rerender } = render(<VibraLive open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /washa kamera/i }));
    await screen.findByLabelText('Camera preview');
    rerender(<VibraLive open={false} onClose={() => {}} />);
    expect(stopTrack).toHaveBeenCalled();
  });

  it('never claims a worldwide broadcast is available', () => {
    render(<VibraLive open onClose={() => {}} />);
    const broadcast = screen.getByRole('button', { name: /anza matangazo duniani/i });
    expect(broadcast).toHaveProperty('disabled', true);
  });
});
