import { createFileRoute, notFound } from "@tanstack/react-router";

import { PostDate } from "#/writing/PostList";
import { findPost } from "#/writing/posts";
import { documentUri, publication } from "#/writing/atproto";

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    if (!findPost(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const post = findPost(params.slug);
    const uri = post?.date ? documentUri(params.slug) : null;
    return {
      meta: post ? [{ title: `${post.title} – Alex Turpin` }] : [],
      links: post
        ? [
            {
              rel: "canonical",
              href: `${publication.url}/writing/${encodeURIComponent(params.slug)}`,
            },
            ...(uri ? [{ rel: "site.standard.document", href: uri }] : []),
          ]
        : [],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const post = findPost(slug);
  if (!post) return null;

  return (
    <article className="post">
      <header className="post-header">
        <h1>{post.title}</h1>
        <PostDate date={post.date} />
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
