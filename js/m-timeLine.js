//插件功能：加载echarts图表
//开发人员：姓名
define("timeLine",function(require){
	return function(args){
		var content = args.content;
			content.html('<div id="story-timeline" style="position:relative"></div>');

		require(['timeline'],function(){
			createStoryJS({
	            type:       'timeline',
	            width:      '100%',
	            height:     '720',
	            start_at_slide: 0,
			 	start_zoom_adjust:  8,
			 	lang:"zh-cn",
	            source:     null,
	            embed_id:   'story-timeline'
	        },args.data.contentTimeLine);
		});

	}
});