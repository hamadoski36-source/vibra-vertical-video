import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { VideoProgress } from '@/components/video-progress';

afterEach(cleanup);
it('seeks the actual video forward and backward and reads elapsed playback', () => {
  const video = document.createElement('video');
  Object.defineProperty(video, 'duration', { value: 120, configurable: true });
  video.currentTime = 30;
  render(<VideoProgress clipId="selected" source="test.webm" videos={{ current: { selected: video } }}/>);
  expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('0:30');
  const slider = screen.getByRole('slider', { name: 'Seek video' });
  fireEvent.keyDown(slider, { key: 'End' });
  expect(video.currentTime).toBe(120);
  expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('2:00');
  fireEvent.keyDown(slider, { key: 'Home' });
  expect(video.currentTime).toBe(0);
  video.currentTime = 42;
  fireEvent(video, new Event('timeupdate'));
  expect(screen.getByLabelText('Elapsed time')).toHaveTextContent('0:42');
});