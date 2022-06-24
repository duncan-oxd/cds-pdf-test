import puppeteer from 'puppeteer';

export default async (req, res, next) => {
  try {
    const { url } = req.query;

    console.log(`converting ${url}...`);
    console.time(`converting ${url}`);

    const browser = await puppeteer.launch({});

    const page = await browser.newPage();

    await page.emulateMediaType('screen');

    await page.goto(url, {
    });

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

    const pdf = await page.pdf({
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

    await browser.close();

    console.timeEnd(`converting ${url}`);

    res.attachment('converted.pdf');
    res.send(pdf);
  } catch (error) {
    next(error);
  }
};
