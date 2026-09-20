import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

test.describe('Deep Layout & Overlap Analysis', () => {
  for (const vp of viewports) {
    test(`Landing Page Layout & Overflow Check [${vp.name}]`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for horizontal overflow on page
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalScrollbar: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      console.log(`[${vp.name}] Landing Page Overflow:`, overflow);
      expect(overflow.hasHorizontalScrollbar).toBe(false);

      await page.waitForTimeout(1200);
      await page.screenshot({ path: `scratch/landing-${vp.name}.png`, fullPage: true });
    });

    test(`Dashboard Layout, Overlap & Responsiveness Check [${vp.name}]`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalScrollbar: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      console.log(`[${vp.name}] Dashboard Overflow:`, overflow);

      // Deep element collision / overlap check
      const layoutAnomalies = await page.evaluate(() => {
        const issues: string[] = [];

        // 1. Check Header vs ScenarioSelectorBar vertical collision / overlap
        const header = document.querySelector('header');
        const subBar = document.querySelector('section.sticky');
        if (header && subBar) {
          const hRect = header.getBoundingClientRect();
          const sRect = subBar.getBoundingClientRect();
          // If subBar overlaps on top of header or is hidden behind header
          if (sRect.top < hRect.bottom && sRect.bottom > hRect.top) {
            issues.push(`Header and SubBar overlap: header bottom is ${hRect.bottom}, subBar top is ${sRect.top}`);
          }
        }

        // 2. Check HeroRunway absolute items (top-left ref vs top-right badge)
        const refElem = document.querySelector('#runway .absolute.top-4.left-6');
        const badgeElem = document.querySelector('#runway .absolute.top-4.right-6');
        if (refElem && badgeElem) {
          const rRect = refElem.getBoundingClientRect();
          const bRect = badgeElem.getBoundingClientRect();
          if (rRect.right > bRect.left && rRect.left < bRect.right) {
            issues.push(`HeroRunway REF badge and Health badge collide horizontally: REF right=${rRect.right}, Badge left=${bRect.left}`);
          }
        }

        // 3. Check for any elements that exceed window width
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > window.innerWidth + 5) {
            // Check if it's inside an intentionally scrollable container
            let parent = el.parentElement;
            let insideScroll = false;
            while (parent && parent !== document.body) {
              const overflowX = window.getComputedStyle(parent).overflowX;
              if (overflowX === 'auto' || overflowX === 'scroll') {
                insideScroll = true;
                break;
              }
              parent = parent.parentElement;
            }
            const svgTags = ['svg', 'path', 'line', 'circle', 'polygon', 'rect', 'g', 'text', 'tspan', 'defs', 'clippath'];
            if (!insideScroll && !svgTags.includes(el.tagName.toLowerCase())) {
              issues.push(`Element <${el.tagName.toLowerCase()} class="${el.className?.toString().slice(0, 30)}"> extends beyond viewport right: right=${rect.right}, innerWidth=${window.innerWidth}`);
            }
          }
        });

        return issues;
      });

      console.log(`[${vp.name}] Layout Anomalies:`, layoutAnomalies);

      await page.waitForTimeout(1000);
      await page.screenshot({ path: `scratch/dashboard-${vp.name}-full.png`, fullPage: true });

      // Record any issues in test expectation or logging
      expect(overflow.hasHorizontalScrollbar).toBe(false);
    });
  }
});
