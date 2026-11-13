import { expect, test } from '@playwright/test';

test.use({ video: 'on', trace: 'on' });

test('Conect mobile app showcases its public stores and screenshots', async ({ page }, testInfo) => {
  await page.goto('/#portfolio');
  const card = page.locator('#portfolio article').filter({ has: page.getByRole('heading', { name: 'Conect.au mobile app' }) });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toContainText('Full-stack Engineer and Tech Lead');
  await expect(card.getByText('Private project')).toHaveCount(0);
  const screenshots = card.getByRole('img', { name: /Conect DMS screenshot/ });
  await expect(screenshots).toHaveCount(3);
  for (const image of await screenshots.all()) {
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  for (const [name, href] of [
    ['App Store', 'https://apps.apple.com/au/app/conect-dms/id6805670775'],
    ['Google Play', 'https://play.google.com/store/apps/details?id=au.caravea.conect'],
  ]) {
    const link = card.getByRole('link', { name });
    await expect(link).toHaveAttribute('href', href);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
  if (process.env.STORE_EVIDENCE_DIR) {
    await card.screenshot({ path: `${process.env.STORE_EVIDENCE_DIR}/${testInfo.project.name}-card.png` });
    await page.getByRole('link', { name: 'Google Play' }).evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.screenshot({ path: `${process.env.STORE_EVIDENCE_DIR}/${testInfo.project.name}.png` });
  }
  await page.waitForTimeout(1500);
});
