const { priceGetter } = require('./priceGetter.js');
const read = require('./read.js');

async function main(){
  const pg = await new priceGetter('https://shopee.sg/Canon-PIXMA-E560-E560R-Advanced-Wireless-All-In-One-with-Auto-Duplex-Colour-Printer-Color-Inkjet-Printer-Color-Printer-i.28714108.2133533289');
  const firstPrice = await pg.getPrice();
  console.log("This is the first price" + firstPrice);
  await read.prompt("WAITING");
  await priceGetter._browser.close();
}
(async ()=>{
  await main();
  read.stdio.close();
})();