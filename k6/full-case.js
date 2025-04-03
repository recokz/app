import { browser } from "k6/browser";

export const options = {
  scenarios: {
    ui: {
      vus: 2,
      iterations: 10,
      executor: "shared-iterations",
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  thresholds: {
    checks: ["rate==1.0"],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:3000/");
    await page.waitForTimeout(1000);
    await page.click("#try");
    await Promise.all([page.waitForNavigation()]);

    await page.locator("#email").type("zholay.abdubek+clerk_test@gmail.com");
    await page.locator("#password").type("ASD12asd!");
    await page.waitForTimeout(1000);
    await page.click("#sign-in-submit");
    await Promise.all([page.waitForNavigation()]);

    await page.waitForTimeout(1000);
    await page.click("#create-report");
    await Promise.all([
      page.waitForNavigation(),
      page.waitForLoadState("networkidle"),
    ]);

    await page.waitForTimeout(1000);
    await page.click("#return-reports");
    await Promise.all([page.waitForNavigation()]);
  } finally {
    await page.close();
  }
}
