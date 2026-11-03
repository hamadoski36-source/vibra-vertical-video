import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ADSENSE_CONFIG } from '@/lib/vibra-ads';

export function VibraAdSpace({ onContinue }: { onContinue: () => void }) {
  return <section className="vibra-ad-break" aria-label="Advertising space">
    <div className="vibra-ad-inner">
      <p className="text-sm text-panel-muted">Advertisement</p>
      <div className="vibra-ad-container" data-ad-client={ADSENSE_CONFIG.publisherId} data-ad-status="not-active">
        <p className="text-sm text-panel-muted">No advertisement is being shown.</p>
      </div>
      <Button variant="outline" size="icon" aria-label="Continue to next video" title="Continue to next video" onClick={onContinue}><ArrowDown /></Button>
    </div>
  </section>;
}