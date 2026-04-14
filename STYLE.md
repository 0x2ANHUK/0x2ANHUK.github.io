# STYLE.md — AGENTIC PAGE ARCHITECTURE GUIDE

**Version:** 1.0 | **For:** AI Agents | **Format:** YAML-ish Abstract | **Lines:** <120

---

## CORE PALETTE (CSS Variables)

```yaml
colors:
  primary: "#d946a6"        # Soft magenta (attention/action)
  secondary: "#00d9ff"      # Cyan (information/flow)
  tertiary: "#00ff99"       # Neon green (success/growth)
  accent: "#ffbe0b"         # Gold (warning/highlight)
  bg_dark: "#0a0e1f"        # Deep space
  bg_surface: "rgba(0,20,30,0.7)"  # Slightly opaque surface

usage: "Apply via --c1, --c2, --c3, --c4; never hardcode colors"
```

---

## ANIMATION PATTERNS

```yaml
scroll_reveal:
  rule: |
    .element { opacity: 0; transform: translateY(30px); 
               transition: opacity 600ms cubic-bezier(0.25,0.46,0.45,0.94),
                           transform 600ms cubic-bezier(0.25,0.46,0.45,0.94); }
    .element.active { opacity: 1; transform: translateY(0); }
  trigger: "IntersectionObserver (threshold: 0.15, rootMargin: -80px)"
  stagger: "80ms between children (nth-child)"

terminal_typewriter:
  rule: |
    .terminal-line { opacity: 0; transform: translateY(6px);
                     transition: opacity 350ms ease-out, transform 350ms ease-out; }
    .terminal-line.reveal { opacity: 1; transform: translateY(0); }
  trigger: "JS: setTimeout(line.classList.add('reveal'), idx * 100ms)"
  effect: "Staggered reveal = typewriter illusion"

crt_scanline:
  rule: "repeating-linear-gradient(0deg, transparent 2px, rgba(0,217,255,0.015) 4px)"
  duration: "8s linear infinite"
  opacity: "0.015 (subtle)"

glitch:
  rule: "clip-path animation; ::before/::after pseudo-elements offset 2px each direction"
  colors: "primary + secondary (offset frames)"
  duration: "2s infinite"
```

---

## SVG SYMBOLOGY (Pre-Built Templates)

```yaml
neural_network:
  layout: "Central node (r=25px) + 4 satellites (r=8px each)"
  animation: "circle.r: 25→30→25 (3s); satellite.opacity: pulse (2-2.8s)"
  emoji: "🧠"
  position: "fixed; top: 8%; right: 8%"
  opacity: "0.22"
  float_duration: "25s ease-in-out infinite"

dna_spiral:
  layout: "Two sine curves (y=50→250); 5 perpendicular rungs"
  animation: "stroke: color-shift (4-5s); rungs pulse (2s)"
  emoji: "🧬"
  position: "fixed; bottom: 15%; left: 5%"
  opacity: "0.2"
  float_duration: "20s ease-in-out infinite"

circuit_board:
  layout: "Orthogonal paths + junction nodes (r=6px)"
  animation: "node.r: 6→8→6 (2s); path.stroke: color-shift (4-5s)"
  emoji: "⚡"
  position: "fixed; bottom: 20%; right: 6%"
  opacity: "0.18"
  float_duration: "30s ease-in-out infinite reverse"

instruction: "Create via SVG createElement; insert at page load; z-index: -1"
```

---

## MERMAID + CHARTS (Rendering Strategy)

```yaml
mermaid:
  strategy: "Pre-render to SVG offline; reference as <img src='/assets/diagrams/*.svg'>"
  cmd: "mermaid-cli or playwright render"
  benefit: "No runtime overhead; styled; offline-friendly; SOTA performance"
  fallback: "If needed live: load CDN + <div class='mermaid'>code</div>"

chartjs:
  strategy: "Load from CDN; init in <script>; canvas element"
  data_binding: "JSON from page data or fetch"
  styling: "Set colors via datasets[].backgroundColor (use palette)"
  animation: "Enabled by default; disable for heavy pages"
  responsive: "Set options.responsive: true; maintainAspectRatio: true"

mermaid_container:
  html: "<div class='mermaid-container scroll-reveal'><img src='/assets/diagrams/name.svg'/></div>"
  css: "opacity: 0; transform: translateY(30px); transition: ... (scroll-reveal rules)"
```

---

## TERMINAL HACKER EFFECTS

```yaml
crt_terminal:
  structure: |
    <div class="crt-terminal scroll-reveal terminal-glow">
      <div class="terminal-line prompt">$ command</div>
      <div class="terminal-line success">[OK] output</div>
    </div>
  styling: |
    background: #000; border: 2px solid #00ff41;
    color: #00ff41; font-family: 'IBM Plex Mono';
    box-shadow: 0 0 20px rgba(0,217,255,0.2), inset 0 0 15px rgba(0,0,0,0.6);
  animation: "Line reveal stagger (100ms apart); JS adds .reveal class"

glitch_header:
  html: "<h1 class='demoscene-title' data-text='TITLE'>TITLE</h1>"
  css: "::before, ::after pseudo-elements; clip-path animation (2s)"
  effect: "Red/cyan offset glitch = hacker aesthetic"

matrix_rain:
  strategy: "Canvas element; fixed; z-index: -1; characters: 01αβγδ...🧬⚡"
  loop: "50ms refresh; random char drop; gravity effect"
  opacity: "0.08 (subtle background)"
  performance: "Single canvas >> many DOM elements"
```

---

## LAYOUT PRIMITIVES

```yaml
container:
  structure: "max-width: 1200px; margin: 0 auto; padding: responsive"
  z_stacking: |
    z-index: -1  → matrix canvas, SVG floats
    z-index: 5   → scanline overlay (fixed)
    z-index: 50  → content
    z-index: 1000 → nav header (fixed)

header_nav:
  pattern: |
    .nav-menu { display: none; } (HIDDEN by default)
    .nav-menu.open { display: flex; } (JS toggles on click)
    .nav-burger { toggle on click; outside-click closes }
  mobile: "Burger menu always; desktop: flex nav"

hero_section:
  pattern: |
    <div class="hero scroll-reveal demoscene">
      [content with glitch effects, emojis, symbols]
    </div>
  styling: "gradient background; neon border; glow box-shadow; smooth scroll reveal"

content_section:
  pattern: |
    <div class="content-section scroll-reveal demoscene">
      <h2 class="circuit-line">[title]</h2>
      <div class="symbol-row">[ASCII symbols]</div>
      [paragraphs, terminals, diagrams]
    </div>
  animation: "Scroll reveal + stagger (80ms per child)"
```

---

## ASSET LINKING (Minimal Duplication)

```yaml
shared_css:
  - "/assets/css/unified.css"        # Global colors, typography
  - "/assets/css/nexus.css"           # Nav, scroll-reveal, terminals
  - "/assets/css/nexus-demoscene.css" # Hacker aesthetic, floats, glitch

shared_js:
  - "/assets/js/nexus.js"             # Nav toggle, IntersectionObserver
  - "/assets/js/nexus-demoscene.js"   # Matrix rain, SVG creation, glitch

strategy: "Link once per page; all styling cascades; zero duplication"
```

---

## PAGE BUILD CHECKLIST (Agents)

```yaml
step_1_structure:
  - Copy from nexus-autonomy.html (template)
  - Update <title>, meta, page title
  - Link shared CSS + JS
  - Set page-specific <style> minimal

step_2_content:
  - Add .hero.scroll-reveal.demoscene
  - Add .content-section.scroll-reveal.demoscene (with .circuit-line h2)
  - Add .symbol-row decorators
  - Use .emoji-accent for floating icons

step_3_interactivity:
  - Terminal? → .crt-terminal.scroll-reveal.terminal-glow
  - Diagram? → <div class='mermaid-container scroll-reveal'><img src='/assets/diagrams/*.svg'/></div>
  - Chart? → <canvas id='chart'></canvas> + script init
  - Glitch text? → <span class='glitch-text' data-text='TEXT'>TEXT</span>

step_4_test:
  - Desktop 1920×1080: smooth animations, no jank
  - Mobile 390×844: floats hidden, readable, scroll works
  - Performance: DevTools → 60fps target
  - Accessibility: contrast ✓, semantic HTML ✓

step_5_commit:
  - Semantic message: "feat(page-name): add [feature] with scroll-reveal"
  - Include agent comment if new pattern
  - Update sitemap.xml + feed.xml if needed
```

---

## QUICK REFERENCE RULES

```yaml
never:
  - ❌ Hardcode colors (use CSS variables)
  - ❌ Duplicate CSS in page-specific <style>
  - ❌ Use animation keyframes for scroll reveals (use transitions + class)
  - ❌ Skip mobile testing (test 390px minimum)
  - ❌ Leave code without agent comments

always:
  - ✅ Use IntersectionObserver (scroll detection)
  - ✅ CSS for animation, JS for timing (separation of concerns)
  - ✅ Stagger animations (80-100ms per element = visual interest)
  - ✅ GPU accelerate (will-change; transform/opacity only)
  - ✅ Commit with educational messages (teach next agent)

performance:
  - Canvas for backgrounds (matrix rain)
  - CSS animations (no JS overhead)
  - SVG for scalable graphics (pre-render offline)
  - IntersectionObserver (auto-throttled)
  - will-change property (GPU acceleration)
```

---

## AGENTIC INTENT

Use this guide to:
- **Generate pages** from templates with minimal variation
- **Understand aesthetics** in abstract, parameterized form
- **Modify styles** by changing palette variables
- **Add animations** using proven patterns (scroll-reveal, typewriter, glitch)
- **Optimize performance** with canvas + SVG + CSS rules
- **Teach future agents** via semantic commits and documented patterns

**Philosophy:** Centralized assets, clear patterns, documented trade-offs → fast iteration, high quality, maintainable code.

---

**For Agents:** Read this. Reference checklist. Build pages. Commit with comments.  
**For Humans:** This is your architecture. Adapt as needed. Share learnings back.

---

*Created: 2026-04-13 | Format: AGENTIC YAML | Status: CANONICAL REFERENCE*
