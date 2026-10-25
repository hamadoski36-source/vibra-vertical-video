# Vibra migration roadmap

- [x] Receive and inspect Replit export (Vibra-Video-Hub.zip)
- [x] Port Vibra app (feed, likes, comments, saves, follows, profile, upload, LIVE placeholder) into Lovable project
- [x] Update page metadata/branding
- [x] Test the app in the preview (feed renders, buttons work, upload flow)
- [x] Report migration status + next steps

## Full-screen feed and lyrics
- [x] Keep one edge-to-edge mobile clip per snap, with accessible overlays
- [x] Add per-clip Lyrics panel below Share without invented lyrics
- [x] Test phone-sized scrolling, layers, lyrics, and existing controls (375×812 and 412×915; touch snapping, close/Escape, likes, saves, comments, upload, playback and sound)

## Future (waiting on user's go-ahead)
- [x] Add confirmed deletion for owned Profile videos; automated tests and 390×844 preview verify cancellation, selected-only metadata/media deletion, reload persistence, and preservation of other videos and user data
- [ ] Real accounts + shared likes/comments/follows via Lovable Cloud (free tier available)
- [ ] Real LIVE streaming (needs an external paid streaming service)
- [ ] Creator monetization (needs Lovable Cloud + Stripe, paid)
