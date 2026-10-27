# Vibra migration roadmap

## Existing project inspection and accounts
- [x] Inspect framework and integrations: React 19, TanStack Start/Router, Vite, localStorage metadata and IndexedDB videos; no authentication integration installed
- [x] Run all 20 regression tests and real-video checks at 375×812 and 412×915: muted autoplay, sound across swipes, previous-video silence, forward/backward seek, Lyrics, both upload controls; no page errors and no confirmed playback defect
- [x] Check local Git configuration without exposing credentials: no GitHub remote configured; Lovable hosted Git sync status cannot be read here
- [ ] Verify user's existing external Supabase connection and hosted auth settings — waiting for user to connect/select that project in Settings → General → External Supabase
- [ ] Add email signup/login, logout, public password recovery, and private owner-only profiles after connection verification; preserve local clips and existing features

## Active video autoplay and upload access
- [x] Start active videos muted automatically; preserve one-tap sound choice during swipes and safely fall back when blocked
- [x] Pause and mute inactive videos, preserve seeking, and add visible Profile upload access
- [x] All 20 tests passed; 375×812 and 412×915 Chromium phone checks verified real uploads via top + and Profile, muted autoplay after reload, sound across touch swipes, previous-video silence, and dragging both directions; no page errors, build OK, not published. Physical Android browser restrictions remain for the user's test.

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
- [ ] Real accounts and private profiles using the user's existing external Supabase project; shared likes/comments/follows remain a later step
- [ ] Real LIVE streaming (needs an external paid streaming service)
- [ ] Creator monetization (needs Lovable Cloud + Stripe, paid)

## Progress and profile improvements
- [x] Add and test actual video seeking and elapsed time (real video dragged forward/backward on phones and desktop)
- [x] Derive unique Followers, Following, and mutual Friends from local relationships; shared incoming follows still await real accounts
- [x] Add validated editable social links and clickable profile badges; verify save and reload
- [x] Pass all 14 regression tests and preview checks at 375×812, 412×915, and 1280×1800; existing branding unchanged (no WORLDWIDE end screen exists in this project)
