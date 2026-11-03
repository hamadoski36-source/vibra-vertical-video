# Vibra AdSense preparation

## Implemented, not live advertising
- Existing publisher identifier preserved: `ca-pub-6181996899763561`.
- Existing `public/ads.txt` preserved with the matching Google publisher row.
- Account-verification meta tag added; unconditionally loaded advertising script removed until approval and consent integration.
- A separated full-screen advertising space appears after four clips when another clip follows. No fake creative, ad click, revenue event or reward is generated. Continue moves to the next video; previous media is silenced and removed during this space.
- Sharing continues to distinguish local content from public cloud links.

## Before real requests
1. Supply the actual custom-domain address. The current URL lookup only returned the Lovable address; no custom domain could be verified.
2. Confirm domain setup and deploy only with explicit publication authorization. Google reviews the published site, not these unpublished changes.
3. Finish Google site review using the matching account verification meta tag or ads.txt method in AdSense. Neither proves approval.
4. Provide the real responsive display ad-unit slot ID from the approved account. Never substitute an AdMob unit or fabricated ID.
5. Configure an appropriate consent flow before any ad requests, including Google's certified CMP requirement where applicable (EEA, UK and Switzerland). Evaluate age handling, privacy disclosures and regional rules before enabling serving.
6. Complete the site's truthful privacy/support details, shared-content moderation and public content readiness. Existing operator/contact details have not been verified; this preparation is not a legal compliance certification.
7. Integrate and verify real ad fill, no-fill/failure handling and mobile separation from swipe/tap controls. Collapse no-fill placements in the production serving flow. Keep rewards unrelated to display ads.

## Still blocked
- No real display slot, site approval, consent provider or actual custom-domain name is available.
- Worldwide uploads and authenticated public-camera LIVE are separate unfinished integrations; this work does not make them operational.
- No purchase or publication performed. AdSense delivery, eligibility and earnings are not guaranteed.