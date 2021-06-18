const stdio = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
function prompt(question, callback){
    return new Promise(resolve=>{
        stdio.question(question, (answer)=>{
            typeof callbacl == "function" && callback();
            resolve(stdio.pause());
        });
    
    })
}
(async ()=>{
    await prompt('something');
    await prompt('somehting else');
    console.log('End of wait');
})();