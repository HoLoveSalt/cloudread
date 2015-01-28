//插件功能：加载echarts图表
//开发人员：姓名
define("attr",['TEMP'], function(T) {
	var attrhtml='{{#each contentAttr}}'+
		'{{#if url}}'+
		'<a href="{{url}}" target="_blank" class="m-attr-box {{typeClass}}">'+
		'	<strong>{{title}}</strong>'+
		// '	<em><span class="iconfont">{{{icon}}}</span>{{typeName}}</em>'+
		'	<em>{{typeName}}</em>'+
		'</a>'+
		'{{else}}'+
		'<span class="m-attr-box {{typeClass}}">'+
		'	<strong>{{title}}</strong>'+
		// '	<em><span class="iconfont">{{{icon}}}</span>{{typeName}}</em>'+
		'	<em>{{typeName}}</em>'+
		'</span>'+
		'{{/if}}'+
		'{{/each}}'+
		'<div class="clear"></div>';
	T.set('attr', attrhtml);
	
	return function(args){
		var def={
			content:'',//容器
			data:'',//加载数据
			callback:function(){} //回调函数
		};
		$.extend(def, args);
		
		$.each(def.data.contentAttr,function(i,data){
 			switch (data.typeId){
				case '1':
					data.icon="&#xe611;";//企业
					data.typeClass="m-attr-i-qiye";
				break;
				case '2':
					data.icon="&#xe60d;";//人物
					data.typeClass="m-attr-i-renwu";
				break;
				case '3':
					data.icon="&#xe60b;";//地点
					data.typeClass="m-attr-i-didian";
				break;
				case '4':
					data.icon="&#xe60f;";//机构
					data.typeClass="m-attr-i-jigou";
				break;
				case '5':
					data.icon="&#xe60c;";//产品
					data.typeClass="m-attr-i-chanpin";
				break;
				case '6':
					data.icon="&#xe610;";//名词
					data.typeClass="m-attr-i-mingci";
				break;
				case '7':
					data.icon="&#xe613;";//景点
					data.typeClass="m-attr-i-jingdian";
				break;
				default:
				data.icon="&#xe610;";
				data.typeClass="m-attr-i-mingci";
			}
		})
		def.content.html(T.get('attr')(def.data));
		//回调函数
		return def.callback();
	}
});