# Policy Radar

A free, Vercel-ready Next.js website for a curated policy dashboard tracking India tech policy, semiconductors, AI governance, digital competition, cybersecurity, telecom, and U.S.-India strategic technology.

## Product Direction

Policy Radar is not a raw RSS reader. It is a curated tracker that blends high-priority developments first while keeping source types clearly separated:

- Government statements: official announcements, consultations, bills, regulator releases, gazette notifications, speeches, and public documents.
- News developments: free publisher-linked reporting and discovery feeds for developments official feeds may not explain well.
- Analysis: newsletters, op-eds, explainers, and think-tank context.

Global sources such as China, EU, Japan, Korea, and Taiwan should appear only when directly relevant to India or U.S.-India policy.

## Free Stack

- Website: Next.js + TypeScript
- Hosting: Vercel Hobby/free
- CI and future refresh jobs: GitHub Actions
- Paid APIs: none
- Paid subscriptions: none

## Source Safety Model

Sources are grouped as `Live-ready`, `Candidate`, or `Needs permission`.

- `Live-ready` sources can appear in v1 because they publish RSS or are otherwise strong official/public sources.
- `Candidate` sources are useful but must pass source-health and terms checks before entering the public feed.
- `Needs permission` sources should not be ingested beyond safe link-out behavior unless permission is obtained.

This prevents broken feeds, paywalled material, or permission-sensitive publishers from quietly polluting the dashboard.

## Local Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run lint
npm run build
```

Both should pass before deploying.

## Deployment

The intended deployment target is Vercel. A typical free path is:

1. Push this project to a GitHub repository.
2. Import the repository into Vercel.
3. Let Vercel auto-detect Next.js and deploy.
4. Use GitHub Actions for future refresh/source-health jobs instead of relying on frequent Vercel cron jobs.

## Next Build Steps

- Replace static signal examples with a generated `public/data/signals.json`.
- Add a source-health script that fetches enabled sources and records failures.
- Add a manual refresh route or admin action after source-health checks exist.
- Add filters for official-only, analysis-only, consultations, major updates, and India-context-only global developments.
