import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.getByLabel('Email address').fill('admin@cardealership.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/dashboard/);
  });

  test('should display dashboard after login', async ({ page }) => {
    await expect(page.getByText(/dashboard|overview/i)).toBeVisible();
  });

  test('should display navigation sidebar or navbar', async ({ page }) => {
    // Check for navigation elements
    const navLinks = page.locator('nav a, aside a, [role="navigation"] a');
    const count = await navLinks.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should have links to main sections', async ({ page }) => {
    // Dashboard should have links to vehicles, customers, and sales
    await expect(page.getByRole('link', { name: /vehicles/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /customers/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sales/i })).toBeVisible();
  });

  test('should navigate between sections', async ({ page }) => {
    // Navigate to Vehicles
    await page.click('text=Vehicles');
    await expect(page).toHaveURL(/vehicles/);

    // Navigate to Customers
    await page.click('text=Customers');
    await expect(page).toHaveURL(/customers/);

    // Navigate to Sales
    await page.click('text=Sales');
    await expect(page).toHaveURL(/sales/);

    // Navigate back to Dashboard
    const dashboardLink = page.getByRole('link', { name: /dashboard/i });
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await expect(page).toHaveURL(/dashboard/);
    }
  });
});
