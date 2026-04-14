// NEXUS DEMOSCENE ENHANCEMENTS
// Hacker • Terminal • Retro • Cyberpunk Aesthetic
// Session: 2026-04-13
//
// AGENT NOTE: This script adds visual spice to NEXUS pages:
// - Matrix rain background (canvas animation)
// - Floating SVG decorations (neural networks, DNA, circuits)
// - Glitch effect text animation
// - Terminal animations and demoscene aesthetics

document.addEventListener('DOMContentLoaded', function() {
    // ============ MATRIX RAIN EFFECT ============
    // AGENT NOTE: Canvas-based background animation
    // Low opacity matrix rain for subtle cyberpunk atmosphere
    
    const canvas = document.createElement('canvas');
    if (document.body) {
        canvas.id = 'matrix-rain-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.08';
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');
        const chars = '01αβγδεζηθικλμνξοπρστυφχψωΣΩ∑∏∫∂∆∇⊕⊗⊙⚛🧬🔗⚡';
        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops = new Array(columns).fill(1);

        function drawMatrix() {
            // Dark semi-transparent background
            ctx.fillStyle = 'rgba(10, 14, 31, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Matrix text
            ctx.fillStyle = '#00d9ff';
            ctx.font = fontSize + 'px IBM Plex Mono';
            ctx.globalAlpha = 0.6;

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(char, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            ctx.globalAlpha = 1;
        }

        // Animation loop
        setInterval(drawMatrix, 50);

        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ============ GLITCH TEXT ANIMATION ============
    // AGENT NOTE: Applies glitch effect to elements with class .glitch-text
    
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(el => {
        if (!el.getAttribute('data-text')) {
            el.setAttribute('data-text', el.textContent);
        }
    });

    // ============ FLOATING SVG DECORATIONS ============
    // AGENT NOTE: Create neural network, DNA spiral, and circuit board SVGs
    
    function createNeuralNetwork() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 300 300');
        svg.setAttribute('class', 'floating-svg floating-svg-neural');
        svg.style.position = 'fixed';
        svg.style.top = '8%';
        svg.style.right = '8%';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'neural-blur');
        const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        blur.setAttribute('stdDeviation', '3');
        filter.appendChild(blur);
        defs.appendChild(filter);
        svg.appendChild(defs);

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('filter', 'url(#neural-blur)');

        // Central pulsing node
        const central = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        central.setAttribute('cx', '150');
        central.setAttribute('cy', '150');
        central.setAttribute('r', '25');
        central.setAttribute('fill', '#00d9ff');
        central.setAttribute('opacity', '0.7');
        
        const animate1 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate1.setAttribute('attributeName', 'r');
        animate1.setAttribute('values', '25;30;25');
        animate1.setAttribute('dur', '3s');
        animate1.setAttribute('repeatCount', 'indefinite');
        central.appendChild(animate1);
        g.appendChild(central);

        // Satellite nodes
        const nodes = [
            { cx: 150, cy: 50, fill: '#00ff99', dur: '2s' },
            { cx: 250, cy: 100, fill: '#d946a6', dur: '2.5s' },
            { cx: 150, cy: 250, fill: '#ffbe0b', dur: '2.2s' },
            { cx: 50, cy: 150, fill: '#00d9ff', dur: '2.8s' }
        ];

        nodes.forEach(node => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.cx);
            circle.setAttribute('cy', node.cy);
            circle.setAttribute('r', '8');
            circle.setAttribute('fill', node.fill);
            circle.setAttribute('opacity', '0.8');

            const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            anim.setAttribute('attributeName', 'opacity');
            anim.setAttribute('values', '0.8;0.4;0.8');
            anim.setAttribute('dur', node.dur);
            anim.setAttribute('repeatCount', 'indefinite');
            circle.appendChild(anim);
            g.appendChild(circle);
        });

        // Connecting lines
        const lines = [
            { x1: 150, y1: 150, x2: 150, y2: 50 },
            { x1: 150, y1: 150, x2: 250, y2: 100 },
            { x1: 150, y1: 150, x2: 150, y2: 250 },
            { x1: 150, y1: 150, x2: 50, y2: 150 }
        ];

        lines.forEach(line => {
            const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            l.setAttribute('x1', line.x1);
            l.setAttribute('y1', line.y1);
            l.setAttribute('x2', line.x2);
            l.setAttribute('y2', line.y2);
            l.setAttribute('stroke', '#00d9ff');
            l.setAttribute('stroke-width', '1.5');
            l.setAttribute('opacity', '0.4');
            g.appendChild(l);
        });

        // Brain emoji
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '150');
        text.setAttribute('y', '158');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '28');
        text.setAttribute('opacity', '0.9');
        text.textContent = '🧠';
        g.appendChild(text);

        svg.appendChild(g);
        return svg;
    }

    function createDNASpiral() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 200 300');
        svg.setAttribute('class', 'floating-svg floating-svg-genome');
        svg.style.position = 'fixed';
        svg.style.bottom = '15%';
        svg.style.left = '5%';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'dna-blur');
        const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        blur.setAttribute('stdDeviation', '2');
        filter.appendChild(blur);
        defs.appendChild(filter);
        svg.appendChild(defs);

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('filter', 'url(#dna-blur)');

        // DNA double helix structure
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M 80 50 Q 120 100, 80 150 Q 40 200, 80 250');
        path1.setAttribute('fill', 'none');
        path1.setAttribute('stroke', '#00ff99');
        path1.setAttribute('stroke-width', '3');
        path1.setAttribute('opacity', '0.7');
        g.appendChild(path1);

        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M 120 50 Q 80 100, 120 150 Q 160 200, 120 250');
        path2.setAttribute('fill', 'none');
        path2.setAttribute('stroke', '#d946a6');
        path2.setAttribute('stroke-width', '3');
        path2.setAttribute('opacity', '0.7');
        g.appendChild(path2);

        // Connecting rungs
        for (let i = 0; i < 5; i++) {
            const y = 50 + i * 50;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '80');
            line.setAttribute('y1', y);
            line.setAttribute('x2', '120');
            line.setAttribute('y2', y);
            line.setAttribute('stroke', '#00d9ff');
            line.setAttribute('stroke-width', '1.5');
            line.setAttribute('opacity', '0.5');
            g.appendChild(line);
        }

        // Genome emoji
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '100');
        text.setAttribute('y', '280');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '20');
        text.setAttribute('opacity', '0.9');
        text.textContent = '🧬';
        g.appendChild(text);

        svg.appendChild(g);
        return svg;
    }

    function createCircuitBoard() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 300 300');
        svg.setAttribute('class', 'floating-svg floating-svg-circuit');
        svg.style.position = 'fixed';
        svg.style.bottom = '20%';
        svg.style.right = '6%';

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'circuit-blur');
        const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        blur.setAttribute('stdDeviation', '2');
        filter.appendChild(blur);
        defs.appendChild(filter);
        svg.appendChild(defs);

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('filter', 'url(#circuit-blur)');

        // Circuit paths
        const pathData = [
            'M 50 100 H 150 V 150 H 250 V 100 H 300',
            'M 50 200 H 100 V 250 H 250 V 200 H 300',
            'M 100 100 V 200',
            'M 200 100 V 200'
        ];

        const colors = ['#00d9ff', '#d946a6', '#00ff99', '#ffbe0b'];

        pathData.forEach((path, idx) => {
            const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            p.setAttribute('d', path);
            p.setAttribute('fill', 'none');
            p.setAttribute('stroke', colors[idx % colors.length]);
            p.setAttribute('stroke-width', '2');
            p.setAttribute('opacity', '0.6');
            g.appendChild(p);
        });

        // Circuit nodes
        const nodes = [
            { x: 150, y: 150 },
            { x: 100, y: 100 },
            { x: 250, y: 100 },
            { x: 100, y: 250 }
        ];

        nodes.forEach(node => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.x);
            circle.setAttribute('cy', node.y);
            circle.setAttribute('r', '6');
            circle.setAttribute('fill', '#00d9ff');
            circle.setAttribute('opacity', '0.8');

            const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            anim.setAttribute('attributeName', 'r');
            anim.setAttribute('values', '6;8;6');
            anim.setAttribute('dur', '2s');
            anim.setAttribute('repeatCount', 'indefinite');
            circle.appendChild(anim);
            g.appendChild(circle);
        });

        // Lightning emoji
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '180');
        text.setAttribute('y', '185');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '24');
        text.setAttribute('opacity', '0.9');
        text.textContent = '⚡';
        g.appendChild(text);

        svg.appendChild(g);
        return svg;
    }

    // Add SVG decorations to body
    if (document.body) {
        document.body.appendChild(createNeuralNetwork());
        document.body.appendChild(createDNASpiral());
        document.body.appendChild(createCircuitBoard());
    }

    // ============ SCANLINE OVERLAY ============
    // AGENT NOTE: Creates CRT scanline effect across all pages
    
    const scanlineOverlay = document.createElement('div');
    scanlineOverlay.className = 'scanline-overlay';
    if (document.body) {
        document.body.appendChild(scanlineOverlay);
    }

    // ============ DEMOSCENE TITLE GLITCH ============
    // AGENT NOTE: Apply subtle flicker to demoscene titles
    
    const demoTitles = document.querySelectorAll('.demoscene-title');
    demoTitles.forEach(title => {
        // Already handled by CSS animation
    });
});

// AGENT NOTES FOR FUTURE SESSIONS:
// 1. Matrix rain uses canvas for performance (not many DOM elements)
// 2. SVG floating decorations use native SVG animations (no JavaScript overhead)
// 3. Glitch effect uses CSS clip-path for browser optimization
// 4. All animations are infinite loops with staggered timing for visual interest
// 5. Scanline overlay is subtle (8% opacity) to avoid readability issues
// 6. Mobile devices hide floating SVGs for performance
