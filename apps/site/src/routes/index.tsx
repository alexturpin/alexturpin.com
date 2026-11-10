import { createFileRoute } from "@tanstack/react-router";

import { PostList } from "#/writing/PostList";
import { posts } from "#/writing/posts";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const yearsOfExperience = new Date().getFullYear() - 2011;

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
          I'm a software developer from Canada. I've been writing software professionally for{" "}
          {yearsOfExperience} years.
        </p>
        <p>
          These days, I'm building{" "}
          <a href="https://www.bettertax.ca/" target="_blank" rel="noopener noreferrer">
            better tax software
          </a>{" "}
          for Canadians.
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
