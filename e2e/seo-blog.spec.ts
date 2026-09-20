import { test, expect } from '@playwright/test';

test.describe('SEO & Editorial Blog Engine', () => {
  test('Editorial post renders with SEO structured data, interactive widget, and Pinterest pin link', async ({ page }) => {
    // 1. Navigate to editorial blog post
    await page.goto('/blog/the-20th-percentile-math');

    // 2. Check title and typography
    await expect(page.locator('h1')).toContainText('The 20th Percentile Rule: Why Averages Kill Freelance Businesses');

    // 3. Verify structured data script exists
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toBeAttached();

    // 4. Verify the interactive simulation widget is present
    await expect(page.locator('text=Interactive Simulation / P20 Stress Test')).toBeVisible();
    await expect(page.locator('text=P20 Calm Reality:')).toBeVisible();

    // 5. Verify Pinterest share button has valid target
    const pinLink = page.locator('a:has-text("Pin")');
    await expect(pinLink).toBeVisible();
    const href = await pinLink.getAttribute('href');
    expect(href).toContain('pinterest.com/pin/create/button');
    expect(href).toContain('pinterest-pin.png');

    // 6. Test interactive slider update
    const revenueSlider = page.locator('input[type="range"]').first();
    await revenueSlider.fill('15000');
    // Value should reflect in the display
    await expect(page.locator('text=$15,000')).toBeVisible();

    // 7. Click Launch Calculator and navigate to Dashboard
    await page.click('text=Launch Calculator');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});
