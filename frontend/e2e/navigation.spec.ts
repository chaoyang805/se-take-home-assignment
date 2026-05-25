import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should default to orders page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/orders');
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/orders');

    await page.click('text=Bot 列表');
    await expect(page).toHaveURL('/bots');
    await expect(page.locator('text=暂无机器人')).toBeVisible();

    await page.click('text=订单列表');
    await expect(page).toHaveURL('/orders');
  });
});
