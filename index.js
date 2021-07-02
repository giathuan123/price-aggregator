const { PriceGetter, read } = require('./priceGetter.js');
const reader = require('xlsx');
const our_laz_col = 'C';
const our_shop_col = 'D';
const FIRST_ROW = 2;
const LAST_ROW = 2;
const comp_cols = ['E', 'F', 'G'];
const lowest_price = 'H';
const perc_comp = 'I';

async function getPrice(price, getters){
  getters.forEach((getter)=>{
    getter.getPrice().then(p=>price.push(p)).catch((e)=>{
    });
  });
}
async function main(){
  const laz = await new PriceGetter('');
  const shopee = await new PriceGetter('');
  const comp1 = await new PriceGetter('');
  const comp2 = await new PriceGetter('');
  const comp3 = await new PriceGetter('');
  const getters = [laz, shopee, comp1, comp2, comp3];
  var workbook = reader.readFile('./Price check for Lazada.xlsx');

  var sheet = workbook.Sheets['Sheet1'];
  for(var i = FIRST_ROW; i <= LAST_ROW; i++){
    // GET DATA
    var url_list = [];
    url_list.push(sheet[our_laz_col + i].v);
    url_list.push(sheet[our_shop_col + i].v);
    comp_cols.forEach((val)=>{url_list.push(sheet[val+i].v);});
    console.log(url_list);
    laz.url = url_list[0];
    shopee.url = url_list[1];
    comp1.url = url_list[2];
    comp2.url = url_list[3];
    comp3.url = url_list[4];
    var price = [];
    await getPrice(price, getters);
    console.log(price);
  }
}


(async ()=>{
  await main();
  read.stdio.close();
})();
