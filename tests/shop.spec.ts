import { test, expect } from './fixtures';

test('each product shows its own image', async ({ shop }) => {
  const images = shop.page.locator('img.inventory_item_img');
  await expect(images).toHaveCount(6);
  const srcs = await images.evaluateAll((els) => els.map((e) => (e as HTMLImageElement).src));
  expect(new Set(srcs).size).toBe(6);
});

test('price sort orders products low to high', async ({ shop }) => {
  await shop.id('product-sort-container').selectOption('lohi');
  await expect.poll(() => shop.prices()).toHaveLength(6);
  const prices = await shop.prices();
  expect(prices).toEqual([...prices].sort((a, b) => a - b));
});

test('cart badge follows adds and removes', async ({ shop }) => {
  await shop.add('sauce-labs-backpack');
  await shop.add('sauce-labs-bike-light');
  await expect(shop.id('shopping-cart-badge')).toHaveText('2');
  await shop.remove('sauce-labs-backpack');
  await expect(shop.id('shopping-cart-badge')).toHaveText('1');
});

test('cart survives a page reload', async ({ shop }) => {
  await shop.add('sauce-labs-backpack');
  await shop.page.reload();
  await expect(shop.id('shopping-cart-badge')).toHaveText('1');
});

test('checkout requires a postal code', async ({ shop }) => {
  await shop.add('sauce-labs-backpack');
  await shop.openCart();
  await shop.id('checkout').click();
  await shop.fillCheckout('Test', 'Shopper', '');
  await expect(shop.id('error')).toContainText('Postal Code is required');
});

test('shopper completes an order and the totals add up', async ({ shop }) => {
  await shop.add('sauce-labs-backpack');
  await shop.add('sauce-labs-bike-light');
  await shop.openCart();
  await shop.id('checkout').click();
  await shop.fillCheckout('Test', 'Shopper', '00100');
  await expect(shop.page).toHaveURL(/checkout-step-two/);
  const lines = (await shop.prices()).reduce((a, b) => a + b, 0);
  const subtotal = await shop.amount('subtotal-label');
  expect(subtotal).toBeCloseTo(lines, 2);
  expect(await shop.amount('total-label')).toBeCloseTo(subtotal + (await shop.amount('tax-label')), 2);
  await shop.id('finish').click();
  await expect(shop.id('complete-header')).toHaveText('Thank you for your order!');
});

test('logout ends the session', async ({ shop }) => {
  await shop.page.getByRole('button', { name: 'Open Menu' }).click();
  await shop.id('logout-sidebar-link').click();
  await expect(shop.id('login-button')).toBeVisible();
  await shop.page.goto('/inventory.html');
  await expect(shop.id('error')).toContainText('only access');
});
