const reader = require('xlsx');
var workbook = reader.readFile('./Price check for Lazada.xlsx');
const our_laz_col = 'C';
const our_shop_col = 'D';
const FIRST_ROW = 2;
const LAST_ROW = 2;
const comp_cols = ['E', 'F', 'G'];
const lowest_price = 'H';
const perc_comp = 'I';

var sheetsname = workbook.Sheets['Sheet1'];
console.log(sheetsname);
for(var i = FIRST_ROW; i <= LAST_ROW; i++){
}

