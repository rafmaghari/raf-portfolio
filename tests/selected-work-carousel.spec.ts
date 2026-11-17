import { expect, test, type Page } from '@playwright/test';

// Keep the validating run watchable without changing recording for other specs.
test.use({ video: 'on', trace: 'on' });
test.describe.configure({ mode: 'parallel' });

const carousel = (page: Page) => page.getByRole('region', { name: 'Recent projects' });
const active = (page: Page) => carousel(page).locator('[data-active="true"]');

async function position(page: Page, number: number, title: string) {
  await expect(active(page)).toHaveAttribute('aria-label', `${number} of 11`);
  await expect(active(page).getByRole('heading')).toHaveText(title);
  await expect(carousel(page).getByRole('button', { name: `Show project ${number}:`, exact: false })).toHaveAttribute('aria-current', 'true');
}

test('arrows, focused keyboard, dots and looping preserve the centre stage', async ({ page }) => {
  await page.goto('/#portfolio');
  await position(page, 1, 'Conect.au platform');
  await carousel(page).getByRole('button', { name: 'Next project', exact: true }).click();
  await position(page, 2, 'Conect.au mobile app');
  await carousel(page).focus();
  await page.keyboard.press('ArrowRight');
  await position(page, 3, 'Caravea');
  await page.keyboard.press('ArrowLeft');
  await position(page, 2, 'Conect.au mobile app');
  await carousel(page).getByRole('button', { name: 'Show project 11:' }).click();
  await position(page, 11, 'Appertiser App');
  await carousel(page).getByRole('button', { name: 'Next project', exact: true }).click();
  await position(page, 1, 'Conect.au platform');
  await carousel(page).getByRole('button', { name: 'Previous project', exact: true }).click();
  await position(page, 11, 'Appertiser App');
  await expect(carousel(page).locator('[data-active="false"] button:not([tabindex="-1"])')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect.poll(async () => {
    const box = await active(page).boundingBox();
    return Math.abs(box!.x + box!.width / 2 - page.viewportSize()!.width / 2);
  }).toBeLessThan(3);
});

test('public details contain the full description, tech and safe links, and restore focus', async ({ page }) => {
  await page.goto('/#portfolio');
  const trigger = active(page).getByRole('button', { name: 'View details' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Conect.au platform' });
  await expect(dialog).toContainText('Full-stack Engineer and Tech Lead');
  await expect(dialog.getByText('Laravel', { exact: true })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'View project' })).toHaveAttribute('href', 'https://conect.au');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await carousel(page).getByRole('button', { name: 'Next project', exact: true }).click();
  await active(page).getByRole('button', { name: 'View details' }).click();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'App Store' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Google Play' })).toBeVisible();
});

test('private project fixture hides every outbound link, including store links', async ({ page }) => {
  // Current editorial data has no private entries. Override only this browser's
  // bundled config, not a shared file or server, to exercise the privacy contract.
  let patched = false;
  await page.route('**/_next/static/**/*.js', async route => {
    const response = await route.fetch();
    const original = await response.text();
    const body = original.replace(/(\\?"private\\?"\s*:)\s*false/g, '$1true')
      .replace(/(\\?"links\\?"\s*:)/g, key => {
        const quote = key.startsWith('\\') ? '\\"' : '"';
        return `${quote}private${quote}:true,${key}`;
      });
    if (body !== original) patched = true;
    await route.fulfill({ response, body });
  });
  await page.goto('/#portfolio');
  await expect(active(page).getByText('Private project')).toBeVisible();
  expect(patched).toBe(true);
  await active(page).getByRole('button', { name: 'View details' }).click();
  await expect(page.getByRole('dialog').getByText('Laravel', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('link')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await carousel(page).getByRole('button', { name: 'Next project', exact: true }).click();
  await active(page).getByRole('button', { name: 'View details' }).click();
  await expect(page.getByRole('dialog').getByText('Private project')).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Expo', { exact: true })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('link')).toHaveCount(0);
});

test('reduced motion crossfades without slide, scale or text movement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#portfolio');
  await carousel(page).getByRole('button', { name: 'Next project', exact: true }).click();
  await position(page, 2, 'Conect.au mobile app');
  await expect(carousel(page)).toHaveAttribute('data-reduced-motion', 'true');
  await expect.poll(() => active(page).evaluate(element => getComputedStyle(element).transform)).toBe('none');
  await expect.poll(() => active(page).locator('[data-card-text]').evaluate(element => getComputedStyle(element).transform)).toBe('none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(carousel(page)).toHaveAttribute('data-reduced-motion', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(carousel(page)).toHaveAttribute('data-reduced-motion', 'true');
});

test('dragging and a horizontal trackpad gesture advance while vertical scroll stays native', async ({ page, browserName }, testInfo) => {
  await page.goto('/#portfolio');
  await expect(carousel(page)).toHaveAttribute('data-reduced-motion', 'false');
  await active(page).scrollIntoViewIfNeeded();
  await expect.poll(async () => (await active(page).boundingBox())!.width).toBeGreaterThan(page.viewportSize()!.width * .5);
  const box = await active(page).boundingBox();
  await page.mouse.move(box!.x + box!.width * .7, box!.y + 70);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width * .25, box!.y + 70, { steps: 12 });
  await page.mouse.up();
  await position(page, 2, 'Conect.au mobile app');
  await page.waitForTimeout(550);
  await carousel(page).locator('[data-carousel-stage]').dispatchEvent('wheel', { deltaX: 160, deltaY: 3 });
  await position(page, 3, 'Caravea');
  await page.waitForTimeout(550);
  await carousel(page).locator('[data-carousel-stage]').dispatchEvent('wheel', { deltaX: 1, deltaY: 140 });
  await position(page, 3, 'Caravea');
  if (browserName === 'chromium' && testInfo.project.use.hasTouch) {
    await page.waitForTimeout(550);
    const card = (await active(page).boundingBox())!;
    const session = await page.context().newCDPSession(page);
    const start = { x: card.x + card.width * .8, y: card.y + 60 };
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [start] });
    for (let step = 1; step <= 8; step++) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x - step * card.width * .07, y: start.y }] });
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await session.detach();
    await position(page, 4, 'GiftShark');
  }
});
