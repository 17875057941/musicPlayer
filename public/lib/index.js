//主页面部分
$.ajax({//获取歌单列表
		url:'http://localhost:8000/songList',
		type:'get',
		success:function(data){
			console.log(data);
			for(var i in data){
				$('<li>').appendTo('.menu ul');
				var $img=$('<img>',{
				src:data[i].result.coverImgUrl,

				title:'coverImg',
				click:function(){//点击图片跳转到相应的歌单播放列表
					//window.location.href='../views/songplay.html';
					//var listId={$index:$('.menu img').index(this)}
					var listId=$('.menu img').index(this);
					var dataId={dataId:data[listId].result.id};
					//console.log(data[listId]);
					window.open('../views/songplay.html');
					$.post('http://localhost:8000/List',dataId,function(){//传上路由
						console.log('传值成功');
					})//get传值
				}
			});
			$('.menu ul li').eq(i).append($img);
		}
	}
})


