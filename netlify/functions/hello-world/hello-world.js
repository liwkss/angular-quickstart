const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
    var ret="";



    const browser = await chromium.puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-dev-shm-usage'],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
		ignoreHTTPSErrors: true,
    });
    
	const page = await browser.newPage()

    await page.goto('https://www.hkab.org.hk/hibor/listRates.do?lang=en&Submit=Detail')

	const text = await page.evaluate(() => Array.from(document.querySelectorAll("body > table > tbody > tr > td:nth-child(1) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr > td > table > tbody > tr:nth-child(n+4):nth-last-child(n+3) > td"), element => element.textContent));
    for(var i=0;i<text.length/2;i++){
		//console.log(text[2*i]+"\t"+text[2*i+1])
		ret = ret+ text[2*i+1]+",";
	}

    await browser.close();
	
    return {
        statusCode: 200,
        body: ret,
    }

}