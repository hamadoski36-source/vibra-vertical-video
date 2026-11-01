import { Gift } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { VibraSheet } from '@/components/vibra-sheet';
import { claimDemoCoins, demoCoinBalance, DEMO_SECONDS } from '@/lib/vibra-rewards';

export function VibraRewards({ onOpenChange, onBalanceChange, onNotice }: { onOpenChange: (open: boolean) => void; onBalanceChange?: (balance: number) => void; onNotice?: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(DEMO_SECONDS);
  const [claimed, setClaimed] = useState(false);
  const claimLock = useRef(false);
  useEffect(() => {
    if (!open || remaining === 0) return;
    const timer = setInterval(() => { if (!document.hidden) setRemaining(value => Math.max(0, value - 1)); }, 1000);
    return () => clearInterval(timer);
  }, [open, remaining]);
  function change(value: boolean) {
    if (value) { setRemaining(DEMO_SECONDS); setClaimed(false); claimLock.current = false; }
    setOpen(value); onOpenChange(value);
  }
  function claim() {
    if (remaining > 0 || claimLock.current) return;
    try {
      const balance = demoCoinBalance(localStorage.getItem('vibra_coins'));
      const next = claimDemoCoins(balance, remaining, claimLock.current);
      localStorage.setItem('vibra_coins', String(next));
      claimLock.current = true; setClaimed(true); onBalanceChange?.(next);
      onNotice?.(`✅ +8 Coins! Total: ${next} — demo coins, no cash value`);
    } catch { onNotice?.('Could not save demo coins. Please allow browser storage and try again.'); }
  }
  return <>
    <Button className="action-button pointer-events-auto z-[60]" aria-label="Vibra Coins demo" onClick={() => change(true)}><Gift /><span>8 Coins</span></Button>
    <VibraSheet title="VIBRA COINS · Demo" open={open} onClose={() => change(false)}>
      <div className="space-y-4">
        <div className="coin-demo"><img src="/pwa-192x192.png" alt="Vibra Worldwide" /><p className="font-bold">Mombasa · Support Vibra</p><p>Demo preview — not a sponsored advertisement</p><output aria-label="Demo countdown">{remaining > 0 ? remaining : 'Ready'}</output></div>
        <p className="text-sm text-panel-muted">Demo coins have no cash value, cannot be withdrawn, and are not earned from Google ads.</p>
        <Button disabled={remaining > 0 || claimed} className={`sheet-command w-full ${remaining === 0 && !claimed ? 'coin-ready' : ''}`} onClick={claim}>{claimed ? '8 Coins claimed' : 'Claim 8 Coins'}</Button>
      </div>
    </VibraSheet>
  </>;
}