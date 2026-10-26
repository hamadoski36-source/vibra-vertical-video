import { useEffect, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

export function playbackTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}
export function VideoProgress({ clipId, source, videos }: { clipId: string; source: string; videos: { current: Record<string, HTMLVideoElement | null> } }) {
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const video = videos.current[clipId];
    if (!video) return;
    const sync = () => {
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
      setPosition(video.currentTime);
    };
    const events = ['timeupdate', 'loadedmetadata', 'durationchange', 'seeked', 'emptied'];
    events.forEach(event => video.addEventListener(event, sync));
    sync();
    return () => events.forEach(event => video.removeEventListener(event, sync));
  }, [clipId, source, videos]);
  function seek(values: number[]) {
    const video = videos.current[clipId];
    const value = values[0];
    if (!video || value === undefined || !duration) return;
    video.currentTime = Math.max(0, Math.min(duration, value));
    setPosition(video.currentTime);
  }
  return <div className="video-progress" onClick={event => event.stopPropagation()} onPointerDown={event => event.stopPropagation()}>
    <Slider.Root className="video-seek" min={0} max={duration || 1} step={0.05} value={[Math.min(position, duration)]} disabled={!duration} onValueChange={seek}>
      <Slider.Track className="video-seek-track"><Slider.Range className="video-seek-range" /></Slider.Track>
      <Slider.Thumb className="video-seek-thumb" aria-label="Seek video" aria-valuetext={`${playbackTime(position)} of ${playbackTime(duration)}`} />
    </Slider.Root>
    <div className="video-times"><output aria-label="Elapsed time">{playbackTime(position)}</output><span>{playbackTime(duration)}</span></div>
  </div>;
}