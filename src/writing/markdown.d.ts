declare module "*.md" {
  /** Compiled by `markdown-posts.ts`. `null` is a draft left out of a build. */
  const post: { title: string; date: string | null; html: string } | null;
  export default post;
}
