//插件功能：加载echarts图表
//开发人员：姓名
define("newsQuest",function(require){
	return function(args){
		var def={
			content:'',//容器
			data:'',//加载数据
			callback:function(){} //回调函数
		};
		$.extend(def, args);
	

		//回调函数
		return def.callback();
	}
});