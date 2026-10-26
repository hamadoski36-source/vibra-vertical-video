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

## Progress and profile improvements
- [x] Add and test actual video seeking and elapsed time (real video dragged forward/backward on phones and desktop)
- [x] Derive unique Followers, Following, and mutual Friends from local relationships; shared incoming follows still await real accounts
- [x] Add validated editable social links and clickable profile badges; verify save and reload
- [x] Pass all 14 regression tests and preview checks at 375×812, 412×915, and 1280×1800; existing branding unchanged (no WORLDWIDE end screen exists in this project)
