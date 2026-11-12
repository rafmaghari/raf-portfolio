import { test, expect } from '@playwright/test';

test('portrait controls, portfolio and neighbouring contact form', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  const shot = async (name: string) => { await page.waitForTimeout(700); await page.screenshot({ path: testInfo.outputPath(`${name}.png`) }); };
  await expect(page.getByRole('heading', { name: 'Raf Maghari.' })).toBeVisible();
  const portrait = page.getByTestId('portrait');
  const bounds = await portrait.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(testInfo.project.use.viewport!.width);
  await shot('initial');
  for (const style of ['Sunglasses', 'Round retro glasses', 'Pixel glasses']) {
    await page.getByRole('button', { name: /^Glasses:/ }).click();
    await expect(page.getByTestId('glasses-overlay')).toHaveAttribute('data-style', style);
    await shot(style.replaceAll(' ', '-').toLowerCase());
  }
  await page.getByRole('button', { name: /^Glasses:/ }).click();
  await expect(page.getByTestId('glasses-overlay')).toHaveCount(0);
  const cap = page.getByRole('button', { name: /^Cap/ });
  await cap.click(); await expect(cap).toHaveAttribute('aria-pressed', 'true'); await expect(page.getByTestId('cap-overlay')).toBeVisible(); await shot('cap');
  await cap.click(); await expect(cap).toHaveAttribute('aria-pressed', 'false'); await expect(page.getByTestId('cap-overlay')).toHaveCount(0);
  const family = page.getByRole('button', { name: /^Family/ });
  await family.click(); await expect(family).toHaveAttribute('aria-pressed', 'true'); await expect(page.locator('.family-person')).toHaveCount(3); await shot('family');
  await family.click(); await expect(family).toHaveAttribute('aria-pressed', 'false'); await expect(page.locator('.family-person')).toHaveCount(0);
  for (const [label, id] of [['Headset', 'headset-overlay'], ['Coffee mug', 'coffee-overlay'], ['Laptop', 'laptop-overlay'], ['Party mode', 'party-overlay'], ['Day/night', 'night-overlay']] as const) {
    const control = page.getByRole('button', { name: new RegExp(`^${label}`) });
    await control.click(); await expect(control).toHaveAttribute('aria-pressed', 'true'); await expect(page.getByTestId(id)).toBeVisible();
    if (id === 'night-overlay') await expect(control).toHaveCSS('color', 'rgb(22, 60, 50)');
    await shot(id);
    await control.click(); await expect(control).toHaveAttribute('aria-pressed', 'false'); await expect(page.getByTestId(id)).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'Portfolio' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Open CareTale details' })).toBeVisible(); await shot('portfolio');
  await dialog.getByRole('button', { name: 'Next project' }).click();
  await expect(dialog.getByRole('button', { name: 'Open Lifeya details' })).toBeVisible();
  await page.keyboard.press('ArrowLeft'); await expect(dialog.getByRole('button', { name: 'Open CareTale details' })).toBeVisible();
  await page.keyboard.press('ArrowRight'); await expect(dialog.getByRole('button', { name: 'Open Lifeya details' })).toBeVisible();
  const card = dialog.getByRole('button', { name: 'Open Lifeya details' });
  const cardBox = (await card.boundingBox())!;
  await page.mouse.move(cardBox.x + cardBox.width * .8, cardBox.y + cardBox.height / 2);
  await page.mouse.down(); await page.mouse.move(cardBox.x + cardBox.width * .2, cardBox.y + cardBox.height / 2, { steps: 8 }); await page.mouse.up();
  await expect(dialog.getByRole('button', { name: 'Open Caretales Games details' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Previous project' }).click();
  const touchCard = dialog.getByRole('button', { name: 'Open Lifeya details' });
  await touchCard.evaluate(node => { const r = node.getBoundingClientRect(); for (const [type, x, buttons] of [['pointerdown', r.right - 20, 1], ['pointermove', r.left + 20, 1], ['pointerup', r.left + 20, 0]] as const) node.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 8, pointerType: 'touch', isPrimary: true, clientX: x, clientY: r.top + 30, button: 0, buttons })); });
  await expect(dialog.getByRole('button', { name: 'Open Caretales Games details' })).toBeVisible();
  await dialog.getByRole('button', { name: 'Previous project' }).click();
  await dialog.getByRole('button', { name: 'Open Lifeya details' }).click();
  await expect(dialog.getByRole('heading', { name: 'Lifeya' })).toBeVisible(); await shot('detail');
  await dialog.getByRole('button', { name: 'Back to work' }).click();
  await expect(dialog.getByRole('button', { name: 'Open Lifeya details' })).toBeVisible();
  for (const title of ['Caretales Games', 'Notee', 'Peekee', 'Caravea Connect', 'CodeCoffeeChill']) {
    await dialog.getByRole('button', { name: 'Next project' }).click();
    await expect(dialog.getByRole('button', { name: `Open ${title} details` })).toBeVisible();
    if (title === 'Caravea Connect') { await expect(dialog.getByAltText('Caravea Connect sign-in screen')).toBeVisible(); await shot('connect'); }
  }
  await dialog.getByRole('button', { name: 'Close portfolio' }).click(); await expect(dialog).toHaveCount(0);
  await page.route('https://api.web3forms.com/submit', route => route.fulfill({json:{success:true}}));
  await page.getByLabel('Name', { exact: true }).fill('Demo User'); await page.getByLabel('Email', { exact: true }).fill('demo@example.test'); await page.getByLabel('Message', { exact: true }).fill('Hello');
  await page.getByRole('button', { name: 'Send Message' }).click(); await expect(page.getByText(/Thank you for your message/)).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await cap.click(); await expect(page.getByTestId('cap-overlay')).toHaveCSS('opacity', '1'); await cap.click();
  for (const [label, id] of [['Headset', 'headset-overlay'], ['Coffee mug', 'coffee-overlay'], ['Laptop', 'laptop-overlay'], ['Party mode', 'party-overlay'], ['Day/night', 'night-overlay']] as const) {
    const control = page.getByRole('button', { name: new RegExp(`^${label}`) });
    await control.click(); await expect(page.getByTestId(id)).toBeVisible();
    if (id === 'coffee-overlay') await expect(page.locator('.coffee-steam')).toHaveCSS('animation-name', 'none');
    if (id === 'laptop-overlay') await expect(page.locator('.laptop-code')).toHaveCSS('animation-name', 'none');
    if (id === 'party-overlay') await expect(page.locator('.party-confetti')).toHaveCSS('animation-name', 'none');
    await control.click(); await expect(page.getByTestId(id)).toHaveCount(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  for (const direction of ['1', '2', '3']) {
    await page.goto(`/?controls=${direction}`);
    await expect(page.getByTestId('control-design')).toHaveAttribute('data-direction', direction);
    await expect(page.getByRole('button', { name: /^Glasses:/ })).toBeVisible();
    const buttons = page.getByTestId('control-design').getByRole('button');
    await expect(buttons).toHaveCount(8);
    const portraitBox = (await page.getByTestId('portrait').boundingBox())!;
    const bottomBar = (await page.getByRole('navigation', { name: 'Quick navigation' }).boundingBox())!;
    const face = { left: portraitBox.x + portraitBox.width * .32, right: portraitBox.x + portraitBox.width * .71, top: portraitBox.y + portraitBox.height * .28, bottom: portraitBox.y + portraitBox.height * .73 };
    for (const button of await buttons.all()) {
      const rect = (await button.boundingBox())!;
      expect(rect.width).toBeGreaterThanOrEqual(44); expect(rect.height).toBeGreaterThanOrEqual(44);
      expect(rect.x + rect.width <= face.left || rect.x >= face.right || rect.y + rect.height <= face.top || rect.y >= face.bottom).toBe(true);
      expect(rect.x + rect.width <= bottomBar.x || rect.x >= bottomBar.x + bottomBar.width || rect.y + rect.height <= bottomBar.y || rect.y >= bottomBar.y + bottomBar.height).toBe(true);
    }
    await shot(`controls-${direction}`);
    const keyboardCap = page.getByRole('button', { name: 'Cap' });
    await keyboardCap.focus(); await page.keyboard.press('Space'); await expect(keyboardCap).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Space'); await expect(keyboardCap).toHaveAttribute('aria-pressed', 'false');
    for (const label of ['Cap', 'Family', 'Headset', 'Coffee mug', 'Laptop', 'Party mode', 'Day/night']) {
      const button = page.getByRole('button', { name: new RegExp(`^${label}`) });
      await button.click(); await expect(button).toHaveAttribute('aria-pressed', 'true');
      if (label === 'Cap') await shot(`controls-${direction}-active`);
      await button.click(); await expect(button).toHaveAttribute('aria-pressed', 'false');
    }
    const glassesButton = page.getByRole('button', { name: /^Glasses:/ });
    for (let i = 0; i < 4; i++) await glassesButton.click();
    await expect(page.getByTestId('glasses-overlay')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});
