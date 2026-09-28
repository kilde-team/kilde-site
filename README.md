# kilde-site

The website for [**kilde**](https://github.com/kilde-team/kilde) — an open-source screen
and audio recorder for macOS.

A hand-written static site (no build step, no framework, no JavaScript), deployed to
Cloudflare with [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).

## Pages

| Path | Page |
|---|---|
| `/` | Top page (English) |
| `/compare/` | Comparison with QuickTime Player / OBS Studio / Audio Hijack / Granola (English) |
| `/record-system-audio-mac/` | Search landing: record system audio on a Mac (English) |
| `/record-online-meetings-mac/` | Search landing: record an online meeting (English) |
| `/transcribe-meetings-without-a-bot/` | Search landing: bot-free meeting transcription (English) |
| `/record-without-notification-sounds/` | Search landing: keep notification sounds out (English) |
| `/privacy/` | Privacy Policy (English) |
| `/terms/` | Terms of Service (English) |
| `/ja/` | トップページ (日本語) |
| `/ja/compare/` | QuickTime Player / OBS Studio / Audio Hijack / Granola との比較 (日本語) |
| `/ja/record-system-audio-mac/` | 検索流入: Mac でシステム音声を録る (日本語) |
| `/ja/record-online-meetings-mac/` | 検索流入: オンライン会議を録る (日本語) |
| `/ja/transcribe-meetings-without-a-bot/` | 検索流入: ボットなしの会議文字起こし (日本語) |
| `/ja/record-without-notification-sounds/` | 検索流入: 通知音を録り込まない収録 (日本語) |
| `/ja/privacy/` | プライバシーポリシー (日本語) |
| `/ja/terms/` | 利用規約 (日本語) |
| `/404.html` | Not-found page, served by `not_found_handling` |

## Layout

```
public/            # everything served, verbatim
  index.html
  compare/index.html
  record-system-audio-mac/index.html
  record-online-meetings-mac/index.html
  transcribe-meetings-without-a-bot/index.html
  record-without-notification-sounds/index.html
                   # the four search landing pages (kilde-site#3); each has a
                   # Japanese counterpart under ja/ with the same slug
  privacy/index.html
  terms/index.html
  ja/…             # includes ja/compare/index.html and the landing pages' JA versions
  404.html
  robots.txt
  sitemap.xml
  _headers         # security headers and cache policy
  assets/
    styles.css     # the single stylesheet for every page
    favicon.svg
    og.png         # 1200x630 social card
    mac-app-store-badge-{en,ja}-{black,white}.svg
                   # Apple's official Mac App Store badge, served verbatim
                   # (downloaded from toolbox.marketingtools.apple.com). Pages
                   # pick black/white via <picture> and prefers-color-scheme.
    menu-bar-app.png
                   # the menu bar app's capture panel, cropped from the App
                   # Store screenshots in the kilde repository (docs/appstore/)
    menu-bar-app-en.png
                   # the English counterpart, rendered from the kilde
                   # repository's screenshot tools (docs/appstore/tools/) —
                   # a stand-in for a real capture; the current App Store
                   # build is Japanese-only, but en/zh-Hans/ko/es
                   # localization has landed in the kilde repository (#138)
wrangler.toml      # static-only Worker: no `main`, just [assets]
.github/workflows/deploy.yml
```

There is no templating: each page carries its own header and footer. When you change the
navigation or the footer, change it in all sixteen pages (the two legal pages have a
minimal footer — the navigation is the part that must stay in sync everywhere). The four
search landing pages are deliberately kept out of the navigation; their header and footer
still mirror the site's, so include them when the shared chrome changes.

## Keeping the comparison page current

`/compare/` and `/ja/compare/` state other vendors' prices and features with links to
their official pages and a confirmation date. That page is only honest while the facts
are fresh, so re-check it **every six months (in April and October)**:

1. Open every link in the pages' "Sources" section (they are the vendors' official pages).
2. Check each table cell against what the vendor's page says. Prices drift the most;
   feature claims must stay describable from the vendor's own words — never from review
   sites or assumptions.
3. Move the confirmation date (the `updated` chip, the "Confirmed" spans, and the
   `<lastmod>` entries in `public/sitemap.xml`) to the day you re-checked — **even when
   nothing changed**, the date is what records that the page was re-verified. Update the
   cells themselves only where a fact changed, and note what changed in the pull request.
4. Ship through a pull request as usual.

If a vendor disappears or a source link rots, drop that row/column instead of leaving an
unverifiable claim on the page.

## Local preview

```sh
npm install
npm run dev        # wrangler dev — serves public/ with the same routing as production
```

Or, without any dependencies:

```sh
python3 -m http.server -d public 8787
```

Note that `python3 -m http.server` does not apply `_headers`, the `/privacy` →
`/privacy/index.html` rewrite, or the custom 404 page. `wrangler dev` does.

## Deploying

```sh
npx wrangler login
npm run deploy
```

CI deploys on every push to `main` via `.github/workflows/deploy.yml`. It needs two
repository secrets:

| Secret | Where to get it |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → *Edit Cloudflare Workers* template |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Workers & Pages → Account ID |

### Custom domain

The site's canonical URLs assume `https://kilde.site/`. After the first deploy, attach the
domain in **Workers & Pages → kilde-site → Settings → Domains & Routes**. If a different
domain is used, update the `canonical`, `hreflang`, `og:url` and `og:image` values in all
sixteen HTML pages (top, comparison, four landing pages and legal, each EN and JA), plus
`robots.txt` and `sitemap.xml`.

## License

Site content and code: [MIT](https://github.com/kilde-team/kilde/blob/main/LICENSE),
matching the kilde project.
