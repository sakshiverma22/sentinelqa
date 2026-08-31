# SentinelQA Website Design Direction

## Three directions considered

### Theme Name: Signal Architecture

**Very Brief Intro:** A dark editorial control room where quality signals, traces, and validation states become the visual language. Black carries focus, violet marks system complexity, and lime is reserved for verified outcomes.

**Probability:** 0.07

### Theme Name: Proof Ledger

**Very Brief Intro:** A bright, paper-like engineering notebook with sharp annotations, restrained rules, and a forensic documentation feel. The interface feels calm, exact, and report-driven.

**Probability:** 0.03

### Theme Name: Night Shift Console

**Very Brief Intro:** A more immersive low-light lab with animated telemetry, cursor trails, and responsive wave fields. It leans into atmosphere but keeps the information hierarchy utilitarian.

**Probability:** 0.08

## Chosen approach: Signal Architecture

### Design Movement

Contemporary editorial technology design with industrial visualization, brutalist restraint, and product-quality dashboard discipline. The page should feel authored by a quality engineer who cares about evidence, not a generic SaaS template.

### Core Principles

1. **Evidence before decoration.** Every visual accent supports a metric, state, rule, or workflow.
2. **Asymmetry with control.** Use an offset split hero, irregular content rails, and anchored evidence blocks rather than centering everything.
3. **Signal hierarchy.** Violet represents analysis and complexity; lime means verified, accepted, or passing; white is reserved for readable narrative; black is the working surface.
4. **Motion as instrumentation.** The GlowCursor and GradientWaves should respond to presence and scroll without making the page feel like a demo of effects.

### Color Philosophy

Black is the instrument panel: quiet, deep, and high-contrast. Violet is the color of investigation, representing the spaces where models explore and quality engineers inspect. Lime is intentionally scarce and therefore meaningful—it appears on passes, accepted suggestions, and calls to action. White is structural and editorial, not decorative. The ownable brand color is **Sentinel Lime `#C6FF33`**.

### Layout Paradigm

An offset narrative layout: a narrow left rail for section labels and test IDs, a dominant content column for the story, and right-side evidence cards that interrupt the rhythm. The hero uses a 5/7 split with text on the left and a dark visual field on the right. Large sections use a vertical “quality run” spine rather than a uniform card grid.

### Signature Elements

1. A thin violet-to-lime signal line that appears as a progress trace through major sections.
2. Small mono labels such as `RUN / 04`, `ASSERTION`, and `HUMAN REVIEW` that turn interface copy into test metadata.
3. A lime status marker, used sparingly, that changes from “observed” to “verified” as the visitor explores the page.

### Interaction Philosophy

Interactions should feel like inspecting a live system: hover states reveal evidence, list items focus one case at a time, and buttons make state changes obvious. No decorative animation should compete with the content. All interactive elements must work with keyboard focus and preserve a strong reduced-motion mode.

### Animation

Use the supplied GlowCursor only inside the hero’s dark visual area, where its cyan-violet trail becomes a cursor-responsive trace. Use ScrollExpand for the “from signal to proof” visual transition once, not as a repeated pattern. Use AnimatedList for the seeded defect cases with subtle active selection. Use BlurText for the hero claim and section labels, with a short stagger. GradientWaves is the atmospheric foundation behind the first viewport; it should stay low-opacity and respond gently to the pointer. Keep UI state transitions under 240ms, avoid layout animation, and disable non-essential motion under `prefers-reduced-motion`.

### Typography System

Use **Space Grotesk** for display and headings: geometric, precise, and slightly technical. Use **DM Sans** for body copy: warm enough for long explanations and clear at small sizes. Use **IBM Plex Mono** for run IDs, metadata, and code-adjacent labels. Headlines are tight with slight negative tracking; body copy stays at 1.55 line-height. Metadata is uppercase, mono, and letter-spaced.

### Brand Essence

**SentinelQA is an AI-assisted quality engineering lab for teams that want faster coverage without surrendering judgment.** Personality: exacting, lucid, quietly bold.

### Brand Voice

Headlines sound like conclusions from a good test report: direct, specific, and slightly provocative. CTAs sound like the next safe action, not a sales funnel. Microcopy names what the user can inspect or verify.

Example lines:

- “AI proposes. The harness decides.”
- “Inspect the run before you trust the result.”

### Wordmark & Logo

Use the generated symbol mark: a geometric shield combined with a terminal cursor and verification notch. Pair it with a custom text lockup in Space Grotesk with tight tracking; the symbol sits in a small lime square or violet outline depending on context. Never use the raw brand name as an unstyled default heading.

### Signature Brand Color

**Sentinel Lime `#C6FF33`** — an acid verification green used only for accepted states, primary actions, and the most important data point in a visual.

## Implementation reminders

- Keep the global shell black and use violet only as a concentrated analysis accent.
- Use real project evidence: 87% application coverage, 8 passing tests, deterministic mock provider, 5 seeded defects planned, and AI suggestions quarantined before execution.
- Avoid generic dashboard filler, fake testimonials, star ratings, and invented customer claims.
- Keep the hero copy left-aligned and give the generated hero art room to breathe.
