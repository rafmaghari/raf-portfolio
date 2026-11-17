import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

test('maker tile follows the theme and site icons are served intact', async ({ page, request }) => {
  await page.goto('/');
  const home = page.getByRole('link', { name: 'Raf Maghari, home' });
  await expect(home).toHaveAttribute('href', '/');
  const mark = home.locator('svg');
  await expect(mark).toBeVisible();
  await expect(mark).toHaveAttribute('viewBox', '0 0 32 32');
  await expect(mark).toHaveCSS('width', '32px');
  await expect(mark).toHaveCSS('height', '32px');
  await expect(mark.locator('rect')).toHaveAttribute('rx', '7');

  const theme = page.getByRole('button', { name: 'Toggle theme' }).filter({ visible: true });
  const colorBefore = await mark.evaluate(el => getComputedStyle(el).color);
  await theme.click();
  await expect.poll(() => mark.evaluate(el => getComputedStyle(el).color)).not.toBe(colorBefore);
  await theme.click();
  await expect.poll(() => mark.evaluate(el => getComputedStyle(el).color)).toBe(colorBefore);

  for (const [url, file] of [['/favicon.ico', 'favicon.ico'], ['/icon.svg', 'icon.svg'], ['/apple-icon.png', 'apple-icon.png']]) {
    const response = await request.get(url);
    expect(response.ok(), url).toBeTruthy();
    expect(await response.body(), url).toEqual(await readFile(path.join(process.cwd(), 'src/app', file)));
  }
});
