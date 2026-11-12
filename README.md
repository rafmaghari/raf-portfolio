# Rafael Maghari Portfolio

## Interactive profile checks

Run `npm install`, then `npx playwright install chromium webkit` once. Start the site with `npm run dev -- -p 3098` and run `npx playwright test tests/interactive-profile.spec.ts` in another terminal. Set `PLAYWRIGHT_BASE_URL` to test another running preview. The contact request is intercepted in the test; it sends no email.

