import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly featuredProductCards: Locator;
  readonly categoryWomen: Locator;
  readonly categoryMen: Locator;
  readonly categoryKids: Locator;

  constructor(page: Page) {
    super(page);
    this.featuredProductCards = page.locator('.features_items .product-image-wrapper');
    this.categoryWomen = page.locator('#Women a[href="#Women"]');
    this.categoryMen = page.locator('#Men a[href="#Men"]');
    this.categoryKids = page.locator('#Kids a[href="#Kids"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/');
  }

  async addFirstFeaturedProductToCart(): Promise<void> {
    const firstCard = this.featuredProductCards.first();
    await firstCard.hover();
    await firstCard.getByText('Add to cart').first().click();
  }

  async addFeaturedProductToCartByIndex(index: number): Promise<void> {
    const card = this.featuredProductCards.nth(index);
    await card.hover();
    await card.getByText('Add to cart').first().click();
  }
}
