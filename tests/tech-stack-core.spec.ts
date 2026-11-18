import { expect, test } from '@playwright/test';
import config from '../src/config.json';

// Keep a watchable record of this focused interaction, not the rest of the site.
test.use({ video: 'on', trace: 'on' });

const coreNames = [
  'Laravel', 'PHP', 'Vue', 'React', 'Next.js', 'TypeScript',
  'Tailwind CSS', 'Swift / SwiftUI', 'AWS', 'MySQL',
];
const coreSources = new Set([
  'Laravel Core', 'PHP', 'VueJS', 'ReactJS', 'NextJS', 'TypeScript',
  'Tailwind CSS', 'Swift / SwiftUI', 'AWS (EC2, RDS, S3, Amplify, Route53)', 'MySQL',
]);
const supportingNames = config.skills.categories.flatMap((category) =>
  category.skills.filter((tool) => !coreSources.has(tool.name)).map((tool) => tool.name),
);
const brandColors = [
  'rgb(255, 45, 32)', 'rgb(119, 123, 180)', 'rgb(79, 192, 141)', 'rgb(97, 218, 251)',
  null, 'rgb(49, 120, 198)', 'rgb(6, 182, 212)', 'rgb(240, 81, 56)',
  'rgb(255, 153, 0)', 'rgb(68, 121, 161)',
];

test('ten core tools lead to the complete toolkit with keyboard controls in both themes', async ({ page }, testInfo) => {
  const timeline: { step: string; seconds: number }[] = [];
  const started = Date.now();
  const mark = (step: string) => timeline.push({ step, seconds: (Date.now() - started) / 1000 });
  await page.goto('/');
  const nav = page.locator('nav.sticky');
  if (await nav.getByRole('button', { name: 'Menu', exact: true }).isVisible()) {
    await nav.getByRole('button', { name: 'Menu', exact: true }).click();
  }
  await nav.getByRole('link', { name: 'Tech stack', exact: true }).click();
  await expect(page).toHaveURL(/#skills$/);
  const section = page.locator('#skills');
  const core = section.getByRole('list', { name: 'Core tools', exact: true });
  const tiles = core.getByRole('listitem');
  const toggle = section.getByRole('button', { name: 'Show all tools', exact: true });
  const panel = section.locator('#all-tools');

  // This first assertion also discriminates against the former wall of pills.
  await expect(tiles).toHaveCount(10);
  expect(supportingNames).toHaveLength(56);
  await expect(section.getByRole('heading', { name: 'Tech stack', exact: true })).toBeVisible();
  await expect(core.locator('svg')).toHaveCount(10);
  await expect(core.locator('img')).toHaveCount(0);
  await expect(tiles).toHaveText(coreNames);

  for (const theme of ['light', 'dark']) {
    if (await page.locator('html').evaluate((html, currentTheme) => html.classList.contains('dark') !== (currentTheme === 'dark'), theme)) {
      await nav.getByRole('button', { name: 'Toggle theme' }).click();
    }
    await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));
    await core.scrollIntoViewIfNeeded();
    mark(`${theme}: ten monochrome core tiles, in order`);
    for (let i = 0; i < coreNames.length; i++) {
      const tile = tiles.nth(i);
      await expect(tile.getByText(coreNames[i], { exact: true })).toBeVisible();
      const geometry = await tile.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const label = element.lastElementChild!;
        const range = document.createRange();
        range.selectNodeContents(label);
        const text = range.getBoundingClientRect();
        return {
          insideViewport: box.left >= 0 && box.right <= innerWidth,
          nameFits: text.left >= box.left && text.right <= box.right && text.bottom <= box.bottom,
          monochrome: getComputedStyle(element.querySelector('svg')!).color === getComputedStyle(element).color,
        };
      });
      expect(geometry).toEqual({ insideViewport: true, nameFits: true, monochrome: true });
    }
    const rows = await tiles.evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().top)));
    expect(new Set(rows).size).toBe(2);
    expect(new Set(rows.slice(0, 5)).size).toBe(1);
    expect(new Set(rows.slice(5)).size).toBe(1);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-controls', 'all-tools');
    await expect(panel).toBeHidden();
    await expect(panel.locator('li')).toHaveText(supportingNames);
    for (const name of supportingNames) {
      await expect(panel.getByText(name, { exact: true })).toBeHidden();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.waitForTimeout(900); // Intentional review beat for the recorded flow.

    // Tab into the disclosure from the last core tile, not a mouse click.
    await tiles.last().focus();
    await page.keyboard.press('Tab');
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Enter');
    mark(`${theme}: Enter reveals all 56 supporting tools`);
    const fewer = section.getByRole('button', { name: 'Show fewer', exact: true });
    await expect(fewer).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect(panel.locator('h3')).toHaveText(config.skills.categories.map((category) => category.name));
    await expect(section.locator('li:visible')).toHaveText([...coreNames, ...supportingNames]);
    for (const name of supportingNames) {
      await expect(panel.getByText(name, { exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await panel.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await panel.locator('li').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await fewer.scrollIntoViewIfNeeded();
    await page.keyboard.press('Space');
    mark(`${theme}: Space collapses the toolkit without losing focus`);
    await expect(toggle).toBeFocused();
    await expect(panel).toBeHidden();
    await expect(section.locator('li:visible')).toHaveCount(10);
    await page.keyboard.press('Space');
    await expect(panel).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(panel).toBeHidden();

    // Focus provides the same brand feedback as hover; names stay monochrome.
    mark(`${theme}: keyboard focus reveals brand colors`);
    for (let i = 0; i < coreNames.length; i++) {
      const tile = tiles.nth(i);
      await tile.focus();
      await expect(tile).toBeFocused();
      const expectedColor = brandColors[i] ?? await tile.evaluate((element) => getComputedStyle(element).color);
      await expect.poll(() => tile.locator('svg').evaluate((svg) => getComputedStyle(svg).color)).toBe(expectedColor);
      expect(await tile.evaluate((element) => getComputedStyle(element.lastElementChild!).color === getComputedStyle(element).color)).toBe(true);
    }
    await toggle.focus();
    if (testInfo.project.name.includes('desktop')) {
      await tiles.first().hover();
      await expect.poll(() => tiles.first().locator('svg').evaluate((svg) => getComputedStyle(svg).color)).toBe(brandColors[0]);
      await page.waitForTimeout(900);
      await page.mouse.move(0, 0);
    }
    await toggle.blur();
    // Let the last color transition finish before checking the next theme's rest state.
    await expect.poll(() => core.locator('svg').evaluateAll((marks) => marks.every((svg) => getComputedStyle(svg).color === getComputedStyle(svg.closest('li')!).color))).toBe(true);
  }
  mark('Passed: 10 core tools, 56 supporting tools, both themes and keyboard controls');
  await page.waitForTimeout(900);
  await testInfo.attach('flow-timeline', { body: JSON.stringify(timeline, null, 2), contentType: 'application/json' });
});

test('reduced motion removes hover transitions and disclosure animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#skills');
  const section = page.locator('#skills');
  const tiles = section.getByRole('list', { name: 'Core tools', exact: true }).getByRole('listitem');
  await expect(tiles).toHaveCount(10);
  await expect(tiles.first()).toBeVisible();
  await tiles.first().focus();
  await expect(tiles.first().locator('svg')).toHaveCSS('color', brandColors[0]!);
  await section.getByRole('button', { name: 'Show all tools', exact: true }).click();
  await expect(section.locator('#all-tools')).toBeVisible();
  const motion = await section.evaluate((element) =>
    Array.from(element.querySelectorAll('*')).every((child) => {
      const style = getComputedStyle(child);
      return style.animationName === 'none' && style.transitionDuration.split(',').every((duration) => parseFloat(duration) === 0);
    }),
  );
  expect(motion).toBe(true);
  await expect(section.locator('li:visible')).toHaveCount(66);
});
