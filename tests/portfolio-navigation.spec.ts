import { expect, test } from '@playwright/test';

test.use({ video: 'on', trace: 'on' });

test('Portfolio quick navigation scrolls to selected work without a dialog', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Quick navigation' }).getByText('Portfolio').click();
  await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  const label = page.locator('#portfolio').getByText('Selected work', { exact: true });
  await expect(label).toBeVisible();
  await expect.poll(async () => {
    const top = await label.evaluate(element => element.getBoundingClientRect().top);
    const navbarBottom = await page.locator('nav.sticky').evaluate(element => element.getBoundingClientRect().bottom);
    return top >= navbarBottom && top <= 200;
  }).toBe(true);
  if (process.env.PORTFOLIO_SCREENSHOT_DIR) {
    await page.screenshot({ path: `${process.env.PORTFOLIO_SCREENSHOT_DIR}/${testInfo.project.name}.png` });
  }
});
