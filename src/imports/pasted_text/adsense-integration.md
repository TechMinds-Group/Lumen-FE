You are a senior frontend developer specializing in React 18 + Vite + TypeScript.

Your task is to implement Google AdSense monetization for the project
"Lumen — Mapa Multidimensional do Pensamento Político", a React 18 +
TypeScript + Vite educational and political transparency SPA.

## Project context
- React 18 + Vite + TypeScript + Tailwind v4
- Client-side SPA, hosted on Vercel
- Educational dashboard with sidebar, thinker cards, and modal views
- Content includes political thinkers AND electoral candidates proposals
- Dark mode supported (light/dark toggle with CSS variables)
- Color palette: Azul Noturno (#0F1E35), Ouro Antigo (#C9A84C),
  Prata (#8A9BB8), Pergaminho (#F2EEE2)
- Fonts: Playfair Display (headings) + Inter (body)
- Multilingual: PT-BR, EN, ES via i18next

## Deliverables

### 1. index.html — AdSense script
Insert the AdSense global script inside <head>:
- Use placeholder ca-pub-XXXXXXXXXX with a comment to replace
- Add attribute data-ad-client
- Must be async
- Do NOT initialize ads before user consent (LGPD compliance)

### 2. src/app/components/ads/GoogleAdUnit.tsx
Create a reusable AdSense component with:
- Props:
  adSlot: string
  adFormat: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  responsive?: boolean (default: true)
- Behavior:
  - Only renders if localStorage 'lumen_consent' === 'true'
  - Calls (window.adsbygoogle = window.adsbygoogle || []).push({})
    inside useEffect, only once per mount
  - Uses a ref to avoid duplicate push() calls
  - Handles window undefined safely (SSR-safe even though not using SSR)
  - Shows a neutral placeholder div (min-height) while consent is pending,
    so layout does not shift when ad loads
  - Transparent background to respect dark mode (no white flash)
- TypeScript: declare window.adsbygoogle as any[] in a global.d.ts file

### 3. Ad placements — where and how to insert

Placement A — Sidebar (Sidebar.tsx)
- Format: rectangle (300×250)
- Position: after the last filter section, before closing </aside>
- Add margin-top: 2rem, centered horizontally
- Hide on mobile (max-width: 768px) with a wrapper div

Placement B — Inline between thinker cards (App.tsx or card grid)
- Format: horizontal (728×90 leaderboard equivalent, format='horizontal')
- Insert every 8 cards using index % 8 === 7 inside the map()
- Wrap in a full-width grid column span div so it doesn't break the CSS grid
- Hide on mobile, show only on desktop (min-width: 1024px)

Placement C — Below page header (Header.tsx)
- Format: auto (responsive)
- Full width, max-height: 90px
- Only visible on mobile (max-width: 768px)
- This avoids duplicate ads on desktop (Placement B covers desktop)

### 4. Blocked ad categories (Brand Safety)
Add a comment block in index.html explaining exactly which categories
the developer must manually block in the AdSense dashboard:
- Politics
- Elections & voting
- Social issues
- Gambling
- Adult content
- Clickbait & sensationalism
Explain WHY each category is blocked (neutrality of the platform,
LGPD, audience trust).

### 5. Environment variables
Create/update .env.example with:
VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXX     # AdSense publisher ID
VITE_ADSENSE_SLOT_SIDEBAR=XXXXXXXXXX      # Slot ID for sidebar unit
VITE_ADSENSE_SLOT_INLINE=XXXXXXXXXX       # Slot ID for inline card unit
VITE_ADSENSE_SLOT_MOBILE_HEADER=XXXXXXXXXX # Slot ID for mobile header unit

Update GoogleAdUnit.tsx to read adSlot from import.meta.env when not
passed explicitly, with a clear fallback comment.

### 6. LGPD consent banner — ConsentBanner.tsx
Create src/app/components/ConsentBanner.tsx:
- Appears on first visit (localStorage key 'lumen_consent' not set)
- Styled to match Lumen's dark academic aesthetic:
  Background: #0F1E35, border-top: 2px solid #C9A84C
  Font: Inter, text color: #F2EEE2
- Layout: fixed bottom bar, full width, z-index: 50
- Content (use i18n t() for all strings, add keys for PT-BR, EN, ES):
  PT-BR: "Usamos cookies e anúncios para manter o Lumen gratuito e
  independente. Ao continuar, você concorda com o uso de cookies."
  EN: "We use cookies and ads to keep Lumen free and independent.
  By continuing, you agree to the use of cookies."
  ES: "Usamos cookies y anuncios para mantener Lumen gratuito e
  independiente. Al continuar, aceptas el uso de cookies."
- Two buttons:
  "Aceitar" → sets localStorage 'lumen_consent' = 'true', hides banner,
  triggers adsbygoogle.push({}) for all pending ad slots
  "Recusar" → sets localStorage 'lumen_consent' = 'false', hides banner,
  no ads are loaded
- If consent is 'false', GoogleAdUnit renders nothing (no placeholder)

### 7. useAdConsent.ts hook
Create src/app/hooks/useAdConsent.ts:
- Returns: { consent: 'accepted' | 'refused' | 'pending' }
- Reads from localStorage 'lumen_consent'
- Listens to a custom DOM event 'lumen:consent-update' so all
  GoogleAdUnit components re-render immediately after user decides
- Export as default

### 8. Ad blocker polite notice
Create src/app/hooks/useAdBlockDetected.ts:
- Probes https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js
  with a fetch() to detect ad blockers
- Returns: { adBlockDetected: boolean, loading: boolean }
- If adBlockDetected is true, show a dismissible banner in App.tsx:
  PT-BR: "Os anúncios mantêm o Lumen gratuito. Considere desativar
  seu bloqueador neste site."
  Styled: subtle gold (#C9A84C) top border, Pergaminho (#F2EEE2)
  background, dismissible via localStorage 'lumen_adblock_dismissed'
- Do not show the banner if user has already refused consent

## Output format
For each deliverable output:
1. Full file path
2. Complete file content in TypeScript (no shortcuts or omissions)
3. One-line note explaining the implementation decision

## Constraints
- No third-party ad wrapper libraries (vanilla AdSense API only)
- All components strictly typed (no 'any' except window.adsbygoogle)
- Dark mode must work without white flash on ad containers
- Ads must never load before LGPD consent is given
- Do not break existing component logic — only add new files and
  minimal imports in App.tsx, Header.tsx, and Sidebar.tsx
- All user-facing strings must go through i18next t() function
- Ad placeholders must use min-height to prevent layout shift (CLS)