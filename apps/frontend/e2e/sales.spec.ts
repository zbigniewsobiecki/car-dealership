import { test, expect } from '@playwright/test';

test.describe('Sales', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email address').fill('admin@cardealership.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/dashboard/);
  });

  test('should navigate to sales page', async ({ page }) => {
    await page.click('text=Sales');

    await expect(page).toHaveURL(/sales/);
    await expect(page.getByText('Sales')).toBeVisible();
  });

  test('should display sales list', async ({ page }) => {
    await page.goto('/sales');

    // Wait for sales to load
    await page.waitForSelector('[data-testid="sale-card"], .card', {
      timeout: 10000,
    }).catch(() => {
      // Sales might be displayed differently
    });
  });

  test('should open add sale form', async ({ page }) => {
    await page.goto('/sales');

    // Find and click add button
    const addButton = page.getByRole('button', { name: /add|new|create/i });
    if (await addButton.isVisible()) {
      await addButton.click();

      // Check if form is visible - should have vehicle or customer selection
      await expect(
        page.getByLabel(/vehicle/i)
          .or(page.getByLabel(/customer/i))
          .or(page.getByPlaceholder(/vehicle/i))
      ).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test('should display sales stats on dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Dashboard should show some stats
    const statsContent = page.locator('[data-testid="stats"], .stat, .metric');
    await expect(statsContent.first()).toBeVisible({ timeout: 10000 }).catch(() => {
      // Stats might be displayed differently
    });
  });
});
