import { Copy, Share2, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VibraSheet } from '@/components/vibra-sheet';
import { socialShareUrl, type ClipShare } from '@/lib/vibra-sharing';

export function VibraShare({ share, onClose, onNotice }: { share: ClipShare | null; onClose: () => void; onNotice: (text: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function copy() {
    if (!share) return;
    try { await navigator.clipboard.writeText(share.url); onNotice('Link copied!'); setError(''); }
    catch { setError('Could not copy automatically. Select and copy the link below.'); }
  }
  async function native(instagram: boolean) {
    if (!share || busy) return;
    setError('');
    if (!navigator.share) {
      setError(instagram ? 'Instagram cannot receive a link directly from this browser. Copy the link and paste it in Instagram.' : 'Your browser does not offer app sharing. Use WhatsApp, Facebook or Copy link.');
      return;
    }
    setBusy(true);
    try { await navigator.share({ title: share.title, text: share.text, url: share.url }); }
    catch (reason) { if (!(reason instanceof Error && reason.name === 'AbortError')) setError('App sharing could not open. Try Copy link.'); }
    finally { setBusy(false); }
  }
  return <VibraSheet title="Share video" open={Boolean(share)} onClose={() => { setError(''); onClose(); }}>
    {share && <div className="space-y-4">
      {!share.publicClip && <p className="text-sm text-panel-muted">This video is local, not public. These options share the Vibra app, not this video.</p>}
      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline"><a href={socialShareUrl('whatsapp', share)} target="_blank" rel="noopener noreferrer"><MessageCircle />WhatsApp</a></Button>
        <Button asChild variant="outline"><a href={socialShareUrl('facebook', share)} target="_blank" rel="noopener noreferrer"><Facebook />Facebook</a></Button>
        <Button variant="outline" disabled={busy} onClick={() => void native(true)}><Instagram />Instagram</Button>
        <Button variant="outline" disabled={busy} onClick={() => void native(false)}><Share2 />More apps</Button>
        <Button variant="outline" onClick={() => void copy()}><Copy />Copy link</Button>
      </div>
      <p className="text-sm text-panel-muted">Instagram appears in your phone’s sharing menu only when supported. Otherwise, copy the link into Instagram.</p>
      <input aria-label="Share link" readOnly value={share.url} onFocus={event => event.currentTarget.select()} />
      {error && <p role="status" className="text-sm">{error}</p>}
    </div>}
  </VibraSheet>;
}