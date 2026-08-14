import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly allProductsHeading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly productCards: Locator;
  readonly cartModal: Locator;
  readonly cartModalViewCartLink: Locator;
  readonly cartModalContinueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.allProductsHeading = page.getByRole('heading', { name: 'All Products' });
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' });
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.cartModal = page.locator('#cartModal');
    this.cartModalViewCartLink = this.cartModal.getByRole('link', { name: 'View Cart' });
    this.cartModalContinueShoppingButton = this.cartModal.getByText('Continue Shopping');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/products');
  }

  async searchProduct(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  productCardByName(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    const card = this.productCards.nth(index);
    // Scroll into view and hover to ensure the "Add to cart" button is visible and clickable
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await card.getByText('Add to cart').first().click();
  }

  async addProductToCartByName(name: string): Promise<void> {
    const card = this.productCardByName(name);
    await card.hover();
    await card.getByText('Add to cart').first().click();
  }

  async viewProductDetailsByIndex(index: number): Promise<void> {
    const card = this.productCards.nth(index);
    await card.hover();
    await card.getByText('View Product').click();
  }

  async continueShoppingFromModal(): Promise<void> {
    await this.cartModalContinueShoppingButton.click();
  }

  async goToCartFromModal(): Promise<void> {
    await this.cartModalViewCartLink.click();
  }

  async productCount(): Promise<number> {
    return this.productCards.count();
  }
}
