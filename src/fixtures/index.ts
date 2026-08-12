import { test as base, expect } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { SignupDetailsPage } from '@pages/SignupDetailsPage';
import { AccountPage } from '@pages/AccountPage';
import { ProductsPage } from '@pages/ProductsPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { PaymentPage } from '@pages/PaymentPage';
import { ContactUsPage } from '@pages/ContactUsPage';
import { ApiClient } from '@api/apiClient';
import { generateUser, UserAccount } from '@utils/testData';

type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupDetailsPage: SignupDetailsPage;
  accountPage: AccountPage;
  productsPage: ProductsPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  contactUsPage: ContactUsPage;
};

type DataFixtures = {
  apiClient: ApiClient;
  /** A user account created via the API before the test and deleted afterwards. */
  registeredUser: UserAccount;
};

export const test = base.extend<PageFixtures & DataFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupDetailsPage: async ({ page }, use) => {
    await use(new SignupDetailsPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },

  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  registeredUser: async ({ apiClient }, use) => {
    const user = generateUser();
    const response = await apiClient.createAccount(user);
    if (!response.ok()) {
      throw new Error(`Failed to seed test user via API (status ${response.status()})`);
    }

    await use(user);

    await apiClient.deleteAccount(user.email, user.password);
  },
});

export { expect };
