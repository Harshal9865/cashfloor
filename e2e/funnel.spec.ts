import { test, expect } from '@playwright/test';

test.describe('Funnel & Freemium Lock', () => {
  test('User navigates from Landing to Dashboard and hits Freemium wall', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/');
    
    // 2. See the marketing teaser value prop
    await expect(page.locator('text=Stop guessing your runway.')).toBeVisible();
    
    // 3. Click Enter Demo Ledger
    await page.click('text=Enter the Ledger');
    
    // 4. Verify we are on dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('text=Capital Partitioning')).toBeVisible();
    
    // 5. Check if Freemium locks are active
    const unlockButtons = page.locator('button:has-text("Unlock")');
    await expect(unlockButtons.first()).toBeVisible();
    
    // 6. Click Unlock Stress Lab to trigger Auth Modal
    await page.click('text=Unlock Stress Lab');
    
    // 7. Verify Auth Modal appears
    await expect(page.locator('text=Unlock Full Ledger')).toBeVisible();
    await expect(page.locator('text=Sign in to unlock Advanced Stress Testing')).toBeVisible();
  });
});
