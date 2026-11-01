import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { VibraRewards } from '@/components/vibra-rewards';
import { ADMOB_CONFIG, claimDemoCoins, rewardCredit } from '@/lib/vibra-rewards';

afterEach(() => {cleanup(); vi.useRealTimers(); localStorage.clear();});
it('does not credit KSH 8 without a verified rewarded ad provider', () => {
  expect(rewardCredit()).toBe(0);
  expect(ADMOB_CONFIG.available).toBe(false);
});
it('does not modify the existing vibra_ksh balance when rewards are opened or dismissed', () => {
  localStorage.setItem('vibra_ksh', '16');
  const onChange = vi.fn();
  render(<VibraRewards onOpenChange={onChange} />);
  fireEvent.click(screen.getByRole('button', { name: 'Vibra Coins demo' }));
  expect(onChange).toHaveBeenLastCalledWith(true);
  expect(screen.getByRole('button', { name: 'Claim 8 Coins' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Close panel' }));
  expect(localStorage.getItem('vibra_ksh')).toBe('16');
  expect(onChange).toHaveBeenLastCalledWith(false);
  localStorage.removeItem('vibra_ksh');
});
it('awards exactly 8 demo coins after five seconds, saves balance and rejects double claim', () => {
  vi.useFakeTimers();
  Object.defineProperty(document, 'hidden', { value: false, configurable: true });
  localStorage.setItem('vibra_coins','8');
  render(<VibraRewards onOpenChange={() => {}} />);
  fireEvent.click(screen.getByRole('button',{name:'Vibra Coins demo'}));
  act(() => {vi.advanceTimersByTime(4000)});
  expect(screen.getByRole('button',{name:'Claim 8 Coins'})).toBeDisabled();
  act(() => {vi.advanceTimersByTime(1000)});
  fireEvent.click(screen.getByRole('button',{name:'Claim 8 Coins'}));
  expect(localStorage.getItem('vibra_coins')).toBe('16');
  expect(screen.getByRole('button',{name:'8 Coins claimed'})).toBeDisabled();
  expect(claimDemoCoins(16,0,true)).toBe(16);
});
it('does not grant demo coins before the five-second demo finishes', () => {
  expect(claimDemoCoins(8,1,false)).toBe(8);
  expect(claimDemoCoins(16,0,false)).toBe(24);
});