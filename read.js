const stdio = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

let prompt = function(question, callback){
    return new Promise(resolve=>{
        stdio.question(question, (answer)=>{
            typeof callback == "function" && callback(answer);
            resolve(stdio.pause());
    });
    })
}
module.exports = {
    prompt,
    stdio
}