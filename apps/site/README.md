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

```sh
pnpm atproto:preview
```

This prints the exact proposed records, excludes drafts, and saves stable record
keys in `atproto.json`. It makes no network requests. Commit that file: never reset
its IDs after publishing. For a slug rename, move the existing entry to the new
slug to retain the article's identity. Do not run publishing commands concurrently.

To publish, put an app password (not your main password) in the gitignored
`.env.atproto` file:

```dotenv
ATPROTO_APP_PASSWORD=your-app-password
```

Then explicitly run:

```sh
pnpm atproto:publish
pnpm run validate
```

Publishing writes to your actual account. It creates or updates records, skips
unchanged records, checks the existing CID before overwriting, and saves progress
after each successful write. Failed runs can be retried; a conflict requires
reviewing the remote changes first. A long run may require retrying after session
expiry. Build and development never publish anything.

After publishing, commit the updated registry and deploy the website through the
normal release process. The site then serves
`/.well-known/site.standard.publication` and each published article gets a
`site.standard.document` verification link in its HTML head. Before publication,
the endpoint returns 404 and no verification links are advertised. Until the
updated site is deployed, network verification will not be complete.

Removing a previously published article or changing it back to a draft stops
synchronization. There is deliberately no automatic remote deletion: explicitly
remove the remote record and its registry entry when withdrawing an article.
Backups or copies held by other services may remain. This integration does not
post Bluesky announcements, add comments, or migrate the account.

References: [Standard.site](https://standard.site/docs/quick-start/),
[Markdown content format](https://markpub.at/), and
[CLI authentication](https://atproto.com/guides/sdk-auth).

Run `pnpm run cf:typegen` after changing Wrangler bindings or compatibility settings.

`pnpm run deploy` validates and uploads the Worker and assets using the available
credentials. For a local release, use `pnpm run deploy --profile personal`;
Cloudflare Builds uses its deployment API token. The site's production hostname and account configuration are
set when release work is authorized.
