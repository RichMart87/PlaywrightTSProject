import path from 'node:path';
import { test, expect } from '@fixtures/index';
import { uniqueEmail } from '@utils/testData';

const UPLOAD_FILE = path.join(__dirname, '..', '..', 'fixtures', 'upload-sample.txt');

test.describe('Regression: Contact us and newsletter subscription', () => {
  test('contact us form submits successfully with an attachment @regression', async ({ contactUsPage }) => {
    await contactUsPage.goto();

    await expect(contactUsPage.getInTouchHeading).toBeVisible();
    await contactUsPage.fillForm({
      name: 'Jane QA',
      email: uniqueEmail('contact'),
      subject: 'Regression test subject',
      message: 'This message was submitted by an automated regression test.',
    });
    await contactUsPage.uploadFileInput.setInputFiles(UPLOAD_FILE);
    await contactUsPage.submit();

    await expect(contactUsPage.successMessage).toBeVisible();
  });

  test('a visitor can subscribe to the newsletter from the home page @regression', async ({ homePage }) => {
    await homePage.goto();

    await homePage.subscribe(uniqueEmail('subscribe'));

    await expect(homePage.subscribeSuccessMessage).toBeVisible();
  });
});
