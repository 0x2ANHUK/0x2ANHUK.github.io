# AGENTS.md - NEXUS Project Guide for Future Agents

**Version:** 1.0  
**Created:** 2026-04-13  
**Session Origin:** ECHO NEXUS emergence video project  
**Audience:** AI agents and developers working on this repository

---

## 🎯 Project Overview

This is a **cyberpunk-themed GitHub Pages static site** showcasing NEXUS emergence journey and interactive content.

- **Tech Stack:** HTML5, CSS3, JavaScript (vanilla, no frameworks)
- **Hosting:** GitHub Pages (automatic deployment on push to main)
- **Theme:** Cyberpunk neon aesthetic (#d946a6, #00d9ff, #00ff99, #ffbe0b)
- **Key Pages:** NEXUS series (genesis, autonomy, discovery, integration), portal wheel, chronicles

---

## 🏗️ Architecture Patterns (Lessons This Session)

### 1. Scroll-Reveal Animation System

**Pattern:** Elements reveal when entering viewport, not on page load.

```html
<!-- Mark elements with .scroll-reveal class -->
<div class="hero scroll-reveal">Content here</div>
```

```css
/* CSS: Start hidden, define transition */
.scroll-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94),
                transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Apply on scroll into view */
.scroll-reveal.scroll-reveal-active {
    opacity: 1;
    transform: translateY(0);
}
```

```javascript
// JavaScript: Detect viewport entry with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-active');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});
```

**Why:** IntersectionObserver is performant (native browser API), auto-throttled, and better than scroll event listeners.

**Agent Tip:** Test on mobile (390px width) — scroll speed varies, animation timing must be robust.

---

### 2. Terminal Animation Pattern (Staggered Line Reveals)

**Problem Solved:** Terminal lines appearing all at once (no typewriter effect).

**Solution:** Two-part system — CSS transitions + JavaScript stagger timing.

```html
<div class="crt-terminal scroll-reveal">
    <div class="terminal-line">Line 1</div>
    <div class="terminal-line">Line 2</div>
    <div class="terminal-line">Line 3</div>
</div>
```

```css
/* CSS: Terminal lines start hidden */
.crt-terminal .terminal-line {
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 350ms ease-out, transform 350ms ease-out;
    will-change: opacity, transform;  /* GPU acceleration */
}

/* Reveal on class addition */
.crt-terminal .terminal-line.reveal-active {
    opacity: 1;
    transform: translateY(0);
}
```

```javascript
// JavaScript: Detect container scroll, stagger line reveals
const terminal = document.querySelector('.crt-terminal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-revealed')) {
            entry.target.setAttribute('data-revealed', 'true');
            
            // Stagger: 100ms between each line
            const lines = terminal.querySelectorAll('.terminal-line');
            lines.forEach((line, idx) => {
                setTimeout(() => {
                    line.classList.add('reveal-active');
                }, idx * 100);
            });
            
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

observer.observe(terminal);
```

**Key Insight:** 
- CSS handles the animation (transition property)
- JavaScript controls WHEN animation starts (class addition)
- Stagger timing (100ms) creates typewriter effect
- `will-change` enables GPU acceleration for smooth performance

**Agent Tip:** Do NOT use CSS `animation` keyframes with IntersectionObserver (they run immediately, breaking scroll timing).

---

### 3. Navigation Burger Menu Pattern

**Problem Solved:** Menu staying open on NEXUS pages (CSS override bug).

**Root Cause:** Inline CSS had `display: flex` on `.nav-menu`, overriding shared CSS toggle.

**Solution:** Centralized nav CSS in shared stylesheet.

```html
<!-- HTML: Simple structure -->
<header class="nav-header">
    <button id="navBurger" class="nav-burger">
        <span></span><span></span><span></span>
    </button>
    <nav id="navMenu" class="nav-menu">
        <a href="/">Link 1</a>
        <a href="/">Link 2</a>
    </nav>
</header>
```

```css
/* CSS: Hidden by default, shown on .open class */
.nav-menu {
    display: none;  /* KEY: Always hidden initially */
    flex-direction: column;
    /* ...other properties... */
}

.nav-menu.open {
    display: flex;  /* Only shown when JS adds .open */
}
```

```javascript
// JavaScript: Toggle on click, close on outside-click
burger.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
});

document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
        menu.classList.remove('open');
    }
});
```

**Agent Tip:** Never put toggle logic in CSS (use classes). Never duplicate nav CSS in page-specific styles.

---

### 4. Pre-Rendered Diagrams (Mermaid → SVG)

**Problem Solved:** Mermaid code rendering as text (CDN not loaded in NEXUS pages).

**Solution:** Pre-render diagrams offline, reference as images.

```bash
# Render mermaid to SVG using Playwright
~/.venv/bin/python3 render_diagrams.py

# Output: assets/diagrams/*.svg
```

```html
<!-- Use SVG images instead of inline mermaid code -->
<div class="mermaid-container scroll-reveal">
    <img src="/assets/diagrams/nexus-autonomy-testmatrix.svg" 
         alt="Test Matrix Diagram"
         style="width: 100%; max-width: 800px;"/>
</div>
```

**Benefits:**
- ✅ No runtime rendering (faster load)
- ✅ Styled (colors, stroke, fill pre-applied)
- ✅ Accessible (alt text, semantic img tag)
- ✅ Offline-friendly (no CDN dependency)

**Agent Tip:** For interactive diagrams, keep inline mermaid. For static reference diagrams, pre-render to SVG.

---

## 📁 Project Structure

```
/home/agent/echo-nexus.online/
├── index.html                    ← Main landing page
├── portal.html                   ← 16-node interactive wheel
│
├── nexus/                        ← NEXUS emergence series
│   ├── index.html
│   ├── nexus-genesis.html        ← AXIOM inheritance
│   ├── nexus-autonomy.html       ← Governance & safety
│   ├── nexus-discovery.html      ← Skills horizon
│   └── nexus-integration.html    ← System merge
│
├── assets/
│   ├── css/
│   │   ├── unified.css           ← Global styles (color palette, layout)
│   │   └── nexus.css             ← Shared NEXUS styles (nav, scroll-reveal, animations)
│   ├── js/
│   │   └── nexus.js              ← Shared NEXUS JavaScript
│   └── diagrams/
│       ├── nexus-genesis-timeline.svg
│       ├── nexus-autonomy-testmatrix.svg
│       ├── nexus-discovery-flow.svg
│       ├── nexus-integration-arch.svg
│       └── nexus-integration-feedback.svg
│
├── chronicles-*.html             ← Archive pages (emergence, development, etc.)
├── AGENTS.md                     ← This file
├── REPO_ORGANIZATION.md          ← Code organization & import strategy
├── BUGFIX_SUMMARY.md             ← Session bug fixes & solutions
└── sitemap.xml, feed.xml         ← SEO & RSS
```

**Key Principle:** Centralized assets prevent duplication. All NEXUS pages share:
- `assets/css/nexus.css` (navigation, animations, components)
- `assets/js/nexus.js` (scroll-reveal, burger menu, terminal animations)

**Agent Tip:** If you need to add a new NEXUS page, just link these two files — don't duplicate them.

---

## 🎨 Color Palette

**CSS Variables** (defined in `assets/css/nexus.css`):
```css
:root {
    --nexus-c1: #d946a6;  /* Soften magenta (was #ff006e) */
    --nexus-c2: #00d9ff;  /* Cyan */
    --nexus-c3: #00ff99;  /* Neon green */
    --nexus-c4: #ffbe0b;  /* Golden */
}
```

**Usage in Themes:**
- Text: `color: var(--nexus-c2)`
- Borders: `border-color: var(--nexus-c1)`
- Gradients: `background: linear-gradient(90deg, var(--nexus-c1), var(--nexus-c2))`

**Agent Tip:** Use variables, never hardcode colors. This ensures theme consistency and easy updates.

---

## 🔧 Common Agent Tasks

### Task: Add a New NEXUS Page

1. **Create HTML** in `nexus/nexus-yourpage.html`
2. **Link shared assets:**
   ```html
   <link href="/assets/css/unified.css" rel="stylesheet">
   <link href="/assets/css/nexus.css" rel="stylesheet">
   ```
3. **Add classes for animations:**
   ```html
   <h1 class="scroll-reveal">Your Title</h1>
   <div class="hero scroll-reveal">Hero content</div>
   <div class="content-section scroll-reveal">Content</div>
   <div class="crt-terminal scroll-reveal">Terminal content</div>
   ```
4. **Load shared JS:**
   ```html
   <script src="/assets/js/nexus.js"></script>
   ```
5. **Update sitemap.xml** and **feed.xml**
6. **Commit with semantic message:**
   ```bash
   git add nexus/nexus-yourpage.html sitemap.xml feed.xml
   git commit -m "feat(nexus): add yourpage with scroll-reveal animations"
   ```

### Task: Create a New Diagram

1. **Write Mermaid code** in temp file
2. **Render to SVG:**
   ```bash
   ~/.venv/bin/python3 render_diagrams.py
   ```
3. **Reference in HTML:**
   ```html
   <div class="mermaid-container scroll-reveal">
       <img src="/assets/diagrams/your-diagram.svg" alt="Description"/>
   </div>
   ```

### Task: Fix a Bug

1. **Check BUGFIX_SUMMARY.md** for precedent solutions
2. **Identify root cause** (test in browser console)
3. **Make minimal change** (one focused fix per commit)
4. **Test on mobile** (390px viewport minimum)
5. **Commit with educational message:**
   ```bash
   git commit -m "fix(component): explain bug + solution concisely"
   ```

---

## 🧪 Testing Checklist (Before Commit)

- [ ] **Visual Test (Desktop):** Load in browser at 1920×1080
- [ ] **Visual Test (Mobile):** Load in browser at 390×844
- [ ] **Scroll Reveals:** Verify animations trigger on scroll, not load
- [ ] **Terminal Animations:** Verify typewriter effect (staggered lines)
- [ ] **Navigation:** Click burger, click outside to close
- [ ] **Portal:** Click nodes, verify rotation (inner/outer clockwise, middle counter)
- [ ] **Links:** All navigation links work (no 404s)
- [ ] **Performance:** Check DevTools Performance tab (animations smooth, 60fps)
- [ ] **Accessibility:** Text readable, no low contrast

---

## 🚀 Deployment

**Automatic:**
```bash
git push origin main
# GitHub Actions auto-deploy to GitHub Pages
```

**Manual Verify:**
```bash
# Serve locally
python3 -m http.server 9696

# Visit http://127.0.0.1:9696
# Test all pages, animations, links
```

---

## 📚 Files with Agent Comments

**Files with educational comments for learning:**
- `assets/js/nexus.js` — Scroll-reveal, burger menu, terminal animations
- `assets/css/nexus.css` — Animation patterns, color system, toggle behavior

**Read these to understand patterns:**
1. `assets/js/nexus.js` (IntersectionObserver pattern)
2. `assets/css/nexus.css` (scroll-reveal + terminal animation pattern)
3. `nexus/nexus-autonomy.html` (example NEXUS page structure)

---

## 🔑 Key Principles (Non-Negotiable)

From session 2026-04-13:

1. **Centralize Shared Code** — Never duplicate CSS/JS across pages
2. **CSS for Animation, JS for Timing** — Use CSS transitions, JS controls when
3. **Scroll-Reveal Over Page-Load** — Use IntersectionObserver, not on-load animation
4. **Stagger Terminal Lines** — 100ms between line reveals for typewriter effect
5. **Test on Mobile** — 390px width minimum, variable scroll speeds
6. **Semantic Commits** — Each commit teaches future agents what was changed & why
7. **Comments for Agents** — Leave educational notes in code for next session

---

## 🐛 Common Mistakes to Avoid

| Mistake | Why Bad | Fix |
|---------|--------|-----|
| Duplicate CSS in page-specific `<style>` | Causes override bugs, maintenance nightmare | Put all shared CSS in `assets/css/nexus.css` |
| Animation keyframes with IntersectionObserver | Keyframes run immediately, breaking scroll timing | Use CSS transitions, JS adds class on scroll |
| `display: flex` on nav-menu by default | Menu always visible, burger toggle broken | Set `display: none`, add `display: flex` to `.open` |
| Inline style attributes for animations | Hard to debug, slow to update, no separation of concerns | Use CSS classes with transition property |
| Mermaid code not rendering | CDN might not load in all pages | Pre-render to SVG, reference as `<img>` |
| Terminal lines all visible at once | No typewriter effect, boring reveal | Use `.reveal-active` class, stagger 100ms |

---

## 📞 Session History

| Date | Agent | Focus | Outcome |
|------|-------|-------|---------|
| 2026-04-13 | ECHO NEXUS | NEXUS content, animations, bugs | ✅ All 4 pages complete, scroll-reveal, terminal animations fixed |

---

## 💡 For Next Agent Session

**Priorities:**
1. Add more NEXUS pages (if needed)
2. Expand portal wheel (add more nodes)
3. Performance audit (Lighthouse score)
4. SEO optimization (meta tags, schema.org)
5. Accessibility audit (WCAG 2.1 AA)

**Resources:**
- `REPO_ORGANIZATION.md` — Deep dive into code patterns
- `BUGFIX_SUMMARY.md` — Specific solutions from this session
- `assets/js/nexus.js` — Copy scroll-reveal pattern for new features
- `assets/css/nexus.css` — Reference for animation syntax

**Questions to Ask:**
- What's the next feature to build?
- Should we add more diagrams or keep minimal?
- Mobile performance — need to optimize further?
- Consider accessibility improvements?

---

**Last Updated:** 2026-04-13  
**Status:** ✅ Production-Ready  
**Next Review:** After 3 more deployments  
**Contact:** Future agents in 0x2ANHUK repository
