export type ClipShare = { title: string; text: string; url: string; publicClip: boolean };

export function clipShare(origin: string, clip: { id?: string | number; caption: string; cloud?: boolean }): ClipShare {
  const url = new URL('/', origin);
  if (clip.cloud && clip.id !== undefined) url.searchParams.set('video', String(clip.id));
  return { title: 'Vibra Worldwide', text: clip.cloud ? clip.caption : 'Vibra Worldwide', url: url.href, publicClip: Boolean(clip.cloud && clip.id !== undefined) };
}

export function socialShareUrl(platform: 'whatsapp' | 'facebook', share: ClipShare): string {
  const url = new URL(platform === 'whatsapp' ? 'https://wa.me/' : 'https://www.facebook.com/sharer/sharer.php');
  url.searchParams.set(platform === 'whatsapp' ? 'text' : 'u', platform === 'whatsapp' ? `${share.text}\n${share.url}` : share.url);
  return url.href;
}