# elmerson.me

Personal portfolio of **Elmerson R** — AI & full-stack developer.
Live at **https://elmerson.me** (served by GitHub Pages from this repo's `main` branch).

A single static page: no framework, no build step. Edit `index.html`, push, and
GitHub Pages republishes in about a minute. Pages are cached for 10 minutes, so
add `?x=1` to the URL to see a change straight away.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site — markup, styles and motion in one file |
| `analytics.js` | Anonymous, cookie-free visit counting |
| `stats.html` | Private dashboard for those counts |
| `elmerson-r-resume.pdf` | Résumé, linked from the hero and contact buttons |
| `me5.webp` / `me5.png` | Current hero cutout, left lens see-through (WebP, with PNG fallback) |
| `portrait5.jpg` | Square crop used for the favicon and link previews |
| `me*.*`, `portrait*.jpg` | Earlier cutouts, kept on purpose |
| `CNAME` | Custom domain — do not delete |

## Analytics

GitHub Pages has no logs or visitor counts, so `analytics.js` keeps its own
using [Abacus](https://jasoncameron.dev/abacus/), a free counting API that needs
no account.

**What is counted:** page views (total and per day), new vs returning visitors,
unique visitors per day, region, how people arrived, phone vs laptop, whether
they reached the Work and Contact sections, and clicks on the résumé, GitHub,
LinkedIn, email and each live project.

**What is not:** no cookies, no IP addresses, no fingerprinting. Region comes
from the browser's time-zone setting, not an IP lookup. Visitors with Do Not
Track or Global Privacy Control are not counted.

**Dashboard:** https://elmerson.me/stats.html — total views update live.
It is not linked from the site and asks search engines not to index it, but the
counters themselves are public, so anyone with the address can read them.

**Don't count your own visits:** open https://elmerson.me/?notrack once on each
of your devices. Undo with `?track`.

**Tag links you share** so the dashboard can tell where people came from —
WhatsApp and most apps hide the referrer otherwise:

```
https://elmerson.me/?ref=whatsapp
https://elmerson.me/?ref=linkedin
https://elmerson.me/?ref=resume
https://elmerson.me/?ref=qr
```

**Testing locally:** nothing is counted on `localhost` / `127.0.0.1`. Add
`?devtrack` to send counts to a separate test namespace, and view them with
`stats.html?ns=dev`.

Counters expire if untouched for six months; every visit resets that clock.
