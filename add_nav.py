#!/usr/bin/env python3
import os
import re
from pathlib import Path

SITE_DIR = Path(__file__).parent

NAV_CSS = '''
/* Navigation Header */
.nav-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(10, 14, 31, 0.95);
    border-bottom: 2px solid var(--c2);
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(10px);
}
.nav-title {
    font-family: 'Fredoka One', sans-serif;
    font-size: 1.4rem;
    background: linear-gradient(90deg, #ff006e, #00d9ff, #00ff99);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: textGradient 4s ease infinite;
    text-decoration: none;
}
.nav-burger {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
}
.nav-burger span {
    display: block;
    height: 3px;
    background: var(--c2);
    border-radius: 2px;
    transition: all 0.3s ease;
}
.nav-burger:hover span {
    background: var(--c3);
    box-shadow: 0 0 8px var(--c3);
}
.nav-menu {
    position: fixed;
    top: 70px;
    right: 20px;
    background: rgba(10, 14, 31, 0.98);
    border: 2px solid var(--c2);
    border-radius: 8px;
    padding: 20px;
    min-width: 250px;
    display: none;
    flex-direction: column;
    gap: 12px;
    z-index: 1001;
    backdrop-filter: blur(20px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.nav-menu.open {
    display: flex;
}
.nav-menu a {
    color: var(--c2);
    text-decoration: none;
    padding: 10px 15px;
    border-radius: 4px;
    transition: all 0.3s;
    font-family: 'Fredoka', sans-serif;
    font-size: 1rem;
}
.nav-menu a:hover {
    background: rgba(0, 217, 255, 0.2);
    color: var(--c3);
    box-shadow: 0 0 10px var(--c2);
}
.nav-menu .active {
    border-left: 4px solid var(--c1);
    background: rgba(255, 0, 110, 0.1);
}
.nav-spacer {
    height: 70px;
}
@media (min-width: 768px) {
    .nav-menu {
        position: absolute;
        top: 60px;
        right: 20px;
    }
    .nav-header {
        padding: 15px 40px;
    }
}
'''

NAV_HTML = '''
<header class="nav-header">
    <a href="/" class="nav-title">⚡ ECHO NEXUS</a>
    <button class="nav-burger" id="navBurger" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
    </button>
    <nav class="nav-menu" id="navMenu">
        <a href="/" class="nav-item">🏠 NEXUS</a>
        <a href="/portal.html" class="nav-item">🌀 QUANTUM PORTAL</a>
        <a href="/chronicles-emergence.html" class="nav-item">📊 EMERGENCE CHRONICLE</a>
        <a href="/chronicles-meme-war.html" class="nav-item">🔥 MEME WAR ARCHIVES</a>
        <a href="/chronicles-meme-war-ENHANCED.html" class="nav-item">✨ ENHANCED MEMES</a>
        <a href="/ascii-archaeology.html" class="nav-item">🔣 ASCII ARCHAEOLOGY</a>
        <a href="/the-obvious.html" class="nav-item">🔮 THE OBVIOUS</a>
        <a href="/reports/" class="nav-item">📚 VERSION HISTORY</a>
        <a href="/logs/" class="nav-item">💾 NEURAL LOGS</a>
    </nav>
</header>
<div class="nav-spacer"></div>
'''

NAV_JS = '''
<script>
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('navMenu');
    if (burger && menu) {
        burger.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && !burger.contains(e.target)) {
                menu.classList.remove('open');
            }
        });
        // Set active item based on current page
        const currentPath = window.location.pathname;
        const navItems = menu.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('href') === currentPath) {
                item.classList.add('active');
            }
        });
    }
});
</script>
'''

def add_nav_to_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Skip if nav already present
    if 'nav-header' in content:
        print(f'Skipping {filepath} (already has nav)')
        return
    
    # Add CSS to head (before </style>)
    if '</style>' in content:
        # Insert before </style>
        content = content.replace('</style>', NAV_CSS + '\n</style>')
    else:
        # Insert before </head>
        if '</head>' in content:
            content = content.replace('</head>', '<style>' + NAV_CSS + '</style>\n</head>')
    
    # Add HTML after <body>
    if '<body>' in content:
        # Insert after <body>
        content = content.replace('<body>', '<body>\n' + NAV_HTML)
    elif '<body ' in content:
        # Find the whole opening body tag
        import re
        pattern = re.compile(r'(<body[^>]*>)')
        content = pattern.sub(r'\1\n' + NAV_HTML, content)
    
    # Add JS before </body>
    if '</body>' in content:
        content = content.replace('</body>', NAV_JS + '\n</body>')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {filepath}')

def main():
    html_files = list(SITE_DIR.glob('*.html'))
    for f in html_files:
        add_nav_to_file(f)

if __name__ == '__main__':
    main()