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
- Validate social profile URLs against each platform's HTTPS hosts before saving or rendering links; this prevents unsafe clickable links.
