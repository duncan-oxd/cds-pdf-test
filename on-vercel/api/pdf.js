// Shout outs to the following repositories:

// https://github.com/vercel/og-image
// https://github.com/ireade/netlify-puppeteer-screenshot-demo

// The maximum execution timeout is 10
// seconds when deployed on a Personal Account (Hobby plan).
// For Teams, the execution timeout is 60 seconds (Pro plan)
// or 900 seconds (Enterprise plan).

const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

/** The code below determines the executable location for Chrome to
 * start up and take the screenshot when running a local development environment.
 *
 * If the code is running on Windows, find chrome.exe in the default location.
 * If the code is running on Linux, find the Chrome installation in the default location.
 * If the code is running on MacOS, find the Chrome installation in the default location.
 * You may need to update this code when running it locally depending on the location of
 * your Chrome installation on your operating system.
 */

const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function getOptions(isDev) {
  let options;
  if (isDev) {
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
  return options;
}

module.exports = async (req, res) => {
  const pageToScreenshot = 'https://rop-pdf-3.surge.sh/pdf/?id=' + req.query.id;

  // pass in this parameter if you are developing locally
  // to ensure puppeteer picks up your machine installation of
  // Chrome via the configurable options
  const isDev = req.query.isDev === "true";

  try {
    // check for https for safety!
    if (!pageToScreenshot.includes("https://")) {
      res.statusCode = 404;
      res.json({
        body: "Sorry, we couldn't screenshot that page. Did you include https://?",
      });
    }

    // get options for browser
    const options = await getOptions(isDev);

    // launch a new headless browser with dev / prod options
    console.log('launch browser...');
    const browser = await puppeteer.launch(options);
    console.log('create page...');
    const page = await browser.newPage();

    // set the viewport size
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // tell the page to visit the url
    console.log('navigate...');
    await page.goto(pageToScreenshot);

    await page.waitForSelector('.pdf-ready');

    const headerFooterStyles = `
    <style>
      header,
      footer {
        font-family: sans-serif;
        font-size: 16px;

        width: 100%;
        margin: 0 1cm;
        display: flex;
        justify-content: space-between;
      }
    </style>
    `;

    console.log('make pdf...');
    const file = await page.pdf({
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        ${headerFooterStyles}
        <header>
          <div>this is the header</div>
          <span class="date"></span>
        </header>
      `,
      footerTemplate: `
        ${headerFooterStyles}
        <footer>
          <div>hello world, this is the footer.</div>
          <div>
            (page <span class="pageNumber"></span>
            of
            <span class="totalPages"></span>)
          </div>
        </footer>
      `,
      margin: {
        top: '2cm',
        bottom: '2.5cm',
        left: '1cm',
        right: '1cm',
      },

      preferCSSPageSize: true,
    });

    // close the browser
    console.log('close browser...');
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Content-Type", `application/pdf`);

    // return the file!
    console.log('return file...');
    res.end(file);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.json({
      body: "Sorry, Something went wrong!",
      e,
    });
  }
};
