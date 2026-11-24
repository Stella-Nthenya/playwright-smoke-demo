import type { Page } from '@playwright/test';

export class Store {
  constructor(readonly page: Page) {}
  id = (testId: string) => this.page.getByTestId(testId);

  async login(username: string, password = 'secret_sauce') {
    await this.page.goto('/');
    await this.id('username').fill(username);
    await this.id('password').fill(password);
    await this.id('login-button').click();
  }
  add = (slug: string) => this.id(`add-to-cart-${slug}`).click();
  remove = (slug: string) => this.id(`remove-${slug}`).click();
  openCart = () => this.id('shopping-cart-link').click();

  async fillCheckout(first: string, last: string, postcode: string) {
    await this.id('firstName').fill(first);
    await this.id('lastName').fill(last);
    await this.id('postalCode').fill(postcode);
    await this.id('continue').click();
  }
  async prices() {
    return (await this.id('inventory-item-price').allTextContents()).map((t) => Number(t.replace('$', '')));
  }
  async amount(testId: string) {
    return Number((await this.id(testId).innerText()).split('$')[1]);
  }
}
