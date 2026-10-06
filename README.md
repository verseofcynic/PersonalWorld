# Personal identity site (data-driven)

A static site where **all content lives in `/data`**. No build step, no dependencies, no backend. Works on GitHub Pages, Vercel, Netlify or any static host.

## Run locally
```
python3 -m http.server 8000     # open http://localhost:8000
```
No `npm install` or build is needed. To deploy, upload the folder as it is.

## Deploy (GitHub Pages)
1. Create a GitHub repository and push this folder to `main`.
2. Settings → Pages → Source: **GitHub Actions**. `.github/workflows/deploy.yml` deploys on every push.
3. Visit `https://<username>.github.io/<repo>/`. Custom domain: Settings → Pages → Custom domain.
4. Replace `YOUR NAME` / `YOUR-DOMAIN` in `index.html`, `robots.txt`, `sitemap.xml`; add `images/og.jpg` (1200x630).

## Where things live
| What | File |
|---|---|
| Name, bio, hero/profile image, roles, taglines, location, email, social links, "Who am I" cards, "Currently", **section order/titles** | `data/profile.js` |
| Skills | `data/skills.js` |
| Destinations | `data/travel.js` |
| Photographs | `data/photography.js` |
| Projects | `data/projects.js` |
| Timeline + achievements | `data/timeline.js` |

## Images
Any image field accepts: a local path (`"images/travel/goa/01.jpg"`, relative so it works in subfolders), a full URL, or `"placeholder:Label|hue"` (generated stand-in, labelled PLACEHOLDER). Missing or broken images fall back automatically. Put files under `images/profile|skills|travel|photography|projects|timeline`. Resize photos to roughly 1600px wide and compress them (e.g. WebP/JPEG) before adding.

## How to...
- **Change profile info / hero image / social links:** edit `data/profile.js` (`name`, `heroImage`, `profileImage`, `social`, `email`). Links with an empty `href` are hidden.
- **Add a skill:** add an object to `DATA.skills` (see the first entry). New `category` values become filter tabs. Optional: `gallery`, `technologies`, `highlights`. It gets a card and a detail page at `#/skills/<id>` automatically. Link projects, timeline entries and achievements to it by setting `skill: "<id>"`.
- **Add a destination:** add an object to `DATA.travel`. Add `coordinates` to get a map pin. New `category` values become filters. Detail page appears at `#/travel/<id>`.
- **Add photographs:** add `{ id, image, category, location, date, title, description }` to `DATA.photography`. Add `thumbnail` for a smaller grid image. For a trip gallery, just add another path to that destination's `gallery` array.
- **Add a project:** add to `DATA.projects` (`category` makes filters; `featured: true` sorts first).
- **Add a timeline entry / achievement:** add to `DATA.timeline` / `DATA.achievements`.
- **Replace an image:** change its value in the data file.
- **Add a new category:** use a new `category` string on any item. Filters build themselves.
- **Add, remove or reorder a page section:** edit `sections` in `data/profile.js`. Use `{ type: "cards", id, title, items: [...] }` for a fully custom section.

## Notes
- Detail pages use hash URLs (`#/travel/goa`) because GitHub Pages has no server rewrites.
- The travel map plots pins on a coordinate grid. It needs no API key and has no coastline outlines.
- Large collections: photos, projects and destinations paginate with "Show more" and images lazy-load.
- Moving to a CMS later: replace the `data/*.js` files with a fetch that fills `window.DATA` in the same shape.
