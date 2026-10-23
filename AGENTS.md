<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Dev server: reuse it, never restart it

The user's dev server runs at http://localhost:3006 under a keep-alive loop (`/tmp/eastwick-dev-3006.sh`) that restarts it if it stops. `next dev` hot-reloads every edit, so a restart is never needed to see a change.

- To check your work, use http://localhost:3006. Do not start another `next dev` in this folder.
- Never kill, pkill or otherwise stop anything on port 3006, or the loop itself.
- For a production check, use `npm run build` then `npm run start -- -p 3010`, and stop only that server.
- If the server is genuinely broken, tell the user and ask before touching it.
