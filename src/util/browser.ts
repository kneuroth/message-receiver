import chromium from "@sparticuz/chromium";
import { LaunchOptions } from "puppeteer-core";
const fss = require('fs');

export async function lambdaLaunchArgs(): Promise<LaunchOptions> {
  let chromiumExecutable: string | undefined;
  try {
    // pass the layer path so -min packages also work
    chromiumExecutable = await chromium.executablePath('/opt/chromium/bin');
  } catch (err) {
    console.warn('chromium.executablePath() threw:', err);
  }

  console.log('resolved chromium executable:', chromiumExecutable);

  // If we got a path, check it exists (extra safety)
  if (chromiumExecutable) {
    try {
      const stat = fss.statSync(chromiumExecutable);
      console.log('chromium executable stats:', { size: stat.size, mode: (stat.mode & 0o777).toString(8) });
    } catch (err) {
      console.warn('chromium executable not accessible:', err);
    }
  }

  // Common flags that help running Chrome in Lambda
  const extraArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
  ];

  return {
    executablePath: chromiumExecutable || await chromium.executablePath('/opt/chromium/bin'),
    args: [...(chromium.args || []), ...extraArgs],
    headless: true,
    dumpio: true,
    timeout: 120000,
  };
}
