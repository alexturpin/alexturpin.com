import { Link } from "@tanstack/react-router";

import { formatDate, posts } from "./posts";

export function PostList() {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <PostDate date={post.date} />
          <Link to="/writing/$slug" params={{ slug: post.slug }}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function PostDate({ date }: { date: string | null }) {
  if (!date) return <span className="post-date draft">Draft</span>;

  return (
    <time className="post-date" dateTime={date}>
      {formatDate(date)}
    </time>
  );
}
