import { test, expect } from '@playwright/test';

const items = [
  ['Cap', 'cap-overlay'], ['Family', 'family-backdrop'], ['Headset', 'headset-overlay'],
  ['Coffee mug', 'coffee-overlay'], ['Laptop', 'laptop-overlay'], ['Party mode', 'party-overlay'],
  ['Day/night', 'night-overlay'], ['Fireworks', 'fireworks-overlay'], ['Cat', 'cat-overlay'],
  ['Rubber duck', 'duck-overlay'], ['Balloons', 'balloons-overlay'], ['Snow', 'snow-overlay'],
  ['Coat and tie', 'coat-overlay'], ['Beard', 'beard-overlay'], ['Mustache', 'mustache-overlay'],
] as const;

test('inventory equips all portrait items and preserves portfolio and contact', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  const shot = async (name: string) => { await page.waitForTimeout(450); await page.screenshot({path: info.outputPath(`${name}.png`)}); };
  const bag = page.getByRole('button', {name: 'Open inventory'});
  await expect(bag).toBeVisible();
  const portrait = (await page.getByTestId('portrait').boundingBox())!;
  expect(portrait.x).toBeGreaterThanOrEqual(0);
  expect(portrait.x + portrait.width).toBeLessThanOrEqual(info.project.use.viewport!.width);
  await bag.click();
  const dialog = page.getByRole('dialog', {name: 'Inventory'});
  await expect(dialog).toBeVisible();
  const slots = dialog.getByRole('button', {name: /^(Glasses:|Cap$|Family$|Headset$|Coffee mug$|Laptop$|Party mode$|Day\/night$|Fireworks$|Cat$|Rubber duck$|Balloons$|Snow$|Coat and tie$|Beard$|Mustache$)/});
  await expect(slots).toHaveCount(16);
  for (const slot of await slots.all()) { const box = (await slot.boundingBox())!; expect(box.width).toBeGreaterThanOrEqual(44); expect(box.height).toBeGreaterThanOrEqual(44); }
  await shot('inventory');
  for (const [label, id] of items) {
    const slot = dialog.getByRole('button', {name: label, exact: true});
    await slot.click(); await expect(slot).toHaveAttribute('aria-pressed', 'true'); await expect(page.getByTestId(id).first()).toBeVisible();
    if (id === 'balloons-overlay') {
      await expect(page.getByTestId(id)).toHaveAttribute('preserveAspectRatio', 'none');
      const balloon = (await page.getByTestId(id).locator('ellipse').first().boundingBox())!;
      const currentPortrait = (await page.getByTestId('portrait').boundingBox())!;
      expect(balloon.x).toBeLessThan(currentPortrait.x);
    }
    await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0); await shot(id);
    await bag.click(); await dialog.getByRole('button', {name: label, exact: true}).click();
    await expect(dialog.getByRole('button', {name: label, exact: true})).toHaveAttribute('aria-pressed', 'false'); await expect(page.getByTestId(id)).toHaveCount(0);
  }
  for (const style of ['Sunglasses', 'Round retro glasses', 'Pixel glasses']) {
    await dialog.getByRole('button', {name: /^Glasses:/}).click(); await expect(page.getByTestId('glasses-overlay')).toHaveAttribute('data-style', style);
  }
  await dialog.getByRole('button', {name: /^Glasses:/}).click(); await expect(page.getByTestId('glasses-overlay')).toHaveCount(0);
  const keyboardCap = dialog.getByRole('button', {name:'Cap', exact:true}); await keyboardCap.focus(); await page.keyboard.press('Space'); await expect(keyboardCap).toHaveAttribute('aria-pressed','true'); await page.keyboard.press('Space'); await expect(keyboardCap).toHaveAttribute('aria-pressed','false');
  await page.getByTestId('inventory-backdrop').click({position:{x:5,y:5}}); await expect(dialog).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'reduce'}); await bag.click();
  for (const [label, id] of items.slice(7)) { await dialog.getByRole('button',{name:label,exact:true}).click(); await expect(page.getByTestId(id)).toBeVisible(); const animated = page.getByTestId(id).locator('[data-motion]'); for (const child of await animated.all()) await expect(child).toHaveCSS('animation-name','none'); await dialog.getByRole('button',{name:label,exact:true}).click(); }
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Portfolio'}).click(); const work = page.getByRole('dialog');
  await work.getByRole('button',{name:'Next project'}).click(); await expect(work.getByRole('button',{name:'Open Lifeya details'})).toBeVisible();
  await work.getByRole('button',{name:'Previous project'}).click(); await work.getByRole('button',{name:'Open CareTale details'}).click(); await expect(work.getByRole('heading',{name:'CareTale'})).toBeVisible(); await work.getByRole('button',{name:'Back to work'}).click(); await work.getByRole('button',{name:'Close portfolio'}).click();
  await page.route('https://api.web3forms.com/submit', route => route.fulfill({json:{success:true}}));
  await page.getByLabel('Name',{exact:true}).fill('Demo User'); await page.getByLabel('Email',{exact:true}).fill('demo@example.test'); await page.getByLabel('Message',{exact:true}).fill('Hello'); await page.getByRole('button',{name:'Send Message'}).click(); await expect(page.getByText(/Thank you for your message/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('inventory has black accents and readable equipped states in light and dark', async ({page}, info) => {
  for (const theme of ['light','dark'] as const) {
    await page.emulateMedia({colorScheme:theme, reducedMotion:'reduce'}); await page.goto('/'); await page.getByRole('button',{name:'Open inventory'}).click({ timeout: 5000 });
    const dialog = page.getByRole('dialog',{name:'Inventory'}); const slot = dialog.getByRole('button',{name:'Cap',exact:true}); await slot.click(); await expect(slot).toHaveAttribute('aria-pressed','true');
    const ratio = await slot.evaluate(element => { const css=getComputedStyle(element); const lum=(s:string)=>{const c=s.match(/\d+/g)!.slice(0,3).map(Number).map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*c[0]+.7152*c[1]+.0722*c[2]}; const a=lum(css.color),b=lum(css.backgroundColor); return (Math.max(a,b)+.05)/(Math.min(a,b)+.05); });
    expect(ratio).toBeGreaterThanOrEqual(4.5); await page.screenshot({path:info.outputPath(`inventory-${theme}.png`)});
  }
});
