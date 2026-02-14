import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductListPage } from '../pages/ProductListPage';
import { validCredentials, invalidCredentials } from '../test-data/credentials';

test.describe('Customer Login & Validation', () => {
  let loginPage: LoginPage;
  let productListPage: ProductListPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productListPage = new ProductListPage(page);
    await loginPage.goto();
    
    await page.waitForLoadState('networkidle');
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    console.log('Logging in with valid credentials...');
    
   
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*inventory.html/, { timeout: 10000 });
  
    await expect(productListPage.inventoryContainer).toBeVisible({ timeout: 10000 });
    
    console.log('Login berhasil dan redirect ke Product Listing page');
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    console.log('Testing login with invalid credentials...');
    
    await loginPage.login(invalidCredentials.username, invalidCredentials.password);
    
    await page.waitForTimeout(500);
    
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
    
    const errorText = await loginPage.getErrorMessage();
    console.log(`Error message: "${errorText}"`);
    
    expect(errorText.toLowerCase()).toContain('username');
    
    console.log('Error message ditampilkan untuk kredensial invalid');
  });
});