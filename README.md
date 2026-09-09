# Michael Romani Balloon Twisting — Website

A static site (no build step required): Home, Balloon Twisting, 6 neighborhood landing pages, a Nearby Suburbs page, Gallery, Meet Michael, and Contact.

Open `index.html` in a browser to preview locally, or deploy the whole `website` folder as-is.

---

## 1. Photos — real ones are live ✅

Real photos from `Edited Website photos` are now in place across the site — hero, About portrait, service shot, the 6 event-type carousel photos (Birthday/School/Block Party/Wedding/Festival/Corporate), all 12 gallery photos, and the social-share image.

**To swap any photo or change a crop:** open `../photo-catalog.html` (double-click it, no server needed) — every photo in the `Edited Website photos` folder is numbered, and ones already live on the site are marked with a green border and a "Live: filename" label so you can see at a glance what's used where. Just tell Claude the number and what to do.

**Want a different photo in any slot, or a different crop?** Open `../photo-catalog.html` (double-click it — no server needed) and tell Claude the photo number plus what to do: "put #14 in the hero instead," "crop #9 tighter on his face," "make gallery-05 landscape instead of square." Claude can crop, rotate, and resize any photo in your `Balloon business photos` folder and drop the result straight into `assets/img/` — you never have to open an image editor yourself.

The **logo** (`assets/img/logo.svg`) and **favicon** (`assets/img/favicon.svg`) use your real balloon-dog artwork, recolored to the site palette. If you get a new logo design later, just say so and Claude will swap it in — every page references these same two files.

---

## 2. Contact form — already connected ✅

The Contact page form posts to your Formspree endpoint (`https://formspree.io/f/mwlkqayy`) and emails submissions straight to you. Submit a test inquiry once the site is live to confirm it arrives.

---

## 3. Google Reviews widget — already connected ✅

The homepage reviews section is live, pulling real 5-star reviews from your connected Google Business Profile via [Elfsight](https://elfsight.com/google-reviews-widget/) — no manual updating needed, reviews refresh automatically as new ones come in.

A small "Leave a Google review →" link stays under the widget for people who want to leave one — everything else on the page keeps visitors on your site rather than sending them off to Google.

If you ever need to swap it for a different Elfsight widget, open `index.html` and replace the ID in this line:
```html
<div class="elfsight-app-b2cfdd15-e744-4740-8ab8-2e78be7a57c0" data-elfsight-app-lazy></div>
```

There's also a **second, compact rating badge** (the small "5.0 ★★★★★ · 24 reviews" pill) near the top of the homepage hero, right under the intro paragraph — a quick trust signal before visitors even scroll. That's a separate, smaller Elfsight widget (`elfsight-app-45f7a93c-7951-4cdf-acc9-15373c997760`).

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
