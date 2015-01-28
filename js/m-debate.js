//插件功能：加载echarts图表
//开发人员：姓名
define("debate",['TEMP'], function(T) {

	var debatehtml='<a href="http://forum.home.news.cn/debate/detail_rank.do?id={{id}}" target="_blank" class="m-debate-content">'+
	'<p class="m-debate-title"><strong>[辩论]</strong>{{title}}</p>'+
	'<p class="m-debate-main">'+
	'	<strong class="first"><b>支持 {{negativeCount}}</b><span>{{negative}}</span></strong>'+
	'	<strong class="last"><b>支持 {{positiveCount}}</b><span>{{positive}}</span></strong>'+
	'</p>'+
	'<p class="m-debate-info"><span>日期：{{postTime}}</span><span>发起者：{{postUserName}}</span></p>'+
	'</a>';
	T.set('debate', debatehtml);

	return function(args){
		var def={
			content:'',//容器
			data:'',//加载数据
			callback:function(){} //回调函数
		};
		$.extend(def, args);
	
		$.ajax({
			url:'http://xuan.news.cn/api/debate/getDebateP.do',
			data:{'id':def.data.contentDebate.debateId},
			dataType:"jsonp",
			success:function(res){
				def.content.html(T.get('debate')(res.data));
			}
		})		

		//回调函数
		return def.callback();
	}
});