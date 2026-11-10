<!-- intent-skills:start -->

# TanStack Intent - before editing files, run the matching guidance command.

tanstackIntent:

- id: "@tanstack/cli#add-addons-existing-app"
  run: "pnpm exec intent load @tanstack/cli#add-addons-existing-app"
  for: "Apply integrations to existing projects with tanstack add, including add-on id resolution, dependency chains, option prompts, and .cta.json project metadata preconditions."
- id: "@tanstack/cli#choose-ecosystem-integrations"
  run: "pnpm exec intent load @tanstack/cli#choose-ecosystem-integrations"
  for: "Map tanstack ecosystem partner metadata to installable add-on ids using tanstack ecosystem --json, tanstack create --list-add-ons --json, and tanstack create --addon-details --json. Covers exclusive categories, provider options, and router-only compatibility constraints."
- id: "@tanstack/cli#create-app-scaffold"
  run: "pnpm exec intent load @tanstack/cli#create-app-scaffold"
  for: "Scaffold a TanStack app with tanstack create using --framework, --build-tool, --template, --toolchain, --deployment, --add-ons, --blank, and --router-only. Covers flag compatibility, non-interactive defaults, and intent-preserving command construction."
- id: "@tanstack/cli#maintain-custom-addons-dev-watch"
  run: "pnpm exec intent load @tanstack/cli#maintain-custom-addons-dev-watch"
  for: "Build and iterate custom add-ons/templates with tanstack add-on init, add-on compile, add-on dev, and tanstack create --dev-watch, including sync loop preconditions, watch-path validation, and project metadata constraints."
- id: "@tanstack/cli#query-docs-library-metadata"
  run: "pnpm exec intent load @tanstack/cli#query-docs-library-metadata"
  for: "Retrieve machine-readable context with tanstack libraries, tanstack doc, tanstack search-docs, tanstack create --list-add-ons --json, and --addon-details for agent-safe discovery and preflight validation."
- id: "@tanstack/react-router#compositions/router-query"
  run: "pnpm exec intent load @tanstack/react-router#compositions/router-query"
  for: "Integrating TanStack Router with TanStack Query: queryClient in router context, static queries and fire-and-forget queries in loaders, useSuspenseQuery in components, defaultPreloadStaleTime: 0, setupRouterSsrQueryIntegration for SSR dehydration/hydration and streaming, per-request QueryClient isolation."
- id: "@tanstack/react-router#lifecycle/migrate-from-react-router"
  run: "pnpm exec intent load @tanstack/react-router#lifecycle/migrate-from-react-router"
  for: "Step-by-step migration from React Router v7 to TanStack Router: route definition conversion, Link/useNavigate API differences, useSearchParams to validateSearch + useSearch, useParams with from, Outlet replacement, loader conversion, code splitting differences."
- id: "@tanstack/react-router#react-router"
  run: "pnpm exec intent load @tanstack/react-router#react-router"
  for: "React bindings for TanStack Router: RouterProvider, useRouter, useRouterState, useMatch, useMatches, useLocation, useSearch, useParams, useNavigate, useLoaderData, useLoaderDeps, useRouteContext, useBlocker, useCanGoBack, Link, Navigate, Outlet, CatchBoundary, ErrorComponent. React-specific patterns for hooks, providers, SSR hydration, and createLink with forwardRef."
- id: "@tanstack/react-start#lifecycle/migrate-from-nextjs"
  run: "pnpm exec intent load @tanstack/react-start#lifecycle/migrate-from-nextjs"
  for: "Step-by-step migration from Next.js App Router to TanStack Start: route definition conversion, API mapping, server function conversion from Server Actions, middleware conversion, data fetching pattern changes."
- id: "@tanstack/react-start#react-start"
  run: "pnpm exec intent load @tanstack/react-start#react-start"
  for: "React bindings for TanStack Start: createStart, StartClient, StartServer, React-specific imports, re-exports from @tanstack/react-router, full project setup with React, useServerFn hook."
- id: "@tanstack/react-start#react-start/server-components"
  run: "pnpm exec intent load @tanstack/react-start#react-start/server-components"
  for: "Implement, review, debug, and refactor TanStack Start React Server Components in React 19 apps. Use when tasks mention @tanstack/react-start/rsc, renderServerComponent, createCompositeComponent, CompositeComponent, renderToReadableStream, createFromReadableStream, createFromFetch, Composite Components, React Flight streams, loader or query owned RSC caching, router.invalidate, structuralSharing: false, selective SSR, stale names like renderRsc or .validator, or migration from Next App Router RSC patterns. Do not use for generic SSR or non-TanStack RSC frameworks except brief comparison."
- id: "@tanstack/router-core#router-core"
  run: "pnpm exec intent load @tanstack/router-core#router-core"
  for: "Framework-agnostic core concepts for TanStack Router: route trees, createRouter, createRoute, createRootRoute, createRootRouteWithContext, addChildren, Register type declaration, route matching, route sorting, file naming conventions. Entry point for all router skills."
- id: "@tanstack/router-core#router-core/auth-and-guards"
  run: "pnpm exec intent load @tanstack/router-core#router-core/auth-and-guards"
  for: "Route protection with beforeLoad, redirect()/throw redirect(), isRedirect helper, authenticated layout routes (_authenticated), non-redirect auth (inline login), RBAC with roles and permissions, auth provider integration (Auth0, Clerk, Supabase), router context for auth state."
- id: "@tanstack/router-core#router-core/code-splitting"
  run: "pnpm exec intent load @tanstack/router-core#router-core/code-splitting"
  for: "Automatic code splitting (autoCodeSplitting), .lazy.tsx convention, createLazyFileRoute, createLazyRoute, lazyRouteComponent, getRouteApi for typed hooks in split files, codeSplitGroupings per-route override, splitBehavior programmatic config, critical vs non-critical properties."
- id: "@tanstack/router-core#router-core/data-loading"
  run: "pnpm exec intent load @tanstack/router-core#router-core/data-loading"
  for: "Route loader option, loaderDeps for cache keys, staleTime/gcTime/ defaultPreloadStaleTime SWR caching, pendingComponent/pendingMs/ pendingMinMs, errorComponent/onError/onCatch, beforeLoad, router context and createRootRouteWithContext DI pattern, router.invalidate, Await component, deferred data loading with unawaited promises."
- id: "@tanstack/router-core#router-core/navigation"
  run: "pnpm exec intent load @tanstack/router-core#router-core/navigation"
  for: "Link component, useNavigate, Navigate component, router.navigate, ToOptions/NavigateOptions/LinkOptions, from/to relative navigation, activeOptions/activeProps, preloading (intent/viewport/render), preloadDelay, navigation blocking (useBlocker, Block), createLink, linkOptions helper, scroll restoration, MatchRoute."
- id: "@tanstack/router-core#router-core/not-found-and-errors"
  run: "pnpm exec intent load @tanstack/router-core#router-core/not-found-and-errors"
  for: "notFound() function, notFoundComponent, defaultNotFoundComponent, notFoundMode (fuzzy/root), errorComponent, CatchBoundary, CatchNotFound, isNotFound, NotFoundRoute (deprecated), route masking (mask option, createRouteMask, unmaskOnReload)."
- id: "@tanstack/router-core#router-core/path-params"
  run: "pnpm exec intent load @tanstack/router-core#router-core/path-params"
  for: "Dynamic path segments ($paramName), splat routes ($ / _splat), optional params ({-$paramName}), prefix/suffix patterns ({$param}.ext), useParams, params.parse/stringify, pathParamsAllowedCharacters, i18n locale patterns."
- id: "@tanstack/router-core#router-core/search-params"
  run: "pnpm exec intent load @tanstack/router-core#router-core/search-params"
  for: "validateSearch, search param validation with Zod/Valibot/ArkType adapters, fallback(), search middlewares (retainSearchParams, stripSearchParams), custom serialization (parseSearch, stringifySearch), search param inheritance, loaderDeps for cache keys, reading and writing search params."
- id: "@tanstack/router-core#router-core/ssr"
  run: "pnpm exec intent load @tanstack/router-core#router-core/ssr"
  for: "Non-streaming and streaming SSR, RouterClient/RouterServer, renderRouterToString/renderRouterToStream, createRequestHandler, defaultRenderHandler/defaultStreamHandler, HeadContent/Scripts components, head route option (meta/links/styles/scripts), ScriptOnce, automatic loader dehydration/hydration, memory history on server, data serialization, document head management."
- id: "@tanstack/router-core#router-core/type-safety"
  run: "pnpm exec intent load @tanstack/router-core#router-core/type-safety"
  for: "Full type inference philosophy (never cast, never annotate inferred values), Register module declaration, from narrowing on hooks and Link, strict:false for shared components, getRouteApi for code-split typed access, addChildren with object syntax for TS perf, LinkProps and ValidateLinkOptions type utilities, as const satisfies pattern."
- id: "@tanstack/router-plugin#router-plugin"
  run: "pnpm exec intent load @tanstack/router-plugin#router-plugin"
  for: "TanStack Router bundler plugin for route generation and automatic code splitting. Supports Vite, Webpack, Rspack, and esbuild. Configures autoCodeSplitting, routesDirectory, target framework, and code split groupings."
- id: "@tanstack/start-client-core#start-core"
  run: "pnpm exec intent load @tanstack/start-client-core#start-core"
  for: "Core overview for TanStack Start: tanstackStart() Vite plugin, getRouter() factory, root route document shell (HeadContent, Scripts, Outlet), client/server entry points, routeTree.gen.ts, tsconfig configuration. Entry point for all Start skills."
- id: "@tanstack/start-client-core#start-core/auth-server-primitives"
  run: "pnpm exec intent load @tanstack/start-client-core#start-core/auth-server-primitives"
  for: "Server-side authentication primitives for TanStack Start: session cookies (HttpOnly, Secure, SameSite, __Host- prefix), session read/issue/destroy via createServerFn and middleware, OAuth authorization-code flow with state and PKCE, password-reset enumeration defense, CSRF for non-GET RPCs, rate limiting auth endpoints, session rotation on privilege change. Pairs with router-core/auth-and-guards for the routing side."
- id: "@tanstack/start-client-core#start-core/deployment"
  run: "pnpm exec intent load @tanstack/start-client-core#start-core/deployment"
  for: "Deploy to Cloudflare Workers, Netlify, Vercel, Node.js/Docker, Bun, Railway. Selective SSR (ssr option per route), SPA mode, static prerendering, ISR with Cache-Control headers, SEO and head management."
- id: "@tanstack/start-client-core#start-core/execution-model"
  run: "pnpm exec intent load @tanstack/start-client-core#start-core/execution-model"
  for: "Isomorphic-by-default principle, environment boundary functions (createServerFn, createServerOnlyFn, createClientOnlyFn, createIsomorphicFn), ClientOnly component, useHydrated hook, import protection, dead code elimination, environment variable safety (VITE_ prefix, process.env)."
- id: "@tanstack/start-client-core#start-core/middleware"
  run: "pnpm exec intent load @tanstack/start-client-core#start-core/middleware"
  for: "createMiddleware, request middleware (.server only), server function middleware (.client + .server), context passing via next({ context }), sendContext for client-server transfer, global middleware via createStart in src/start.ts, middleware factories, method order enforcement, fetch override precedence."
- id: "@tanstack/start-client-core#start-core/server-functions"
  run: "pnpm exec intent load @tanstack/start-client-core#start-core/server-functions"
  for: "createServerFn (GET/POST), validator (Zod or function), useServerFn hook, server context utilities (getRequest, getRequestHeader, setResponseHeader, setResponseStatus), error handling (throw errors, redirect, notFound), streaming, FormData handling, file organization (.functions.ts, .server.ts)."
- id: "@tanstack/start-client-core#start-core/server-routes"
  run: "pnpm exec intent load @tanstack/start-client-core#start-core/server-routes"
  for: "Server-side API endpoints using the server property on createFileRoute, HTTP method handlers (GET, POST, PUT, DELETE), createHandlers for per-handler middleware, handler context (request, params, context), request body parsing, response helpers, file naming for API routes."
- id: "@tanstack/start-server-core#start-server-core"
  run: "pnpm exec intent load @tanstack/start-server-core#start-server-core"
  for: "Server-side runtime for TanStack Start: createStartHandler, request/response utilities (getRequest, setResponseHeader, setCookie, getCookie, appendResponseHeader), three-phase request handling, AsyncLocalStorage context."
- id: "@tanstack/virtual-file-routes#virtual-file-routes"
  run: "pnpm exec intent load @tanstack/virtual-file-routes#virtual-file-routes"
  for: "Programmatic route tree building as an alternative to filesystem conventions: rootRoute, index, route, layout, physical, defineVirtualSubtreeConfig. Use with TanStack Router plugin's virtualRouteConfig option."

<!-- intent-skills:end -->

# alexturpin.com

- Build with TanStack Start and Router, React, and plain CSS on Cloudflare Workers.
  Prerender static content; use the Worker runtime for SSR and server functions
  when needed. TanStack Query is available for data fetching. Ask before adding
  a component library.
- Use pnpm with the pinned Node version. Run `pnpm run validate` after changes.
  Use `pnpm dev` for development and `pnpm run preview` to check the built files.
- Use the local `tanstack`, `tsr`, `wrangler`, `oxfmt`, `oxlint`, and `tsc` CLIs.
- Pass `--profile personal` to Wrangler commands that support it. Cloudflare
  provisioning, remote changes, deployments, and Git pushes require explicit authority.

## CF Stack skills

Before implementation, read the applicable installed skills and load additional
ones when the scope changes. Use the available-skills catalog to find them.

| Work                                   | Skill                               |
| -------------------------------------- | ----------------------------------- |
| Routes, loaders and Query integration  | `cf-stack:build-cf-routes`          |
| Form state, validation and submission  | `cf-stack:build-cf-forms`           |
| Cloudflare services and infrastructure | `cf-stack:choose-cf-infrastructure` |
| Dependencies, scripts and tooling      | `cf-stack:maintain-cf-tooling`      |
| Deployment and Wrangler environments   | `cf-stack:deploy-cf-app`            |
| Explicit localization requests         | `cf-stack:localize-cf-app`          |

Apply stack guidance within the personal site scope. When adding data, auth, or
application logging, read the matching `cf-stack:manage-cf-data`,
`cf-stack:integrate-cf-auth`, or `cf-stack:instrument-cf-observability` skill.
Use `cf-stack:create-cf-app` for scaffolding, `cf-stack:update-cf-skills` for
plugin updates, `cf-stack:migrate-cf-project` for adopting project guidance,
and `cf-stack:improve-cf-skills` for a skills retrospective. If a required
skill is unavailable, report which one and follow the documented conventions.

## Commit messages

- Use Conventional Commits, for example `feat: add an about page`.
- Use `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `build`, `ci`,
  `chore`, or `revert`. Add a scope only when it identifies a useful area.
- Keep the subject to 72 characters with a lowercase imperative description
  and no trailing period.
- Mark breaking changes with `!` before the colon. Explain the impact and
  migration in the body. Separate any body from the subject with a blank line.
