import { expect, test } from '@playwright/test';

test.use({ video: 'on', trace: 'on' });

test('visitors can explore the updated tech stack', async ({ page }) => {
  await page.goto('/#skills');
  const section = page.locator('#skills');
  await expect(section.getByRole('heading', { name: 'Tech stack' })).toBeVisible();

  const groups: Record<string, string[]> = {
    'Languages & Frameworks': ['TypeScript', 'Inertia.js', 'Python (FastAPI)', 'Swift / SwiftUI', 'React Native (Expo)'],
    'Laravel Ecosystem': ['Reverb', 'Pulse', 'Pennant', 'Sail', 'Pint', 'Laravel AI', 'Ploi'],
    'Cloud & DevOps': ['Kubernetes (DigitalOcean DOKS)', 'Helm', 'Temporal', 'PostgreSQL', 'MySQL', 'Redis', 'Coolify', 'nginx'],
    'Frontend & UI': ['Tailwind CSS', 'Bootstrap', 'shadcn/ui', 'Radix UI', 'Zustand', 'TanStack', 'GSAP', 'Tiptap', 'Strapi (CMS)'],
    Testing: ['Playwright', 'Vitest', 'Jest', 'XCUITest', 'Maestro (mobile)'],
    'Integrations & Services': ['Twilio (SMS, Voice)', 'OpenAI', 'Sentry/Flareio'],
    'Development Tools': ['PHPStorm', 'Visual Studio Code', 'DataGrip', 'Vim'],
  };
  await expect(section.locator('h3')).toHaveText(Object.keys(groups));
  for (const [name, skills] of Object.entries(groups)) {
    const group = section.getByRole('heading', { name, exact: true }).locator('..');
    await group.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    for (const skill of skills) {
      await expect(group.getByText(skill, { exact: true })).toBeVisible();
    }
  }
  const integrations = section.getByRole('heading', { name: 'Integrations & Services', exact: true }).locator('..');
  await expect(integrations.getByText('Twilio', { exact: true })).toHaveCount(0);
  await expect(integrations.getByText('Twilio Voice', { exact: true })).toHaveCount(0);
  const tools = section.getByRole('heading', { name: 'Development Tools', exact: true }).locator('..');
  await expect(tools.getByText('Tailwind CSS', { exact: true })).toHaveCount(0);
  await expect(tools.getByText('Bootstrap', { exact: true })).toHaveCount(0);
});
