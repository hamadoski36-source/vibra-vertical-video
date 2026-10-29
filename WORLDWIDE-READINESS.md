# VIBRA WORLDWIDE — staged release readiness

## Verified inspection

The existing app is React 19 with TanStack Start/Router and Vite. It is a hosted web app with a PWA manifest, not a verified native Android release. Keep its existing feed and visual design.

The existing external account service responds using its browser-safe publishable key. Current hosted settings allow email login/signup and enable automatic email confirmation. Successful account login/logout and recovery were not exercised with a real account during this inspection. Account data is not yet the identity layer for clips or social activity.

Clips remain in IndexedDB; profile/activity metadata remains in localStorage. No shared video queries or cloud-upload calls exist in the reviewed feed. All 20 existing regression tests passed. These tests do not establish database security, cloud uploads, cross-account discovery, ads, payouts or Android readiness.

Management access is not connected: the project database command returns no connected backend. There are no available external service connections or backend management credentials. Visitor bucket listing returns no visible buckets; private buckets and policies cannot be inferred from that. Repository remotes are internal Lovable hosts, not verification of external GitHub sync.

## First required phone action

In this existing Lovable project, open **Project settings → General → External Supabase → Connect** and select the existing project `svrjacetnlwlwesferwz`. Do not create a replacement project or paste private keys into chat. Check **Project settings → Git** separately to confirm the intended GitHub repository and branch. Management access must be verified after connection before migrations are applied.

## Phase 1 — cloud videos and accounts

- Inspect/reuse current tables and policies before adding anything. Stable authenticated user IDs authorize cloud operations; mutable profile handles never authorize access.
- Store file paths, creator ID, caption/title, creation date, visibility, deletion/moderation state and thumbnail metadata. Model likes, comments, follows and views as normalized records, not client-editable totals.
- Every public table migration includes explicit grants, then RLS, then narrow policies. Owners read their hidden rows; visitors read only public, approved, nondeleted content. Owners alone edit/delete their uploads.
- Use private video/thumbnail buckets with owner-prefixed object paths and policies tied to metadata visibility. Never treat an unguessable URL as privacy. Do not offer signed URLs with a lifetime that violates required private/deleted revocation; verify an appropriate revocable access strategy before implementation.
- Stage upload privately; persist metadata; publish only after file and metadata succeed. Failed uploads must not show success; preserve recoverable drafts. Existing local clips remain intact and require explicit migration, not silent ownership reassignment.
- Fetch public content with stable cursor pagination. Owner collections separately include drafts/private clips. Reuse the existing playback helper, active-video pause/mute policy and isolated seeking control.
- Add real shared activity without labeling raw playback events as fraud-validated reward views. Define validation and qualification before reward credit.
- Test two distinct authenticated accounts and an independent visitor browser: create/upload/read back, public discovery, playback, own edits/delete, forbidden other-user edits/delete, and private/draft/deleted denial. Exercise public-to-private and deletion transitions including previously acquired media access.
- Verify signup/login/logout/recovery, owner-private profiles and account deletion; real accounts and access are prerequisites, not mocked verification.

## Phase 2 — safe public content and advertising

Public UGC requires accepted terms/community rules, reporting, user blocking, moderation, copyright handling, privacy choices, operator support contact and account deletion. Add child-safety obligations appropriate to the audience and store category. Do not fabricate operator identity, support details or legal disclosures.

Assess an approved website advertising program for the web app. Native AdMob requires Android SDK integration through the eventual wrapper; it is not a website script. Keep ads separate from playback and seeking controls, avoid excessive interruptions, and label actual sponsored placements. Keep serving disabled until approval, consent, real configuration and tests exist. No fake placements, claimed revenue, live-ad test clicks or invented ad-unit IDs. Reporting records must distinguish ad configuration, delivery and provider-verified revenue.

## Phase 3 — Creator Rewards

The follower requirement is **100,000 unique real followers**, not sufficient by itself. Require configurable valid public views, eligible account, original content, guideline compliance, fraud checks and admin approval. Minimum views, payout threshold, rate, currency, eligible countries and revenue allocation are not supplied yet; leave them unset/disabled rather than invent values.

Use separately protected role membership and server-verified admin actions. Creators cannot edit valid view counts, rates, approvals, balances or payout status. Record estimates separately from approved earnings and provider-confirmed paid earnings. Keep immutable audit/ledger history, review/reversal handling and idempotent payouts. No automatic payment on threshold attainment.

Assess approved Safaricom B2C/Daraja or a verified legitimate disbursement provider for Kenya M-Pesa plus supported international methods. Business onboarding, secure credentials, verified recipient details, funded revenue, approval and provider reconciliation are prerequisites. Never ask for or store creators' M-Pesa PINs. Do not use a checkout payment integration as proof that creator disbursements are supported.

## Phase 4 — Android and Google Play

Evaluate Capacitor as a maintainable wrapper with native media/ads capabilities while retaining the hosted TanStack server. A wrapper alone does not prove Android compatibility. Validate local data retention across upgrades and web-to-app migration, browser codec restrictions, gallery/camera permissions, native sharing, deep links for recovery, phones/tablets and lifecycle pause/resume on real Android.

Required before a production AAB: confirmed package ID and existing-listing identity, upload key/signing ownership, Play App Signing, current target SDK, Android build tooling, correct least-privilege permissions, and physical-device release tests. Keep signing credentials outside source and chat. Prepare icon/splash and real screenshots, privacy policy and public deletion request URL, truthful store description, Data safety, ads declaration, audience/content rating and moderation information.

Play Console registration is normally **US$25 one-time** if no account exists. New personal accounts may require 12 opted-in testers for 14 continuous days before applying for production access; verify the actual account's requirements. Confirm target SDK at submission rather than hardcoding an outdated deadline. No signed AAB, store upload or Google approval has been verified.

## Costs and source references

Video storage/delivery, moderation, payouts and external build services may incur costs; obtain applicable limits and fees before activation. No purchases, live ad serving, payouts or publication are authorized by this readiness document.

- Play requirements: https://developer.android.com/google/play/requirements/target-sdk
- App bundles: https://developer.android.com/guide/app-bundle
- App signing: https://developer.android.com/studio/publish/app-signing
- Developer account/testing: https://support.google.com/googleplay/android-developer/answer/6112435 and https://support.google.com/googleplay/android-developer/answer/14151465
- UGC policy: https://support.google.com/googleplay/android-developer/answer/9876937
- Account deletion: https://support.google.com/googleplay/android-developer/answer/13327111
- AdMob Android/consent: https://developers.google.com/admob/android/quick-start and https://developers.google.com/admob/android/privacy
- Web advertising: https://support.google.com/adsense/answer/48182
- Kenya payouts: https://developer.safaricom.co.ke/ and https://developers.intasend.com/docs/m-pesa-b2c