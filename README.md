# kilde-site

The website for [**kilde**](https://github.com/kilde-team/kilde) — an open-source screen
and audio recorder for macOS.

A hand-written static site (no build step, no framework, no JavaScript), deployed to
Cloudflare with [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/).

## Pages

| Path | Page |
|---|---|
| `/` | Top page (English) |
| `/privacy/` | Privacy Policy (English) |
| `/terms/` | Terms of Service (English) |
| `/ja/` | トップページ (日本語) |
| `/ja/privacy/` | プライバシーポリシー (日本語) |
| `/ja/terms/` | 利用規約 (日本語) |
| `/404.html` | Not-found page, served by `not_found_handling` |

## Layout

```
public/            # everything served, verbatim
  index.html
  privacy/index.html
  terms/index.html
  ja/…
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
navigation or the footer, change it in all six pages.

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
domain is used, update the `canonical`, `hreflang`, `og:url` and `og:image` values in the
six HTML pages, plus `robots.txt` and `sitemap.xml`.

## License

Site content and code: [MIT](https://github.com/kilde-team/kilde/blob/main/LICENSE),
matching the kilde project.
