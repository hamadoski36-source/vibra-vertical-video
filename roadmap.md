# Vibra migration roadmap

## AdSense preparation — November 3, 2026
- [ ] Prepare clearly separated advertising containers between clips, preserving playback and controls; no simulated Google ads or reward credit.
- [ ] Inspect existing AdSense script/ads.txt and prevent unapproved ad requests; document real ad-unit and consent prerequisites while the user handles Google review.
- [ ] Verify the user's actual custom-domain name and hosted status; blocker: message contains only “[my custom domain]”, not an address.
- [ ] Test between-clip navigation, video silence on advertising spaces and continued sharing/playback; no publication or purchase.

## Sharing and public LIVE — November 2, 2026
- [x] Add WhatsApp and Facebook link choices, Instagram/system sharing and copy-link in a controlled sheet; shared cloud links select the requested loaded clip, and local clips share only the app with an explicit warning.
- [x] 14 focused tests pass; 390×844 touch check verifies share links, real clipboard readback, Instagram unsupported fallback, dismissal and existing Like/LIVE controls; build OK. External app delivery and real shared cloud clip readback remain unverified because this browser has no installed apps and the existing cloud setup is incompatible.
- [ ] Real camera broadcasting and public worldwide viewing: blocked until a streaming service, verified broadcaster accounts and secure existing backend access are connected; no connections currently available. LiveKit Cloud has a capped free Build plan worth assessing; obtain consent before setup or any paid usage. Do not substitute a camera preview.

## Real buttons repair — November 2, 2026
- [x] Outside edits had replaced the main screen with look-alike buttons; restored the last tested working screen and added working Search and LIVE buttons (top, side, bottom). LIVE opens an honest "coming soon" panel.
- [x] 390×844 tap test: like 246→247, save, comment, lyrics, three LIVE buttons, search, sound, coins, upload picker, profile, edit profile, followers, home; no page errors. 23 targeted tests pass; same 5 older tests still fail.
- [ ] Real LIVE streaming needs a paid streaming service and the user's go-ahead.

## Controls, cloud and demo coins — November 1, 2026
- [x] Repair selected-video likes/comments/bookmarks, profile/Home navigation, upload composer, editable profile and three-column playable video previews; preserve zero follower totals honestly.
- [x] Inspect existing external service: videos SELECT fails because username column does not exist; vibra-videos and Vibra clips bucket checks return NoSuchBucket. No authorized administration access is available; do not provision a replacement backend.
- [x] Add browser upload adapter with authenticated user_id, Storage public URL, metadata insertion and cleanup on metadata failure; staged upload progress/status/errors. Adapter cannot be verified on real cloud until existing setup is repaired. Retain IndexedDB clips and clearly labeled Local Mode.
- [x] Add five-second demo awarding exactly 8 non-cash coins, persistent vibra_coins balance and single claim per demo; no fake sponsored/Google ad or KSH conversion.
- [x] 390×844 browser verification passes: likes 246→247, save toast, comment posting, supplied example lyric, five-second claim, balance reload, real local video upload, Profile count/preview/player, sound and blur silence. 19 focused tests pass; full suite 22 pass / 5 older compact-feed tests fail (known missing demo/relationship/delete/observer flows).
- [ ] Worldwide upload/cross-account test blocked by missing compatible videos fields, bucket and verified auth flow; owner must connect the EXISTING project for administration through Project settings → General → External Supabase → Connect. Need owner-only write policies, not public true-for-everyone.
- [ ] No deployment/commit performed. Restore five older compact-feed flows in a separate verified step; do not delete tests or claim full regression success.

## Rewards repair — November 1, 2026
- [x] Repair truncated Home route, retain device clips/profile editing, restore Home controls and upload access, and use shared playback lifecycle to stop background audio.
- [x] Make KSH 8 open a controlled unavailable panel; retain supplied AdMob IDs without a fake Google image, timer, banner, cash credit or earning claim. Preserve existing vibra_ksh without modification.
- [x] Verify 16 relevant automated tests and 390×844 browser checks: reward open/close, unchanged balance, likes, lyrics, real local WebM upload, muted autoplay, sound, reward pause/resume and blur silence. Latest build OK; no publication or purchase.
- [ ] Restore missing older compact-feed functionality separately: five pre-existing worldwide UI tests still fail because the incoming truncated route lacks its former two-clip Profile, deletion and relationship/observer flows. Keep these tests; do not imply full regression success.
- [ ] Real rewarded advertising blocked: browser app has no native Mobile Ads SDK; Google prohibits KSH cash rewards. Choose a non-transferable in-app benefit and supported web/native ad path before implementation.
- [ ] Vercel deployment unverified: existing SPA rewrite is not proof of a working TanStack server deployment; do not claim a deployment or misleading commit.

## Current interface repairs — October 30, 2026
- [x] Restore clickable right-side and two-column Profile actions; controlled stats/comments/lyrics/delete panels
- [x] Stop and mute all media on hidden/pagehide/blur; only active Home video gets sound; verify seeking
- [x] Test existing local uploads and profile thumbnails on phone-sized previews: 22 automated tests pass; 375×812 and 412×915 browser checks pass for actions, upload, muted thumbnails, sound across snaps, seeking and blur/pagehide silence; no page errors. Physical Android still needs the user’s check.
- [ ] Ads blocked pending approved advertising account, consent/privacy setup and real placement configuration; no live ads or purchases
- [ ] Current source no longer matches earlier cloud/auth completion claims; worldwide storage and secure account restoration need a separate verified step, without replacing the existing backend


## Earlier worldwide cloud feed report — October 29, 2026 (not present in current source)
- [x] Feed now reads from the cloud clips table (newest first, paginated), not localStorage; localStorage clip logic removed
- [x] Uploads go to the public 'Vibra clips' storage bucket, then a row is inserted with the public URL; success message is exactly "Uploaded worldwide!"
- [x] Matched the real table schema by probing the live API: id (number, required), title, creator, username, caption, video_url, created_at (epoch ms number); NO owner_id, user_id or visibility columns exist
- [x] Verified the real cloud path end to end with the publishable key: uploaded a real WebM to the bucket, inserted its row, read it back in the feed, confirmed the public video URL serves 200, then cleaned up the test file and row
- [x] Phone-sized browser check at 390×844: the live app loaded and fully buffered the cloud video (readyState 4); no page errors
- [x] Fixed route registration (missing Route export broke the build) and delete-path parsing for the space in the bucket name (%20 in public URLs)
- [x] Replaced 3 obsolete localStorage test files with vibra-worldwide.test.tsx (cloud feed, upload success message, delete signed-in/signed-out); all 18 tests pass, build OK
- [ ] Ownership protection for delete: the clips table has no owner column, so any signed-in user can delete any video; user must add an owner_id column in their Supabase dashboard (Table editor → clips → Add column → name: owner_id, type: text) before per-owner delete rules can return
- [ ] Tighten RLS: policies are currently true-for-everyone on clips and storage, so anyone on the internet can write or delete; narrow them once owner_id exists

## Earlier inspection — October 29, 2026
- [x] Inspect existing code, auth, storage and deployment indicators without replacing the app: React 19/TanStack Start/Vite web app with PWA manifest
- [x] Check existing external account service: settings endpoint responds; email login and signup enabled, email auto-confirm currently enabled
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
