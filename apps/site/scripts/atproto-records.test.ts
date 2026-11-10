import assert from "node:assert/strict";
import { test } from "node:test";

import { documentUri, publicationUri } from "../src/writing/atproto.ts";
import { assertRemoteDocumentsIncluded, prepareRecords } from "./atproto-records.ts";

import type { PublicationRegistry } from "../src/writing/atproto.ts";

function state(): PublicationRegistry {
  return {
    did: "did:plc:kknhrqqcdsrn3zkmtxpah4u6",
    publication: { rkey: "", published: false },
    documents: {},
  };
}

const article = {
  slug: "hello",
  source: "---\ntitle: Hello\ndate: 2026-11-10\n---\n## A heading\n\n**Full** content.",
};

await test("drafts never enter the publication plan or receive record IDs", () => {
  const registry = state();
  const records = prepareRecords(
    [{ slug: "draft", source: "---\ntitle: Secret\n---\nPrivate body" }],
    registry,
  );
  assert.equal(records.length, 1);
  assert.deepEqual(registry.documents, {});
  assert.ok(!JSON.stringify(records).includes("Private body"));
});

await test("edits preserve identity and carry full Markdown without frontmatter", () => {
  const registry = state();
  const first = prepareRecords([article], registry);
  const before = structuredClone(registry);
  const second = prepareRecords(
    [{ ...article, source: article.source.replace("Hello", "Edited") }],
    registry,
  );
  assert.deepEqual(registry, before);
  assert.equal(second[1].record.title, "Edited");
  assert.deepEqual(first[1].record.content, {
    $type: "at.markpub.markdown",
    flavor: "gfm",
    renderingRules: "marked",
    text: { $type: "at.markpub.text", markdown: "## A heading\n\n**Full** content." },
  });
  assert.equal(first[1].record.path, "/writing/hello");
});

await test("verification links appear only after successful publication", () => {
  const registry = state();
  prepareRecords([article], registry);
  assert.equal(publicationUri(registry), null);
  assert.equal(documentUri("hello", registry), null);
  registry.publication.published = true;
  registry.documents.hello.published = true;
  assert.equal(
    documentUri("hello", registry),
    `at://${registry.did}/site.standard.document/${registry.documents.hello.rkey}`,
  );
  assert.equal(documentUri("missing", registry), null);
});

await test("missing published articles stop synchronization instead of silently orphaning records", () => {
  const registry = state();
  prepareRecords([article], registry);
  registry.documents.hello.published = true;
  assert.throws(() => prepareRecords([], registry), /missing or drafts/);
});

await test("invalid dates and duplicate IDs are rejected before publishing", () => {
  const registry = state();
  assert.throws(
    () =>
      prepareRecords(
        [{ ...article, source: article.source.replace("2026-11-10", "2026-02-30") }],
        registry,
      ),
    /invalid calendar date/,
  );
  prepareRecords([article], registry);
  registry.documents.hello.rkey = registry.publication.rkey;
  assert.throws(() => prepareRecords([article], registry), /Duplicate record keys/);
});

await test("fresh CI checkouts produce the same article identities across edits", () => {
  const first = state();
  const second = state();
  prepareRecords([article], first);
  prepareRecords([{ ...article, source: article.source.replace("Hello", "Changed") }], second);
  assert.deepEqual(first, second);
  prepareRecords([{ ...article, slug: "different" }], second);
  assert.notEqual(first.documents.hello.rkey, second.documents.different.rkey);
});

await test("existing record keys survive the switch to automatic publishing", () => {
  const registry = state();
  registry.publication.rkey = "3mzyhw7ejm2hj";
  registry.documents.hello = { rkey: "3mutd3nu2x72v", published: true };
  prepareRecords([article], registry);
  assert.equal(registry.publication.rkey, "3mzyhw7ejm2hj");
  assert.equal(registry.documents.hello.rkey, "3mutd3nu2x72v");
});

await test("remote history catches removed articles even with a clean local registry", () => {
  const registry = state();
  prepareRecords([article], registry);
  const uri = `at://${registry.did}/site.standard.document/${registry.documents.hello.rkey}`;
  const site = `at://${registry.did}/site.standard.publication/${registry.publication.rkey}`;
  const remote = [{ uri, value: { site } }];
  assert.throws(
    () => assertRemoteDocumentsIncluded(remote, registry, new Set()),
    /missing or a draft/,
  );
  assert.doesNotThrow(() =>
    assertRemoteDocumentsIncluded(remote, registry, new Set([registry.documents.hello.rkey])),
  );
  assert.doesNotThrow(() =>
    assertRemoteDocumentsIncluded(
      [{ uri, value: { site: "another-publication" } }],
      registry,
      new Set(),
    ),
  );
});
