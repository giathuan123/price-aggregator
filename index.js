const { priceGetter } = require('./priceGetter.js');
const read = require('./read.js');

async function main(){
  const pg = await new priceGetter('https://www.lazada.sg/products/local-warranty-canon-pixma-e560-e560r-advanced-wireless-all-in-one-with-auto-duplex-printing-colour-inkjet-printer-e-560r-e-560-e-560-colour-printer-color-inkjet-printer-color-printer-ink-tank-printer-inktank-printer-i309128437-s560548854.html?spm=a2o42.searchlist.list.4.795d7db226LrCG&search=1&freeshipping=1');
  const firstPrice = await pg.getPrice();
  console.log(firstPrice);
  await read.prompt("WAITING");
  await priceGetter._browser.close();
}
(async ()=>{
  await main();
  read.stdio.close();
})();