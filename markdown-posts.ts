import { marked } from "marked";

import type { Plugin } from "vite";

/**
 * Turns each Markdown file into a module whose default export is the post:
 * `{ title, date, html }`. A post without a `date` in its frontmatter is a
 * draft: it is kept while developing and compiled to `null` in a build, so
 * draft text never reaches the production bundle.
 */
export function markdownPosts(): Plugin {
  let isBuild = false;

  return {
    name: "markdown-posts",
    configResolved(config) {
      isBuild = config.command === "build";
    },
    async transform(source, id) {
      if (!id.endsWith(".md")) return;

      const { title, date, body } = parsePost(source, id);
      const post = isBuild && !date ? null : { title, date, html: await marked.parse(body) };

      return { code: `export default ${JSON.stringify(post)};`, map: null };
    },
  };
}

function parsePost(source: string, id: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  const fields = new Map<string, string>();

  for (const line of (match?.[1] ?? "").split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const value = line.slice(colon + 1).trim();
    fields.set(line.slice(0, colon).trim(), value.replace(/^(["'])(.*)\1$/, "$2"));
  }

  const title = fields.get("title");
  if (!title) throw new Error(`${id}: frontmatter needs a title`);

  const date = fields.get("date") || null;
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${id}: date must look like 2026-01-31, got "${date}"`);
  }

  return { title, date, body: source.slice(match?.[0].length ?? 0) };
}
