const puppeteer = require('puppeteer');
const read = require('./read.js');
const LAZ_CAP = "Sorry";
const SHOP_CAP = "_____";
async function solveCaptcha(page){
  return new Promise( async (res, rej)=>{
  await page.bringToFront();
  await page.waitForSelector('.nc_iconfont.btn_slide');
  const sliderEl = await page.$('.slidetounlock');
  const slider = await sliderEl.boundingBox();
  const slideHandle = await page.$('.nc_iconfont.btn_slide');
  const handle = await slideHandle.boundingBox();
  await page.mouse.move(handle.x + handle.width/2, handle.y + handle.height/2);
  await page.mouse.down();
  await page.mouse.move(handle.x + slider.width, handle.y + handle.height/2, {steps:50});
  await page.waitForNavigation();
  res("Done captcha");
  });
}
class PriceGetter{
    static seenArray = {};
    static _browser;
    static _opts = {headless: true};
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
        if(this.url == null){
          res(null);
          return;
        }
        else if(PriceGetter.seenArray[this.url] != undefined){
           console.log("From Seen Array");
           res(PriceGetter.seenArray[this.url])
           return;
        }
        else{
          try{
            await this.page.goto(this.url);
            if(this.url.includes('shopee')){
                this.price = await this._getPrice(SHOP_CAP, PriceGetter._getShopeePrice);
            }else if (this.url.includes('lazada')){
                this.price = await this._getPrice(LAZ_CAP, PriceGetter._getLazadaPrice);
            }
            PriceGetter.seenArray[this.url] = this.price;
            res(this.price);
          }catch(e){
            console.log("Something went wrong:", this.url)
            rej(e);
          }
        }
    });
    }
    async _getPrice(CAP, getter){
        return new Promise(async (res, rej)=>{
            try{
            const title = await this.page.title();
            if(title.includes(CAP)){
              await solveCaptcha(this.page);
            }
            const get = getter.bind(this);
            this.price = await get();
            res(this.price);
            }catch(e){
              console.log(this.url)
              rej(e);
            }
        });
    }
    static async _getShopeePrice(){
        await this.page.bringToFront();
        await this.page.waitForFunction(()=>{
          const nodeList = Array.from(document.querySelectorAll("script[type='application/ld+json']"));
          const jsonList = nodeList.map(d=>JSON.parse(d.innerHTML));
          for( i in jsonList){
              if(jsonList[i].offers != undefined){
                return true;
              }
          }
        })
        const data = await this.page.evaluate(()=>{
        return (Array.from(document.querySelectorAll("script[type='application/ld+json']")).map(d=>JSON.parse(d.innerHTML))).filter(d=>d.offers)[0];
        });
        if(data.offers["@type"]=="AggregateOffer"){
           return Promise.resolve(parseFloat(data.offers.lowPrice));
        }
        return Promise.resolve(parseFloat(data.offers.price));
    }
    static async _getLazadaPrice(){
        return await this.page.evaluate(()=>{
            let price;
            if(price = document.querySelector("#module_product_price_1 > div > div > span"))
                return parseFloat(price.innerHTML.replace('$',''));
            return null;
        });
    }
}
module.exports = {
    PriceGetter,
    read
}
