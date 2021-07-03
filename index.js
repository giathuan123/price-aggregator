const { PriceGetter, read } = require('./priceGetter.js');
const reader = require('xlsx');
const our_laz_col = 'C';
const our_shop_col = 'D';
const FIRST_ROW = 2;
const LAST_ROW = 2;
const comp_cols = ['E', 'F', 'G'];
const lowest_price = 'H';
const perc_comp = 'I';

async function getPrice(getters){
  return getters.map((getter)=>getter.getPrice().catch((e)=>console.log(e)));
}
async function createGetter(number){
  var getters = [];
  for(var i = 0; i < number; i++){
    getters.push(await new PriceGetter(''));
  }
  return getters;
}
async function main(){
  return new Promise( async (res, rej) =>{
  const getters = await createGetter(5);
  var workbook = reader.readFile('./Price check for Lazada.xlsx');
  var sheet = workbook.Sheets['Sheet1'];
  for(var i = FIRST_ROW; i <= LAST_ROW; i++){
    // GET DATA
    var url_list = [];
    url_list.push(sheet[our_laz_col + i].v);
    url_list.push(sheet[our_shop_col + i].v);
    comp_cols.forEach((val)=>{url_list.push(sheet[val+i].v);});
    getters[0].url = url_list[0];
    getters[1].url = url_list[1];
    getters[2].url = url_list[2];
    getters[3].url = url_list[3];
    getters[4].url = url_list[4];
  }
    getPrice(getters).then((price)=>res(price));
  });
}


(async ()=>{
  await main();
  await read.prompt('');
  await PriceGetter._browser.close();
  read.stdio.close();
})();
