---
title: A sample article
---

This is a sample article for checking how posts look. It has no `date` in its
frontmatter, so it is a draft: it shows up while developing and is left out of
the production build.

## Writing a post

Add a Markdown file to `content/writing`. The file name becomes the address, so
`my-first-post.md` is served at `/writing/my-first-post`. The frontmatter takes
a title and a publication date:

```md
---
title: My first post
date: 2026-11-10
---
```

Leave the date out until the post is ready to publish.

## What the styles cover

Paragraphs can hold [links](https://alexturpin.com/), _emphasis_, **strong
text** and `inline code`.

> A blockquote, for when someone else said it better.

- An unordered list
- With a second item

1. An ordered list
2. With a second item

### A smaller heading

```ts
export function greet(name: string) {
  return `Hello, ${name}!`;
}
```

---

And a horizontal rule above this last paragraph.
