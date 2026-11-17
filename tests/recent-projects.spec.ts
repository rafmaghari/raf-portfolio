import { expect, test } from '@playwright/test';

test.use({ video: 'on', trace: 'on' });

test('recent projects retain their descriptions and image fallbacks in the carousel', async ({ page }) => {
  await page.route('**/_next/image?**', async route => {
    if (new URL(route.request().url()).searchParams.get('url') === '/project1.jpg') await route.abort();
    else await route.continue();
  });
  await page.goto('/#portfolio');
  const section = page.locator('#portfolio');
  const cards = section.locator('article');
  await expect(cards.locator('h3').allTextContents()).resolves.toEqual([
    'Conect.au platform', 'Conect.au mobile app', 'Caravea', 'GiftShark', 'DotReady',
    'Whittaker Properties', 'SmartScout Calculator', 'PandaByte', 'Podiem',
    'SugarAndFlour', 'Appertiser App',
  ]);
  for (const [number, href] of [[1, 'https://conect.au'], [3, 'https://caravea.au']] as const) {
    await section.getByRole('button', { name: `Show project ${number}:` }).click();
    await section.locator('[data-active="true"]').getByRole('button', { name: 'View details' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toContainText('Full-stack Engineer and Tech Lead');
    await expect(dialog.getByRole('link', { name: 'View project' })).toHaveAttribute('href', href);
    await page.keyboard.press('Escape');
  }
  await section.getByRole('button', { name: 'Show project 4:' }).click();
  const gift = section.locator('[data-active="true"]');
  await expect(gift.getByRole('img', { name: 'Project image unavailable' })).toBeVisible();
  await expect(gift.getByRole('img', { name: 'GiftShark project preview' })).toHaveCount(0);
  await expect(gift).toContainText('A gifting and donation platform enabling seamless gift-giving experiences.');
  await section.getByRole('button', { name: 'Show project 2:' }).click();
  await expect(section.locator('[data-active="true"]').getByRole('img', { name: /Conect DMS screenshot/ })).toHaveCount(3);
});
