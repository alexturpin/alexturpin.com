# alexturpin.com

A pnpm workspace with two independently deployed Cloudflare Workers. No task
runner or shared package layer: pnpm filters and recursive scripts are sufficient.

| App         | Purpose                                  | Local command              |
| ----------- | ---------------------------------------- | -------------------------- |
| `apps/site` | TanStack website and Markdown publishing | `pnpm dev` (port 3000)     |
| `apps/pds`  | Cirrus Personal Data Server              | `pnpm dev:pds` (port 8787) |

Use the Node version in `.node-version` and pnpm version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm validate
```

`pnpm build`, `pnpm lint`, `pnpm typecheck`, and `pnpm test` run across the apps.
`pnpm format` formats the workspace. `pnpm preview` previews the built website.
The PDS build is a Wrangler dry run: it bundles locally without uploading anything.

Each app owns its Wrangler configuration, generated types, secrets, and local
storage. Put site environment files in `apps/site` and PDS secrets in
`apps/pds/.dev.vars`. Package scripts are authentication-neutral so Cloudflare Builds can use its API
token. For local Wrangler commands, append `--profile personal` explicitly.
The PDS hosts `@alexturpin.com` at `pds.alexturpin.com`. The existing Bluesky
account was migrated on November 10, 2026, preserving its DID.

`pnpm deploy:site` and `pnpm deploy:pds` are separate, explicit release commands.
The PDS has separate production secrets. Deploying or migrating requires separate authorization.

The blog still publishes to the existing account's current PDS. The publishing
commands remain available at the root (`pnpm atproto:preview` and
`pnpm atproto:publish`); credentials belong in `apps/site/.env.atproto`.

See [site documentation](apps/site/README.md) and [PDS documentation](apps/pds/README.md).
