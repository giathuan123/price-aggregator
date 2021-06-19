const priceGetter = require('./priceGetter.js');
const read = require('./read.js');

async function main(){
  const pg = await new priceGetter.priceGetter('https://google.com');
  await pg.getPrice();

}
(async ()=>{
  await main();
  await priceGetter.browser.close();
  read.stdio.close();
})();