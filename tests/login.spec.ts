import { test, expect } from './fixtures';

test('valid shopper reaches the product list', async ({ store }) => {
  await store.login('standard_user');
  await expect(store.page).toHaveURL(/inventory\.html/);
  await expect(store.id('inventory-item')).toHaveCount(6);
});

for (const [name, user, password, message] of [
  ['locked account', 'locked_out_user', 'secret_sauce', 'locked out'],
  ['wrong password', 'standard_user', 'wrong', 'do not match'],
  ['missing username', '', 'secret_sauce', 'Username is required'],
] as const) {
  test(`login is refused: ${name}`, async ({ store }) => {
    await store.login(user, password);
    await expect(store.id('error')).toContainText(message);
    await expect(store.page).not.toHaveURL(/inventory/);
  });
}

test('signed-out visitor cannot open the product list', async ({ store }) => {
  await store.page.goto('/inventory.html');
  await expect(store.id('error')).toContainText('only access');
});
