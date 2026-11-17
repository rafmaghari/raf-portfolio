import { expect, test } from '@playwright/test';

// A compact recorded regression flow; run the desktop project for the 1440px review.
test.use({ video: { mode: 'on', size: { width: 1440, height: 1000 } }, trace: 'on' });
test.describe.configure({ mode: 'parallel' });

test('swipe through three projects without opening details accidentally', async ({ page }) => {
  await page.goto('/#portfolio');
  const section = page.locator('#portfolio');
  const region = section.getByRole('region', { name: 'Recent projects' });
  const active = section.locator('[data-active="true"]');
  await expect(region).toHaveAttribute('data-reduced-motion', 'false');
  await active.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800); // Opening frame and first project.
  for (const [number, title] of [[2, 'Conect.au mobile app'], [3, 'Caravea']] as const) {
    const box = await active.boundingBox();
    await page.mouse.move(box!.x + box!.width * .75, box!.y + 70);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width * .25, box!.y + 70, { steps: 20 });
    await page.mouse.up();
    await expect(active).toHaveAttribute('aria-label', `${number} of 11`);
    await expect(active.getByRole('heading')).toHaveText(title);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.waitForTimeout(1100); // Let the spring and text settle for review.
  }
});

test('light and dark carousel and details remain contained at desktop and phone widths', async ({ page }, testInfo) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 1440 ? 1050 : 844 });
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto('/#portfolio');
      const section = page.locator('#portfolio');
      const region = section.getByRole('region', { name: 'Recent projects' });
      const active = section.locator('[data-active="true"]');
      await expect(region).toHaveAttribute('data-reduced-motion', 'false');
      await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(theme === 'dark');
      await page.evaluate(() => document.fonts.ready);
      await section.evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.waitForTimeout(600);
      await expect.poll(async () => {
        const box = await active.boundingBox();
        return Math.abs(box!.x + box!.width / 2 - width / 2);
      }).toBeLessThan(2);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      const directory = process.env.CAROUSEL_EVIDENCE_DIR;
      expect((await active.getByRole('button', { name: 'View details' }).boundingBox())!.height).toBeGreaterThanOrEqual(44);
      if (directory) await page.screenshot({ path: `${directory}/${width}-${theme}-carousel.png` });
      await active.getByRole('button', { name: 'View details' }).click();
      const dialog = page.getByRole('dialog', { name: 'Conect.au platform' });
      await expect(dialog.getByText('Laravel', { exact: true })).toBeVisible();
      if (directory) await page.screenshot({ path: `${directory}/${width}-${theme}-details.png` });
      await dialog.getByRole('button', { name: 'Close project details' }).click();
      await expect(dialog).not.toBeVisible();
      await expect(active.getByRole('button', { name: 'View details' })).toBeFocused();
    }
  }
  testInfo.annotations.push({ type: 'coverage', description: '1440 and 390px; light and dark; centred active card, no page overflow, details and focus return' });
});
