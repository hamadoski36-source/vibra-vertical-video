export function silenceVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.pause();
}

/** Only a still-active element may finish a pending playback request. */
export async function startActiveVideo(
  video: HTMLVideoElement,
  soundEnabled: boolean,
  isActive: () => boolean,
): Promise<'playing' | 'muted-fallback' | 'inactive' | 'blocked' | 'failed'> {
  if (!isActive()) { silenceVideo(video); return 'inactive'; }
  video.muted = !soundEnabled;
  video.playsInline = true;
  try {
    await video.play();
    if (!isActive()) { silenceVideo(video); return 'inactive'; }
    return 'playing';
  } catch (error) {
    if (!isActive()) { silenceVideo(video); return 'inactive'; }
    const name = error instanceof Error ? error.name : '';
    if (name === 'AbortError') return 'inactive';
    if (name !== 'NotAllowedError') return 'failed';
    video.muted = true;
    if (!soundEnabled) return 'blocked';
    try {
      await video.play();
      if (!isActive()) { silenceVideo(video); return 'inactive'; }
      return 'muted-fallback';
    } catch {
      if (!isActive()) { silenceVideo(video); return 'inactive'; }
      return 'blocked';
    }
  }
}