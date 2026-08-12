import { Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  readonly signupLoginLink: Locator;
  readonly loggedInAsText: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly cartLink: Locator;
  readonly productsLink: Locator;
  readonly homeLink: Locator;
  readonly contactUsLink: Locator;
  readonly subscribeEmailInput: Locator;
  readonly subscribeButton: Locator;
  readonly subscribeSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    const nav = page.locator('#header');
    this.signupLoginLink = nav.locator('a[href="/login"]');
    this.loggedInAsText = nav.locator('a:has-text("Logged in as")');
    this.logoutLink = nav.locator('a[href="/logout"]');
    this.deleteAccountLink = nav.locator('a[href="/delete_account"]');
    this.cartLink = nav.locator('a[href="/view_cart"]');
    this.productsLink = nav.locator('a[href="/products"]');
    this.homeLink = nav.locator('a[href="/"]');
    this.contactUsLink = nav.locator('a[href="/contact_us"]');
    this.subscribeEmailInput = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.subscribeSuccessMessage = page.locator('#success-subscribe');
  }

  /**
   * Third-party ad scripts on the public site can keep network activity going
   * indefinitely, so waiting for the full `load` event is unreliable (observed as
   * intermittent 30s navigation timeouts, particularly in Firefox). `domcontentloaded`
   * is sufficient since it guarantees the DOM our locators query against is ready.
   */
  protected async navigateTo(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async subscribe(email: string): Promise<void> {
    await this.subscribeEmailInput.scrollIntoViewIfNeeded();
    await this.subscribeEmailInput.fill(email);
    await this.subscribeButton.click();
  }

  async isLoggedInAs(username: string): Promise<boolean> {
    return this.loggedInAsText.filter({ hasText: username }).isVisible();
  }

  async logout(): Promise<void> {
    await this.clickNavLinkResilient(this.logoutLink, /\/login$/);
  }

  async deleteAccount(): Promise<void> {
    this.page.on('dialog', (dialog) => dialog.accept());
    await this.clickNavLinkResilient(this.deleteAccountLink, /\/delete_account$/);
  }

  /**
   * The public site periodically injects a third-party ad interstitial ("Close" in the
   * top-right corner) on a timer, independent of user action. It can cover the nav bar
   * right up to the moment of a click and re-appear moments after being dismissed, so a
   * single dismiss-then-click is not reliable. This retries dismiss+click until the
   * navigation actually lands, rather than trusting any single attempt.
   */
  protected async clickNavLinkResilient(link: Locator, expectedUrl: RegExp, attempts = 5): Promise<void> {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      await this.dismissPromotionalOverlay();
      await link.click({ force: true }).catch(() => undefined);

      const navigated = await this.page
        .waitForURL(expectedUrl, { timeout: 2_000 })
        .then(() => true)
        .catch(() => false);
      if (navigated) return;
    }

    // Final attempt, allowed to throw its real error if the app itself is broken.
    await this.dismissPromotionalOverlay();
    await link.click({ force: true });
    await this.page.waitForURL(expectedUrl);
  }

  /**
   * Best-effort dismissal of the ad overlay described above, so it never masks the
   * real assertion under test.
   */
  async dismissPromotionalOverlay(): Promise<void> {
    const closeControl = this.page.getByText('Close', { exact: true }).first();
    try {
      if (await closeControl.isVisible({ timeout: 1_000 })) {
        await closeControl.click({ timeout: 2_000, force: true });
      }
    } catch {
      // No overlay present — nothing to dismiss.
    }
  }
}
