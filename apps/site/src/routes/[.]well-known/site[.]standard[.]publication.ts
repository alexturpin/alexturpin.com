import { createFileRoute } from "@tanstack/react-router";

import { publicationUri } from "#/writing/atproto";

export const Route = createFileRoute("/.well-known/site.standard.publication")({
  server: {
    handlers: {
      GET: () => {
        const uri = publicationUri();
        return new Response(uri ?? "Publication not connected", {
          status: uri ? 200 : 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      },
    },
  },
});
