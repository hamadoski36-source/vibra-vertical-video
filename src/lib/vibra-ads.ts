/** Preparation only. Approval, a real display unit and consent integration are still required. */
export const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-6181996899763561',
  displaySlotId: null,
  servingEnabled: false,
  clipsBetweenPlacements: 4,
} as const;

export type FeedEntry<T> = { kind: 'clip'; clip: T } | { kind: 'advertisement'; after: number };
export function withAdPlacements<T>(clips: T[]): FeedEntry<T>[] {
  const result: FeedEntry<T>[] = [];
  clips.forEach((clip, index) => {
    result.push({ kind: 'clip', clip });
    if ((index + 1) % ADSENSE_CONFIG.clipsBetweenPlacements === 0 && index < clips.length - 1) {
      result.push({ kind: 'advertisement', after: index + 1 });
    }
  });
  return result;
}