const { PriceGetter } = require("./priceGetter.js");
const { cin, input } = require("./read.js");
const reader = require('xlsx');

const  new_wb = reader.utils.book_new();
const r_decode = reader.utils.decode_col;
const r_encode = reader.utils.encode_col;

async function getPrice(sheet, getters, s_col, NEW_WB_NAME, NO_GETTERS){
  var i = 2;
  while(sheet['A'+i] != undefined){
    console.log('Getting price in row',i)
    for(var j = 0, col=s_col;j<NO_GETTERS;j++,col++){
      getters[j].url = (sheet[r_encode(col)+i] ? sheet[r_encode(col)+i].v: null); 
    }
    if(i % 10 == 0) reader.writeFile(new_wb, NEW_WB_NAME);
    const prices = await Promise.all(getters.map(getter=>getter.getPrice().catch(e=>console.log(getter.url, e))));
    for(var j = 0, col=s_col;j<NO_GETTERS;j++,col++){
      if(sheet[r_encode(col)+i]) sheet[r_encode(col)+i].v = prices[j];
    }
    i++;
  }
  reader.writeFile(new_wb, NEW_WB_NAME);
  return Promise.resolve("Done");
}
async function createGetter(number){
  var getters = [];
  for(var i = 0; i < number; i++){
    getters.push(await new PriceGetter());
  }
  return getters;
}

function data(sheet, starting_col, ending_col, sheetName){
  this.sheet = sheet;
  this.starting_col = starting_col;
  this.ending_col = ending_col;
  this.sheetName = sheetName;
} 
async function main(){
  return new Promise(async (res, rej) =>{
  try{
    const filename = await cin("Please enter the filename: ");
    const SHEET = await cin("Please enter the sheetname: ");
    const NEW_WB_NAME = await cin("Please enter destination filename: ");
    sheetSplit = SHEET.split(' ');
    dataArray = [];
    var workbook = reader.readFile(filename);
    console.log(sheetSplit);
    for(const name of sheetSplit){
      STARTING_COL = await cin("Please enter staring col for "+ name + ": ");
      ENDING_COL = await cin("Please enter ending col for "+ name + ": ");
      dataArray.push(new data(workbook.Sheets[name], r_decode(STARTING_COL), r_decode(ENDING_COL), name));
    }
    getters = await createGetter(20);
    for(const data of dataArray){
      console.log("SHEET", data.sheetName);
      console.log("Staring from", r_encode(data.starting_col), "to", r_encode(data.ending_col));
      no_col = data.ending_col - data.starting_col + 1;
      reader.utils.book_append_sheet(new_wb, data.sheet, data.sheetName + "price" );
      await getPrice(data.sheet, getters, data.starting_col, NEW_WB_NAME, no_col);
    }
    PriceGetter._browser.close(); 
    input.close();
    res("Done")
  } catch(e){
    rej(e);
  }
});
}

main();
// (async ()=>{
//   try{
//   await main();
//   console.log("Ending...");
//   input.close();
//   }catch(e){
//     console.log(e);
//   }
// })();
