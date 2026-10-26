export type FollowEdge = { from: string; to: string };
export const normalizeHandle = (handle: string) => handle.trim().replace(/^@/, '').replace(/\s+/g, '').toLowerCase();
export function cleanFollows(handles: string[], self: string) {
  return [...new Set(handles.map(normalizeHandle).filter(handle => handle && handle !== normalizeHandle(self)))];
}
export function followGraph(self: string, follows: string[], edges: FollowEdge[] = []): FollowEdge[] {
  const owner = normalizeHandle(self);
  const all = [...edges.filter(edge => normalizeHandle(edge.from) !== owner), ...cleanFollows(follows, owner).map(to => ({ from: owner, to }))];
  const seen = new Set<string>();
  return all.map(edge => ({ from: normalizeHandle(edge.from), to: normalizeHandle(edge.to) })).filter(edge => {
    const key = JSON.stringify([edge.from, edge.to]);
    if (!edge.from || !edge.to || edge.from === edge.to || seen.has(key)) return false;
    seen.add(key); return true;
  });
}
export function followStats(handle: string, edges: FollowEdge[]) {
  const account = normalizeHandle(handle);
  const followers = new Set(edges.filter(edge => edge.to === account).map(edge => edge.from));
  const following = new Set(edges.filter(edge => edge.from === account).map(edge => edge.to));
  return { followers: followers.size, following: following.size, friends: [...following].filter(user => followers.has(user)).length };
}
export const SOCIAL_PLATFORMS = [
  { key: 'youtube', label: 'YouTube', hosts: ['youtube.com', 'youtu.be'] },
  { key: 'instagram', label: 'Instagram', hosts: ['instagram.com'] },
  { key: 'x', label: 'X / Twitter', hosts: ['x.com', 'twitter.com'] },
  { key: 'tiktok', label: 'TikTok', hosts: ['tiktok.com'] },
] as const;
export type SocialLinks = Partial<Record<typeof SOCIAL_PLATFORMS[number]['key'], string>>;
export function socialUrl(key: keyof SocialLinks, value: string): string | null {
  if (!value.trim()) return '';
  try {
    const url = new URL(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`);
    const platform = SOCIAL_PLATFORMS.find(item => item.key === key);
    if (url.protocol !== 'https:' || url.username || url.password || url.port || !platform?.hosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))) return null;
    return url.href;
  } catch { return null; }
}