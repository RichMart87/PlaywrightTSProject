import { test, expect } from '@fixtures/index';
import { generateUser, uniqueEmail } from '@utils/testData';

test.describe('Regression: Authentication', () => {
  test('login with invalid credentials shows an error @regression', async ({ homePage, loginPage }) => {
    await homePage.goto();
    await homePage.signupLoginLink.click();

    await loginPage.login(uniqueEmail('invalid'), 'not-a-real-password');

    await expect(loginPage.loginErrorMessage).toBeVisible();
  });

  test('signup with an already-registered email shows an error @regression', async ({
    homePage,
    loginPage,
    registeredUser,
  }) => {
    await homePage.goto();
    await homePage.signupLoginLink.click();

    await loginPage.startSignup('Existing User', registeredUser.email);

    await expect(loginPage.signupErrorMessage).toBeVisible();
  });

  test('a new account can be registered end-to-end and then deleted @regression', async ({
    page,
    homePage,
    loginPage,
    signupDetailsPage,
    accountPage,
  }) => {
    const user = generateUser();

    await homePage.goto();
    await homePage.signupLoginLink.click();
    await loginPage.startSignup(user.name, user.email);

    await expect(signupDetailsPage.enterAccountInfoHeading).toBeVisible();
    await signupDetailsPage.fillAccountInformation(user);
    await signupDetailsPage.submit();

    await expect(accountPage.accountCreatedHeading).toBeVisible();
    await accountPage.continueToHome();

    await expect(homePage.loggedInAsText.filter({ hasText: user.firstName })).toBeVisible();

    await homePage.deleteAccount();
    await expect(accountPage.accountDeletedHeading).toBeVisible();
    await accountPage.continueToHome();

    await expect(page).toHaveURL(/\/$/);
  });
});
