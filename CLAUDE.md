# RECVR — Claude Code Master Build Document

You are building RECVR: the AI recovery protocol platform for serious athletes.
Read this entire document before writing a single line of code.
Follow the build sequence exactly. Do not add features not listed here.
When in doubt: do less, do it better.

---

## WHAT WE ARE BUILDING

RECVR aggregates UK recovery and longevity services — cryotherapy, infrared sauna,
IV therapy, float tanks, red light therapy, cold plunge — and uses AI to generate
personalised 7-day recovery protocols based on the user's training context.

**Two features. Both must be exceptional. Nothing else.**

1. **AI Protocol Engine** — user describes training context, RECVR returns a
   personalised 7-day recovery protocol with specific venue recommendations and
   physiological reasoning. This is the hero feature. This is what wins the demo.

2. **Venue Directory** — 12–15 hand-crafted, high-quality UK recovery venue profiles
   with beautiful cards, rich profile pages, and real booking CTAs.

Everything else is out of scope for this build.

---

## WHAT IS OUT OF SCOPE — DO NOT BUILD

- User authentication / login / accounts
- Payment processing / Stripe
- Real-time availability checking
- Reviews system (seed static data instead)
- Wearable integrations
- Admin dashboard
- Blog / CMS
- Notifications / email sequences
- Anything requiring more than 5 minutes to configure

If you find yourself about to build any of the above, stop and ask for confirmation.

---

## STACK — EXACT VERSIONS AND TOOLS

```
Framework:    Next.js 15 (App Router, TypeScript)
Styling:      Tailwind CSS v4
Components:   shadcn/ui
AI:           @anthropic-ai/sdk (claude-sonnet-4-6, streaming)
Database:     @supabase/supabase-js
Email:        resend
Animations:   framer-motion
Icons:        lucide-react
Font:         Geist + Geist Mono (next/font/google or next/font/local)
Deployment:   Vercel
```

**Install command after create-next-app:**
```bash
npx shadcn@latest init
npm install @anthropic-ai/sdk @supabase/supabase-js resend framer-motion lucide-react
```

---

## ENVIRONMENT VARIABLES

Create `.env.local` with these keys. Never expose on the client side.

```env
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

The Supabase anon key is safe to expose (NEXT_PUBLIC_). All others are server-only.
The Anthropic API key must only ever be used in server-side API routes or server actions.

---

## COLOUR PALETTE — USE EXACTLY THESE VALUES

```
Background:       #080A0F   (near-black, cold blue undertone)
Surface/Cards:    #0F1117   (slightly lighter for card backgrounds)
Border:           #1E2433   (subtle card borders)
Primary accent:   #06B6D4   (cyan-500 — evokes ice, cold, precision)
Secondary:        #3B82F6   (blue-500 — secondary actions)
Text primary:     #F8FAFC   (near-white)
Text secondary:   #94A3B8   (slate-400)
Success:          #10B981   (emerald-500)
```

Add these to `tailwind.config.ts` as custom colours so they can be used as
`bg-recvr-bg`, `text-recvr-primary`, `border-recvr-border` etc.

**Dark mode only. No light mode. No toggle.**

---

## TYPOGRAPHY

```
Display:    Geist Bold, tracking -0.02em
Body:       Geist Regular
Mono:       Geist Mono (used for protocol output stats and numbers)
```

Set in `app/layout.tsx` using `next/font/google` or Vercel's Geist package.

---

## SITE STRUCTURE

```
/                        Landing page + embedded AI protocol widget
/venues                  Venue directory with filter (city + modality)
/venues/[slug]           Individual venue profile page
/protocol                Standalone protocol generator (for deep-linking in demo)
/api/generate-protocol   POST — server route, calls Claude, streams response
/api/capture-email       POST — server route, saves email to Supabase
```

---

## DATABASE SCHEMA — CREATE EXACTLY THIS IN SUPABASE

### Table: `venues`

```sql
CREATE TABLE venues (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  city          text NOT NULL,
  postcode      text,
  description   text,
  modalities    text[],
  price_from    integer,
  price_range   text CHECK (price_range IN ('£', '££', '£££')),
  hero_image    text,
  images        text[],
  booking_url   text,
  website       text,
  instagram     text,
  phone         text,
  is_featured   boolean DEFAULT false,
  is_verified   boolean DEFAULT true,
  rating        numeric(3,1) DEFAULT 4.8,
  review_count  integer DEFAULT 14,
  amenities     text[],
  lat           numeric(9,6),
  lng           numeric(9,6),
  created_at    timestamptz DEFAULT now()
);
```

Valid modality values for the `modalities` array:
```
'cryotherapy'
'infrared_sauna'
'iv_therapy'
'float_tank'
'red_light'
'cold_plunge'
'contrast_therapy'
'compression'
'hyperbaric_oxygen'
'sports_massage'
```

### Table: `email_captures`

```sql
CREATE TABLE email_captures (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL,
  source     text,
  metadata   jsonb,
  created_at timestamptz DEFAULT now()
);
```

### Table: `protocol_logs`

```sql
CREATE TABLE protocol_logs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport            text,
  training_load    text,
  issues           text[],
  goal             text,
  city             text,
  protocol_output  jsonb,
  created_at       timestamptz DEFAULT now()
);
```

### Row Level Security

```sql
-- venues: public read
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read venues" ON venues FOR SELECT USING (true);

-- email_captures: service role only (server-side inserts only)
ALTER TABLE email_captures ENABLE ROW LEVEL SECURITY;

-- protocol_logs: service role only
ALTER TABLE protocol_logs ENABLE ROW LEVEL SECURITY;
```

---

## VENUE DATA — SEED THESE RECORDS

Research and enter the following real UK venues. Pull accurate data from their
websites. Every field should be real and verifiable. Judges will Google these.

Priority venues to enter (in this order):

1. **LondonCryo** — Multiple London locations (Belgravia, City, St John's Wood)
   - Modalities: cryotherapy, infrared_sauna, iv_therapy, red_light
   - Website: londoncryo.com

2. **Repose Space** — London
   - Modalities: cryotherapy, infrared_sauna, red_light, hyperbaric_oxygen
   - Website: repose-space.co.uk

3. **Rebase Recovery** — London
   - Modalities: cryotherapy, infrared_sauna, cold_plunge, contrast_therapy
   - Website: rebaserecovery.com

4. **Sauna & Plunge** — Shoreditch, London
   - Modalities: infrared_sauna, cold_plunge, contrast_therapy
   - Website: saunaandplunge.life

5. **Zone Recovery** — London
   - Modalities: cryotherapy, infrared_sauna, iv_therapy, hyperbaric_oxygen
   - Website: zonerecovery.co.uk

6. **111CRYO** — London (part of 111SKIN)
   - Modalities: cryotherapy, infrared_sauna, sports_massage
   - Website: 111skin.com/cryo

7. **EK Cryo** — London
   - Modalities: cryotherapy
   - Website: cryotherapy-london.co.uk

8. **Rooftop Saunas** — Hackney + Brixton, London
   - Modalities: infrared_sauna, cold_plunge, contrast_therapy
   - Website: (search for current URL)

9. **The CryoLab** — Manchester
   - Modalities: cryotherapy, infrared_sauna
   - Website: thecryolab.co.uk

10. **Get A Drip** — Multiple London locations
    - Modalities: iv_therapy
    - Website: getadrip.com

11. **Cryobright** — London
    - Modalities: cryotherapy, red_light
    - Website: cryobright.co.uk

12. **LondonCryotherapy** — London
    - Modalities: cryotherapy, sports_massage
    - Website: londoncryotherapy.co.uk

---

## AI PROTOCOL ENGINE — IMPLEMENTATION

### Route: `/app/api/generate-protocol/route.ts`

```typescript
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const SYSTEM_PROMPT = `You are RECVR's AI recovery protocol engine — a world-class sports
performance specialist with deep expertise in exercise physiology and evidence-based
recovery modalities including cryotherapy, infrared sauna, IV therapy, float tanks,
red light therapy, contrast therapy, compression therapy, and cold plunge.

When given a user's training context, generate a precise 7-day recovery protocol.

RULES:
- Recommend exactly 3–4 treatments across 7 days (not every day — recovery needs rest days)
- Each recommendation must specify: day number, modality, duration, and a physiological reason
- Physiological reasons must reference specific mechanisms: lactate clearance,
  vasoconstriction/vasodilation cycles, parasympathetic nervous system activation,
  cortisol reduction, mitochondrial stimulation, pro-inflammatory cytokine reduction,
  glycogen replenishment support, fascia hydration, etc.
- Sequence treatments intelligently: never put heat and cold on the same day
  (e.g. sauna and cryotherapy should be on different days)
- Account for the user's specific sport, training load, issues, and goals
- Be confident and specific — this is evidence-based guidance, not hedged opinion
- Tone: expert sports scientist, not a wellness influencer

OUTPUT: Respond with valid JSON only. No markdown. No preamble. No explanation outside the JSON.

{
  "summary": "2-sentence personalised overview explaining why this protocol is designed for this person",
  "protocol": [
    {
      "day": 1,
      "day_label": "Day 1",
      "modality": "Cryotherapy",
      "modality_key": "cryotherapy",
      "duration_minutes": 3,
      "price_from": 85,
      "reason": "Specific physiological reason referencing their sport and issues...",
      "venue_modality_match": "cryotherapy"
    }
  ]
}

Valid modality_key values: cryotherapy, infrared_sauna, iv_therapy, float_tank,
red_light, cold_plunge, contrast_therapy, compression, hyperbaric_oxygen, sports_massage`

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { sport, trainingLoad, issues, goal, city } = body

  const userMessage = `
    Sport/activity: ${sport}
    Training load this week: ${trainingLoad}
    Current issues: ${issues?.join(', ') || 'none specified'}
    Primary goal: ${goal}
    Location: ${city}
    
    Generate a personalised 7-day recovery protocol for this athlete.
  `

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  return new Response(stream.toReadableStream())
}
```

### Frontend: Parsing and Venue Matching

After receiving the streamed JSON from Claude, the frontend should:

1. Parse the JSON once the stream completes
2. For each protocol item, query Supabase for venues in the user's city that include
   the `venue_modality_match` value in their `modalities` array
3. Take the first matching venue (or the featured one if multiple exist)
4. Inject the real venue name, slug, and price_from into the protocol card
5. Render the complete protocol timeline with venue cards

```typescript
// Venue matching query example
const { data: matchedVenue } = await supabase
  .from('venues')
  .select('*')
  .eq('city', city)
  .contains('modalities', [modalityKey])
  .eq('is_featured', true)
  .limit(1)
  .single()

// Fallback to any venue with that modality if no featured one
```

---

## PAGE COMPONENTS TO BUILD

### Landing Page (`app/page.tsx`)

Build these sections in order. Each is independent. Ship what exists.

```
1. Nav              Fixed, dark, logo left, 2 links + CTA button right
2. Hero             Headline + sub + 2 CTAs + background image/gradient
3. Protocol Widget  THE PRODUCT — multi-step form + streaming output, inline
4. How It Works     3 steps, icons, one line each
5. Featured Venues  4 venue cards pulled from Supabase (is_featured = true)
6. Modalities Grid  6 modality type cards with icons
7. Social Proof     3 testimonials + founding venue partner logos
8. Email Capture    Simple email input + CTA
9. Footer           Logo + links + legal
```

### Protocol Form (`components/ProtocolForm.tsx`)

Multi-step form with these exact steps:

```
Step 1: "What's your main sport or activity?"
        Pills: Running · Cycling · CrossFit · Gym training ·
               Triathlon · Swimming · Team sports · Other
        Multi-select: yes

Step 2: "How hard have you been training this week?"
        Pills: Light (1–2 sessions) · Moderate (3–4) ·
               Heavy (5–6) · Extreme (daily doubles / race week)
        Single select: yes

Step 3: "What are you dealing with right now?"
        Pills: Leg fatigue · Upper body tightness · Lower back ·
               Full body soreness · Injury prevention ·
               Mental fatigue · Nothing specific
        Multi-select: yes

Step 4: "What's your main goal this week?"
        Pills: Recover faster · Reduce inflammation ·
               Boost performance · Prevent injury · General optimisation
        Single select: yes

Step 5: "Where are you based?"
        Pills: London · Manchester · Bristol · Edinburgh · Other UK
        Single select: yes

Submit: "Build my recovery protocol →" button
```

After submit: show a loading state with animated text
("Analysing your training load..." → "Building your protocol...")
then render the protocol output in the same component space.

### Protocol Output (`components/ProtocolOutput.tsx`)

Render as a vertical timeline. Use Framer Motion to stagger each card in
with a 150ms delay between items.

Each protocol card contains:
```
- Day indicator (e.g. "Day 1")
- Modality icon (use Lucide icons or custom SVGs)
- Modality name (e.g. "Cryotherapy")
- Matched venue name + city (from Supabase lookup)
- Duration (e.g. "3 minutes")
- Price from (e.g. "From £85")
- Physiological reason (the Claude output — render in full)
- "View venue →" button → links to /venues/[matched-venue-slug]
```

Below the timeline:
```
"Get this protocol emailed to you"
[email input]  [Send me this protocol →]
```
On submit: save email + full protocol JSON to email_captures table,
send confirmation email via Resend.

### Venue Card (`components/VenueCard.tsx`)

```
- Hero image (aspect-video, object-cover, rounded-lg)
- Modality pills (colour coded: cyan for cryo, amber for sauna,
                  purple for IV, teal for float, red for red light)
- Venue name (text-lg font-semibold)
- City + postcode
- Price range indicator (£ / ££ / £££)
- Verified badge (if is_verified = true)
- Rating + review count
- "View venue →" link → /venues/[slug]
```

On hover: scale(1.02), border brightens to cyan-500/50.
Use Framer Motion whileHover for this.

### Venue Profile Page (`app/venues/[slug]/page.tsx`)

```
- Full-width hero image header (h-64 md:h-96, object-cover)
- Venue name + verified badge
- City + postcode
- Description (full text)
- Modality tags
- Pricing table (per modality/service if data available)
- Amenities list
- Google Maps embed (static iframe, no API key required)
  Use: https://maps.google.com/maps?q={postcode}&output=embed
- "Book a session" button → links to booking_url (external, target="_blank")
- Back to venues link
```

### Venue Directory (`app/venues/page.tsx`)

```
- Page header: "Recovery venues"
- Filter row: city pills + modality pills (all | cryotherapy | sauna | iv | etc.)
- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- Venue cards (using VenueCard component)
- Filtering: client-side state or Supabase query params
- Empty state: "No venues found for this combination"
```

---

## EMAIL CAPTURE — `/app/api/capture-email/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  const { email, source, metadata } = await request.json()

  await supabase.from('email_captures').insert({ email, source, metadata })

  await resend.emails.send({
    from: 'RECVR <hello@recvr.uk>',
    to: email,
    subject: "You're on the RECVR waitlist",
    html: `
      <h2>You're in.</h2>
      <p>You're on the RECVR early access list. We'll be in touch when
      we open up to new members.</p>
      <p>In the meantime, explore recovery venues at recvr.uk</p>
      <p>— The RECVR team</p>
    `,
  })

  return NextResponse.json({ success: true })
}
```

---

## BUILD SEQUENCE — FOLLOW EXACTLY

Complete each block fully before starting the next. Do not skip ahead.

### DAY 1 — Foundation and data

**Block 1 (2h): Project setup**
```bash
npx create-next-app@latest recvr --typescript --tailwind --app --src-dir
cd recvr
npx shadcn@latest init
npm install @anthropic-ai/sdk @supabase/supabase-js resend framer-motion lucide-react
```
- Set up Supabase project, create all three tables from schema above
- Add RLS policies
- Connect to GitHub
- Deploy to Vercel, add all env vars in Vercel dashboard
- Verify: site loads at Vercel URL

**Block 2 (3h): Venue data entry — MOST IMPORTANT WORK OF DAY 1**
- Research all 12 venues listed above using their real websites
- Enter complete, accurate records into Supabase manually
- For each venue: real description, real modalities, real pricing,
  real booking URL, real hero image URL (from their site or Unsplash)
- Mark 4–6 venues as is_featured = true
- Verify: 12+ complete records in Supabase, all booking_urls work

**Block 3 (2h): Nav + landing page hero**
- Global layout with dark background (#080A0F)
- Fixed nav: RECVR wordmark left, "Venues" link + "Get early access" button right
- Hero section: headline, sub, two CTAs
- Verify: homepage renders, nav is fixed, hero reads clearly

**Block 4 (1h): How It Works + modality grid sections**
- Three-step section (static content)
- Six modality icon cards
- Verify: sections stack correctly on mobile and desktop

---

### DAY 2 — Hero features

**Block 5 (3h): AI protocol API route**
- Create `/app/api/generate-protocol/route.ts` using exact implementation above
- Set `export const runtime = 'edge'`
- Test with curl or Postman before building the UI
- Verify: endpoint returns valid streaming JSON for a test input

**Block 6 (2h): Protocol form UI**
- `ProtocolForm` component with 5 steps as specified above
- Pill selection components (single and multi-select variants)
- Progress indicator
- Submit button triggers POST to /api/generate-protocol
- Loading state with animated text
- Verify: form completes, API call fires, response streams back

**Block 7 (2h): Protocol output UI**
- `ProtocolOutput` component renders timeline from JSON
- Parse streamed response, extract protocol array
- Supabase venue matching for each protocol item
- Framer Motion stagger animation (150ms delay between cards)
- "Email me this protocol" capture below timeline
- Verify: full demo journey works end to end with real output

**Block 8 (1h): Venue directory page**
- `/app/venues/page.tsx` fetches from Supabase
- City and modality filter pills
- Responsive venue card grid
- Verify: filters work, all 12 venues display correctly

---

### DAY 3 — Polish and demo prep

**Block 9 (2h): Venue profile pages**
- `/app/venues/[slug]/page.tsx` dynamic route
- Fetch venue by slug from Supabase
- All sections as specified: hero image, services, map, booking CTA
- Verify: all 12 slugs render correctly with real data

**Block 10 (1h): Complete landing page**
- Featured venue cards (4, from Supabase)
- Social proof section (3 seeded testimonials)
- Email capture section
- Footer
- Verify: full landing page complete top to bottom

**Block 11 (1h): Email capture wiring**
- Connect landing page email form to /api/capture-email
- Connect post-protocol email form to same route
- Test: submit email, verify Supabase record + Resend confirmation
- Verify: both entry points capture email correctly

**Block 12 (1h): Mobile responsiveness**
- Test every page at 375px (iPhone SE), 390px (iPhone 14), 768px (tablet)
- Fix any layout breaks
- Protocol form must be fully usable on mobile
- Verify: entire demo flow works on a real phone

**Block 13 (1h): Animations and final polish**
- Framer Motion: protocol timeline stagger, card hover states, page transitions
- Loading states on all async operations (venue fetch, protocol generation)
- Error states (API failure message, empty venue results)
- Hover states: venue cards scale + border brightens
- Verify: demo feels smooth, no jank, no layout shifts

**Block 14 (1h): Domain, deploy, demo runs**
- Connect recvr.uk to Vercel
- Final production deploy
- Run the full demo flow 10 times
- Test 3 different input combinations — note which produces best output
- Fix any issues found
- Verify: everything works on the real domain at recvr.uk

---

## DEMO FLOW — KNOW THIS COLD

The demo takes exactly 3 minutes. Practice it until it is effortless.

1. Open recvr.co, full screen, protocol form at Step 1
2. Say: *"The recovery services market in the UK is £6 billion.
   Recovery studios grew 25x in 2 years. But the discovery experience is broken —
   everything is on different booking systems with no intelligence. RECVR fixes that."*
3. Fill form live: **Running / Heavy / Leg fatigue + full body soreness /
   Recover faster / London** — takes 20 seconds
4. Hit "Build my protocol"
5. While loading: *"The AI is analysing the training context and matching
   it to recovery science."*
6. Protocol streams in — read one recommendation aloud with the physiological reason
7. Click "View venue" on the cryotherapy recommendation
8. Venue profile opens — scroll to show photos, services, booking CTA
9. Click "Book this session" — real venue booking page opens
10. *"Real venues. Real bookings. 18% commission on every session we refer.
    Plus £299/month venue SaaS. [X] founding venue partners already signed."*
11. Switch to financial model

**Golden path inputs (pre-tested, produces best output):**
- Sport: Running
- Load: Heavy (5–6 sessions)
- Issues: Leg fatigue + Full body soreness
- Goal: Recover faster
- City: London

Have this pre-filled and ready to go before presenting.

---

## WHAT TO FAKE vs BUILD PROPERLY

### Fake without guilt

- **Booking infrastructure**: "Book this session" links out to the real venue's
  own booking page. Tell judges: "Integrated booking is Phase 2." This is fine.
- **Reviews and ratings**: Seed 2–3 plausible reviews per venue. Keep them
  realistic (not hyperbolic). Ratings between 4.6 and 4.9.
- **Review counts**: Numbers like 17, 23, 31 read credibly. Not 5, not 100.
- **Wearable integrations**: Add "Coming soon" tags in the UI if you want to
  signal roadmap. Do not build them.

### Build properly — these cannot be faked

- **AI protocol engine**: Must work live. Judges will input their own data.
  The output must be specific, coherent, and impressive.
- **Venue search and filter**: Must be real Supabase queries. Judges will filter.
- **Email capture**: Must actually store the address. Judges may sign up.
- **"Book this session" links**: Must go to real, working venue booking pages.
- **Domain**: Must be deployed on recvr.co. Not a Vercel preview URL.

---

## COMPONENT ARCHITECTURE

```
app/
  layout.tsx              Global layout, dark bg, fonts, metadata
  page.tsx                Landing page (assembles all sections)
  venues/
    page.tsx              Venue directory
    [slug]/
      page.tsx            Venue profile
  protocol/
    page.tsx              Standalone protocol page
  api/
    generate-protocol/
      route.ts            Claude API route (edge runtime)
    capture-email/
      route.ts            Email capture route

components/
  ui/                     shadcn components (auto-generated)
  Nav.tsx                 Fixed navigation
  Hero.tsx                Landing hero section
  ProtocolForm.tsx        Multi-step form
  ProtocolOutput.tsx      Protocol timeline renderer
  VenueCard.tsx           Venue card for directory + featured grid
  ModularityGrid.tsx      6 modality type cards
  HowItWorks.tsx          3-step section
  EmailCapture.tsx        Email input + submit
  Footer.tsx              Site footer

lib/
  supabase.ts             Supabase client (browser + server variants)
  types.ts                TypeScript types for Venue, Protocol, etc.

types/
  index.ts                Shared types
```

---

## TYPESCRIPT TYPES

```typescript
// lib/types.ts

export type Modality =
  | 'cryotherapy'
  | 'infrared_sauna'
  | 'iv_therapy'
  | 'float_tank'
  | 'red_light'
  | 'cold_plunge'
  | 'contrast_therapy'
  | 'compression'
  | 'hyperbaric_oxygen'
  | 'sports_massage'

export interface Venue {
  id: string
  name: string
  slug: string
  city: string
  postcode: string
  description: string
  modalities: Modality[]
  price_from: number
  price_range: '£' | '££' | '£££'
  hero_image: string
  images: string[]
  booking_url: string
  website: string
  instagram: string
  phone: string
  is_featured: boolean
  is_verified: boolean
  rating: number
  review_count: number
  amenities: string[]
  lat: number
  lng: number
  created_at: string
}

export interface ProtocolItem {
  day: number
  day_label: string
  modality: string
  modality_key: Modality
  duration_minutes: number
  price_from: number
  reason: string
  venue_modality_match: Modality
  matched_venue?: Venue
}

export interface Protocol {
  summary: string
  protocol: ProtocolItem[]
}

export interface ProtocolFormData {
  sport: string[]
  trainingLoad: string
  issues: string[]
  goal: string
  city: string
}
```

---

## COMMON MISTAKES — DO NOT MAKE THESE

1. **Exposing the Anthropic API key client-side.** Always call Claude from a
   server route or server action. Never from a React component directly.

2. **Building auth before the hero features work.** Auth is block N+100.
   Protocol engine and venue profiles first. Always.

3. **Spending time on the CMS or admin dashboard.** Enter venue data directly
   in Supabase. No admin UI needed for the demo.

4. **Generic loading states.** The protocol loading state is part of the demo
   experience. "Analysing your training load..." is better than a spinner.

5. **Sparse venue data.** Judges will click through to venue profiles. Every
   venue needs: real description, real modalities, real hero image, real
   booking URL. Anything less breaks trust.

6. **Forgetting Edge Runtime on the AI route.** Without `export const runtime = 'edge'`
   cold starts will make the demo feel broken.

7. **Building for desktop and forgetting mobile.** Judges will look on their phones.
   Block 12 (mobile responsiveness pass) is non-negotiable.

8. **Over-engineering the venue matching.** A simple Supabase query filtering by
   city and modality array is enough. Do not build a recommendation algorithm for this.

---

## PERFORMANCE TARGETS

- Lighthouse score: 90+ on mobile
- Protocol API response (first token): < 1 second
- Protocol full output: < 5 seconds
- Venue directory page load: < 1 second
- No layout shifts (CLS = 0)
- All images: next/image with correct width/height

---

## FINAL RULE

When in doubt: build less, build better.

A venue directory with 12 real, beautiful venue profiles beats a venue directory
with 50 sparse ones. A protocol engine that produces genuinely impressive output
beats one that generates generic text with 10 extra form fields.

The competition is won on the quality of two things: the AI protocol output and
the venue profiles. Allocate time accordingly.
