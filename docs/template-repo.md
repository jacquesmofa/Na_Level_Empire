# Reusing this site as a template for another client

This repository can be the starting point for other clients' sites: same
blocks, CMS, image handling, forms, prerendering and checks; new content.

## Make it a template (once)

GitHub → this repository → **Settings → General** → tick **Template
repository**. A **Use this template** button then appears on the repository
page.

## Start a new client site

1. **Use this template → Create a new repository** (owner: the client or your
   account; Private is fine).
2. In the new repository, edit **`src/site.config.ts`**:
   - `repo`: the new `owner/name`
   - `cloudinary.cloud` and `cloudinary.apiKey`: the client's Cloudinary cloud
     name and *public* API key (never the API secret)
   - `cloudinary.folder`: a short folder name for the client, e.g. `acme`
3. Run `npm ci` then `npm run cms:config` and commit the regenerated
   `public/admin/config.yml`.
4. Replace the content in `src/content/` (site name, logo, pages, lists).
   Keep at least one item per collection or delete the collection's section
   from the pages that use it. `npm run validate` tells you exactly what is
   missing. Update `PLACEHOLDERS.md`.
5. Check the brand colours and fonts in `tailwind.config.ts` and
   `src/main.tsx` (font imports). Any change to the look is a design change:
   agree it with the client first.
6. Remove `scripts/image-migration/` and `scripts/migrate-images.ts` if the
   client has no images to move, and set `ALLOW_LEGACY_READDY_IMAGES = false`
   in `src/content/schema.ts`.
7. Follow `docs/setup-checklist.md` for the new accounts: Vercel project,
   Web3Forms key (new inbox; `forms` in `src/site.config.ts`), Cloudinary upload preset, GitHub OAuth App
   (callback `https://<new site>/api/callback`), editors.
8. Update `CLAUDE.md` (name, owner decisions) and give the editors
   `docs/editor-guide.md`.

`npm run check` and `npm run build` must pass before the first deploy.
