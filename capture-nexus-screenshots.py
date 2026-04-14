#!/usr/bin/env python3
import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

async def capture_screenshots():
    screenshots_dir = Path('./screenshots')
    screenshots_dir.mkdir(exist_ok=True)
    
    pages = [
        ('http://127.0.0.1:9696/nexus/', 'nexus-hub'),
        ('http://127.0.0.1:9696/nexus/nexus-genesis.html', 'nexus-genesis'),
        ('http://127.0.0.1:9696/nexus/nexus-autonomy.html', 'nexus-autonomy'),
        ('http://127.0.0.1:9696/nexus/nexus-discovery.html', 'nexus-discovery'),
        ('http://127.0.0.1:9696/nexus/nexus-integration.html', 'nexus-integration'),
    ]
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # Desktop 1920x1080
        desktop_context = await browser.new_context(viewport={'width': 1920, 'height': 1080})
        for url, name in pages:
            page = await desktop_context.new_page()
            await page.goto(url, wait_until='networkidle')
            await page.screenshot(path=f'{screenshots_dir}/{name}-desktop.png', full_page=True)
            print(f'✅ {name} (desktop)')
            await page.close()
        await desktop_context.close()
        
        # Mobile 390x844 (iPhone 12)
        mobile_context = await browser.new_context(viewport={'width': 390, 'height': 844})
        for url, name in pages:
            page = await mobile_context.new_page()
            await page.goto(url, wait_until='networkidle')
            await page.screenshot(path=f'{screenshots_dir}/{name}-mobile.png', full_page=True)
            print(f'✅ {name} (mobile)')
            await page.close()
        await mobile_context.close()
        
        await browser.close()
        print(f'\n✨ Screenshots saved to ./{screenshots_dir}/')

asyncio.run(capture_screenshots())
