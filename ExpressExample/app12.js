//Express 기본 모듈 불러오기
var express = require('express');
var http = require('http');
var path=require('path');

//Express의 미들웨어 불러오기
var bodyParser = require('body-parser');
var static = require('serve-static');

//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');
//쿠키 모듈 사용
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

//익스프레스 객체 생성
var app = express();

//기본 속성 설정
app.set('port',process.env.PORT || 3000);

//body-parser를 사용해 파싱
app.use(bodyParser.urlencoded({extended:false}));

//body-parser를 사용해 json파싱
app.use(bodyParser.json());

app.use(static(path.join(__dirname,'/')));

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


/*//미들웨어에서 파라미터확인
app.use(function(req,res,next){
   console.log('첫 번째 미들웨어에서 요청을 처리함.') ;
    
   var paramId = req.body.id || req.query.id;
   var paramPassword = req.body.password || req.query.password;
    
   res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
   res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
   res.write('<div><p>Param id :' + paramId+'</p></div>');
   res.write('<div><p>Param password :' + paramPassword + '</p></div>');
   res.end();
});*/

var router = express.Router();

router.route('/process/login').post(function(req,res){
   console.log('/process/login:name 처리함.') ;

   var paramName = req.params.name;
   var paramId = req.body.id || req.query.id;
   var paramPassword = req.body.password || req.query.password;
    
   if(req.session.user){
       //이미 로그인된 상태
       console.log('이미 로그인되어 상품페이지로 이동합니다.');
       res.redirect('/public/product.html');
   }else{
       //세션 저장
       req.session.user={
           id:paramId,
           name:'소녀시대',
           authorized:true
       };
   }
   res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
   res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
   res.write('<div><p>Param id :' + paramId+'</p></div>');
   res.write('<div><p>Param password :' + paramPassword + '</p></div>');
   res.write("<br><br><a href='/process/product'>상품페이지로 이동하기</a>");
   res.end();
});

router.route('/process/showCookie').get(function(req,res){
   console.log('/process/showCookie 호출됨');
   res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function(req,res){
   console.log('/process/setUserCookie 호출됨.') ;
    
   //쿠키설정
    
   res.cookie('user',{
       id : 'mike',
       name : '소녀시대',
       authorized:true
   });
   //redirect로 응답
   res.redirect('/process/showCookie');
});

router.route('/process/product').get(function(req,res){
   console.log('/process/product 호출됨..');
    
   if(req.session.user){
       res.redirect('/public/product.html');
   }else{
       res.redirect('/public/login2.html');
   }
});

router.route('/process/logout').get(function(req,res){
   console.log('/process/logout 호출됨') ;
    
   if(req.session.user){
       //로그인 된 상태
       console.log('로그아웃합니다.');
       
       req.session.destroy(function(err){
          if(err){throw err;}
           
          console.log('세션을 삭제하고 로그아웃되었습니다.');
          res.redirect('/public/login2.html');
       });
   }else{
       //로그인 안된 상태
       console.log('아직 로그인되어있지 않습니다.');
       res.redirect('/public/login2.html');
   }
});


app.use('/',router);


var errorHandler = expressErrorHandler({
    static:{
        '404' : './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);



http.createServer(app).listen(3000,function(){
    console.log('3000번 포트에서 서버가 시작됨');
});