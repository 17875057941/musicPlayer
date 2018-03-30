const cheerio=require('cheerio');
const express=require('express');
const superagent=require('superagent');
const eventproxy=require('eventproxy');
const bodyParser=require('body-parser');
const app=express();
const url=[
	'http://music.163.com/api/playlist/detail?id=2111709944',
	'http://music.163.com/api/playlist/detail?id=2114870775',
	'http://music.163.com/api/playlist/detail?id=2072796628',
	'http://music.163.com/api/playlist/detail?id=453739824',
	'http://music.163.com/api/playlist/detail?id=905821744',

	'http://music.163.com/api/playlist/detail?id=2092313707',
	'http://music.163.com/api/playlist/detail?id=2108339599',
	'http://music.163.com/api/playlist/detail?id=2107922801',
	'http://music.163.com/api/playlist/detail?id=2106881647',
	'http://music.163.com/api/playlist/detail?id=2109442677',

	'http://music.163.com/api/playlist/detail?id=2105549217',
	'http://music.163.com/api/playlist/detail?id=2099302296',
	'http://music.163.com/api/playlist/detail?id=2099228567',
	'http://music.163.com/api/playlist/detail?id=2097548733',
	'http://music.163.com/api/playlist/detail?id=2100341581',

	'http://music.163.com/api/playlist/detail?id=2088799380',
	'http://music.163.com/api/playlist/detail?id=2089907261',
	'http://music.163.com/api/playlist/detail?id=2092484970',
	'http://music.163.com/api/playlist/detail?id=2093273437',
	'http://music.163.com/api/playlist/detail?id=2092474396'
]

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//解决跨域问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
var ep=new eventproxy();
app.get('/songList',function(req,res){
	ep.after('getData',url.length,function(data){
		res.send(data);
	})

    for(var i=0;i<url.length;i++){
		superagent.get(url[i])
			.end(function(err,res){
				ep.emit('getData',JSON.parse(res.text));
		})
	 }
})

var id;
app.post('/songLyric',function(req,res){
	//res.redirect();
	id=req.body.id;
})

app.get('/songLyric',function(req,res){
	superagent.get('http://music.163.com/api/song/lyric?os=pc&id='+id+'&lv=-1&kv=-1&tv=-1')
		.end(function(err,sres){
			res.send(sres.text);
		})
})

var index;
app.post('/List',function(req,res){
	index=req.body.dataId;
	console.log(index);
})

app.get('/SingleList',function(req,res){
	// superagent.get('http://localhost:8000/List')
	// 	.end(function(err,sres){
	// 		res.send(sres);
	// 		console.log('get数据'+sres);
	// })
	superagent.get('http://music.163.com/api/playlist/detail?id='+index)
		.end(function(err,sres){
			res.send(sres.text);
	})
	// res.send(index);
})
app.listen(8000);
