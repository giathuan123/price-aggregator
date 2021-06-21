const puppeteer = require('puppeteer');
const read = require('./read.js');
const LAZ_CAP = "Sorry";
const SHOP_CAP = "kajhsdflaksjdf";
class priceGetter{
    static _browser;
    static _opts = {headless: false};
    constructor(url){
        return new Promise( async (resolve, reject) => {
            if(priceGetter._browser == undefined)
                priceGetter._browser = await puppeteer.launch();
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
            this.price = await this._getPrice(SHOP_CAP, priceGetter._getShopeePrice);
        }else if (this.url.includes('lazada')){
            this.price = await this._getPrice(LAZ_CAP, priceGetter._getLazadaPrice);
        }else{
            throw new Error("URL is wrong");
        }
        res(this.price);
    });
    }
    async _getPrice(CAP, getter){
        return new Promise(async (res)=>{
            const title = await this.page.title();
            if(title.includes(CAP))
                await require('./read').prompt("");
            const get = getter.bind(this);
            await get();
            if(this.price == -1)
                throw new Error('Can\'t get price');
            res(this.price);
        }
        );
    }
    // todo shopee
    static async _getShopeePrice(){
        await this.page.waitFor(3000);
        this.price = await this.page.evaluate(()=>{
            const data = Array.from(document.querySelectorAll("script[type='application/ld+json']")).map((node)=>{
                return JSON.parse(node.innerHTML);
            });
            for(d in data){
                if(data[d].offers){
                    if(data[d].offers.price)
                        console.log(data[d].offers.price);
                        return Promise.resolve(data[d].offers.price);
                }
            }
        });
    }
    static async _getLazadaPrice(){
        this.price = await this.page.evaluate(()=>{
            return Promise.resolve(+(document.querySelector("#module_product_price_1 > div > div > span").innerHTML.replace('$','')));
        });
    }
}

module.exports.priceGetter = priceGetter;
