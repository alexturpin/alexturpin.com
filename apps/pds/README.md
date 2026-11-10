# Personal Data Server

This app wraps `@getcirrus/pds` as its own Worker, with an account Durable Object
and R2 blob storage. Cirrus is pinned to 0.18.0 (beta). This version does not include the optional Spaces alpha. This repository contains configuration only; no Cloudflare resources
have been provisioned and no account has been migrated.

Run `pnpm build` here for an offline Wrangler bundle, or `pnpm validate` at the
workspace root to check both apps. Run `pnpm cf:typegen` here after binding changes.

## Local development

`pnpm dev:pds` generates disposable signing and authentication credentials on first
run, preserving an existing file on subsequent runs. Local
secrets belong in `.dev.vars`, which is ignored by Git. The required variables are
`AUTH_TOKEN`, `SIGNING_KEY` (hex), `SIGNING_KEY_PUBLIC` (multibase), `JWT_SECRET`,
and `PASSWORD_HASH` (bcrypt). Use a separate disposable keypair and credentials;
the configured `did:web:localhost` identity is not your real account.

Run `pnpm dev:pds` from the root. Wrangler simulates
the Durable Object and R2 locally on port 8787. The local account starts inactive
and is not registered with the public network. Local setup does not create a public identity.

## Future production setup

The intended hostname is `pds.alexturpin.com`, but it is not bound in this config.
Before deployment, configure that hostname, the chosen identity, production
secrets, account activation, relay settings, and Cloudflare resources. Account
migration is a separate operation and is not part of install, build, or dev.

Avoid running Cirrus's interactive `pds init` as a local setup command: it also
offers Cloudflare authentication and production configuration. Follow the
[Cirrus documentation](https://cirrus.earth/) when production setup is authorized.

## Dependency pin

Cirrus 0.19.0 currently fails pnpm installation: its Spaces alpha dependency
resolves to an `@atproto/lex-cbor` package containing an unpublished
`@atproto/lex-data@workspace:*` dependency. Version 0.18.0 avoids that chain.
Revisit the pin when upstream publishes an installable release; verify a clean
workspace install and local PDS startup before upgrading.
