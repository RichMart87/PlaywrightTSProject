import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly emptyCartMessage: Locator;
  readonly cartRows: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly registerLoginModalLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emptyCartMessage = page.locator('#empty_cart');
    this.cartRows = page.locator('#cart_info tbody tr[id^="product-"]');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout');
    this.registerLoginModalLink = page.getByRole('link', { name: 'Register / Login' });
  }

  async goto(): Promise<void> {
    await this.navigateTo('/view_cart');
  }

  cartRowByProductId(productId: number): Locator {
    return this.page.locator(`#product-${productId}`);
  }

  async removeProduct(productId: number): Promise<void> {
    await this.page.locator(`#product-${productId} .cart_quantity_delete`).click();
  }

  async quantityOf(productId: number): Promise<string | null> {
    return this.page.locator(`#product-${productId} .cart_quantity button`).textContent();
  }

  async itemCount(): Promise<number> {
    return this.cartRows.count();
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }
}
