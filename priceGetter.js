const puppeteer = require('puppeteer');

class priceGetter{
    static _browser;
    static _opts;
    constructor(url){
        return new Promise( async (resolve, reject) => {
            if(priceGetter._browser == undefined)
                priceGetter._browser = await puppeteer.launch({headless: false});
            this.page = await priceGetter._browser.newPage();
            this.url = url;
            this.price = -1;
            if(this.page == undefined)
                reject("Can't create newPage");
            resolve(this);
        });
    }
    async getPrice(){
        return new Promise(async (res, rej) =>{
        await this.page.goto(this.url, {'waitUntil': 'load'});
        if(this.url.includes('shopee')){
            this.price = await this._getShopeePrice();
        }else if (this.url.includes('lazada')){
            this.price = await this._getLazadaPrice();
        }else{
            throw new Error("URL is wrong");
        }
        if(this.price == -1){
            throw new Error("Can't get price~");
        }
        res(this.price);
    });
    }
    async _getLazadaPrice(){
        return new Promise(async (res)=>{
            const title = await this.page.title();
            if(title.includes('Sorry'))
                throw new Error('~Captcha~');
            this.price = await this.page.evaluate((price)=>{
                parseFloat(pdpTrackingData.pdt_price.replace('$',''));
            });
            if(this.price == -1)
                throw new Error('Can\'t get price from lazada');
            res(this.price);
        }
        );
    }
    // todo shopee
    async _getShopeePrice(){
        return new Promise((res)=>{
            res();
        }
        );
    }
}

module.exports.priceGetter = priceGetter;
