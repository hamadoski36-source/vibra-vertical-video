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

## Google Play readiness (planning only; after secure accounts)
- [x] Inspect existing project: no Android wrapper, AAB configuration, AdMob integration, or privacy-policy page found; only the existing favicon is present
- [ ] Verify GitHub sync and the user's existing Supabase connection before account work; preserve all local clips and app features
- [ ] Implement and test signup, login, logout, password recovery, and owner-only private profiles before release work
- [ ] Assess Capacitor Android packaging against a Trusted Web Activity; preserve TanStack web app and its server hosting, verify gallery/camera access, playback, sound, seeking, sharing, and storage on physical Android before selecting packaging
- [ ] Determine whether updating an existing Play listing or creating the first listing; verify package identity, signing ownership, and Play account access without requesting secrets in chat
- [ ] Prepare signed Android App Bundle (AAB) for Play and APK for direct device testing; verify current target SDK requirements at submission
- [ ] Confirm store app name, create approved icon and screenshots from the real app, and draft store description without claiming unavailable features
- [ ] Add an accurate publicly accessible privacy policy and support contact; review actual data flows, permissions, data safety declaration, ads declaration, age audience, and content rating
- [ ] Before shared user content launches, implement terms acceptance, reporting, user blocking, moderation, and applicable child-safety requirements; verify account deletion in-app and via a public web request path when accounts are introduced
- [ ] Explain Play Console upload, internal/closed testing, conditional production-access testing requirements, review, and staged rollout; do not claim publication until Google approval and release are confirmed
- [ ] Explain any mandatory Google registration cost upfront without purchasing or asking for upgrades

## Google AdMob (assessment only; after secure app and Android validation)
- [ ] Assess a maintained Capacitor-compatible native AdMob bridge; AdMob is for the Android app, not an ad script added to the website
- [ ] Plan restrained banners away from playback, seeking, navigation, and action controls; no automatic disruptive ads between every clip
- [ ] Consider optional rewarded ads only with a defined genuine user benefit, explicit opt-in, and verified reward completion; do not invent rewards or grant them for clicking an ad
- [ ] Guide account/app registration, review requirements, and real banner/rewarded ad-unit creation; use Google's documented test units or registered test devices during development, never invented IDs or live-ad clicks
- [ ] Implement and verify Google consent flow and privacy choices, child/age handling, SDK declarations, and applicable advertising policies before requesting ads
- [ ] Test ad load/failure/dismissal and rewards on Android, including continued feed playback and no control overlap; request real configured IDs only when live verification is ready
- [ ] Verify app readiness review and applicable app-ads.txt/store association before live advertising; do not claim integration or earnings before verification

## Progress and profile improvements
- [x] Add and test actual video seeking and elapsed time (real video dragged forward/backward on phones and desktop)
- [x] Derive unique Followers, Following, and mutual Friends from local relationships; shared incoming follows still await real accounts
- [x] Add validated editable social links and clickable profile badges; verify save and reload
- [x] Pass all 14 regression tests and preview checks at 375×812, 412×915, and 1280×1800; existing branding unchanged (no WORLDWIDE end screen exists in this project)
