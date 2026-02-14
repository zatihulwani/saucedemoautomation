import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
  }

  async fillCustomerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async getItemTotal(): Promise<number> {
    const text = await this.itemTotal.textContent() || '';
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTax(): Promise<number> {
    const text = await this.tax.textContent() || '';
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTotal(): Promise<number> {
    const text = await this.total.textContent() || '';
    const match = text.match(/\$([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async getConfirmationMessage(): Promise<string> {
    return await this.completeText.textContent() || '';
  }

  async isOrderComplete(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }
}
