import registry from "../../atproto.json" with { type: "json" };

export interface RecordIdentity {
  rkey: string;
  published: boolean;
}

export interface PublicationRegistry {
  did: string;
  publication: RecordIdentity;
  documents: Record<string, RecordIdentity>;
}

export const publication = {
  $type: "site.standard.publication",
  url: "https://alexturpin.com",
  name: "Alex Turpin’s writing",
  description: "Writing by Alex Turpin, a software developer from Canada.",
  preferences: { showInDiscover: true },
};

export function recordUri(did: string, collection: string, rkey: string) {
  return `at://${did}/${collection}/${rkey}`;
}

export function publicationUri(state: PublicationRegistry = registry) {
  return state.did && state.publication.published
    ? recordUri(state.did, publication.$type, state.publication.rkey)
    : null;
}

export function documentUri(slug: string, state: PublicationRegistry = registry) {
  const document = state.documents[slug];
  return publicationUri(state) && document?.published
    ? recordUri(state.did, "site.standard.document", document.rkey)
    : null;
}
