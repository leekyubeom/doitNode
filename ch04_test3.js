process.on('tick',function(count){
   console.log('tick 이벤트 발생함 %d' , count) 
});

setTimeout(function(){
   
    process.emit('tick','2');
},2000);