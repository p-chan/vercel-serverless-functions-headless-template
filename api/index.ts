import { NowRequest, NowResponse } from '@vercel/node'
import chromium from 'chrome-aws-lambda'

export default async (req: NowRequest, res: NowResponse) => {
  let browser = null

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.AWS_LAMBDA_FUNCTION_VERSION
        ? await chromium.executablePath
        : process.env.EXECUTABLE_PATH,
      headless: chromium.headless,
    })

    const page = await browser.newPage()
    await page.goto('https://vercel.com/')

    const title = await page.title()

    return res.json({
      title: title,
    })
  } catch (error) {
    return res.json({
      message: 'error',
    })
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }
}
