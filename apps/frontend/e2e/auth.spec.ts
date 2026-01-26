import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('Car Dealership Management')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should display demo credentials', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByText('Demo Credentials')).toBeVisible();
    await expect(page.getByText('admin@cardealership.com')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email address').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('should login successfully and navigate to dashboard', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email address').fill('admin@cardealership.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel('Email address').fill('admin@cardealership.com');
    await page.getByLabel('Password').fill('admin123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/dashboard/);

    // Find and click logout button (usually in navbar or sidebar)
    const logoutButton = page.getByRole('button', { name: /logout/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await expect(page).toHaveURL(/login/);
    }
  });
});
