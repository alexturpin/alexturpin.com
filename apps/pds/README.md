# Personal Data Server

This app wraps `@getcirrus/pds` as its own Worker, with an account Durable Object
and R2 blob storage. Cirrus is pinned to 0.18.0 (beta). This version does not include the optional Spaces alpha. Production is configured for `pds.alexturpin.com` with Alex’s existing DID.
Migration completed on November 10, 2026: Cirrus is active and the old Bluesky
PDS copy is deactivated. The existing DID, records, media, and preferences were preserved.

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

## Production

The Worker is `alexturpin-pds`, with R2 bucket `alexturpin-pds-blobs` and its own
account Durable Object. `INITIAL_ACTIVE` remains `false` so newly created account
storage starts inactive. The migrated account is already active; this setting
does not deactivate it on redeployment.

Production credentials are independent of `.dev.vars`. The private, gitignored
`.env.pds-production-backup.json` contains the signing key and generated account
password; copy it to secure backup storage. `.env.pds-production.json` contains
only the secrets accepted by Wrangler's `--secrets-file` option. Never commit
these files or use the disposable local credentials for production.

Local development overrides DID, handle, and hostname in `.dev.vars` and still
uses the test identity. Worker deployments do not change the public PLC identity
record. Account migration, identity rotation, and activation are separate,
explicitly authorized operations. See the [Cirrus migration guide](https://cirrus.earth/guides/migrate-from-bluesky/).

## Dependency pin

Cirrus 0.19.0 currently fails pnpm installation: its Spaces alpha dependency
resolves to an `@atproto/lex-cbor` package containing an unpublished
`@atproto/lex-data@workspace:*` dependency. Version 0.18.0 avoids that chain.
Revisit the pin when upstream publishes an installable release; verify a clean
workspace install and local PDS startup before upgrading.
