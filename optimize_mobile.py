#!/usr/bin/env python3
import os
import re
from pathlib import Path

SITE_DIR = Path(__file__).parent

MOBILE_CSS = '''
/* Mobile Optimization */
@media (max-width: 768px) {
    body {
        overflow-x: hidden !important;
        max-width: 100vw;
    }
    .container {
        padding-left: 12px !important;
        padding-right: 12px !important;
        max-width: 100% !important;
    }
    .nav-header {
        padding: 10px 12px !important;
    }
    .nav-menu {
        right: 12px !important;
        min-width: 200px !important;
    }
    table {
        display: block;
        overflow-x: auto;
        max-width: 100%;
        border-collapse: collapse;
    }
    img, svg, video, canvas {
        max-width: 100%;
        height: auto;
    }
    pre, code {
        white-space: pre-wrap;
        word-wrap: break-word;
        max-width: 100%;
    }
    h1 {
        font-size: 1.8rem !important;
        line-height: 1.2;
    }
    h2 {
        font-size: 1.5rem !important;
    }
    .card, .nav-card {
        padding: 15px !important;
        margin-bottom: 15px;
    }
    .grid {
        grid-template-columns: 1fr !important;
        gap: 15px !important;
    }
    footer {
        padding: 20px 10px !important;
        font-size: 0.7rem !important;
    }
}
@media (max-width: 480px) {
    h1 {
        font-size: 1.5rem !important;
    }
    .container {
        padding-left: 8px !important;
        padding-right: 8px !important;
    }
    .nav-title {
        font-size: 1.1rem !important;
    }
}
'''

def optimize_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # Update viewport meta tag
    viewport_pattern = re.compile(r'<meta[^>]*name=["\']viewport["\'][^>]*>')
    viewport_replacement = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'
    
    if viewport_pattern.search(content):
        content = viewport_pattern.sub(viewport_replacement, content)
        modified = True
    else:
        # Insert after <head> if missing
        if '<head>' in content:
            content = content.replace('<head>', '<head>\n    ' + viewport_replacement)
            modified = True
    
    # Add mobile CSS
    if '</style>' in content:
        content = content.replace('</style>', MOBILE_CSS + '\n</style>')
        modified = True
    else:
        # Insert before </head>
        if '</head>' in content:
            content = content.replace('</head>', '<style>' + MOBILE_CSS + '</style>\n</head>')
            modified = True
    
    # Ensure body has overflow-x hidden
    body_pattern = re.compile(r'(<body[^>]*>)')
    if body_pattern.search(content):
        body_style = ' style="overflow-x: hidden;"'
        def add_body_style(match):
            tag = match.group(0)
            if 'style=' in tag:
                return re.sub(r'style="([^"]*)"', r'style="\1 overflow-x: hidden;"', tag)
            else:
                return tag[:-1] + body_style + '>'
        content = body_pattern.sub(add_body_style, content)
        modified = True
    
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Optimized {filepath}')
    else:
        print(f'No changes needed for {filepath}')

def main():
    html_files = list(SITE_DIR.glob('*.html'))
    for f in html_files:
        optimize_file(f)

if __name__ == '__main__':
    main()