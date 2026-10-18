# Placeholders to replace before launch

Everything below is still placeholder or unconfirmed content carried over
from the Readdy prototype. Nothing here should go live as if it were real.
Each line names the file(s) and field. `{en,fr}` means both language files.

Status: **open** unless marked otherwise. Last reviewed: 18 Oct 2026.

## Highest risk: claims about real organizations

Decision of 18 Oct: only the six organizations below stay named; every
other real-looking organization was replaced with a generic placeholder.
All collection items carry `"placeholder": true` until confirmed.

| What | Where | Action |
| --- | --- | --- |
| **Kept, still to confirm:** United Way, CAMH, City of Toronto, Humber College, TDSB, George Brown College (named in projects, one partner, one news story, two videos) | `src/content/projects/{en,fr}/*.json`, `pages/{en,fr}/impact.json`, `news/…/earth-week-hybrid-broadcast.json`, `videos/…` | Confirm each relationship is real and may be named, or replace |
| **Replaced:** Ontario Trillium Foundation, MaRS Discovery District, OMDC, BDC Social Enterprise, Toronto Metropolitan Univ., Ontario Nonprofit Network → "Community Partner 1–6" | `pages/{en,fr}/impact.json` → Partners | Add real partners (name, logo, website) |
| **Replaced:** "Canada-Ontario Job Grant" story → "Workforce Training Grant" | `news/{en,fr}/workforce-training-grant-2026.json` | Confirm or replace |
| **Replaced:** video naming a private person ("Meet Adaeze Obi") → "Meet a Toronto Community Leader" | `videos/{en,fr}/community-voices-ep4.json` | Real video title and link |
| A credit-union client (not named) | `projects/{en,fr}/credit-union-impact-campaign.json` | Confirm |
| 6 news stories and their dates | `src/content/news/{en,fr}/*.json` | Confirm or replace; dates estimated from the prototype |
| Latest Work tiles ("Toronto Non-Profit Gala 2025"…) differ from the matching projects | `pages/{en,fr}/home.json` → Latest work | Align with real projects |
| "Founding Charter" quote | `pages/{en,fr}/about.json` → Quote | Confirm wording and source |

## Numbers

| What | Where | Action |
| --- | --- | --- |
| Hero stats: 100+ events, 50+ lives impacted, 12K training hours | `pages/{en,fr}/home.json` → Hero → stats | Confirm, or mark as targets |
| $500K revenue, 8+ hires, B Corp (shown with a "Target" tag) | `pages/{en,fr}/home.json` → Stats | Confirm wording; switch Kind to "result" once achieved |
| 25% profit reinvested (now shown with a "Target" tag, decision of 18 Oct) | `pages/{en,fr}/home.json` → Stats | Switch Kind to "result" once confirmed in the governance documents |
| 8–12 hires, 1,200+ training hours, 70%+ retention (shown with a "Target" tag) | `pages/{en,fr}/impact.json` → Stats | Confirm wording |

## People and contact details

| What | Where | Action |
| --- | --- | --- |
| Team names are job titles ("Executive Director"…) and photos are AI images | `src/content/team/{en,fr}/*.json` | Real names and photos |
| Phone `+1 (416) 000-0000` | `src/content/settings/{en,fr}/site.json` → contact.phone | Real number |
| Email `hello@nalevelempire.ca` (forms deliver to levelempiremedia@gmail.com) | `settings/{en,fr}/site.json` → contact.email | Confirm this address exists and is monitored |
| Social links all `#` (YouTube, Instagram, LinkedIn, Facebook) | `settings/{en,fr}/site.json` → social | Real profile URLs; set placeholder to false |
| Footer legal items (Privacy Policy, Terms…) are not links yet | `settings/{en,fr}/site.json` → footer.legal | Privacy Policy page comes with the visitor map; others when written |

## Images and media

| What | Where | Action |
| --- | --- | --- |
| Logo hosted on Readdy | `settings/{en,fr}/site.json` → logo | Moves to Cloudinary in phase (c) |
| All 40 photos are AI stock images hosted by Readdy | every `image`, `photo`, `thumbnail`, `reel` field | Phase (c) moves them to Cloudinary; replace with real photos as they arrive |
| 8 videos have no YouTube link (cards open the channel) and estimated dates | `src/content/videos/{en,fr}/*.json` | Paste real YouTube links and dates |
| Featured video uses an old YouTube "uploads" embed that YouTube no longer supports | `pages/{en,fr}/media.json` → Video grid → featuredVideo | Paste one real video link |

## Language

| What | Where | Action |
| --- | --- | --- |
| All French text is a careful draft, not reviewed by a fluent speaker | every `.../fr/...` file | Review by a francophone; Canadian usage (courriel, OBNL, RGT) was used |
