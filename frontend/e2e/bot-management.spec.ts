import { test, expect } from '@playwright/test';

test.describe('Bot Management', () => {
  test('should add a bot', async ({ page }) => {
    await page.goto('/bots');
    await page.click('text=+ Bot');

    await expect(page.locator('text=Bot-1')).toBeVisible();
    await expect(page.locator('text=IDLE')).toBeVisible();
  });

  test('should remove the newest bot', async ({ page }) => {
    await page.goto('/bots');
    await page.click('text=+ Bot');
    await page.click('text=+ Bot');
    await page.click('text=+ Bot');

    await expect(page.locator('text=Bot-3')).toBeVisible();

    await page.click('text=- Bot');

    // Bot-3 should be gone, Bot-2 remains
    await expect(page.locator('text=Bot-3')).not.toBeVisible();
    await expect(page.locator('text=Bot-2')).toBeVisible();
  });

  test('should show processing status when handling order', async ({ page }) => {
    // Create an order first
    await page.goto('/orders');
    await page.click('text=New Normal Order');

    // Go to bots and add one
    await page.click('text=Bot 列表');
    await page.click('text=+ Bot');

    // Bot should be PROCESSING
    await expect(page.locator('text=PROCESSING')).toBeVisible();

    // Wait for completion, should go back to IDLE
    await expect(page.locator('text=IDLE')).toBeVisible({ timeout: 15000 });
  });

  test('should return order to PENDING when processing bot removed', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New VIP Order');
    await page.click('text=New Normal Order');

    // Go add a bot to start processing the VIP order
    await page.click('text=Bot 列表');
    await page.click('text=+ Bot');

    // Remove the bot immediately
    await page.click('text=- Bot');

    // Go back to orders - the VIP order should be back in PENDING
    await page.click('text=订单列表');
    const pendingSection = page.locator('h2:has-text("PENDING")').locator('..');

    // Both orders should be in PENDING (VIP first)
    await expect(pendingSection.locator('text=Order-1')).toBeVisible({ timeout: 5000 });
    await expect(pendingSection.locator('text=Order-2')).toBeVisible({ timeout: 5000 });
  });
});
