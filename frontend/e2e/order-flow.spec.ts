import { test, expect } from '@playwright/test';

test.describe('Order Flow', () => {
  test('should create Normal order and see it in PENDING', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New Normal Order');

    const pendingSection = page.locator('h2:has-text("PENDING")').locator('..');
    await expect(pendingSection.locator('text=Order-1')).toBeVisible();
    await expect(pendingSection.locator('text=NORMAL')).toBeVisible();
  });

  test('should create VIP order placed before Normal orders', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New Normal Order');
    await page.click('text=New Normal Order');
    await page.click('text=New VIP Order');

    const pendingSection = page.locator('h2:has-text("PENDING")').locator('..');
    const orderCards = pendingSection.locator('text=Order-');
    const texts = await orderCards.allTextContents();

    // VIP (Order-3) should be first
    expect(texts[0]).toContain('Order-3');
    expect(texts[0]).toContain('VIP');
  });

  test('should complete order after bot processes it', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New Normal Order');

    // Go to bot page and add a bot
    await page.click('text=Bot 列表');
    await page.click('text=+ Bot');

    // Wait 10+ seconds for processing, go back to orders
    await page.click('text=订单列表');

    // The order should eventually appear in COMPLETE
    await expect(page.locator('h2:has-text("COMPLETE")').locator('..').locator('text=Order-1')).toBeVisible({ timeout: 15000 });
  });

  test('should show completed timestamp in COMPLETE area', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New Normal Order');

    await page.click('text=Bot 列表');
    await page.click('text=+ Bot');

    await page.click('text=订单列表');

    const completeSection = page.locator('h2:has-text("COMPLETE")').locator('..');
    await expect(completeSection.locator('text=Order-1')).toBeVisible({ timeout: 15000 });

    // Should show 完成于 timestamp
    const card = completeSection.locator('text=Order-1').locator('..');
    await expect(card.locator('text=/完成于/')).toBeVisible({ timeout: 15000 });
  });
});
