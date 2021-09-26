const readline = require('readline');

const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout
});

function cin(s){
  return new Promise((res)=>{
    input.question(s,(data)=>{
     res(data); 
    });
  });
  
}

module.exports = {
  cin: cin,
  input: input
}
