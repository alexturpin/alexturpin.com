import { createFileRoute } from "@tanstack/react-router";

import { PostList } from "#/writing/PostList";
import { posts } from "#/writing/posts";

export const Route = createFileRoute("/writing/")({
  head: () => ({ meta: [{ title: "Writing – Alex Turpin" }] }),
  component: Writing,
});

function Writing() {
  return (
    <section className="intro">
      {posts.length > 0 && <h1>Writing</h1>}
      {posts.length > 0 ? <PostList /> : <p className="muted">Nothing published yet.</p>}
    </section>
  );
}
