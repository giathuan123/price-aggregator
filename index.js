const puppeteer = require('puppeteer')
const readline = require('readline').createInterface({
  input: process.stdin,
  ouput: process.stdout
})
async function wait(){
  readline.question('Close?', ()=>{
  })
  readline.close();
}
async function main(){
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://google.com');
  await browser.close();
}
main();