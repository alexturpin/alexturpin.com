# alexturpin.com

Personal site built with React, TanStack Start and Router, and plain CSS, deployed
as a Cloudflare Worker. Static pages are prerendered; the Worker supports SSR,
server functions, and server routes. TanStack Query is wired into the router.

## Local development

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

Run `pnpm run cf:typegen` after changing Wrangler bindings or compatibility settings.

`pnpm run deploy` validates and uploads the Worker and assets using the `personal`
Wrangler profile. The site's production hostname and account configuration are
set when release work is authorized.
