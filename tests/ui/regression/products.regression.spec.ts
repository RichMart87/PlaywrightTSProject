import { test, expect } from '@fixtures/index';

test.describe('Regression: Product catalog', () => {
  test('product details page shows accurate product information @regression', async ({ productDetailsPage }) => {
    await productDetailsPage.goto(1); // Blue Top

    await expect(productDetailsPage.productName).toHaveText('Blue Top');
    await expect(productDetailsPage.productPrice).toContainText('Rs. 500');
    await expect(productDetailsPage.productCategory).toContainText('Women');
    await expect(productDetailsPage.productAvailability).toContainText('In Stock');
    await expect(productDetailsPage.productCondition).toBeVisible();
    await expect(productDetailsPage.productBrand).toContainText('Polo');
  });

  test('quantity can be set before adding a product to the cart @regression', async ({
    page,
    productDetailsPage,
    cartPage,
  }) => {
    await productDetailsPage.goto(1);
    await productDetailsPage.setQuantity(4);
    await productDetailsPage.addToCart();

    await productDetailsPage.cartModal.getByRole('link', { name: 'View Cart' }).click();
    await expect(page).toHaveURL(/\/view_cart/);

    const quantity = await cartPage.quantityOf(1);
    expect(quantity?.trim()).toBe('4');
  });

  test('searching for a non-existent product returns no results @regression', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.searchProduct('zzzznonexistentproductzzzz');

    await expect(productsPage.searchedProductsHeading).toBeVisible();
    expect(await productsPage.productCount()).toBe(0);
  });
});
