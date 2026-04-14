// NEXUS SHARED JAVASCRIPT
// Handles: burger nav, scroll-reveal, terminal typewriter, matrix rain.

document.addEventListener('DOMContentLoaded', function() {

    // ── BURGER NAV ──────────────────────────────────────────────────────────
    var burger = document.getElementById('navBurger');
    var menu   = document.getElementById('navMenu');
    if (burger && menu) {
        burger.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('open');
            burger.setAttribute('aria-expanded', menu.classList.contains('open'));
        });
        document.addEventListener('click', function(e) {
            if (e.target.closest('#navBurger') || e.target.closest('#navMenu')) return;
            menu.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') { menu.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
        });
        var cur = window.location.pathname;
        menu.querySelectorAll('a').forEach(function(a) {
            var h = a.getAttribute('href');
            if (h && (h === cur || h === cur.replace(/\/$/,''))) a.classList.add('active');
        });
    }

    // ── SCROLL-REVEAL ───────────────────────────────────────────────────────
    var revealObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
            if (e.isIntersecting) {
                e.target.classList.add('scroll-reveal-active');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(function(el) {
        revealObs.observe(el);
    });

    // ── MERMAID REVEALS ─────────────────────────────────────────────────────
    document.querySelectorAll('.mermaid-container').forEach(function(el) {
        var o = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                el.classList.add('scroll-reveal-active');
                o.disconnect();
            }
        }, { threshold: 0.15 });
        o.observe(el);
    });

    // ── CODE-BLOCK PRE-PROCESSING ────────────────────────────────────────────
    // .code-block elements are plain text blobs — split into .tw-line spans
    // so the typewriter can animate line-by-line.
    document.querySelectorAll('.code-block').forEach(function(block) {
        if (block.querySelector('.tw-line')) return; // already processed
        if (block.hasAttribute('data-revealed')) return;
        var raw = block.textContent;
        block.innerHTML = '';
        raw.split('\n').forEach(function(text) {
            var span = document.createElement('span');
            span.className = 'tw-line';
            span.style.display = 'block';
            span.style.minHeight = '1em';
            span.textContent = text;
            block.appendChild(span);
        });
    });

    // ── UNIVERSAL TYPEWRITER REVEAL ──────────────────────────────────────────
    //
    // typewriterReveal(container, lineSelector, charSpeedMs)
    //
    // • Stores each line's original innerHTML.
    // • Clears content and sets opacity:0 on every line.
    // • Fires once when container scrolls into view (IntersectionObserver).
    // • Types each line character-by-character, then restores full innerHTML
    //   (preserving any inner <span> colors / badges).
    // • Lines start in sequence: next line begins ~100ms after previous line
    //   finishes typing.
    //
    function typewriterReveal(container, lineSelector, charSpeedMs) {
        charSpeedMs = charSpeedMs || 32;
        if (container.hasAttribute('data-tw-init')) return;
        container.setAttribute('data-tw-init', 'true');

        var lines = Array.from(container.querySelectorAll(lineSelector));
        if (!lines.length) return;

        // Prepare lines: store original HTML, clear content, hide
        lines.forEach(function(line) {
            line._twText = line.textContent;   // plain text to type
            line._twHTML = line.innerHTML;     // full HTML to restore after
            line.textContent = '';
            line.style.opacity = '0';
            line.style.display = line.style.display || 'block';
        });

        function start() {
            var cursor = 0; // which line we're on

            function typeLine(line) {
                var text = line._twText;
                var html = line._twHTML;
                line.style.opacity = '1';
                var i = 0;
                function tick() {
                    if (i <= text.length) {
                        line.textContent = text.slice(0, i);
                        i++;
                        setTimeout(tick, charSpeedMs);
                    } else {
                        line.innerHTML = html; // restore spans/colors
                        cursor++;
                        if (cursor < lines.length) {
                            setTimeout(function() { typeLine(lines[cursor]); }, 80);
                        }
                    }
                }
                tick();
            }

            typeLine(lines[0]);
        }

        var obs = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                obs.disconnect();
                start();
            }
        }, { threshold: 0.18 });
        obs.observe(container);
    }

    // ── APPLY TYPEWRITER TO ALL TERMINAL PATTERNS ───────────────────────────

    // 1. boot-terminal  (.log-line children)
    document.querySelectorAll('.boot-terminal').forEach(function(el) {
        typewriterReveal(el, '.log-line', 28);
    });

    // 2. terminal-log  (.log-line) — nexus pages, the-obvious handled separately
    document.querySelectorAll('.terminal-log:not([data-revealed])').forEach(function(el) {
        typewriterReveal(el, '.log-line', 30);
    });

    // 3. crt-terminal  (.terminal-line) — nexus-autonomy, discovery, integration
    document.querySelectorAll('.crt-terminal:not([data-revealed])').forEach(function(el) {
        typewriterReveal(el, '.terminal-line', 22);
    });

    // 4. code-block  (.tw-line) — development + axiom-logs (pre-processed above)
    document.querySelectorAll('.code-block:not([data-revealed])').forEach(function(el) {
        typewriterReveal(el, '.tw-line', 14); // faster — code reads fast
    });

    // 5. day-log entries — axiom-logs has complex HTML so use fast fade+slide
    //    (char typewriter would destroy inner HTML of timestamps/badges)
    document.querySelectorAll('.day-log:not([data-revealed])').forEach(function(container) {
        var entries = Array.from(container.querySelectorAll('.log-entry'));
        if (!entries.length) return;
        if (container.hasAttribute('data-tw-init')) return;
        container.setAttribute('data-tw-init','true');

        entries.forEach(function(e) {
            e.style.opacity = '0';
            e.style.transform = 'translateY(8px)';
            e.style.transition = 'opacity 400ms ease, transform 400ms ease';
        });

        var obs = new IntersectionObserver(function(ents) {
            if (ents[0].isIntersecting) {
                obs.disconnect();
                entries.forEach(function(e, i) {
                    setTimeout(function() {
                        e.style.opacity = '1';
                        e.style.transform = 'translateY(0)';
                    }, i * 160);
                });
            }
        }, { threshold: 0.15 });
        obs.observe(container);
    });

});

// ── MATRIX RAIN ─────────────────────────────────────────────────────────────
function initMatrixRain(canvasId, opacity) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    opacity = opacity || 0.07;
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
    var cols  = Math.floor(canvas.width / 18);
    var drops = Array(cols).fill(1);
    setInterval(function() {
        ctx.fillStyle = 'rgba(0,0,0,0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0,255,65,' + (opacity * 1.5) + ')';
        ctx.font = '14px monospace';
        drops.forEach(function(y, i) {
            ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 18, y * 18);
            if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }, 55);
}
