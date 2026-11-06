import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VibraSheet } from '@/components/vibra-sheet';

type CameraState = 'off' | 'starting' | 'on' | 'denied' | 'unavailable';

/**
 * LIVE panel: real phone-camera preview via getUserMedia.
 * Worldwide broadcasting stays disabled until a verified account and a
 * streaming service (e.g. LiveKit) are connected server-side — a camera
 * preview alone cannot send video to other people.
 */
export function VibraLive({ open, onClose }: { open: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camera, setCamera] = useState<CameraState>('off');

  function stopCamera() {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamera('off');
  }

  async function startCamera() {
    if (camera === 'starting' || camera === 'on') return;
    if (!navigator.mediaDevices?.getUserMedia) { setCamera('unavailable'); return; }
    setCamera('starting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCamera('on');
    } catch (error) {
      setCamera(error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'SecurityError') ? 'denied' : 'unavailable');
    }
  }

  // Always release the camera when the panel closes or the page unmounts.
  useEffect(() => {
    if (!open) stopCamera();
    return () => { streamRef.current?.getTracks().forEach(track => track.stop()); streamRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <VibraSheet title="LIVE" open={open} onClose={onClose}>
      <div className="space-y-3">
        <div className="live-stage">
          {camera === 'on'
            ? <video ref={videoRef} className="live-preview" muted playsInline autoPlay aria-label="Camera preview" />
            : <div className="live-preview live-preview-idle">
                {camera === 'starting' && <p>Inawasha kamera…</p>}
                {camera === 'off' && <p>Kamera imezimwa.</p>}
                {camera === 'denied' && <p>Ruhusa ya kamera imekataliwa. Fungua ruhusa kwenye mipangilio ya kivinjari kisha jaribu tena.</p>}
                {camera === 'unavailable' && <p>Kamera haipatikani kwenye kifaa hiki au kivinjari hiki.</p>}
              </div>}
        </div>
        {camera === 'on'
          ? <Button className="sheet-command w-full" onClick={stopCamera}>Zima kamera</Button>
          : <Button className="sheet-command w-full" disabled={camera === 'starting'} onClick={() => void startCamera()}>
              {camera === 'starting' ? 'Inawasha…' : '📷 Washa kamera'}
            </Button>}
        <p className="text-sm text-panel-muted">
          Hii ni hakikisho la kamera yako tu. Matangazo ya moja kwa moja kwa watu wote duniani hayajaunganishwa bado —
          yanahitaji akaunti salama na huduma ya streaming. Hakuna mtu anayekuona sasa.
        </p>
        <Button className="w-full" variant="ghost" disabled aria-disabled="true">Anza matangazo duniani (hajajaunganishwa)</Button>
      </div>
    </VibraSheet>
  );
}
