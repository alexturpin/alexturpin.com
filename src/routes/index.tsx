import { createFileRoute } from "@tanstack/react-router";

import { PostList } from "#/writing/PostList";
import { posts } from "#/writing/posts";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <>
      <section className="intro">
        <img
          className="portrait"
          src="/avatar.jpg"
          alt="Photo of Alex Turpin"
          width={96}
          height={96}
        />
        <h1>Hey, I'm Alex.</h1>
        <p>
          I'm a software developer from Canada. I have a passion for using modern web technology to
          build great products with delightful user experiences.
        </p>
        <p>
          I'm currently channeling this passion into building{" "}
          <a href="https://bettertax.ca/">better tax software</a> for Canadians.
        </p>
      </section>
      {posts.length > 0 && (
        <section className="section">
          <h2 className="section-heading">Writing</h2>
          <PostList />
        </section>
      )}
    </>
  );
}
