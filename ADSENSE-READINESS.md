# Vibra AdSense preparation

## Implemented, not live advertising
- Existing publisher identifier preserved: `ca-pub-6181996899763561`.
- Existing `public/ads.txt` preserved with the matching Google publisher row.
- Account-verification meta tag added; unconditionally loaded advertising script removed until approval and consent integration.
- Inactive bottom banner spaces appear after Home's video content and after the Me video grid. No interruptions between clips or banners over controls. No fake creative, ad click, revenue event or reward is generated. Real serving remains disabled pending the prerequisites below.
- Sharing continues to distinguish local content from public cloud links.

## Before real requests
1. Use the current production address **https://vibra-vertical-video.vercel.app** for Google's site review. It replaces the previously supplied broken Vercel address; it is a Vercel-hosted address, not a verified Lovable-connected custom domain.
2. The November 4, 2026 HTTPS check returned 200 for the production home page (title: Vibra Worldwide — Video feed), the matching `google-adsense-account` meta tag, and `/ads.txt` with the exact matching publisher row. The deployment-specific address `https://vibra-vertical-video-9pdjukydh-vole-world.vercel.app` redirects visitors to Vercel login, so do not use it for public Google review. These checks verify reachability and publisher-file presence, not ownership, Google approval or full deployment sync. Deploy further changes only with explicit publication authorization.
3. Finish Google site review using the matching account verification meta tag or ads.txt method in AdSense. Neither proves approval.
4. Provide the real responsive display ad-unit slot ID from the approved account. Never substitute an AdMob unit or fabricated ID.
5. Configure an appropriate consent flow before any ad requests, including Google's certified CMP requirement where applicable (EEA, UK and Switzerland). Evaluate age handling, privacy disclosures and regional rules before enabling serving.
6. Complete the site's truthful privacy/support details, shared-content moderation and public content readiness. Existing operator/contact details have not been verified; this preparation is not a legal compliance certification.
7. Integrate and verify real ad fill, no-fill/failure handling and mobile separation from swipe/tap controls. Collapse no-fill placements in the production serving flow. Keep rewards unrelated to display ads.

## Still blocked
- No real display slot, verified Google site approval or consent provider is available. The working production Vercel address is now known and checked; the previous unreachable-address blocker is resolved.
- Worldwide uploads and authenticated public-camera LIVE are separate unfinished integrations; this work does not make them operational.
- Existing LiveKit credentials are left unchanged; this address check neither rotates nor validates them.
- No purchase or publication performed. AdSense delivery, eligibility and earnings are not guaranteed.