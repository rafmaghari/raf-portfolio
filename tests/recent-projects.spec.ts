import { expect, test } from '@playwright/test';

test.use({ video: 'on', trace: 'on' });

test('recent projects show their details and respect privacy', async ({ page }) => {
  await page.route('**/_next/image?**', async route => {
    if (new URL(route.request().url()).searchParams.get('url') === '/project1.jpg') {
      await route.abort();
    } else {
      await route.continue();
    }
  });
  await page.goto('/#portfolio');
  const cards = page.locator('#portfolio article');
  await expect(cards.locator('h3').allTextContents()).resolves.toEqual([
    'Conect.au platform', 'Conect.au mobile app', 'Caravea', 'GiftShark', 'DotReady',
    'Whittaker Properties', 'SmartScout Calculator', 'PandaByte', 'Podiem',
    'SugarAndFlour', 'Appertiser App',
  ]);
  await cards.nth(0).scrollIntoViewIfNeeded();
  await expect(cards.nth(0)).toContainText('Full-stack Engineer and Tech Lead');
  await expect(cards.nth(0).getByRole('link', { name: 'View project' })).toHaveAttribute('href', 'https://conect.au');
  await page.waitForTimeout(1200); // Keep the recorded review flow legible.
  await cards.nth(1).scrollIntoViewIfNeeded();
  await expect(cards.nth(1)).toContainText('Full-stack Engineer and Tech Lead');
  await expect(cards.nth(1).getByText('Private project')).toHaveCount(0);
  await expect(cards.nth(1).getByRole('link', { name: 'App Store' })).toBeVisible();
  await expect(cards.nth(1).getByRole('link', { name: 'Google Play' })).toBeVisible();
  await expect(cards.nth(1)).toContainText('Twilio voice calling');
  await page.waitForTimeout(1200);
  await cards.nth(2).scrollIntoViewIfNeeded();
  await expect(cards.nth(2)).toContainText('Full-stack Engineer and Tech Lead');
  await expect(cards.nth(2).getByRole('link', { name: 'View project' })).toHaveAttribute('href', 'https://caravea.au');
  await page.waitForTimeout(1200);
  await cards.nth(3).scrollIntoViewIfNeeded();
  await expect(cards.nth(3).getByRole('img', { name: 'Project image unavailable' })).toBeVisible();
  await expect(cards.nth(3).getByRole('img', { name: 'GiftShark project preview' })).toHaveCount(0);
  await page.waitForTimeout(1200);
});
