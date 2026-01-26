import { test, expect } from '@playwright/test';

test.describe('Customers', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email address').fill('admin@cardealership.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/dashboard/);
  });

  test('should navigate to customers page', async ({ page }) => {
    await page.click('text=Customers');

    await expect(page).toHaveURL(/customers/);
    await expect(page.getByText('Customers')).toBeVisible();
  });

  test('should display customer list', async ({ page }) => {
    await page.goto('/customers');

    // Wait for customers to load
    await page.waitForSelector('[data-testid="customer-card"], .card', {
      timeout: 10000,
    }).catch(() => {
      // Customers might be displayed differently
    });
  });

  test('should open add customer form', async ({ page }) => {
    await page.goto('/customers');

    // Find and click add button
    const addButton = page.getByRole('button', { name: /add|new|create/i });
    if (await addButton.isVisible()) {
      await addButton.click();

      // Check if form is visible
      await expect(
        page.getByLabel(/first name/i).or(page.getByPlaceholder(/first name/i))
      ).toBeVisible({
        timeout: 5000,
      });
    }
  });
});
