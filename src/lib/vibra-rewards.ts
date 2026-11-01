export const ADMOB_CONFIG = {
  appId: 'ca-app-pub-6181996899763561~9348255750',
  rewardedUnitId: 'ca-app-pub-6181996899763561/3714453996',
  available: false,
} as const;

/** No native ad provider or verified reward event is connected to this web app. */
export function rewardCredit(): number { return 0; }