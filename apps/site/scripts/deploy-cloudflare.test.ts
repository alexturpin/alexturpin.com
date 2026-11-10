import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

for (const branch of [undefined, "feature/article"]) {
  await test(`automatic publishing rejects ${branch ?? "local"} runs before doing any work`, () => {
    const result = spawnSync(
      process.execPath,
      [new URL("./deploy-cloudflare.ts", import.meta.url).pathname],
      {
        env: { ...process.env, WORKERS_CI: branch ? "1" : "", WORKERS_CI_BRANCH: branch ?? "" },
        encoding: "utf8",
      },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /requires a Cloudflare production build on main/);
  });
}

await test("production publishing fails closed without its build secret", () => {
  const result = spawnSync(
    process.execPath,
    [new URL("./deploy-cloudflare.ts", import.meta.url).pathname],
    {
      env: { ...process.env, WORKERS_CI: "1", WORKERS_CI_BRANCH: "main", ATPROTO_APP_PASSWORD: "" },
      encoding: "utf8",
    },
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing ATPROTO_APP_PASSWORD build secret/);
});
