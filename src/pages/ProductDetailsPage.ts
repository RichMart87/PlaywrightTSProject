import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly cartModal: Locator;
  readonly writeYourReviewHeading: Locator;

  constructor(page: Page) {
    super(page);
    const info = page.locator('.product-information');
    this.productName = info.locator('h2');
    this.productCategory = info.locator('p').filter({ hasText: 'Category:' });
    this.productPrice = info.locator('span span');
    this.productAvailability = info.locator('p').filter({ hasText: 'Availability:' });
    this.productCondition = info.locator('p').filter({ hasText: 'Condition:' });
    this.productBrand = info.locator('p').filter({ hasText: 'Brand:' });
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.locator('button.cart');
    this.cartModal = page.locator('#cartModal');
    this.writeYourReviewHeading = page.getByText('Write Your Review');
  }

  async goto(productId: number): Promise<void> {
    await this.navigateTo(`/product_details/${productId}`);
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
