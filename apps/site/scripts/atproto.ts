import { readFile, readdir, rename, writeFile } from "node:fs/promises";

import registry from "../atproto.json" with { type: "json" };
import { recordUri } from "../src/writing/atproto.ts";
import { assertRemoteDocumentsIncluded, prepareRecords } from "./atproto-records.ts";

const mode = process.argv[2];
if (mode !== "preview" && mode !== "publish") {
  throw new Error("Use pnpm atproto:preview or pnpm atproto:publish");
}
const directory = new URL("../content/writing/", import.meta.url);
const files = (await readdir(directory)).filter((file) => file.endsWith(".md")).sort();
const sources = await Promise.all(
  files.map(async (file) => ({
    slug: file.slice(0, -3),
    source: await readFile(new URL(file, directory), "utf8"),
  })),
);
const writes = prepareRecords(sources, registry);
const statePath = new URL("../atproto.json", import.meta.url);
async function saveState() {
  const temporary = new URL("../atproto.json.tmp", import.meta.url);
  await writeFile(temporary, `${JSON.stringify(registry, null, 2)}\n`);
  await rename(temporary, statePath);
}

// Persist identities before any network write so retries reuse the same records.
await saveState();
if (mode === "preview") {
  console.log(
    JSON.stringify(
      writes.map(({ identity, record }) => ({
        uri: recordUri(registry.did, String(record.$type), identity.rkey),
        record,
      })),
      null,
      2,
    ),
  );
  console.log(`Prepared ${writes.length - 1} articles; drafts excluded. No network requests made.`);
} else {
  const password = process.env.ATPROTO_APP_PASSWORD;
  if (!password) throw new Error("Set ATPROTO_APP_PASSWORD in .env.atproto (use an app password).");
  const didDocument = await request(`https://plc.directory/${registry.did}`);
  const services = didDocument.service;
  if (!Array.isArray(services)) throw new Error("DID document has no services");
  const pds = services.find(
    (service: unknown) => isObject(service) && service.id === "#atproto_pds",
  );
  if (!isObject(pds) || typeof pds.serviceEndpoint !== "string") throw new Error("PDS not found");
  const base = new URL(pds.serviceEndpoint);
  if (base.protocol !== "https:") throw new Error("PDS must use HTTPS");
  const session = await request(new URL("/xrpc/com.atproto.server.createSession", base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: registry.did, password }),
  });
  if (session.did !== registry.did || typeof session.accessJwt !== "string") {
    throw new Error("Authenticated account does not match atproto.json");
  }
  // A fresh CI checkout has no publication flags from previous builds.
  // Check remote records before writing anything to catch removals and slug changes.
  const includedKeys = new Set(writes.slice(1).map(({ identity }) => identity.rkey));
  let cursor: string | undefined;
  do {
    const query = new URLSearchParams({
      repo: registry.did,
      collection: "site.standard.document",
      limit: "100",
    });
    if (cursor) query.set("cursor", cursor);
    const page = await request(new URL(`/xrpc/com.atproto.repo.listRecords?${query}`, base));
    if (!Array.isArray(page.records)) throw new Error("Invalid record listing");
    const records = page.records.map((record: unknown) => {
      if (!isObject(record) || typeof record.uri !== "string" || !isObject(record.value)) {
        throw new Error("Invalid remote document");
      }
      return { uri: record.uri, value: record.value };
    });
    assertRemoteDocumentsIncluded(records, registry, includedKeys);
    cursor = typeof page.cursor === "string" ? page.cursor : undefined;
  } while (cursor);
  for (const { identity, record } of writes) {
    const collection = String(record.$type);
    const query = new URLSearchParams({ repo: registry.did, collection, rkey: identity.rkey });
    const existingResponse = await fetch(
      new URL(`/xrpc/com.atproto.repo.getRecord?${query}`, base),
      {
        signal: AbortSignal.timeout(30_000),
      },
    );
    const existing: unknown = await existingResponse.json();
    let cid: string | null = null;
    if (existingResponse.ok && isObject(existing) && typeof existing.cid === "string") {
      cid = existing.cid;
      // Ignore key ordering and timestamps when deciding whether content changed.
      if (isObject(existing.value)) {
        const { updatedAt: _updatedAt, ...value } = existing.value;
        if (canonical(value) === canonical(record)) {
          identity.published = true;
          await saveState();
          console.log(`Unchanged: ${collection}/${identity.rkey}`);
          continue;
        }
      }
    } else if (!isObject(existing) || existing.error !== "RecordNotFound") {
      throw new Error(
        `Cannot read existing record (${existingResponse.status}); refusing to overwrite`,
      );
    }
    const result = await request(new URL("/xrpc/com.atproto.repo.putRecord", base), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.accessJwt}` },
      body: JSON.stringify({
        repo: registry.did,
        collection,
        rkey: identity.rkey,
        record:
          cid && collection === "site.standard.document"
            ? { ...record, updatedAt: new Date().toISOString() }
            : record,
        swapRecord: cid,
      }),
    });
    if (result.uri !== recordUri(registry.did, collection, identity.rkey)) {
      throw new Error("PDS returned an unexpected record URI");
    }
    identity.published = true;
    await saveState();
    console.log(`Published: ${result.uri}`);
  }
  console.log(
    "Publication state saved for this build. Rebuild and deploy the website to expose verification links.",
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function request(url: string | URL, options?: RequestInit) {
  const response = await fetch(url, {
    ...options,
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok)
    throw new Error(`AT Protocol request failed (${response.status}) at ${new URL(url).pathname}`);
  const result: unknown = await response.json();
  if (!isObject(result)) throw new Error("Invalid AT Protocol response");
  return result;
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (isObject(value))
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`)
      .join(",")}}`;
  return JSON.stringify(value);
}
