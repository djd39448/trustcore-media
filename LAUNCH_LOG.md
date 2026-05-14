# Launch Log: TrustCore Media

**Slug:** `trustcore-media`
**Repo:** `djd39448/trustcore-media`
**Domain:** `trustcore-media.vercel.app` (custom `media.50by50.dev` planned)
**Site type:** newsletter + news aggregator
**Launch date:** 2026-05-13 (live; awaiting full §5 gate pass to count)
**Kill-clock date:** 2026-06-03 (launch + 21 days)

---

## One-sentence promise

A calm daily brief on crypto and AI — hand-picked headlines from the firehose, no commentary, just signal.

## User persona

- **Who:** Founders, traders, researchers, and operators who need to stay current on crypto + AI without scrolling Twitter for an hour every morning.
- **Situation:** Reads too many sources, distrusts any one of them, wants a quick scan in under three minutes.
- **Urgency:** Daily — the value is the morning-routine slot.
- **What they are trying to decide:** "Is anything I need to know about happening right now?"

## Core asset

The homepage IS the asset: every page-load fetches RSS from 14 named publications, surfaces a Today's Brief lede pair (one crypto, one AI), magazine-style Top Stories columns, then the full chronological file. Refreshes on every load — no cache, no stale.

## MVP pages

1. Homepage (`/`) — Today's Brief + Top Stories + Full File + sidebar.
2. Privacy (`/privacy`) — what we collect, what we don't.
3. JSON API (`/api/feeds`, `/api/brief`, `/api/sources`, `/api/subscribers`) — programmatic surface for agents.

## CTA

- **Primary:** Subscribe to the morning brief (sidebar `SubscribeForm`).
- **Secondary:** Click headlines through to publishers (no interstitial, no rewrite).

## Monetization path (pick ONE at launch)

- [x] Newsletter sponsorships (eventual — primary)
- [ ] Affiliate (deferred — no outbound-headline affiliate links, ever; would compromise editorial trust)
- [ ] Digital product (potential — paid weekly digest tier)
- [ ] Sponsorship (eventual)
- [ ] Display ads (deferred — incompatible with the calm-signal voice)
- [ ] Service/consulting

## Privacy posture

- GA4 with `anonymize_ip` + `allow_google_signals: false` + `allow_ad_personalization_signals: false`.
- No third-party trackers beyond GA4. No Facebook Pixel, no LinkedIn Insight, no session replay.
- Subscriber email is the only PII collected; stored in Supabase; used only for the brief.
- Standard Vercel server logs retained per Vercel default.
- Full statement at [`/privacy`](https://trustcore-media.vercel.app/privacy).

## §5 launch-gate status (50by50 Minimum Useful Launch Standard)

Scored 2026-05-13 EOD:

| # | Gate item | Status | Note |
|---|---|---|---|
| 1 | Live domain or subdomain | ✅ | `trustcore-media.vercel.app` |
| 2 | Clear promise on homepage | ✅ | Masthead + editor's deck |
| 3 | Useful tool OR 5 pages | ✅ | The aggregator itself |
| 4 | Basic SEO hygiene | ✅ | `app/sitemap.ts`, `app/robots.ts`, canonical metadata via `metadataBase` + `alternates.canonical` |
| 5 | Human quality pass | ✅ | Headlines from attributed RSS; no fabricated content |
| 6 | Analytics installed | ⏳ | Component wired (`src/components/analytics.tsx`); activates the moment `NEXT_PUBLIC_GA4_ID` is set in Vercel |
| 7 | Search Console connected + sitemap submitted | ⏳ | Wire `NEXT_PUBLIC_GSC_VERIFICATION` in Vercel, then submit sitemap from SC dashboard |
| 8 | One primary conversion action | ✅ | Daily-brief subscribe form |
| 9 | Compliance footer | ✅ | Privacy link + contact + affiliate disclosure + Hub link in `src/app/page.tsx` footer; full statement at `/privacy` |
| 10 | Launch log + portfolio + TrustCore wiring | ✅ | This file + `roadmap.yaml` entry; TrustCore wiring opportunistic per §2 |

**To flip `counts_toward_total: true` in the 50by50 roadmap:**

1. Set `NEXT_PUBLIC_GA4_ID` in Vercel project settings (e.g. `G-XXXXXXXX`).
2. Set `NEXT_PUBLIC_GSC_VERIFICATION` in Vercel with the meta-tag value from Google Search Console, OR add a DNS TXT record on the apex domain for domain-property verification.
3. Submit the sitemap URL (`/sitemap.xml`) in Search Console.
4. Replace the `hello@trustcore.systems` placeholder in `src/app/page.tsx` and `src/app/privacy/page.tsx` with the real contact address.
5. Update the 50by50 `roadmap.yaml` entry: `counts_toward_total: true`.

## Risk / kill criteria

- **Kill at 21 days if:** <300 unique visitors per week AND <10 email signups AND no inbound source-publisher reach-out.
- **Pivot trigger:** if the average session is <20s, the layout isn't helping — collapse Top Stories columns, lead with the chronological file.

## Day-3 EOD state (2026-05-13)

- Editorial visual refresh shipped: warm paper-black palette, single terracotta accent, Newsreader serif wordmark, magazine-style Today's Brief lead, Top Stories columns, calmer Full File feed, colophon footer.
- CryptoSlate 403 fixed via native-fetch fallback with browser UA + raw-XML entity sanitization. CryptoSlate now renders in the source list (200 → 210 items).
- Lint clean (raw `<img>` swapped to `next/image` with `unoptimized` + `fill`).
- SEO hygiene + privacy stub + analytics scaffolding + this launch log added EOD per the §5 gate close-out plan.

Pending Thursday: GA4 ID + Search Console verification + real contact address. Once those land, `counts_toward_total` flips to `true` in the 50by50 roadmap.
