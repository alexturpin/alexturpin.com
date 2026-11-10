import { createHash } from "node:crypto";

import { publication, recordUri } from "../src/writing/atproto.ts";
import { parsePost } from "./parse-post.ts";

import type { PublicationRegistry, RecordIdentity } from "../src/writing/atproto.ts";

// Stable across clean CI checkouts; existing registry overrides remain authoritative.
export function stableRecordKey(identity: string) {
  let value = createHash("sha256").update(identity).digest().readBigUInt64BE() & ((1n << 63n) - 1n);
  const alphabet = "234567abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 13; i++) {
    result = alphabet[Number(value & 31n)] + result;
    value >>= 5n;
  }
  return result;
}

export function prepareRecords(
  sources: Array<{ slug: string; source: string }>,
  state: PublicationRegistry,
) {
  if (!/^did:plc:[a-z2-7]{24}$/.test(state.did)) {
    throw new Error("Set your did:plc identity in atproto.json before preparing records.");
  }
  state.publication.rkey ||= stableRecordKey(`${state.did}/publication/${publication.url}`);
  const site = recordUri(state.did, publication.$type, state.publication.rkey);
  const writes: Array<{ identity: RecordIdentity; record: Record<string, unknown> }> = [
    { identity: state.publication, record: publication },
  ];
  const included = new Set<string>();
  for (const { slug, source } of sources) {
    const post = parsePost(source, slug);
    if (!post.date) continue;
    const publishedAt = new Date(`${post.date}T00:00:00Z`).toISOString();
    if (!publishedAt.startsWith(post.date)) throw new Error(`${slug}: invalid calendar date`);
    const identity = (state.documents[slug] ??= {
      rkey: stableRecordKey(`${site}/${slug}`),
      published: false,
    });
    included.add(slug);
    writes.push({
      identity,
      record: {
        $type: "site.standard.document",
        site,
        title: post.title,
        path: `/writing/${encodeURIComponent(slug)}`,
        publishedAt,
        content: {
          $type: "at.markpub.markdown",
          flavor: "gfm",
          renderingRules: "marked",
          text: { $type: "at.markpub.text", markdown: post.body },
        },
      },
    });
  }
  const missing = Object.entries(state.documents)
    .filter(([slug, identity]) => identity.published && !included.has(slug))
    .map(([slug]) => slug);
  if (missing.length) {
    throw new Error(
      `Previously published posts are missing or drafts: ${missing.join(", ")}. Restore them or explicitly remove their remote records and registry entries. Nothing is deleted automatically.`,
    );
  }
  for (const { identity, record } of writes) {
    if (!/^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/.test(identity.rkey)) {
      throw new Error("Invalid record key in atproto.json");
    }
    const title = record.title ?? record.name;
    if (typeof title !== "string" || [...new Intl.Segmenter().segment(title)].length > 500) {
      throw new Error("Publication and article titles must be at most 500 graphemes.");
    }
  }
  if (new Set(writes.map(({ identity }) => identity.rkey)).size !== writes.length) {
    throw new Error("Duplicate record keys in atproto.json");
  }
  return writes;
}

export function assertRemoteDocumentsIncluded(
  records: Array<{ uri: string; value: Record<string, unknown> }>,
  state: PublicationRegistry,
  includedKeys: Set<string>,
) {
  const site = recordUri(state.did, publication.$type, state.publication.rkey);
  for (const record of records) {
    if (record.value.site === site && !includedKeys.has(record.uri.split("/").at(-1)!)) {
      throw new Error(
        `Previously published article is missing or a draft: ${record.uri}. Restore it or explicitly withdraw it; nothing is deleted automatically.`,
      );
    }
  }
}
