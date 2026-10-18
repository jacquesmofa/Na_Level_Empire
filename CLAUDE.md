# CLAUDE.md — Na Level Empire Media website

Read this before changing anything. Items marked **(planned)** are not built
yet. Where the code and this file disagree, ask before "fixing" either one.
Owner decisions: 17–18 Oct 2026.

## What this is

Bilingual (English + French) marketing site for Na Level Empire Media
(NLEM), a Toronto audiovisual production and event management social
enterprise. Editors change everything — text, images, lists, whole page
sections and new pages — in Sveltia CMS at `/admin`, at zero ongoing cost.

## Stack

| Concern | Tool |
| --- | --- |
| UI | React 19, TypeScript (strict), React Router 7 |
| Build | Vite 8 → `dist/` |
| Styling | Tailwind CSS 3 + brand tokens in `tailwind.config.ts` |
| Content | JSON in `src/content/`, validated by Zod inside every build |
| CMS | Sveltia CMS 0.248.0 (pinned) at `/admin`, GitHub backend, saves commit to `main` |
| CMS login | GitHub OAuth relay: Vercel functions `api/auth.ts`, `api/callback.ts` |
| Images | Cloudinary, cloud `beavj5sp`, root folder `nlem/` |
| Forms | Web3Forms → levelempiremedia@gmail.com |
| Hosting | Vercel (Hobby): preview per pull request, production from `main` |
| CI | GitHub Actions `ci.yml` on pull requests: `npm ci`, `npm run check`, `npm run build` |
| Node | 22 LTS (`.nvmrc`) |

## Folder structure

```
.github/workflows/ci.yml   checks on every pull request (Vercel deploys)
api/                       Vercel functions: auth.ts, callback.ts (+ oauth.test.ts)
public/
  admin/index.html         loads /admin/sveltia-cms.js (copied by the build)
  admin/config.yml         GENERATED from the schema: npm run cms:config
  favicon.svg
scripts/
  validate-content.ts      content checks (also runs inside vite build)
  cms-config.ts            builds config.yml from the Zod schema + labels
  migrate-images.ts        one-time Readdy -> Cloudinary move
  prerender.ts             writes every page as HTML + sitemap.xml + robots.txt after the build
  *.test.ts                node:test suites
src/
  site.config.ts           GitHub repo + Cloudinary cloud/key/folder (change these for a new client)
  main.tsx                 browser entry: hydrates prerendered HTML
  entry-server.tsx         build-time entry used by scripts/prerender.ts
  Root.tsx                 cursor + routes, shared by both entries
  content/
    schema.ts              Zod: the single source of truth
    constants.ts           locales, fixed page ids/paths (no zod: safe for the bundle)
    sharedFields.ts        which fields are shared across languages vs translated
    index.ts               typed loaders (getPage, getSettings, getNav, …)
    settings/{en,fr}/site.json
    ui/{en,fr}/strings.json            interface text (labels, states, a11y, email subjects)
    pages/{en,fr}/<id>.json            the 9 fixed pages: seo + sections[]
    custom-pages/{en,fr}/<slug>.json   pages editors create
    projects/ news/ jobs/ videos/ team/{en,fr}/<slug>.json
  blocks/                  one component per section type + BlockRenderer
  components/layout/       Navbar, Footer, CustomCursor
  components/ui/           LocalizedLink, Icon, CmsImage, SectionLabel, TargetTag
  lib/                     image.ts (Cloudinary), forms.ts (Web3Forms), locale.ts, youtube.ts
  router/                  routes for / and /fr/, Layout, PageView
  dev/                     /__blocks catalogue (development only)
PLACEHOLDERS.md            every unconfirmed item
docs/setup-checklist.md    owner setup (Vercel, Web3Forms, Cloudinary, OAuth, editors)
docs/editor-guide.md       how editors use /admin (with screenshots)
docs/template-repo.md      starting another client's site from this one
```

## Content model

- **Fixed pages** (9): home, projects, media, news, impact, careers, about,
  contact, not-found. `seo` + `sections[]`. Cannot be deleted in the CMS.
- **Extra pages** (`custom-pages`): title, slug (web address), showInNav,
  navOrder, seo, sections. Served at `/<slug>` and `/fr/<slug>`; pages with
  showInNav get a menu and footer link automatically. Reserved slugs are
  listed in `RESERVED_SLUGS` (schema.ts).
- **Sections**: 18 block types, a Zod discriminated union on `type`
  (`BLOCK_LABELS` lists them). In the CMS: a list with variable types.
- **Collections**: projects, news (slug + optional body for future
  `/news/<slug>`), jobs, videos (YouTube link by hand; `source` reserved for
  automatic fetching), team. All carry `placeholder: true` until confirmed.
- **Languages**: Sveltia i18n `multiple_folders`, `en` default, `fr`. The
  validator fails the build if English and French differ in structure
  (sections, list lengths) or in shared fields (images, links, numbers,
  settings — see `sharedFields.ts`). Only text may differ.
- **Stats**: `kind: result | target`; targets show "Target" / "Objectif".

## Content rules (non-negotiable)

1. **No hardcoded copy or URLs in components.** Lint rule
   `nlem/no-hardcoded-copy` fails on visible text, alt/title/placeholder/
   aria-label strings, URLs and sentence-like strings in `src/blocks`,
   `src/components`, `src/router`. Small UI text goes in `ui/{locale}/strings.json`.
2. **Zod is the contract.** Types come from `z.infer`. To add a field or
   block: schema → label in `scripts/cms-config.ts` → `npm run cms:config` →
   JSON → component. A schema field without a CMS label stops the generator.
3. **A bad edit fails the build, never the live site.** Validation runs in
   `vite build`; on Vercel a failed build keeps the previous deployment.
4. **CMS config is generated**, never edited by hand; `npm run cms:check`
   (part of `npm run check`) fails if it is out of date.
5. **Design stays identical** unless the owner approves; visual changes ship
   with before/after screenshots in the PR.

## Images

- Content stores the plain Cloudinary URL plus `alt`. Zod accepts only
  `https://res.cloudinary.com/beavj5sp/image/upload/[v…/]nlem/…`.
- **Temporary:** `ALLOW_LEGACY_READDY_IMAGES` in schema.ts lets the
  prototype's Readdy images pass until `scripts/migrate-images.ts` runs
  (needs the unsigned Cloudinary preset `nlem_migration`; no API secret).
  Set it to `false` right after the move.
- Render images only through `<CmsImage>` (width/height required, srcset,
  sizes, lazy; `priority` for the first visible image). `src/lib/image.ts`
  adds `f_auto,q_auto,w_<n>,c_limit`.
- The Cloudinary API secret never appears in the repo, config, environment
  variables or chat. Editors upload through Cloudinary's media library with
  their own Cloudinary login.

## Commands

```
npm ci               install exact versions (behind the workspace proxy add: --noproxy=localhost with NO_PROXY unset)
npm run dev          dev server on :3000 (/__blocks shows every section type)
npm run check        lint + typecheck + validate + cms:check + tests
npm run validate     content checks only
npm run cms:config   regenerate public/admin/config.yml after schema/label changes
npm run build        validate → vite build → copy CMS into dist/admin → SSR build → prerender
npm run preview      serve dist/ locally
```

## Deploy and environment

1. One branch + pull request per phase; never commit to `main` directly.
   Merge (squash) when CI is green and the Vercel preview builds.
2. CMS saves commit straight to `main` and go live after the Vercel build.
   `/admin` on a preview also edits `main` (the live site).

Vercel environment variables (Production + Preview); nothing secret is committed:

| Name | Secret? | Used by |
| --- | --- | --- |
| `VITE_WEB3FORMS_ACCESS_KEY` | no (public by design) | forms, baked in at build |
| `GITHUB_OAUTH_ID` | no | `api/auth.ts`, `api/callback.ts` |
| `GITHUB_OAUTH_SECRET` | **yes** | `api/callback.ts` only |
| `CMS_ALLOWED_ORIGINS` | no | extra addresses allowed to receive a login token, e.g. `https://na-level-empire-*-jacques15.vercel.app` |
| `CMS_SITE_URL` | no | optional; overrides the address in config.yml (default: Vercel's production URL) |

## Editors

- `jacquesmofa` (owner) now; a second editor is added as a collaborator
  with Write access when named. Each editor also needs a Cloudinary login.
- Fallback login: Sveltia "Sign In Using Access Token" with a fine-grained
  GitHub token limited to this repository (Contents: read and write).

## Pages, SEO and performance

- Every page in both languages is prerendered (`dist/<path>.html`); React
  hydrates it. Unknown addresses get `dist/404.html` with a real 404 status
  (no catch-all rewrite in `vercel.json`).
- Each page's `<head>` comes from its `seo` fields: title, description,
  canonical, hreflang en/fr/x-default, Open Graph/Twitter (first image of the
  page). Home adds Organization JSON-LD. `sitemap.xml` and `robots.txt` use
  `CMS_SITE_URL` or Vercel's production address.
- Fonts are self-hosted (`@fontsource`, imported in `main.tsx`) and the
  first-screen weights are preloaded. Icons are inline SVG (`Icon.tsx`).
- Animations stop under `prefers-reduced-motion`; the custom cursor only runs
  with a mouse (`pointer: fine`).

## Guides

- `docs/editor-guide.md`: for the editors, with screenshots (`docs/editor-guide/`).
- `docs/template-repo.md`: reusing this repository for another client.
  Client-specific accounts live only in `src/site.config.ts`.

## Working rules for Claude

- Small commits, one concern each, plain language.
- Never commit secrets, `.env`, `node_modules/`, `dist/`.
- Never add a dependency without saying why; prefer none.
- Never claim something works until it has been run; say what was tested.
- Ask before visible design changes, deleting content or touching
  credentials. Report blockers immediately.
