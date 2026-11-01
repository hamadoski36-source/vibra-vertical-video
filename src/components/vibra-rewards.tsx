import { Gift } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VibraSheet } from '@/components/vibra-sheet';
import { ADMOB_CONFIG } from '@/lib/vibra-rewards';

export function VibraRewards({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  function change(value: boolean) { setOpen(value); onOpenChange(value); }
  return <>
    <Button className="action-button pointer-events-auto z-[60]" aria-label="KSH 8 rewards — unavailable" onClick={() => change(true)}><Gift /><span>KSH 8</span></Button>
    <VibraSheet title="Rewards unavailable" open={open} onClose={() => change(false)}>
      <div className="space-y-4">
        <p>No rewarded ad is connected. No money has been earned or added.</p>
        <p>Google rewarded ads cannot offer cash rewards, including KSH 8. This website needs a supported web advertising setup; AdMob requires a native mobile integration.</p>
        <p className="text-sm text-panel-muted">Configured rewarded unit: {ADMOB_CONFIG.rewardedUnitId}</p>
        <Button disabled className="w-full">Claim unavailable</Button>
      </div>
    </VibraSheet>
  </>;
}