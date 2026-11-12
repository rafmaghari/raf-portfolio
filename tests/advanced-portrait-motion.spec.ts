import { test, expect, type Page } from '@playwright/test';

test.use({ actionTimeout: 5000 });

const closeTo = (a: {x:number;y:number;width:number;height:number}, b: {x:number;y:number;width:number;height:number}) => {
  for (const key of ['x', 'y', 'width', 'height'] as const) expect(Math.abs(a[key] - b[key]), key).toBeLessThanOrEqual(1);
};

async function toggle(page: Page, name: string) {
  await page.getByRole('button', {name:'Open inventory'}).click();
  await page.getByRole('dialog', {name:'Inventory'}).getByRole('button', {name, exact:true}).click();
  await page.getByRole('button', {name:'Close inventory'}).click();
}

test('roll returns home and DVD stays in bounds before returning home', async ({page}, info) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('/');
  const portrait = page.getByTestId('portrait');
  await expect(portrait).toBeVisible();
  const home = (await portrait.boundingBox())!;
  for (let run = 0; run < 3; run++) {
    await toggle(page, 'Roll');
    if (run === 0) {
      await page.waitForTimeout(300);
      const rolling = await portrait.evaluate(element => {
        const matrix = new DOMMatrix(getComputedStyle(element).transform);
        return { travel: matrix.e, rotation: Math.atan2(matrix.b, matrix.a) };
      });
      expect(rolling.travel).toBeGreaterThan(1);
      expect(Math.abs(rolling.rotation)).toBeGreaterThan(.01);
      await page.screenshot({path:info.outputPath('mid-roll.png')});
    }
    await page.waitForTimeout(2400);
    closeTo((await portrait.boundingBox())!, home);
    await toggle(page, 'Roll');
  }
  await toggle(page, 'Cap');
  await toggle(page, 'DVD');
  const badge = page.getByTestId('dvd-badge');
  await expect(badge).toBeVisible();
  await expect(badge.getByTestId('cap-overlay')).toBeVisible();
  await page.waitForTimeout(1800);
  const viewportBeforeResize = page.viewportSize()!;
  await page.setViewportSize({width: 320, height: 600});
  await page.waitForTimeout(100);
  const resized = (await badge.boundingBox())!;
  expect(resized.x).toBeGreaterThanOrEqual(-1);
  expect(resized.x + resized.width).toBeLessThanOrEqual(321);
  expect(resized.y + resized.height).toBeLessThanOrEqual(601);
  await page.setViewportSize(viewportBeforeResize);
  await page.waitForTimeout(100);
  await page.evaluate(() => Object.defineProperty(document, 'hidden', {configurable:true, value:true}));
  await page.waitForTimeout(100);
  const paused = (await badge.boundingBox())!;
  await page.waitForTimeout(300);
  closeTo((await badge.boundingBox())!, paused);
  await page.evaluate(() => { delete (document as unknown as {hidden?: boolean}).hidden; });
  for (let i = 0; i < 20; i++) {
    const box = (await badge.boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(box.x).toBeGreaterThanOrEqual(-1);
    expect(box.y).toBeGreaterThanOrEqual(-1);
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
    if (i === 3) await page.screenshot({path:info.outputPath('dvd-bounce.png')});
    await page.waitForTimeout(500);
  }
  await toggle(page, 'DVD');
  await expect(badge).toHaveCount(0, {timeout:5000});
  await toggle(page, 'Cap');
  closeTo((await portrait.boundingBox())!, home);
  await page.screenshot({path:info.outputPath('rest.png')});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('reduced motion keeps DVD static and roll in place', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const portrait = page.getByTestId('portrait');
  const home = (await portrait.boundingBox())!;
  await toggle(page, 'Roll');
  closeTo((await portrait.boundingBox())!, home);
  await toggle(page, 'Roll');
  await toggle(page, 'DVD');
  const badge = page.getByTestId('dvd-badge');
  await expect(badge).toBeVisible();
  await page.waitForTimeout(150);
  const first = (await badge.boundingBox())!;
  await page.waitForTimeout(1200);
  closeTo((await badge.boundingBox())!, first);
  await toggle(page, 'DVD');
  await expect(badge).toHaveCount(0);
  closeTo((await portrait.boundingBox())!, home);
});
