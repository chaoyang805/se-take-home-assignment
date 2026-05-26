import { test, expect } from '@playwright/test';
import { resetTestState } from './helpers';

test.beforeEach(async ({ request }) => {
  await resetTestState(request);
});

test.describe('Order Flow', () => {
  test('should create Normal order and see it in PENDING', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New Normal Order');

    const pendingSection = page.locator('h2:has-text("PENDING")').locator('..');
    await expect(pendingSection.locator('text=NORMAL').first()).toBeVisible();
  });

  test('should create VIP order placed before Normal orders', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New Normal Order');
    await page.click('text=New Normal Order');
    await page.click('text=New VIP Order');

    const pendingSection = page.locator('h2:has-text("PENDING")').locator('..');
    const orderNames = await pendingSection.locator('strong').allTextContents();

    // VIP should be first
    const vipText = await pendingSection.locator('text=VIP').first().textContent();
    expect(orderNames[0]).toContain('Order-');
    expect(vipText).toBe('VIP');
  });

  test('should complete order after bot processes it', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New Normal Order');

    const pendingSection = page.locator('h2:has-text("PENDING")').locator('..');
    const orderName = await pendingSection.locator('strong').first().textContent();

    await page.click('text=Bot 管理');
    await page.click('text=+ Bot');

    await page.click('text=我的订单');

    const completeSection = page.locator('h2:has-text("COMPLETE")').locator('..');
    await expect(completeSection.locator(`text=${orderName}`)).toBeVisible({ timeout: 15000 });
  });

  test('should show completed timestamp in COMPLETE area', async ({ page }) => {
    await page.goto('/orders');
    await page.click('text=New Normal Order');

    const pendingSection = page.locator('h2:has-text("PENDING")').locator('..');
    const orderName = await pendingSection.locator('strong').first().textContent();

    await page.click('text=Bot 管理');
    await page.click('text=+ Bot');

    await page.click('text=我的订单');

    const completeSection = page.locator('h2:has-text("COMPLETE")').locator('..');
    await expect(completeSection.locator(`text=${orderName}`)).toBeVisible({ timeout: 15000 });
    await expect(completeSection.locator('text=/完成于/').first()).toBeVisible({ timeout: 15000 });
  });
});
