# Vibra migration roadmap

## Current worldwide release request — October 29, 2026
- [x] Inspect existing code, auth, storage and deployment indicators without replacing the app: React 19/TanStack Start/Vite web app with PWA manifest; uploads/media and social activity remain device-local
- [x] Run all existing tests: 20 tests across 7 files passed
- [x] Phone-sized browser check at 390×844: real local WebM upload, muted autoplay, one-tap sound and sign-in screen passed; no page errors; not a cloud or authenticated cross-account test
- [x] Check existing external account service: settings endpoint responds; email login and signup enabled, email auto-confirm currently enabled (earlier confirmation-required observation is no longer current)
- [x] Verify management access blocker: project database query reports no connected backend; no available service connections or backend management credentials; visitor-visible bucket list is empty, which does not prove there are no private buckets
- [x] Inspect Git indicators: current remotes are Lovable internal hosting, not proof of external GitHub sync; hosted GitHub status remains unverified
- [ ] Connect the EXISTING external project through Project settings → General → External Supabase → Connect; blocker: user must complete the dashboard connection, no replacement backend authorized
- [ ] Inspect existing tables, grants, policies, buckets and Auth redirect configuration after connection; reuse compatible tables and preserve all device clips
- [ ] Implement cloud video metadata and private Storage objects with owner-scoped access; public reads only for public, nondeleted videos; owner reads include drafts/private videos; test public-to-private/deleted access revocation
- [ ] Add global cursor-paginated public discovery, cloud upload progress/errors, thumbnail metadata, caption/date/creator ID and truthful shared likes/comments/views; retain working feed, playback, seeking and local clips
- [ ] Test upload/readback with two confirmed accounts and visitor browsing; reject other-user writes/deletes and private/draft/deleted media access; blocker: connected backend and authenticated test access
- [ ] Verify signup/login/logout/password-reset end to end; add private profiles and secure in-app/public account-deletion path without deleting another user's content
- [ ] Implement UGC terms acceptance, reporting, blocking, moderation, copyright requests and privacy controls before public release
- [ ] Build advertising foundation only after cloud verification: approved web solution assessment, native AdMob only in Android wrapper, consent/privacy choices, settings and reporting; blocker: approved ad account/site and real configuration
- [ ] Build creator dashboard and separate role-protected administration: 100,000 unique followers PLUS configurable valid views, eligible account, originality, guideline compliance and fraud checks; no automatic eligibility/payment
- [ ] Add configurable program rules and payout thresholds, estimated/approved/paid ledger states and history; leave earnings unavailable until verified revenue and an approved rate exist
- [ ] Prepare server-verified, idempotent, admin-approved payouts through a legitimate Kenya M-Pesa/international provider; blocker: business onboarding, provider approval/credentials, funded verified revenue and chosen program rules; never collect M-Pesa PINs
- [ ] Assess maintainable Capacitor Android wrapper while preserving hosted TanStack app; test gallery/camera, auth, upload, seeking, playback, consent, deletion and tablet navigation on physical Android
- [ ] Prepare signed AAB and APK only after package identity/signing ownership, SDK requirements and Android build environment are verified; blocker: release identity, signing and Android device validation
- [ ] Complete icon/splash/store screenshots, truthful description, privacy policy/support contact, data safety, rating and Play Console testing/submission; blocker: real operator/legal/support details and developer account; Google registration may cost US$25
- [ ] Do not publish or enable live ads/payments until tested and explicitly authorized; Google Play approval remains unverified

## Existing project inspection and accounts
- [x] Inspect framework and integrations: React 19, TanStack Start/Router, Vite, localStorage metadata and IndexedDB videos; no authentication integration installed
- [x] Run all 20 regression tests and real-video checks at 375×812 and 412×915: muted autoplay, sound across swipes, previous-video silence, forward/backward seek, Lyrics, both upload controls; no page errors and no confirmed playback defect
- [x] Check local Git configuration without exposing credentials: no GitHub remote configured; Lovable hosted Git sync status cannot be read here
- [x] Connect the user's existing Supabase project (svrjacetnlwlwesferwz) via publishable key in src/lib/supabase.ts; no secret keys in code
- [x] Add /auth (sign up, sign in, forgot password) and /reset-password screens with loading, validation, and error states; email confirmation is ON in the user's project, so signup requires clicking the email link
- [x] Rename app to Vibra Worldwide (titles, meta, brand, share text) and add new icon: favicon.png, pwa-192/512, manifest.webmanifest
- [x] Fix upload landing: feed now scrolls to the newly uploaded clip (verified playing, muted autoplay, drag seek, sound toggle at 390×844)
- [ ] Add a profiles table with owner-only RLS policies in the user's Supabase dashboard when shared profiles are built (no private data is stored server-side yet, so there is nothing to protect today)
- [ ] Full login/logout round-trip test with a confirmed email account (needs a real inbox; signup, validation, reset-email, and unconfirmed-login blocking are tested)

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
