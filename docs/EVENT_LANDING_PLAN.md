---
name: Event promo landing
overview: Add a dedicated Vietnamese ad-landing route for Apple Watch promo that follows your 15-step conversion flow and captures leads via an on-page form (no checkout/tracking yet).
todos:
  - id: inspect-existing-styles
    content: Scan existing homepage/product-detail styling patterns to match TaoOne look-and-feel (typography, spacing, colors).
    status: pending
  - id: add-event-route
    content: Add new ad-landing route under `UserLayout` in `src/App.tsx` (e.g. `/su-kien/apple-watch`).
    status: pending
  - id: build-landing-components
    content: Implement landing page sections that map to the 15-step conversion flow using PrimeFlex + PrimeReact components.
    status: pending
  - id: implement-lead-form
    content: Create `LeadForm` with validation + Toast + Telegram submit via `TelebotService.postMessage()` and a thank-you state.
    status: pending
  - id: polish-mobile-ux
    content: Add sticky CTA, smooth scroll, and responsive section layout.
    status: pending
  - id: basic-seo
    content: Set page title/description in a lightweight way for ad sharing/preview.
    status: pending
isProject: false
---

# Event promo landing page (ad-ready)

## Goal

Create a shareable route (e.g. `/su-kien/apple-watch`) under the existing `UserLayout` that presents a high-converting event/promo screen following your 15-step flow and ends with a **lead form** (name/phone/email + optional note). Submission should notify your team via existing Telegram bot integration.

## Visual direction (Apple-like, not a copy)

Target an **Apple Watch landing-page feel** (inspired by [Apple Watch Series 11](https://www.apple.com/apple-watch-series-11/)) without copying assets or wording:

- **Theme**: predominantly **light** (white/soft gray), lots of whitespace, strong typographic hierarchy.
- **Imagery policy**: **TaoOne-owned images only** (use clean placeholders initially; swap in real product photos later).
- **Layout rhythm**: short “editorial” sections with generous spacing, alternating text-left / image-right patterns, and occasional full-width highlight modules.
- **Signature modules to emulate (structure, not content)**:
  - “Get the highlights” style **feature cards** near the top.
  - A simple **sticky in-page section nav** (Overview / Benefits / Offer / FAQ / Register) on desktop; collapses to a single CTA on mobile.
  - Subtle motion: fade/slide-in on scroll, hover lifts on cards, smooth anchor scrolling.
- **Avoid**: Apple trademarks/copy, Apple product renders, Apple SF Pro font lock-in; instead use a premium Google Font pairing and TaoOne brand colors as accents.

## What we’ll leverage in your repo

- **Routing is centralized** in `[src/App.tsx](src/App.tsx)` using React Router under `UserLayout`.
- **UI stack**: PrimeReact + PrimeFlex are already in use (`InputText`, `InputTextarea`, `Button`, `Toast`).
- **Lead capture transport**: `[src/services/telebot.service.tsx](src/services/telebot.service.tsx)` already supports `postMessage()`.
- **Existing benefits/bonuses copy**: `[src/constants/constants.tsx](src/constants/constants.tsx)` exports `CAM_KET` (commitments/guarantees) and `QUA_TANG` (gifts/bonuses), which map nicely to steps 12 and 8.
- **Existing contact info** lives in `[src/components/footer/Footer.tsx](src/components/footer/Footer.tsx)` (hotline/email/address) and `SOCIAL_LINKS` in constants.

## UX/content structure (maps to your steps)

Single-page longform layout with sticky CTA (mobile-first), each section clearly labeled by content (not “Step X”):

- **Hero offer block** (Steps 1–2): promo hook + bold headline + short subhead + product image placeholder
- **Highlights strip** (Apple-like): 5–6 small feature cards (short labels) that summarize key selling points at a glance
- **Pain points** (Step 3): 3–5 bullets with icons
- **Solution** (Step 4): why TaoOne + what customer gets
- **Proof / objections** (Step 5): testimonial cards (placeholder), FAQ accordion for objections
- **Price comparison** (Step 6): “market price vs TaoOne offer” (placeholder numbers)
- **Core benefits** (Step 7): benefit grid
- **Bonuses / gifts** (Step 8): reuse `QUA_TANG`
- **Urgency + timeline** (Step 9): end date/time placeholder + “today only” copy
- **Scarcity** (Step 10): limited quantity banner (static placeholder)
- **Conversion offer** (Step 11): “Đăng ký nhận ưu đãi” highlight box
- **Guarantee / commitment** (Step 12): reuse `CAM_KET`
- **CTA** (Step 13): repeated CTA buttons scroll to form
- **Policies** (Step 14): transparent purchase/return notes (placeholder text)
- **Contact info** (Step 15): hotline/email/address (reuse Footer/SOCIAL_LINKS)

## Implementation approach (React)

- **New page component**: create `[src/components/event/EventLandingAppleWatch.tsx](src/components/event/EventLandingAppleWatch.tsx)`.
  - Compose the page from smaller presentational blocks (Hero, Proof, Comparison, FAQ, LeadForm) to keep it maintainable.
  - Use PrimeFlex grid utilities for layout.
- **New scoped styles**: `[src/components/event/EventLandingAppleWatch.module.scss](src/components/event/EventLandingAppleWatch.module.scss)` (match existing module usage like `UserHeader.module.scss`).
  - Implement Apple-like typography scale, section spacing, and card styling in SCSS modules (no global overrides unless necessary).
  - Use CSS `position: sticky` for the in-page nav on desktop.
- **Lead form component**: `[src/components/event/LeadForm.tsx](src/components/event/LeadForm.tsx)`.
  - Fields: `name` (required), `phone` (required), `email` (optional), `note` (optional).
  - Validate required fields and phone basic format; show inline errors + PrimeReact `Toast` success/failure.
  - On submit: format a concise Vietnamese lead message including **source route** and **timestamp** and send via `TelebotService.postMessage()`.
  - After success: show a lightweight thank-you state (can reuse patterns from `ThankYou.tsx`, but keep it lead-focused).
- **Routing**: add a new `<Route>` under the existing `UserLayout` block in `[src/App.tsx](src/App.tsx)`.
  - Example placement based on current structure:
    - `/<UserLayout>` currently hosts `Home`, `cart`, `payment`, `news`, etc. We’ll add `su-kien/apple-watch` (or `event/apple-watch`) alongside.

## SEO + ads readiness (non-tracking)

- Add page title/meta description handling (likely via `react-helmet-async` if already installed; otherwise minimal `document.title` in the page component).
- Ensure the URL is stable and shareable for ad campaigns.
- Keep content placeholders clearly marked so you can swap copy/images later.
- Ensure Open Graph image can be added later (placeholder notes; no implementation unless you want it now).

## Test plan

- Navigate directly to the new route and confirm it renders under `UserLayout` (header/footer present).
- Verify CTA buttons scroll to the form.
- Submit form with missing required fields → errors show.
- Submit valid form → Telegram message is sent and success state appears.
- Check mobile layout (PrimeFlex breakpoints) and ensure sticky CTA doesn’t cover form.

## Open items we’ll fill with placeholders now

- Promo headline, exact discount, end date, market price comparisons, testimonial content, policy wording (we’ll stub cleanly in Vietnamese for easy replacement).

