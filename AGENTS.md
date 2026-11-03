<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep mobile Home as a viewport-bounded native snap scroller; layer existing navigation over it so each clip fills the screen without changing other views.
- Store optional lyrics with each local clip and use a controlled Radix dialog for its selected ID; this preserves per-clip content and accessible dismissal without a lyrics service.
- Delete local clips by their selected ID only after a controlled confirmation and ownership check; remove only their unshared media blob and preserve other activity and profile data.
- Derive social statistics from normalized directed relationships and migrate legacy local follows without illustrative totals; this prevents duplicate and self counts while keeping existing activity.
- Keep video seeking in an isolated control subscribed to the actual media element; this avoids rerendering the feed on every playback tick.
- Centralize playback policy in the browser-safe playback helper and guard asynchronous play completion by active element identity; mute and pause inactive elements to prevent sound leaking across swipes.
- Validate social profile URLs against each platform's HTTPS hosts before saving or rendering links; this prevents unsafe clickable links.

- Suspend all media through the shared playback lifecycle helper; resume only the current view after visibility/focus returns so pending play requests cannot leak background audio.
- The current compact feed uses session-only clip/activity state and controlled Radix sheets; do not treat its local identity or demo clips as verified cloud accounts or ownership.
- Keep ad configuration in a browser-safe module and disable reward credit until a supported provider verifies completion; timers and local storage cannot verify revenue.
- Demo coins use a separate local balance and explicit no-cash labeling; never promote them to a payout or ad-revenue ledger.
- External cloud video uploads require verified account IDs and compatible owner-scoped schema; retain local mode on configuration failure instead of granting anonymous writes.
- Keep sharing in a controlled selected-clip sheet with browser-safe URL helpers; use native app sharing for Instagram and never represent a local clip link as worldwide-accessible media.
- Interleave advertising entries through the browser-safe feed helper, never overlay ads on video controls; keep ad serving off until approval, real unit IDs and consent are verified, retaining account verification without global ad scripts.
