---
name: LearnTwin AI
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#b9c8de'
  on-secondary: '#233143'
  secondary-container: '#39485a'
  on-secondary-container: '#a7b6cc'
  tertiary: '#bec6e0'
  on-tertiary: '#283044'
  tertiary-container: '#8990a8'
  on-tertiary-container: '#22293d'
  error: '#f43f5e'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
  surface-lowest: '#020617'
  surface-low: '#0b1120'
  surface-mid: '#1e293b'
  success: '#10b981'
  warning: '#f59e0b'
  accent-violet: '#a78bfa'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 56px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  section-gap: 5rem
  element-gap: 1.5rem
  grid-gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system moves away from typical "AI neon" tropes toward a **High-End Professional SaaS** aesthetic, drawing inspiration from industry leaders like Linear and Vercel. The brand personality is sophisticated, data-driven, and authoritative, yet remains accessible for an educational context.

The visual style is **Refined Glassmorphism**. We utilize deep, monochromatic surfaces with high-precision details: ultra-thin borders, multi-layered shadows, and expansive whitespace. The indigo accent is used with surgical precision to guide the eye, rather than overwhelming the interface with decorative glows.

**Design Principles:**
- **Editorial Precision:** Large, high-contrast typography and generous negative space.
- **Structural Depth:** A clear hierarchy of dark surfaces (Slate/Navy) to create logical separation without relying on heavy lines.
- **Subtle Motion:** Micro-interactions should be fluid and dampened, reinforcing a sense of stability and speed.
```

## Colors

The palette is anchored in a deep **Midnight/Slate hierarchy** to provide a true "Pro" feel. We avoid flat navy backgrounds in favor of a layered surface system that provides depth through subtle tonal shifts.

- **Primary (Indigo):** Reserved for high-value actions (CTAs) and critical active states.
- **Surface Hierarchy:** 
  - `surface-lowest` (#020617) for the main canvas.
  - `surface-low` (#0b1120) for primary containers.
  - `surface-mid` (#1e293b) for elevated elements or hover states.
- **Semantic Accents:** Success (Emerald), Warning (Amber), and Error (Rose) are used for data visualization and feedback loops, maintaining high legibility against the dark backdrop.

## Typography

This design system employs a high-contrast typographic scale to create an editorial feel.

- **Headlines:** Uses **Hanken Grotesk** for a sharp, modern, and technical look. Tracking is tightened at larger sizes to create a dense, "premium" impact.
- **Body:** **Inter** provides maximum legibility for long-form educational content and data analysis.
- **Labels/Data:** **JetBrains Mono** is introduced for secondary metadata, timers, and small badges to reinforce the "AI/Data-driven" nature of the platform.

**Note:** Always use optical kerning. For display sizes, ensure negative letter-spacing is applied to maintain the "locked-in" professional look.

## Layout & Spacing

The layout philosophy emphasizes **significant whitespace** to reduce cognitive load, essential for complex AI analysis and learning environments.

- **Grid:** A standard 12-column fluid grid for dashboard views, shifting to a centered, single-column "focus mode" (max-width 672px) for test-taking and analysis reading.
- **Negative Space:** Increase vertical spacing between logical sections (using `section-gap`) to allow the user's eyes to rest.
- **Responsive Behavior:** 
  - **Mobile:** Margins shrink to 16px; side-by-side elements reflow into a vertical stack.
  - **Desktop:** Margins expand to 48px to create an airy, premium feel.

## Elevation & Depth

We utilize a **Subtle Glassmorphism** model that prioritizes clarity over "frostiness."

- **Layers:** Depth is communicated through backdrop blurs (20px+) combined with extremely low-opacity fills (`rgba(255, 255, 255, 0.03)`).
- **Borders:** Surfaces are defined by "Hairline" borders (0.5px to 1px) with `rgba(255, 255, 255, 0.1)`. This creates a crisp, technical edge.
- **Shadows:** Avoid heavy black dropshadows. Instead, use multi-layered ambient shadows:
  - Layer 1: 0 4px 6px rgba(0,0,0,0.3)
  - Layer 2: 0 10px 15px rgba(0,0,0,0.2)
- **Glows:** Remove all large, colorful background glows. Replace them with subtle, tinted top-borders on cards to denote category or state.

## Shapes

The design system uses a **standardized "Rounded" (0.5rem)** logic to balance the technical sharpness of the typography with a modern, approachable SaaS feel. 

- **Base Radius:** 8px for standard UI elements like inputs and smaller cards.
- **Large Radius:** 16px for primary containers and "Twin Hero" cards.
- **Pill:** Reserved exclusively for status badges and indicators (e.g., Risk Badges).

## Components

### Buttons
- **Primary:** Instead of a flat Indigo fill, use a very subtle vertical gradient (Indigo-500 to Indigo-600) with a 0.5px top-light highlight. Padding: `12px 24px`.
- **Ghost/Outline:** Use the 0.5px border rule. Hover states should feel tactile, with a slight background lift to `surface-mid`.

### Input Fields
- Darkest background (`surface-lowest`) with a subtle inner shadow. 
- Focus state: A thin Indigo border and a very soft 4px Indigo outer glow (opacity 0.2).

### Glass Cards
- Ensure `backdrop-filter: blur(24px)` is applied. 
- Content inside cards should have increased padding (`32px` on desktop) to support the "breathing room" directive.

### Icons
- Use **1.5px stroke weight** icons. They should be sized slightly smaller than standard (20px in a 24px box) to feel "precise" and clinical.

### Progress Bars
- Remove any glow or pulse. Use a solid Indigo fill on a `surface-mid` track. The transition must be a smooth `cubic-bezier(0.4, 0, 0.2, 1)`.

### Risk Badges
- High-contrast text on low-opacity backgrounds. Text must be `label-sm` (Monospaced) to feel like "data output" rather than a decorative tag.