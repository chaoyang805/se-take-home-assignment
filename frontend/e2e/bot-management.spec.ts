import { test, expect } from '@playwright/test';

test.describe('Bot Management', () => {
  test('should add a bot', async ({ page }) => {
    await page.goto('/bots');

    // Count existing bots
    const before = await page.locator('strong').count();

    await page.click('text=+ Bot');

    // A new bot card should appear
    await expect(page.locator('strong').nth(before)).toBeVisible();
  });

  test('should remove the newest bot', async ({ page }) => {
    const botsLoaded = page.waitForResponse(
      (resp) => resp.url().includes('/api/bots') && resp.status() === 200,
    );
    await page.goto('/bots');
    await botsLoaded;
    const initial = await page.locator('strong').count();
    await page.click('text=+ Bot');
    await expect(page.locator('strong')).toHaveCount(initial + 1);
    await page.click('text=+ Bot');
    await expect(page.locator('strong')).toHaveCount(initial + 2);
    await page.click('text=+ Bot');
    await expect(page.locator('strong')).toHaveCount(initial + 3);

    await page.click('text=- Bot');
    await expect(page.locator('strong')).toHaveCount(initial + 2);
  });

  test('should show processing status when handling order', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New Normal Order');

    const pendingSection = page.locator('h2:has-text("PENDING")').locator('..');
    const orderName = await pendingSection.locator('strong').first().textContent();
    const orderId = orderName!.replace('Order-', '');

    await page.click('text=Bot 管理');
    await page.click('text=+ Bot');

    // Bot should show processing the captured order
    await expect(page.locator(`text=处理中: Order-${orderId}`)).toBeVisible();
    await expect(page.locator('text=PROCESSING').first()).toBeVisible();

    // After 10s, bot should go back to IDLE
    await expect(page.locator('text=IDLE').first()).toBeVisible({ timeout: 15000 });
  });

  test('should return order to PENDING when processing bot removed', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New VIP Order');
    await page.click('text=New Normal Order');

    const pendingSection = page.locator('h2:has-text("PENDING")').locator('..');
    const orderNames = await pendingSection.locator('strong').allTextContents();
    const vipName = orderNames[0]; // VIP always placed first

    await page.click('text=Bot 管理');
    await page.click('text=+ Bot');
    await page.click('text=- Bot');

    await page.click('text=我的订单');

    // VIP order should be back in PENDING
    await expect(pendingSection.locator(`text=${vipName}`)).toBeVisible({ timeout: 5000 });
  });
});
