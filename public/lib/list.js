//obj对象，index每个歌单的每首歌曲=>result.tracks[i]
function createTags(obj,index){
	var $Li=$('<li></li>').appendTo('.songList_list');
	$('<div>')
	.addClass('songList_name')
	.appendTo($Li);

	$('<div>')
	.addClass('songList_author')
	.appendTo($Li);

	totalTime=String(obj.result.tracks[index].duration).substring(0,String(obj.result.tracks[index].duration).length-3);//获取一首歌的总时间
	var time='0'+Math.floor(totalTime/60)+":"+Math.floor(totalTime%60);
	$('<div>'+time+'</div>')//每首歌的时间
	.addClass('songList_time')
	.appendTo($Li);

	$('.songList_img img')
	.attr('src',obj.result.coverImgUrl);

	$('.songList_list .songList_name')
	.eq(index)
	.text(obj.result.tracks[index].name);

	$('.songList_list .songList_author')
	.eq(index)
	.text(obj.result.tracks[index].artists[0].name);
}

function getListData(){
	var data;
// 	var getList= $.ajax({//获取歌单数据
// 		url:'http://localhost:8000/songList',
// 		type:'GET',
// 		dataType:"json"
// 		success:function(json){
// 		    data=json;//歌单id
// 		    console.log('json'+json);
// 	}
// })
	// var getListIndex=$.ajax({//根据歌单id获取某个歌单
	// 	url:'http://localhost:8000/SingleList',
	// 	type:'GET',
	// 	dataType:'json',
	// 	success:function(result){
	// 		//listIndex=result;
	// 		console.log('get成功'+result);
	// 	},
	// 	error:function(err){
	// 		console.log(err);
	// 	}
	// })

	var getListIndex=$.ajax({//获取歌单列表
		url:'http://localhost:8000/SingleList',
		type:'get',
		success:function(json){
			data=json;
			console.log(data);
		}
	});
	$.when(getListIndex)
		.done(function(){	
			var index;
			for(index=0;index<=data.result.tracks.length-1;index++)
			{//点击歌单，跳转到songplay页面，改变i
				createTags(data,index);
			}
			NormalPlay(data);
			console.log("获取歌单数据成功");
	});
}

//播放或者暂停
function PlayOrNot(){
	$('#play-btn').click(function(){
		if($('audio')[0].paused){//如果暂停
			$('audio')[0].play();
			$('#play-btn').removeClass('fa-play');
			$('#play-btn').addClass('fa-pause');
		}else{
			$('audio')[0].pause();
			$('#play-btn').removeClass('fa-pause');
			$('#play-btn').addClass('fa-play');
		}
	});
}
//歌曲相关操作
var Song={

	id:'',
	SongAction:function(obj,index){
		// var id=obj.result.tracks[index].id;
		var url='http://music.163.com/song/media/outer/url?id='+this.id+'.mp3';//播放对应歌曲
		$('audio').attr('src',url);
		$('audio')[0].play();

		$('.songList_img img').attr('src',obj.result.tracks[index].album.blurPicUrl);//显示对应歌曲的图片

		$('.player_music_info').text(obj.result.tracks[index].name+'-'+obj.result.tracks[index].artists[0].name);

		$('.songList_lyric p').eq(0).text("歌曲名："+obj.result.tracks[index].name);
		$('.songList_lyric p').eq(1).text("歌手："+obj.result.tracks[index].artists[0].name);
		totalTime=String(obj.result.tracks[index].duration).substring(0,String(obj.result.tracks[index].duration).length-3);//获取一首歌的总时间
		time='0'+Math.floor(totalTime/60)+":"+Math.floor(totalTime%60);
		$('.player_music_time').text(time);
	},

	getLrcById:function(obj,index){
		// var id=obj.result.tracks[index].id;
		var lyricId={
			"id":this.id
		}
		$.when(lyricAjax(lyricId),getLyric())
			.done(console.log('操作成功'));
	}
	
}
//var totalTime;
function NormalPlay(obj){//正常播放
	var time,index;
	$('.songList_list .songList_name').click(function(){//点击播放
	    index=$(this).parent().index();//找到对应歌曲的索引 即li标签所在位置
	    console.log(index);
	    Song.id=obj.result.tracks[index].id;
	    Song.SongAction(obj,index);
	    Song.getLrcById(obj,index);
	})

	$('#backward').click(function(){//上一首
		index--;//
		if(index<0){
			index=obj.result.tracks.length-1;
		}
		Song.id=obj.result.tracks[index].id;
	    Song.SongAction(obj,index);
	    Song.getLrcById(obj,index);
	})

	$('#forward').click(function(){//下一首
		index++;//
		if(index>obj.result.tracks.length-1){
			index=0;
		}
		Song.id=obj.result.tracks[index].id;
	    Song.SongAction(obj,index);
	    Song.getLrcById(obj,index);
	})

//单曲循环，顺序，随机三种播放模式
	var num=0;//click times
	$('#Play_Mode').click(function(){//默认随机
		//console.log('mode');
		num++;
		if(num==1){//单曲
			$('#Play_Mode').removeClass('fa-random');
			$('#Play_Mode').addClass('fa-refresh').attr('title','单曲');

			$('audio')[0].onended=function(){
				Song.id=obj.result.tracks[index].id;
	   			Song.SongAction(obj,index);
			}
		}else if(num==2){//顺序
			$('#Play_Mode').removeClass('fa-refresh');
			$('#Play_Mode').addClass('fa-retweet').attr('title','顺序');

			$('audio')[0].onended=function(){
				//播放完
				index++;//自动加一
				Song.id=obj.result.tracks[index].id;
	    		Song.SongAction(obj,index);
			}
		}else{
			num=0;//随机
			$('#Play_Mode').removeClass('fa-retweet');
			$('#Play_Mode').addClass('fa-random').attr('title','随机');
			index=parseInt(Math.random()*(obj.result.tracks.length));
			Song.id=obj.result.tracks[index].id;
	    	Song.SongAction(obj,index);
		}
	})

	//歌曲进度条vs歌词显示
	$('audio')[0].ontimeupdate=function(){
		var percent=($('audio')[0].currentTime/$('audio')[0].duration)*100;
		$('.dot').css('left',percent+'%');//进度条
		$('.dot-bar').css('width',percent+'%');
		if(parseInt($('audio')[0].currentTime%60)<10){
			var updatetime='0'+Math.floor($('audio')[0].currentTime/60)+':'+'0'+Math.floor($('audio')[0].currentTime%60);
		}else{
			var updatetime='0'+Math.floor($('audio')[0].currentTime/60)+':'+Math.floor($('audio')[0].currentTime%60);
		}
		var time='0'+Math.floor(totalTime/60)+":"+Math.floor(totalTime%60);
		//var updatetime='0'+Math.floor($('audio')[0].currentTime/60)+':'+Math.floor($('audio')[0].currentTime%60);
		$('.player_music_time').text(time+'/'+updatetime);
		//获取对应的歌词并显示
	}
}
//音量控制,控制音量滚动条
 	$('.volume-dot').bind('mousedown',start);
    function start(e){
        //console.log(e.which);
        if(e.which==1){
           $('.volume-bgbar').bind('mousemove',move);
           $('.volume-bgbar').bind('mouseup',stop);
           $('.volume-bgbar').bind('mouseleave',stop);
        }else{
            $('.volume-bgbar').unbind('mousemove',move);
        }
    }
    function move(es){
        var X=es.pageX-$(this).offset().left;//
        $('.volume-dot').css('left',X+40);
        var percent=X/parseInt($('.volume-bgbar').css('width'));
        $('audio')[0].volume=percent;
    }
    function stop(){
        $('.volume-bgbar').unbind('mousemove',move);
    }


var lyricAjax=function(lyricId){//传递id
	$.ajax({//向node发送id
		url:'http://localhost:8000/songLyric',
		type:'POST',
		data:lyricId,
		success:function(){
			console.log('lyricId'+lyricId);
		}
	})
}

var getLyric=function(){//从后台获取歌词
	$.ajax({
		url:'http://localhost:8000/songLyric',
		type:'GET',
		success:function(lyric){
			//歌词解析
			var lines=lyric.lrc.lyric;//将歌词文本分成一行一行
			var parsed=parseLyric(lines);//歌词解析
			roll(parsed);//歌词同步

		}	
	})
}

function parseLyric(lrc) {//歌词解析,just what i want
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for(var i=0;i<lyrics.length;i++){
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if(!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg,'');
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
        }
    }
    return lrcObj;
}
//歌词滚动
function roll(parsed){
	$('audio')[0].ontimeupdate=function(){
		var percent=($('audio')[0].currentTime/$('audio')[0].duration)*100;
		$('.dot').css('left',percent+'%');//进度条
		$('.dot-bar').css('width',percent+'%');
		if(parseInt($('audio')[0].currentTime%60)<10){
			var updatetime='0'+Math.floor($('audio')[0].currentTime/60)+':'+'0'+Math.floor($('audio')[0].currentTime%60);
		}else{
			var updatetime='0'+Math.floor($('audio')[0].currentTime/60)+':'+Math.floor($('audio')[0].currentTime%60);
		}
		var time='0'+Math.floor(totalTime/60)+":"+Math.floor(totalTime%60);
		
		$('.player_music_time').text(time+'/'+updatetime);

		//获取对应的歌词并显示
		for(var i in parsed){
			if(this.currentTime>i){
				$('.songList_lyric p').eq(2).text(parsed[i]).css('color','red');
			}
		}
	}
}
window.onload=function(){
	getListData();
	PlayOrNot();
}