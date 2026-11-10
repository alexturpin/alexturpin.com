import { marked } from "marked";
import { parsePost } from "./scripts/parse-post.ts";

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
