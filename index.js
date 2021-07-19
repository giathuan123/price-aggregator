const { PriceGetter, read } = require('./priceGetter.js');
const reader = require('xlsx');
const FIRST_ROW = 18;
const LAST_ROW = 18;
const comp_cols = ['G', 'H', 'I'];
const sale_price_col = 'C';
const filename = './Competitor Price Check_updated.xlsx'

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
  return new Promise(async (res, rej) =>{
  try{
    const getters = await createGetter(3);
    var workbook = reader.readFile(filename);
    var sheet = workbook.Sheets['HP'];
    for(var i = FIRST_ROW; i <= LAST_ROW; i++){
      var url_list = [];
      comp_cols.forEach((val)=>{
        const value = sheet[val+i] ? sheet[val+i].v: null;    
        url_list.push(value);
      });
      getters[0].url = url_list[0];
      getters[1].url = url_list[1];
      getters[2].url = url_list[2];
    }
    const a = await getPrice(getters);
    console.log(a);
    const price = await Promise.all(a);
    console.log(price)
    res(price);
  } catch(e){
    rej(e);
  }
});
}


(async ()=>{
  await main();
  read.stdio.close();
})();
