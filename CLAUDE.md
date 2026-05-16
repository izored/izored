# izored — GitHub Profile Repo

## Purpose
GitHub profile repo for `izored`. Hosts `CHANGELOG.json` fetched by Framer site at dev.izo.red.

## Structure
- `CHANGELOG.json` — source of truth for site changelog. Newest entry first. Auto-updated by GitHub Actions on release.
- `.github/workflows/release-entry.yml` — fires on release publish, tag push, or `repository_dispatch` from project repos. Prepends entry to CHANGELOG.json.
- `framer/ChangelogFeed.tsx` — Framer code component. Paste into Framer Assets > Code. Fetches raw JSON, renders with type pill colors, emoji, linked project/version.
- `README.md` — GitHub profile page.

## CHANGELOG.json schema
```json
{
  "id": "003",
  "date": "YYYY-MM-DD",
  "version": "v1.0.0",
  "emoji": "🚀",
  "title": "Short title",
  "description": "One or two sentences with 🎨 emojis inline.",
  "type": "launch | update | fix | experiment | meta",
  "tags": ["RepoName"],
  "project": "RepoName",
  "projectUrl": "https://github.com/izored/RepoName",
  "releaseUrl": "https://github.com/izored/RepoName/releases/tag/v1.0.0"
}
```

## Type pill colors (Framer component)
- `launch` → green `#4ADE80`
- `update` → blue `#60A5FA`
- `fix` → orange `#FB923C`
- `experiment` → purple `#C084FC`
- `meta` → gray `#888888`

## Cross-repo automation
Each project repo (AnimIconSVG, OpenMemo, rightclick-*) has `.github/workflows/notify-changelog.yml`.
On release publish → dispatches `release-published` event here → `release-entry.yml` appends entry.
Requires `CHANGELOG_TOKEN` secret (fine-grained PAT, Contents R/W on izored/izored) in each project repo.

## Adding a new project repo
1. Push `framer/notify-changelog.yml` to the new repo (or copy `.github/workflows/notify-changelog.yml`)
2. Add `CHANGELOG_TOKEN` secret to that repo (Settings → Secrets → Actions)

## Git rules
- Never add `Co-Authored-By: Claude ...` trailer to any commit message. Clutters commit history with unwanted AI attribution. Applies to all commits, no exceptions.
