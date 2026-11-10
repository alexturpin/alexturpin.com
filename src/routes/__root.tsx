import { HeadContent, Link, Scripts, createRootRouteWithContext } from "@tanstack/react-router";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

const work = [{ label: "Better Tax", href: "https://bettertax.ca/" }];

const elsewhere = [
  { label: "GitHub", href: "https://github.com/alexturpin" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/alexturpin/" },
  { label: "Bluesky", href: "https://bsky.app/profile/alexturpin.com" },
  { label: "Instagram", href: "https://instagram.com/alexturpin.ca" },
  { label: "Email", href: "mailto:contact@alexturpin.com" },
];

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Alex Turpin",
      },
      {
        name: "description",
        content: "Alex Turpin is a software developer from Canada.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="site">
          <SiteMenu />
          <main className="content">
            <div className="column">{children}</div>
          </main>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

function SiteMenu() {
  return (
    <nav className="menu" aria-label="Site">
      <Link to="/" className="menu-name">
        Alex Turpin
      </Link>
      <div className="menu-group">
        <Link to="/" className="menu-link" activeOptions={{ exact: true }}>
          Home
        </Link>
        <Link to="/writing" className="menu-link">
          Writing
        </Link>
      </div>
      <MenuGroup heading="Work" links={work} />
      <MenuGroup heading="Elsewhere" links={elsewhere} />
    </nav>
  );
}

function MenuGroup({
  heading,
  links,
}: {
  heading: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="menu-group">
      <div className="menu-heading">{heading}</div>
      {links.map((link) => (
        <a key={link.href} href={link.href} className="menu-link">
          <span>{link.label}</span>
          <span className="menu-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      ))}
    </div>
  );
}

function NotFound() {
  return (
    <section className="intro">
      <h1>Page not found</h1>
      <p>
        There is nothing at this address. <Link to="/">Go back home</Link>.
      </p>
    </section>
  );
}
