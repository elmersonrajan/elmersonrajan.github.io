# elmerson.me

Personal portfolio of **Elmerson R** — AI & full-stack developer.
Live at **https://elmerson.me** (served by GitHub Pages from this repo's `main` branch).

A single static page: no framework, no build step. Edit `index.html`, push, and
GitHub Pages republishes in about a minute. Pages are cached for 10 minutes, so
add `?x=1` to the URL to see a change straight away.

## Layout

Top to bottom, each block is one `<section>` in `index.html`:

| Section | What it shows |
|---|---|
| Hero | The name set page-wide behind the photo, with an outline copy drawn over it |
| About (`#about`) | An intro line that fills in word by word on scroll, then five claims |
| Experience (`#experience`) | The four Doxa builds; pressing one plays a short walkthrough on a phone |
| Work (`#work`) | Seven project cards that pin and pile up on large screens |
| Education (`#education`) | Degrees on a timeline, certificates underneath |
| Skills (`#skills`) | Skills grouped by area |
| Contact (`#contact`) | Email, LinkedIn, GitHub and the résumé |

Things to keep when editing:

- The phone walkthroughs are illustrations written for this page, not recordings.
  Their text lives in the `DEMOS` object near the end of `index.html`.
- The LYN MEET, DAN BONIM and Mathan Jewellers cards do not link out on purpose. Each shows
  a short status label instead of a button.
- The visit counter relies on the `data-track` attributes and on the sections
  keeping the ids `work` and `contact`.
- Colours and fonts are set once, in the `:root` block at the top of the `<style>`.

## The projects page

`projects/index.html` is its own small page with one large tile per course project.

- A project with a link is an `<a class="tile">`; set its `href` to where it should open.
- A project without a link yet is a `<div class="tile soon">`, so it does not look or act like a button.
  To switch it on, change the `div` to an `a`, add the `href`, remove `soon`, and update the
  small label and the text at the bottom of the tile.
- To add a project, copy a tile and change its number, title, text and the two colours (`--c1`, `--c2`).

## Files

| File | What it is |
|---|---|
| `index.html` | The whole site — markup, styles and motion in one file |
| `projects/index.html` | The NEC Projects page, served at https://elmerson.me/projects |
| `analytics.js` | Anonymous, cookie-free visit counting |
| `stats.html` | Private dashboard for those counts |
| `elmerson-r-resume.pdf` | Résumé, linked from the hero and contact buttons |
| `me4.webp` / `me4.png` | Current hero cutout (WebP, with PNG fallback) |
| `portrait4.jpg` | Square crop used for the favicon and link previews |
| `me*.*`, `portrait*.jpg` | Earlier cutouts, kept on purpose |
| `CNAME` | Custom domain — do not delete |

## Analytics

GitHub Pages has no logs or visitor counts, so `analytics.js` keeps its own
using [Abacus](https://jasoncameron.dev/abacus/), a free counting API that needs
no account.

**What is counted:** page views (total and per day), new vs returning visitors,
unique visitors per day, region, how people arrived, phone vs laptop, whether
they reached the Work and Contact sections, and clicks on the résumé, GitHub,
LinkedIn, email and each linked project.

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
