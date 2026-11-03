import { expect, it } from 'vitest';
import { ADSENSE_CONFIG, withAdPlacements } from '@/lib/vibra-ads';

it('reserves a separated placement after four clips, never after the last clip', () => {
  const entries = withAdPlacements([1, 2, 3, 4, 5]);
  expect(entries).toEqual([{kind:'clip',clip:1},{kind:'clip',clip:2},{kind:'clip',clip:3},{kind:'clip',clip:4},{kind:'advertisement',after:4},{kind:'clip',clip:5}]);
  expect(withAdPlacements([1, 2, 3, 4]).some(entry => entry.kind === 'advertisement')).toBe(false);
});
it('keeps ad serving disabled without approval, a real slot or consent integration', () => {
  expect(ADSENSE_CONFIG.servingEnabled).toBe(false);
  expect(ADSENSE_CONFIG.displaySlotId).toBe(null);
});