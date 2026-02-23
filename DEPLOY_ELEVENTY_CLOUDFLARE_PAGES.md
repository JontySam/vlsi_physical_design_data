# Eleventy + Cloudflare Pages (VLSI Physical Design)

## Local run

1. Install dependencies:
   - `npm install`
2. Start local dev server:
   - `npm run dev`
3. Open:
   - `http://localhost:8080`

## Build output

- Build command: `npm run build`
- Output folder: `dist`

## Quick checks before deploy

1. Open the following locally and confirm they load:
   - `/`
   - `/blog`
   - `/about`
   - `/works-cited`
   - `/advanced-logic-synthesis`
2. Check static assets:
   - CSS loads
   - JS navigation toggle works
   - Images render
3. Confirm redirects:
   - Legacy URLs like `/work_sited` should redirect to `/works-cited` after deployment on Cloudflare Pages.

## Cloudflare Pages (Dashboard)

1. Push this repo to GitHub/GitLab.
2. In Cloudflare Dashboard, go to `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`.
3. Select the repo and configure:
   - Framework preset: `None` (Eleventy build is handled by npm script)
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy.

## Cloudflare Pages (CLI, optional)

1. Install Wrangler (if needed):
   - `npm install -g wrangler`
2. Login:
   - `wrangler login`
3. Build:
   - `npm run build`
4. Deploy:
   - `wrangler pages deploy dist --project-name <your-pages-project-name>`

## Notes

- Source files remain in `vlsi_physical_design_web/`.
- Eleventy outputs the production-ready site to `dist/`.
- `_redirects` is included for Cloudflare Pages URL compatibility and legacy slug redirects.
