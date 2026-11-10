# alexturpin.com

Personal site built with React, TanStack Start and Router, and plain CSS, deployed
as a Cloudflare Worker. Static pages are prerendered; the Worker supports SSR,
server functions, and server routes. TanStack Query is wired into the router.

## Local development

Commands in this document run from `apps/site`. The workspace root also forwards
`dev`, `preview`, and the `atproto:*` commands to this app.

Use the Node version in `.node-version` and the pnpm version in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The dev server listens at http://localhost:3000. Edit `src/routes/index.tsx` for the homepage.

```sh
pnpm run validate
pnpm run preview
```

Validation checks formatting, lint and types, then prerenders the site. The
preview command runs the built Worker and assets locally through the Cloudflare
Vite plugin. The build generates the deployment configuration in `dist/server/`
and points Wrangler to it through `.wrangler/deploy/config.json`.

Add pages under `src/routes/`. The build discovers and prerenders static routes.
Configure explicit paths for parameterized routes when adding them.
Exclude request-dependent pages from prerendering in the TanStack Start plugin
configuration so they render in the Worker at request time. Prerendered pages
are served as assets before falling back to the Worker.

## Writing

Each Markdown file in `content/writing/` is a post, served at `/writing/<file name>`.
The frontmatter takes a `title` and a publication `date` (`YYYY-MM-DD`). A post
without a date is a draft: it shows in `pnpm dev` and is left out of the build.
`markdown-posts.ts` compiles the files to HTML at build time.

### Publish to AT Protocol

The website remains the canonical home for articles. Standard.site records carry
the full Markdown body in the `at.markpub.markdown` format, alongside each article's
title, publication date, and canonical path. Readers that support this format can
render the body; other readers can link to the website. Images and relative links
remain references in the Markdown; media is not uploaded to the PDS by this tool.

The public `atproto.json` registry is configured for `alexturpin.com`'s permanent
DID. The publishing command discovers the current PDS from that DID, so migrating
the account (for example to Cirrus on Workers) does not require changing this code.
Publication name and description live in `src/writing/atproto.ts`.

### Automatic publishing on push

Add or edit Markdown in `content/writing/`, set its `date` when ready, and push to
`main`. Cloudflare Builds validates the site, publishes the dated articles to the
account's current PDS, rebuilds the site with verification links, and deploys it.
Drafts (no date) are excluded. Ordinary builds, development, and preview branches
do not publish. There are no automatic Bluesky announcements.

Cloudflare's production build configuration is:

- Root directory: `apps/site`
- Build command: `pnpm run validate`
- Deploy command: `pnpm run deploy:cloudflare`
- Build secret: `ATPROTO_APP_PASSWORD`, a dedicated Cirrus app password
- Existing `NODE_VERSION` and `PNPM_VERSION` build variables match the pinned versions.

The deploy script requires Cloudflare's `WORKERS_CI=1`, branch `main`, and a commit
SHA matching the current remote `main` before publishing and again before deploying.
Old build retries therefore fail rather than intentionally rolling articles back.
Keep production releases sequential; a remote-head check cannot lock Git against
a push that arrives during publishing. Record updates use CID conflict checks.

New article IDs are deterministic from the publication and filename, so fresh
checkouts and retries use the same records. Existing IDs in `atproto.json` take
precedence. CI updates publication flags in its checkout for the final build;
it does not need to commit those generated changes back to Git.

Treat published filenames as stable URLs. To rename one while preserving its
network identity, first run `pnpm atproto:preview` with the old filename, then move
its registry entry to the new slug and commit the registry with the renamed file.
The publisher checks remote articles too: removing a published article or making
it a draft fails the release until you restore it or explicitly withdraw its PDS
record. No remote records are deleted automatically.

PDS publishing and website deployment are separate operations. If publishing
succeeds but deployment fails, retry the latest build: unchanged records are
skipped, stable IDs prevent duplicates, and the site completes its verification
links. A partially published run can likewise be retried. Until deployment
succeeds, the new article or its verification links may not be live on the site.

### Manual preview and publishing

`pnpm atproto:preview` prints proposed records without network requests and saves
IDs in `atproto.json`. For manual publishing, save an app password in the gitignored
`apps/site/.env.atproto` file (relative to the workspace root):

```dotenv
ATPROTO_APP_PASSWORD=your-app-password
```

Then run `pnpm atproto:publish` and rebuild/deploy the site. Do not run manual
publishing concurrently with Cloudflare releases. Keep credentials out of Git;
the Cloudflare credential is a build secret, not a Worker runtime binding.

The deployed site serves `/.well-known/site.standard.publication` and includes a
`site.standard.document` verification link in each published article's HTML head.
Readers can verify the relationship between the website and the PDS records.

References: [Standard.site](https://standard.site/docs/quick-start/),
[Markdown content format](https://markpub.at/), and
[CLI authentication](https://atproto.com/guides/sdk-auth).

Run `pnpm run cf:typegen` after changing Wrangler bindings or compatibility settings.

`pnpm run deploy` validates and uploads the Worker and assets using the available
credentials. For a local release, use `pnpm run deploy --profile personal`;
Cloudflare Builds uses its deployment API token. The site's production hostname and account configuration are
set when release work is authorized.
