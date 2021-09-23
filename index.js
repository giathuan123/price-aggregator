const { PriceGetter } = require('./priceGetter.js');
const { cin } = require('./read.js')
const path = require('path');
const reader = require('xlsx');
const NO_GETTERS = 18;
const  new_wb = reader.utils.book_new();
async function getPrice(sheet, getters){
  var i = 2;
  while(sheet['A'+i] != undefined){
    console.log('Running Line ',i)
    for(var j = 0, col=3;j<18;j++,col++){
      getters[j].url = (sheet[reader.utils.encode_col(col)+i] ? sheet[reader.utils.encode_col(col)+i].v: null); 
    }
    if(i % 10 == 0) reader.writeFile(new_wb, 'new sheets2.xlsx');
    const prices = await Promise.all(getters.map(getter=>getter.getPrice().catch(e=>console.log(e))));
    for(var j = 0, col=3;j<18;j++,col++){
      if(sheet[reader.utils.encode_col(col)+i]) sheet[reader.utils.encode_col(col)+i].v = prices[j];
    }
    i++;
  }
  reader.writeFile(new_wb, 'new sheets2.xlsx');
  return Promise.resolve("Done");
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
    
    const filename = await cin("Please enter the filename (dont include .xslx extension): ");
    const SHEET = await cin("Please enter the sheetname: ");
    
    getters = await createGetter(NO_GETTERS);
    var workbook = reader.readFile(filename);
    sheetName = workbook.SheetNames;
    new_sheets = [ workbook.Sheets[SHEET] ];
    reader.utils.book_append_sheet(new_wb,new_sheets[0], SHEET + 'price')
    for( const sheet of new_sheets){
        const done = await getPrice(sheet, getters);
    }
    console.log("Ending");
    res('ended');
  } catch(e){
    rej(e);
  }
});
}


(async ()=>{
  await main();
})();
