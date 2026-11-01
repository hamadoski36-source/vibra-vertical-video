export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-6181996899763561~9348255750',
  rewardedUnitId: 'ca-app-pub-6181996899763561/3714453996',
  available: false,
} as const;

/** No native ad provider or verified reward event is connected to this web app. */
export function rewardCredit(): number { return 0; }

export const DEMO_REWARD = 8;
export const DEMO_SECONDS = 5;
export function demoCoinBalance(value: string | null) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : 0;
}
export function claimDemoCoins(balance: number, remaining: number, claimed: boolean) {
  if (remaining > 0 || claimed) return balance;
  const next = balance + DEMO_REWARD;
  return Number.isSafeInteger(next) ? next : balance;
}