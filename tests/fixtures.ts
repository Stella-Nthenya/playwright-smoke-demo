import { test as base, expect } from '@playwright/test';
import { Store } from '../pages/store';

// SHOPPER selects which demo account runs the suite. See scripts/check-detects-bugs.mjs.
const shopper = process.env.SHOPPER ?? 'standard_user';

export const test = base.extend<{ store: Store; shop: Store }>({
  store: async ({ page }, use) => use(new Store(page)),
  shop: async ({ store }, use) => {
    await store.login(shopper);
    await expect(store.page).toHaveURL(/inventory\.html/);
    await use(store);
  },
});
export { expect };
