# Na Level Empire Media — website

Marketing site for **Na Level Empire Media (NLEM)**, a Toronto audiovisual
production and event management social enterprise.

Pages: Home, Projects, Media Hub, News, Social Impact, Careers, About,
Contact, and a 404 page.

## Run it locally

You need [Node.js 22](https://nodejs.org/) (see `.nvmrc`).

```bash
npm ci          # install exact dependency versions
npm run dev     # start the dev server at http://localhost:3000
npm run check   # lint + type-check
npm run build   # production build into dist/
npm run preview # serve the production build locally
```

Forms need a Web3Forms access key. Copy `.env.example` to `.env` and fill it
in; `.env` is never committed. On Vercel the same variable is set in the
project's Environment Variables.

## Where things live

| What | Where |
| --- | --- |
| Pages (one folder per route) | `src/pages/` |
| Navbar, footer, cursor | `src/components/feature/` |
| Routes | `src/router/config.tsx` |
| List content (projects, news, jobs, videos, team) | `src/mocks/nlem.ts` — moving to `src/content/` JSON |
| Static files (favicon) | `public/` |

## Roadmap

The site is being refactored in phases so non-technical editors can change
all text and images through a CMS at `/admin`:

1. **(a) Repo cleanup** — this phase
2. **(b)** Content moves to validated JSON in `src/content/` (Zod)
3. **(c)** Sveltia CMS at `/admin`; images on Cloudinary
4. **(d)** Hosting on Vercel: a preview for every pull request, production on merge to `main`; CI checks every pull request
5. **(e)** Prerendering, per-page SEO, sitemap, Lighthouse 90+ on mobile
6. **(f)** Editor guide and reusable template

Developer and AI-assistant conventions are in [`CLAUDE.md`](CLAUDE.md).
Work happens on one branch and pull request per phase; nothing is committed
straight to `main`.
