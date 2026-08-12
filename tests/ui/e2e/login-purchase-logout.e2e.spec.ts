import { test, expect } from '@fixtures/index';

test.describe('E2E: Returning user login through logout', () => {
  test('a returning user logs in, buys a product, and logs out @e2e', async ({
    page,
    homePage,
    loginPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage,
    registeredUser,
  }) => {
    await test.step('Log in with an existing account', async () => {
      await homePage.goto();
      await homePage.signupLoginLink.click();
      await loginPage.login(registeredUser.email, registeredUser.password);

      await expect(homePage.loggedInAsText.filter({ hasText: registeredUser.firstName })).toBeVisible();
    });

    await test.step('Add a product to the cart and check out', async () => {
      await productsPage.goto();
      await productsPage.addProductToCartByIndex(2);
      await productsPage.goToCartFromModal();

      await expect(page).toHaveURL(/\/view_cart/);
      expect(await cartPage.itemCount()).toBe(1);

      await cartPage.proceedToCheckout();
      await expect(checkoutPage.reviewOrderHeading).toBeVisible();
      await checkoutPage.placeOrder();
    });

    await test.step('Complete payment and verify the order confirmation', async () => {
      await paymentPage.fillCardDetails({
        nameOnCard: registeredUser.name,
        cardNumber: '4242424242424242',
        cvc: '321',
        expiryMonth: '06',
        expiryYear: '2029',
      });
      await paymentPage.confirmPayment();

      await expect(paymentPage.orderConfirmationMessage).toBeVisible();
    });

    await test.step('Log out', async () => {
      await homePage.goto();
      await homePage.logout();

      await expect(loginPage.loginHeading).toBeVisible();
    });
  });
});
