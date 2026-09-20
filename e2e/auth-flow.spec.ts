import { test, expect } from '@playwright/test';

test.describe('Authentication & Feature Gating Flow', () => {
  test('Complete Sign In, Navbar Reflection, Feature Unlocking, and Sign Out Flow', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Ensure we start cleanly logged out
    await page.evaluate(() => {
      localStorage.removeItem('cf_auth_profile_v2');
      localStorage.removeItem('cf_auth_profile');
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 2. Verify logged-out Navbar shows Sign In button
    const signInBtn = page.getByRole('button', { name: /sign in/i }).first();
    await expect(signInBtn).toBeVisible();

    // 3. Click Sign In to open AuthModal
    await signInBtn.click();
    const modalTitle = page.getByText(/sign in to cashfloor/i);
    await expect(modalTitle).toBeVisible();

    // 4. Check that tabs exist
    const demoTab = page.getByRole('button', { name: '1-Click Demo', exact: true });
    await expect(demoTab).toBeVisible();
    await demoTab.click();

    // 5. Select the Alex Vance persona
    const alexPersona = page.getByRole('button', { name: /alex vance/i });
    await expect(alexPersona).toBeVisible();
    await alexPersona.click();

    // 6. Verify modal success and closing
    await page.waitForTimeout(1000);

    // 7. Verify Navbar reflects signed-in state: Avatar button with Alex Vance or initials 'AV' and PRO badge
    const userMenuBtn = page.getByRole('button', { name: /user account menu/i });
    await expect(userMenuBtn).toBeVisible();
    await expect(userMenuBtn).toContainText('PRO');

    // 8. Open user menu dropdown
    await userMenuBtn.click();
    const dropdownEmail = page.getByText('alex.vance@cashfloor.app');
    await expect(dropdownEmail).toBeVisible();

    // 9. Navigate to Dashboard
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });

    // 10. Verify DashboardNav reflects authenticated state
    const dashAccountBtn = page.getByTitle('Account');
    await expect(dashAccountBtn).toBeVisible();
    await expect(dashAccountBtn).toContainText('PRO');

    // 11. Verify that the features are UNLOCKED (no lock overlay with "Unlock" button)
    const unlockStressBtn = page.getByRole('button', { name: /unlock stress lab/i });
    await expect(unlockStressBtn).not.toBeVisible();

    const unlockLedgerBtn = page.getByRole('button', { name: /unlock 12-month ledger/i });
    await expect(unlockLedgerBtn).not.toBeVisible();

    // 12. Verify interactive elements in the unlocked sections are usable
    const conservativeScenarioBtn = page.getByRole('button', { name: /conservative/i }).first();
    await expect(conservativeScenarioBtn).toBeVisible();
    await conservativeScenarioBtn.click();

    // 13. Test Sign Out from Dashboard
    await dashAccountBtn.click();
    const signOutBtn = page.getByRole('button', { name: /sign out/i });
    await expect(signOutBtn).toBeVisible();
    await signOutBtn.click();

    // 14. Verify signed out state: DashboardNav now shows Sign In button
    const dashSignInBtn = page.getByRole('button', { name: /sign in/i }).first();
    await expect(dashSignInBtn).toBeVisible();

    // 15. Verify features are locked again
    const lockOverlayButton = page.getByRole('button', { name: /unlock stress lab/i });
    await expect(lockOverlayButton).toBeVisible();
  });
});
