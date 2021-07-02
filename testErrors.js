async function testing(){return new Promise((res, rej)=>{
  console.log(this.huh);
  if(this.huh) res('huh');
  else rej('rej');
})};
const testHuh = {huh: true};
const testHuh2 = {huh: false};
(async ()=>{
  try{
    test = testing.bind(testHuh2);
    await test();
  }catch(e){
    console.log('Erryor');
  }
})();
