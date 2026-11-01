import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { VibraRewards } from '@/components/vibra-rewards';
import { ADMOB_CONFIG, rewardCredit } from '@/lib/vibra-rewards';

afterEach(cleanup);
it('does not credit KSH 8 without a verified rewarded ad provider', () => {
  expect(rewardCredit()).toBe(0);
  expect(ADMOB_CONFIG.available).toBe(false);
});
it('does not modify the existing vibra_ksh balance when rewards are opened or dismissed', () => {
  localStorage.setItem('vibra_ksh', '16');
  const onChange = vi.fn();
  render(<VibraRewards onOpenChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'KSH 8 rewards — unavailable' }));
  expect(onChange).toHaveBeenLastCalledWith(true);
  expect(screen.getByRole('button', { name: 'Claim unavailable' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));
  expect(localStorage.getItem('vibra_ksh')).toBe('16');
  expect(onChange).toHaveBeenLastCalledWith(false);
  localStorage.removeItem('vibra_ksh');
});