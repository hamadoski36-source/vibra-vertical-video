import { ADSENSE_CONFIG } from '@/lib/vibra-ads';

export function VibraBanner({ placement }: { placement: 'home' | 'profile' }) {
  return <aside className="vibra-bottom-banner" aria-label={`${placement === 'home' ? 'Home' : 'Profile'} advertisement space`} data-ad-client={ADSENSE_CONFIG.publisherId} data-ad-status="not-active">
    <span>Advertisement</span>
    <p>No advertisement is being shown.</p>
  </aside>;
}