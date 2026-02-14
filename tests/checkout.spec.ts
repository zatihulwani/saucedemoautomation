import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductListPage } from '../pages/ProductListPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { validCredentials } from '../test-data/credentials';

test.describe('End-to-End Checkout Flow', () => {
  let loginPage: LoginPage;
  let productListPage: ProductListPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productListPage = new ProductListPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.goto();
    await page.waitForLoadState('networkidle');
    
    await loginPage.login(validCredentials.username, validCredentials.password);
    
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*inventory.html/, { timeout: 10000 });
  });

  test('should complete checkout flow successfully', async ({ page }) => {
 
    console.log('Menambahkan 2 item ke cart...');
    
    await productListPage.addItemToCart('Sauce Labs Backpack');
    await page.waitForTimeout(500); 
    
    await productListPage.addItemToCart('Sauce Labs Bike Light');
    await page.waitForTimeout(500); 

  
    const cartCount = await productListPage.getCartItemCount();
    expect(cartCount).toBe(2);
    console.log(`Cart berisi ${cartCount} items`);

    console.log('Navigasi ke cart page...');
    await productListPage.goToCart();
    await page.waitForLoadState('networkidle');
    
    await expect(cartPage.cartItems).toHaveCount(2, { timeout: 5000 });
    console.log('Cart page menampilkan 2 items');

    console.log('Melanjutkan ke checkout...');
    await cartPage.proceedToCheckout();
    await page.waitForLoadState('networkidle');

    console.log('Mengisi informasi customer...');
    await checkoutPage.fillCustomerInfo('Wani', 'Zati', '12345');
    await page.waitForLoadState('networkidle');
    console.log('Informasi customer terisi');

  
    console.log('Memverifikasi perhitungan total...');
    
    await expect(checkoutPage.itemTotal).toBeVisible({ timeout: 5000 });
    await expect(checkoutPage.tax).toBeVisible({ timeout: 5000 });
    await expect(checkoutPage.total).toBeVisible({ timeout: 5000 });
    
    const itemTotal = await checkoutPage.getItemTotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    const calculatedTotal = itemTotal + tax;
    expect(calculatedTotal).toBeCloseTo(total, 2);
    
    console.log(`Item Total: $${itemTotal}`);
    console.log(`Tax: $${tax}`);
    console.log(`Total: $${total}`);
    console.log(`CRITICAL ASSERTION PASSED: $${itemTotal} + $${tax} = $${total}`);

    console.log('Menyelesaikan order...');
    await checkoutPage.finishOrder();
    await page.waitForLoadState('networkidle');

  
    await expect(checkoutPage.completeHeader).toBeVisible({ timeout: 5000 });
    
    const confirmationMessage = await checkoutPage.getConfirmationMessage();
    expect(confirmationMessage.toLowerCase()).toContain('your order has been dispatched, and will arrive just as fast as the pony can get there!');
    expect(await checkoutPage.isOrderComplete()).toBe(true);
    
    console.log(`Confirmation message: "${confirmationMessage}"`);
    console.log('CHECKOUT FLOW COMPLETED SUCCESSFULLY!');
  });
});