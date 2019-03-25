var fs = require('fs');

//파일을 비동기식 IO로 읽어들입니다.
fs.readFile('./package.json','utf8',function(err,data){
   console.log(data); 
});

console.log('gggggggg');