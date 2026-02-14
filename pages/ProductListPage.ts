import { Page, Locator } from '@playwright/test';

export class ProductListPage {
  readonly page: Page;
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly addToCartButtons: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryContainer = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  async isLoaded(): Promise<boolean> {
    return await this.inventoryContainer.isVisible();
  }

  async addItemToCart(itemName: string) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.locator('[data-test^="add-to-cart"]').click();
  }

  async addMultipleItemsToCart(count: number) {
    const buttons = await this.addToCartButtons.all();
    for (let i = 0; i < Math.min(count, buttons.length); i++) {
      await buttons[i].click();
    }
  }

async sortBy(option: string) {
  const select = this.page.locator('select');
  await select.selectOption(option);
}

  async getFirstItemName(): Promise<string> {
    const firstItem = this.inventoryItems.first();
    return await firstItem.locator('.inventory_item_name').textContent() || '';
  }

  async getFirstItemPrice(): Promise<number> {
    const firstItem = this.inventoryItems.first();
    const priceText = await firstItem.locator('.inventory_item_price').textContent() || '';
    return parseFloat(priceText.replace('$', ''));
  }

  async getAllItemPrices(): Promise<number[]> {
    const items = await this.inventoryItems.all();
    const prices: number[] = [];
    
    for (const item of items) {
      const priceText = await item.locator('.inventory_item_price').textContent() || '';
      prices.push(parseFloat(priceText.replace('$', '')));
    }
    
    return prices;
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    const count = await this.shoppingCartBadge.textContent() || '0';
    return parseInt(count);
  }
}
