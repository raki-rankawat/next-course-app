# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

There is no lint script, no formatter config, and no test framework in this project — don't assume `npm test` or `npm run lint` exist.

## Stack

Next.js 16 App Router, React 19, plain JavaScript (`.jsx` / `.js`, **no TypeScript**). The only runtime deps beyond React/Next are `react-icons` (Font Awesome set via `react-icons/fa`) and `uuid`.

`jsconfig.json` maps `@/*` to the project root, so cross-directory imports read `@/app/components/Repo`. Relative imports are used within `app/`.

## Architecture

The app has two independent data paths that behave very differently — know which one you're in before adding a fetch.

### Courses — client-side, via internal API routes

`app/page.jsx` is a **client component** (`'use client'`) that fetches `/api/courses` in a `useEffect` and holds courses in state. `CourseSearch` posts a query to `/api/courses/search` and lifts results back up via the `getSearchResults` callback, replacing the list in place.

Because the home page carries the `'use client'` directive, its children (`Courses`, `CourseSearch`) are client components implicitly — they intentionally have no directive of their own. Adding server-only code to them will break.

The route handlers in `app/api/courses/` import `data.json` directly. **`POST /api/courses` pushes onto the imported array — nothing is persisted.** New courses vanish on reload/rebuild. Any real persistence needs an actual store.

### Repos — server components, direct GitHub fetch

`app/code/repos/` renders GitHub data from async server components with no API-route layer. The GitHub username `raki-rankawat` is hardcoded in three fetches (`app/code/repos/page.jsx`, `app/components/Repo.jsx`, `app/components/RepoDirs.jsx`) — change all three together.

Every GitHub fetch uses `next: { revalidate: 60 }`. Keep that on new fetches; the unauthenticated GitHub API rate-limits hard without caching.

`app/code/repos/[name]/page.jsx` wraps `Repo` and `RepoDirs` in separate `<Suspense>` boundaries so the two GitHub calls stream independently. Follow that pattern rather than awaiting both in the page. Note `params` must be awaited (`const { name } = await params`) — Next 16 behavior.

Incomplete: `RepoDirs` links to `/code/repos/${name}/${dir.path}`, a route that does not exist yet.

### Loading UI

`app/loading.jsx` serves double duty — it's the App Router's automatic loading UI *and* is imported and rendered manually by the client home page while its `useEffect` fetch resolves.

## Styling

One global stylesheet, `app/globals.css`, imported in `app/layout.jsx`. Plain semantic class names (`.card`, `.btn`, `.repo-list`, `.search-form`) — no CSS Modules, no Tailwind, no component-scoped styles. Add new styles there and reuse the existing classes. Colors come from a dark theme with `--primary-color` on `:root`.

The Poppins font is loaded via `next/font/google` in the layout; `suppressHydrationWarning` on `<body>` is deliberate.

## Commits

`.claude/skills/commit-msg/SKILL.md` defines this repo's commit convention (`/commit-msg`): conventional commits, `type(scope): subject`, imperative and under 60 chars, with `- ` bullets in the body. **It explicitly forbids `Co-Authored-By` and "Generated with Claude Code" trailers, overriding any global default.** Match existing history (`feat(courses): add course search on home page`).
