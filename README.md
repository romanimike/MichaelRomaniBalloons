# Michael Romani Balloon Twisting — Website

A static site (no build step required): Home, Balloon Twisting, 6 neighborhood landing pages, a Nearby Suburbs page, Gallery, Meet Michael, and Contact.

Open `index.html` in a browser to preview locally, or deploy the whole `website` folder as-is.

---

## 1. Add your photos (do this first — biggest visual upgrade)

Every photo on the site is wired up already. Drop a file with the **exact name** below into `assets/img/` and it appears automatically — no code changes needed. Until a file exists, a branded placeholder shows in its place, so the site always looks finished.

| File name | Used on | Suggested shot |
|---|---|---|
| `hero-main.jpg` | Home hero | Vertical action shot of Michael twisting a balloon (4:5 crop works best) |
| `service-twisting.jpg` | Balloon Twisting page(s) | A finished balloon animal/sculpture close-up |
| `about-portrait.jpg` | Meet Michael | A clean portrait of Michael (square crop) |
| `about-action-1.jpg` | Meet Michael | Michael performing at an event |
| `gallery-01.jpg` … `gallery-12.jpg` | Gallery + Home preview | Balloon twisting close-ups, birthday parties, and events in action |
| `og-image.jpg` | Social share previews (1200×630px) | A bright, recognizable photo — this is what shows when the link is shared on Facebook/Instagram/iMessage |

You mentioned you have many event photos to add — just drop them into `assets/img/` using the names above (add more `gallery-##.jpg` files and copy one of the existing `<button class="gallery-item">` blocks in `gallery.html` if you want more than 12).

The **logo** (`assets/img/logo.svg`) and **favicon** (`assets/img/favicon.svg`) are a placeholder twisted-balloon-dog mark. Swap either file for your final logo whenever it's ready — every page references the same two files, so there's nothing else to update.

---

## 2. Contact form — already connected ✅

The Contact page form posts to your Formspree endpoint (`https://formspree.io/f/mwlkqayy`) and emails submissions straight to you. Submit a test inquiry once the site is live to confirm it arrives.

---

## 3. Connect your live Google Reviews widget

Per your request, the homepage reviews section is wired up for a **free, auto-updating widget** (via [Elfsight](https://elfsight.com/google-reviews-widget/)) instead of a hand-edited carousel — reviews stay current with zero manual work, and visitors read them right on your site instead of clicking away to Google.

**Setup (about 5 minutes):**
1. Go to [elfsight.com/google-reviews-widget](https://elfsight.com/google-reviews-widget/) and create a free account.
2. Connect your Google Business Profile ("Michael Romani Balloon Twisting").
3. Elfsight gives you a **Widget ID**. Open `index.html`, find this line (search for `WIDGET_ID`):
   ```html
   <div class="elfsight-app-WIDGET_ID" data-elfsight-app-lazy></div>
   ```
4. Replace `WIDGET_ID` with the ID Elfsight gave you. That's it — reviews will start appearing and update automatically going forward.

Until you connect it, that section of the homepage stays quietly empty rather than showing placeholder or fake reviews.

A small "Leave a Google review →" link stays under the widget for people who want to leave one — everything else on the page keeps visitors on your site rather than sending them off to Google.

---

## 4. Fix the map to your exact Google Business Profile

The embedded map on the Contact page currently searches Google Maps by business name. For pixel-perfect accuracy:

1. Open your [Google Business Profile](https://business.google.com), go to your listing.
2. Open it in Google Maps → **Share** → **Embed a map** → copy the `<iframe>` code.
3. In `contact.html`, replace the existing `<iframe src="https://www.google.com/maps?q=...">` with the one Google gives you.

---

## 5. Set your real domain name

Every page currently uses a placeholder domain: `https://www.michaelromaniballoontwisting.com/`. Once you've picked and purchased your real domain:

1. Find-and-replace `https://www.michaelromaniballoontwisting.com` with your real domain across all HTML files, `robots.txt`, and `sitemap.xml`.
2. This affects canonical links, Open Graph/social preview tags, and the schema.org structured data used for local SEO.

---

## 6. Deploying the site

Any static host works. Two easy, free options:

**Netlify (drag-and-drop):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the entire `website` folder onto the page.
3. Your site is live instantly on a `*.netlify.app` URL — connect your real domain under Site settings → Domain management.

**GitHub Pages:**
1. Create a new GitHub repository and push the contents of the `website` folder to it.
2. In the repo's Settings → Pages, set the source to the `main` branch, root folder.
3. Connect your custom domain under the same Pages settings.

---

## 7. Site structure

- `index.html` — Home
- `balloon-twisting.html` — Full balloon twisting services page (event types, FAQ, booking process)
- `balloon-twisting-chicago-loop.html`, `-lincoln-park.html`, `-lincoln-square.html`, `-edgewater.html`, `-wicker-park.html`, `-old-irving-park.html` — neighborhood-specific landing pages (each has its own H1, meta tags, and FAQ tailored to that area) for local SEO.
- `balloon-twisting-nearby-suburbs.html` — dedicated landing page targeting Chicago suburbs (Evanston, Skokie, Niles, Morton Grove, Park Ridge, Norridge, Harwood Heights, Lincolnwood, Oak Park, Elmwood Park, Forest Park, River Forest) with its own keywords and FAQ.
- `gallery.html` — Filterable photo gallery with lightbox
- `meet-michael.html` — About/bio page
- `contact.html` — Booking form + direct contact info + map

The "Areas We Serve" pills on the homepage, and the Chicago Areas links in every footer, point to all 7 of the location pages above.

## 8. Managing your photos

See `../photo-catalog.html` (one level up, next to the `website` and `Balloon business photos` folders) — it's a browsable page numbering every photo in your `Balloon business photos` folder. Double-click it to open in your browser, then just tell Claude things like "use #14 as the homepage hero" or "delete #9" — no need to describe the photo, just use its number.

Every page links to the others contextually (services ↔ neighborhoods ↔ gallery ↔ contact) to reinforce local SEO relevance for "balloon twisting Chicago" and nearby suburbs.

---

## 9. What's already built in

- **12 pages**: Home, full Balloon Twisting services page, 6 neighborhood landing pages, a Nearby Suburbs page, filterable Gallery with lightbox, Meet Michael, and Contact.
- **Local SEO**: unique title/meta description/H1 per page, schema.org `LocalBusiness`, `Person`, and `FAQPage` structured data (including neighborhood-specific FAQ entries), `sitemap.xml` + `robots.txt`, contextual internal links between every page and neighborhood.
- **Elegant, quiet motion**: small scroll-reveal transitions, floating balloon-dog decorations, animated counters, a working gallery lightbox — all vanilla CSS/JS (no framework weight), fully disabled for visitors with `prefers-reduced-motion` turned on.
- **Mobile-specific design**: a persistent bottom Call / Get a Free Quote bar on mobile (not just a shrunk desktop layout), a dedicated slide-in nav, and layouts that re-flow rather than just scale down.
- **Fully responsive**: tested from 375px phones up through large desktop.
- **Accessible**: visible focus states, skip-to-content link, alt text on every image, keyboard-operable gallery/lightbox/menu, labeled form fields.
- **A restrained, deliberate palette**: cream, charcoal ink, and three balloon colors (gold, coral, teal) — no incidental colors.
- **No paid dependencies required**: everything runs on plain HTML/CSS/JS. Google Fonts (Fredoka + Nunito) load from Google's CDN; Elfsight's script only loads once you've connected your reviews widget.
