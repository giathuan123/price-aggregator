const puppeteer = require('puppeteer');
const read = require('./read.js');
const LAZ_CAP = "Sorry";
const SHOP_CAP = "_____";
async function solveCaptcha(page){
  console.log("Hit Captcha");
  await page.waitForSelector('.nc_iconfont.btn_slide');
  const sliderEl = await page.$('.slidetounlock');
  const slider = await sliderEl.boundingBox();
  const slideHandle = await page.$('.nc_iconfont.btn_slide');
  const handle = await slideHandle.boundingBox();
  await page.mouse.move(handle.x + handle.width/2, handle.y + handle.height/2);
  await page.mouse.down();
  await page.mouse.move(handle.x + slider.width, handle.y + handle.height/2, {steps:50});
  await page.waitForNavigation();
}
class PriceGetter{
    static _browser;
    static _opts = {headless: false};
    constructor(url){
      return new Promise( async(resolve, reject) =>{
        if(PriceGetter._browser == undefined){
            PriceGetter._browser = await puppeteer.launch(PriceGetter._opts);
        }
        this.page = await PriceGetter._browser.newPage();
        this.url = url;
        this.price = -1;
        if(this.page == undefined)
            reject("Can't create newPage");
        resolve(this);
      });
    }
    async getPrice(){
        return new Promise(async (res, rej) =>{
        await this.page.goto(this.url);
        try{
        if(this.url.includes('shopee')){
            this.price = await this._getPrice(SHOP_CAP, PriceGetter._getShopeePrice);
        }else if (this.url.includes('lazada')){
            this.price = await this._getPrice(LAZ_CAP, PriceGetter._getLazadaPrice);
        }
        res(this.price);
        }catch(e){
            rej(e);
        }
    });
    }
    async _getPrice(CAP, getter){
        return new Promise(async (res, reject)=>{
            const title = await this.page.title();
            if(title.includes(CAP)){
              await solveCaptcha(this.page);
            }
            const get = getter.bind(this);
            await get();
            if(this.price == -1){
                reject('Can\'t get price');
            }
            res(this.price);
        }
        );
    }
    static async _getShopeePrice(){
        const scriptSelector = "script[type='application/ld+json']";
        await this.page.waitForFunction((scriptSelector)=>{ 
            return (document.querySelectorAll(scriptSelector).length) == 4;
        }, {}, scriptSelector);
        this.price = await this.page.evaluate((scriptSelector)=>{
            const data = Array.from(document.querySelectorAll(scriptSelector)).map((node)=>{
                return JSON.parse(node.innerHTML);
            });
            for(d in data){
                if(data[d].offers){
                    if(data[d].offers.price)
                        console.log(data[d].offers.price);
                        return Promise.resolve(parseFloat(data[d].offers.price));
                }
            }
        }, scriptSelector);
    }
    static async _getLazadaPrice(){
        this.price = await this.page.evaluate(()=>{
            let price;
            if(price = document.querySelector("#module_product_price_1 > div > div > span"))
                return Promise.resolve(parseFloat(price.innerHTML.replace('$','')));
            return Promise.resolve(-1);
        });
    }
}
module.exports = {
    PriceGetter,
    read
}
