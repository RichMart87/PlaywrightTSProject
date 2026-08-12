import { test, expect } from '@fixtures/index';
import { generateUser } from '@utils/testData';

test.describe('E2E: Registration through purchase', () => {
  test('a new user can register, buy products, and delete their account @e2e', async ({
    page,
    homePage,
    loginPage,
    signupDetailsPage,
    accountPage,
    productsPage,
    cartPage,
    checkoutPage,
    paymentPage,
  }) => {
    const user = generateUser();

    await test.step('Register a new account', async () => {
      await homePage.goto();
      await homePage.signupLoginLink.click();
      await loginPage.startSignup(user.name, user.email);

      await expect(signupDetailsPage.enterAccountInfoHeading).toBeVisible();
      await signupDetailsPage.fillAccountInformation(user);
      await signupDetailsPage.submit();

      await expect(accountPage.accountCreatedHeading).toBeVisible();
      await accountPage.continueToHome();
      await expect(homePage.loggedInAsText.filter({ hasText: user.firstName })).toBeVisible();
    });

    await test.step('Add products to the cart', async () => {
      await productsPage.goto();
      await productsPage.addProductToCartByIndex(0);
      await productsPage.continueShoppingFromModal();
      await productsPage.addProductToCartByIndex(1);
      await productsPage.goToCartFromModal();

      await expect(page).toHaveURL(/\/view_cart/);
      expect(await cartPage.itemCount()).toBe(2);
    });

    await test.step('Check out and place the order', async () => {
      await cartPage.proceedToCheckout();
      await expect(checkoutPage.addressDetailsHeading).toBeVisible();
      await expect(checkoutPage.reviewOrderHeading).toBeVisible();

      await checkoutPage.addComment('Please deliver during business hours. (automated e2e test order)');
      await checkoutPage.placeOrder();
    });

    await test.step('Pay for the order and confirm', async () => {
      await paymentPage.fillCardDetails({
        nameOnCard: user.name,
        cardNumber: '4111111111111111',
        cvc: '123',
        expiryMonth: '12',
        expiryYear: '2030',
      });
      await paymentPage.confirmPayment();

      await expect(paymentPage.orderConfirmationMessage).toBeVisible();
    });

    await test.step('Delete the account', async () => {
      await homePage.goto();
      await homePage.deleteAccount();
      await expect(accountPage.accountDeletedHeading).toBeVisible();
      await accountPage.continueToHome();
    });
  });
});
