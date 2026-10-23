<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Dev server: reuse it, never restart it

The user keeps one dev server running at http://localhost:3005, shared by every session. `next dev` hot-reloads every edit, so a restart is never needed to see a change.

- Before starting a server, check `curl -s -o /dev/null -w "%{http_code}" http://localhost:3005/`. If it answers, use it.
- Only run `npm run dev -- -p 3005` when nothing is listening on 3005.
- Never kill, pkill or otherwise stop a server you did not start in this turn, and never start a second `next dev` on another port in this folder.
- If the server is genuinely broken, tell the user and ask before restarting it.
