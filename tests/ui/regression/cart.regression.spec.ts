import { test, expect } from '@fixtures/index';

test.describe('Regression: Cart management', () => {
  test('multiple products can be added and one removed from the cart @regression', async ({
    page,
    productsPage,
    cartPage,
  }) => {
    await productsPage.goto();

    await productsPage.addProductToCartByIndex(0);
    await productsPage.continueShoppingFromModal();
    await productsPage.addProductToCartByIndex(1);
    await productsPage.goToCartFromModal();

    await expect(page).toHaveURL(/\/view_cart/);
    expect(await cartPage.itemCount()).toBe(2);

    const firstRow = cartPage.cartRows.first();
    const firstRowId = await firstRow.getAttribute('id');
    const productId = Number(firstRowId?.replace('product-', ''));

    await cartPage.removeProduct(productId);
    await expect(cartPage.cartRowByProductId(productId)).toBeHidden();
    expect(await cartPage.itemCount()).toBe(1);
  });

  test('an empty cart shows an empty-cart message @regression', async ({ cartPage }) => {
    await cartPage.goto();

    await expect(cartPage.emptyCartMessage).toBeVisible();
    expect(await cartPage.itemCount()).toBe(0);
  });
});
