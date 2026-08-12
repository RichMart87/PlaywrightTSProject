import { test, expect } from '@fixtures/index';

test.describe('Smoke: Products and cart critical path', () => {
  test('products page loads and search returns results @smoke', async ({ productsPage }) => {
    await productsPage.goto();

    await expect(productsPage.allProductsHeading).toBeVisible();
    expect(await productsPage.productCount()).toBeGreaterThan(0);

    await productsPage.searchProduct('Top');

    await expect(productsPage.searchedProductsHeading).toBeVisible();
    expect(await productsPage.productCount()).toBeGreaterThan(0);
  });

  test('a product can be added to the cart @smoke', async ({ page, productsPage, cartPage }) => {
    await productsPage.goto();
    await productsPage.addProductToCartByIndex(0);
    await productsPage.goToCartFromModal();

    await expect(page).toHaveURL(/\/view_cart/);
    expect(await cartPage.itemCount()).toBe(1);
  });
});
