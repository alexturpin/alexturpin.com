export interface Post {
  slug: string;
  title: string;
  /** Publication date as `YYYY-MM-DD`, or `null` for a draft. */
  date: string | null;
  html: string;
}

type CompiledPost = Omit<Post, "slug"> | null;

// Every Markdown file in content/writing is a post; its file name is its slug.
const files = import.meta.glob<CompiledPost>("../../content/writing/*.md", {
  eager: true,
  import: "default",
});

/** Drafts first (they only exist while developing), then newest to oldest. */
export const posts: Array<Post> = Object.entries(files)
  .flatMap(([path, post]) => {
    const slug = path.split("/").pop()?.replace(/\.md$/, "");
    return post && slug ? [{ slug, ...post }] : [];
  })
  .sort((a, b) => (b.date ?? "9999").localeCompare(a.date ?? "9999"));

export function findPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

const dateFormat = new Intl.DateTimeFormat("en-CA", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatDate(date: string) {
  return dateFormat.format(new Date(`${date}T00:00:00Z`));
}
