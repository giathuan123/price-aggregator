const puppeteer = require('puppeteer');
var browser;

async function init(){
    if(module.exports.browser == undefined){
        module.exports.browser = await puppeteer.launch({headless: false});
        browser = module.exports.browser;
    }
};

class priceGetter {
    constructor(url){
        return new Promise( async (resolve, reject) => {
            await init();
            this.page = await browser.newPage();
            this.url = url;
            if(page == undefined)
                reject("Can't create newPage");
            resolve(this);
        });
    }
    async getPrice(){
       await this.page.goto(this.url);
    }
}

module.exports = {
    priceGetter
}