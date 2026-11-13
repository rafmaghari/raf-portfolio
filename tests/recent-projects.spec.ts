import { expect, test } from '@playwright/test';

test.use({ video: 'on', trace: 'on' });

test('recent projects show their details and respect privacy', async ({ page }) => {
  await page.goto('/#portfolio');
  const cards = page.locator('#portfolio article');
  await expect(cards.locator('h3').allTextContents()).resolves.toEqual([
    'Conect.au platform', 'Conect.au mobile app', 'Caravea', 'GiftShark', 'DotReady',
    'Whittaker Properties', 'SmartScout Calculator', 'PandaByte', 'Podiem',
    'SugarAndFlour', 'Appertiser App',
  ]);
  await expect(cards.nth(0).getByRole('link', { name: 'View project' })).toHaveAttribute('href', 'https://conect.au');
  await expect(cards.nth(1).getByText('Private project')).toBeVisible();
  await expect(cards.nth(1).locator('a')).toHaveCount(0);
  await expect(cards.nth(1).getByRole('img', { name: 'Project image unavailable' })).toBeVisible();
  await expect(cards.nth(1)).toContainText('mock');
  await expect(cards.nth(2).getByRole('link', { name: 'View project' })).toHaveAttribute('href', 'https://caravea.au');
});
