import { test, expect } from '@fixtures/index';

test.describe('Smoke: Core navigation', () => {
  test('home page loads with title and key nav links visible @smoke', async ({ page, homePage }) => {
    await homePage.goto();
    // "one moment, please.." suggests page is still loading trying to wait for network idle state before asserting title and nav links
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/Automation Exercise/i);
    await expect(homePage.productsLink).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();
    await expect(homePage.signupLoginLink).toBeVisible();
    await expect(homePage.featuredProductCards.first()).toBeVisible();
  });

  test('login page renders both signup and login forms @smoke', async ({ homePage, loginPage }) => {
    await homePage.goto();
    await homePage.signupLoginLink.click();

    await expect(loginPage.newUserSignupHeading).toBeVisible();
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(loginPage.signupNameInput).toBeVisible();
    await expect(loginPage.loginEmailInput).toBeVisible();
  });
});
