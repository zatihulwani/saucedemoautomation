import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductListPage } from '../pages/ProductListPage';
import { validCredentials } from '../test-data/credentials';

test.describe('Sorting Functionality', () => {
  let loginPage: LoginPage;
  let productListPage: ProductListPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productListPage = new ProductListPage(page);

    await loginPage.goto();
    await page.waitForLoadState('networkidle');
    
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*inventory.html/, { timeout: 10000 });
  });

  test('should sort products by price (high to low)', async ({ page }) => {
    console.log('Mengubah sorting ke "Price (high to low)"...');
    
    await productListPage.sortBy('hilo');

    await page.waitForTimeout(1000);

    const prices = await productListPage.getAllItemPrices();
    console.log(`Prices after sorting: ${prices.map(p => '$' + p).join(', ')}`);

    expect(prices.length).toBeGreaterThan(0);

    const maxPrice = Math.max(...prices);
    expect(prices[0]).toBe(maxPrice);
    console.log(`Item pertama adalah yang termahal: $${prices[0]}`);

    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
    console.log('Semua items terurut dari harga tinggi ke rendah');
    
    console.log('SORTING TEST PASSED!');
  });
});