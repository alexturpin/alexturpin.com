import { execFileSync } from "node:child_process";

// Only the production Deploy command calls this. Preview commands stay separate.
if (process.env.WORKERS_CI !== "1" || process.env.WORKERS_CI_BRANCH !== "main") {
  throw new Error("Automatic publishing requires a Cloudflare production build on main.");
}
if (!process.env.ATPROTO_APP_PASSWORD)
  throw new Error("Missing ATPROTO_APP_PASSWORD build secret.");

function assertCurrentCommit() {
  const head = execFileSync("git", ["ls-remote", "origin", "refs/heads/main"], {
    encoding: "utf8",
  }).split(/\s/)[0];
  if (!head || head !== process.env.WORKERS_CI_COMMIT_SHA) {
    throw new Error(
      "This build is no longer the latest main commit; refusing to publish or deploy it.",
    );
  }
}

function run(...args: string[]) {
  execFileSync("pnpm", args, { stdio: "inherit" });
}

// Cloudflare's Build command runs validate before invoking this Deploy command.
assertCurrentCommit();
run("atproto:publish");
run("build"); // Incorporate confirmed publication links into the static output.
assertCurrentCommit();
run("exec", "wrangler", "deploy"); // Cloudflare Builds supplies its API token.
