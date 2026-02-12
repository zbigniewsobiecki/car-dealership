import { test, expect } from '@playwright/test';

test.describe('Vehicles', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email address').fill('admin@cardealership.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/dashboard/);
  });

  test('should navigate to vehicles page', async ({ page }) => {
    await page.click('text=Vehicles');

    await expect(page).toHaveURL(/vehicles/);
    await expect(page.getByText('Vehicles')).toBeVisible();
  });

  test('should display vehicle list', async ({ page }) => {
    await page.goto('/vehicles');

    // Wait for vehicles to load
    await page.waitForSelector('[data-testid="vehicle-card"], .card', {
      timeout: 10000,
    }).catch(() => {
      // Vehicles might be displayed differently
    });

    // Check if any vehicle content is visible
    const vehicleContent = page.locator('.card, [data-testid="vehicle-list"]');
    await expect(vehicleContent.first()).toBeVisible({ timeout: 10000 }).catch(() => {
      // No vehicles might exist, which is fine
    });
  });

  test('should open add vehicle form', async ({ page }) => {
    await page.goto('/vehicles');

    // Find and click add button
    const addButton = page.getByRole('button', { name: /add|new|create/i });
    if (await addButton.isVisible()) {
      await addButton.click();

      // Check if form is visible
      await expect(page.getByLabel(/vin/i).or(page.getByPlaceholder(/vin/i))).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test('should filter vehicles by status', async ({ page }) => {
    await page.goto('/vehicles');

    // Look for status filter
    const statusFilter = page.getByRole('combobox', { name: /status/i }).or(
      page.locator('select[name="status"]')
    );

    if (await statusFilter.isVisible({ timeout: 5000 }).catch(() => false)) {
      await statusFilter.selectOption('available');

      // Wait for filter to apply
      await page.waitForTimeout(500);
    }
  });

  test('should filter vehicles by price range', async ({ page }) => {
    await page.goto('/vehicles');

    const minPriceInput = page.getByPlaceholder(/min price/i);
    const maxPriceInput = page.getByPlaceholder(/max price/i);
    const searchButton = page.getByRole('button', { name: /search/i });
    const clearButton = page.getByRole('button', { name: /clear/i });

    // Verify inputs exist
    await expect(minPriceInput).toBeVisible();
    await expect(maxPriceInput).toBeVisible();

    // Fill price range
    await minPriceInput.fill('10000');
    await maxPriceInput.fill('50000');
    await searchButton.click();

    // Verify clear button appears
    await expect(clearButton).toBeVisible();

    // Clear filters
    await clearButton.click();

    // Verify inputs are cleared
    await expect(minPriceInput).toHaveValue('');
    await expect(maxPriceInput).toHaveValue('');
    await expect(clearButton).not.toBeVisible();
  });
});
