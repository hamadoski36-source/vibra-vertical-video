import { expect, it } from 'vitest';
import { clipShare, socialShareUrl } from '@/lib/vibra-sharing';

it('shares a public cloud clip by its exact ID', () => {
  const share = clipShare('https://vibra-vertical-video.lovable.app', { id: 'clip & 2', caption: 'Hello & world', cloud: true });
  expect(new URL(share.url).searchParams.get('video')).toBe('clip & 2');
  expect(share.publicClip).toBe(true);
  expect(new URL(socialShareUrl('whatsapp', share)).searchParams.get('text')).toBe(`Hello & world\n${share.url}`);
  expect(new URL(socialShareUrl('facebook', share)).searchParams.get('u')).toBe(share.url);
});
it('never advertises a device-local clip as a public shared video', () => {
  const share = clipShare('https://vibra-vertical-video.lovable.app', { id: 12, caption: 'Private local upload' });
  expect(share.url).toBe('https://vibra-vertical-video.lovable.app/');
  expect(share.publicClip).toBe(false);
  expect(share.text).toBe('Vibra Worldwide');
});