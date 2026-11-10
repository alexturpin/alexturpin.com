import { createFileRoute, notFound } from "@tanstack/react-router";

import { PostDate } from "#/writing/PostList";
import { findPost } from "#/writing/posts";

export const Route = createFileRoute("/writing/$slug")({
  loader: ({ params }) => {
    if (!findPost(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const post = findPost(params.slug);
    return { meta: post ? [{ title: `${post.title} – Alex Turpin` }] : [] };
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
