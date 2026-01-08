# hc-pfp

Fresh rebuild of this project.

- Old code is preserved in [`legacy/`](legacy/:line).
- New app lives in [`src/`](src/:line) (Next.js App Router).

## Dev

```bash
bun install
bun dev
```

## Tooling

- Biome: [`biome.json`](biome.json:line)
- Drizzle: [`drizzle.config.ts`](drizzle.config.ts:line), schema in [`src/lib/db/schema.ts`](src/lib/db/schema.ts:line)

## DB

1. Copy env: `cp .env.example .env.local` (or create `.env.local`)
2. Set `DATABASE_URL`
3. Generate migrations:

```bash
bun run db:generate
```

4. Run migrations:

```bash
bun run db:migrate
```

## Notes

We prefer server components/actions; avoid API routes unless needed for external clients.

Current placeholder overlay browsing is at [`src/app/overlays/page.tsx`](src/app/overlays/page.tsx:line).
