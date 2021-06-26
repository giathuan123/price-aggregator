const { PriceGetter, read } = require('./priceGetter.js');
const LAZ_URL = "https://www.lazada.sg/products/local-warranty-canon-pixma-e560-e560r-advanced-wireless-all-in-one-with-auto-duplex-printing-colour-inkjet-printer-e-560r-e-560-e-560-colour-printer-color-inkjet-printer-color-printer-ink-tank-printer-inktank-printer-i309128437-s560548854.html?spm=a2o42.searchlist.list.4.795d7db226LrCG&search=1&freeshipping=1";
const SHOP_URL = "https://shopee.sg/Canon-PIXMA-E560-E560R-Advanced-Wireless-All-In-One-with-Auto-Duplex-Colour-Printer-Color-Inkjet-Printer-Color-Printer-i.28714108.2133533289";
async function main(){
  const pg = await new PriceGetter(SHOP_URL);
  const laz = await new PriceGetter(LAZ_URL);
  await laz.getPrice();
  await pg.getPrice();
  console.log("Lazprice: ", laz.price);
  console.log("Shopprice: ", pg.price);
  await PriceGetter._browser.close();
}


(async ()=>{
  await main();
  read.stdio.close();
})();
