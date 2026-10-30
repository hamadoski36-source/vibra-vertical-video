export function silenceVideo(video: HTMLVideoElement) {
  video.muted = true;
  video.pause();
}

/** Suspend every media element, including previews and profile thumbnails. */
export function watchPlaybackLifecycle(onSuspend: () => void, onResume: () => void) {
  const suspend = () => {
    onSuspend();
    document.querySelectorAll('video').forEach(silenceVideo);
  };
  const resume = () => { if (!document.hidden) onResume(); };
  const visibility = () => { if (document.hidden) suspend(); else resume(); };
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('pagehide', suspend);
  window.addEventListener('blur', suspend);
  window.addEventListener('focus', resume);
  window.addEventListener('pageshow', resume);
  return () => {
    document.removeEventListener('visibilitychange', visibility);
    window.removeEventListener('pagehide', suspend);
    window.removeEventListener('blur', suspend);
    window.removeEventListener('focus', resume);
    window.removeEventListener('pageshow', resume);
    suspend();
  };
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
    const name = typeof error === 'object' && error !== null && 'name' in error ? error.name : '';
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