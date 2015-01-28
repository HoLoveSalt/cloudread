//插件功能：问答
//开发人员：姓名
define("newsQuest",['TEMP'], function(T) {
	
	var newsQuestHtmlSu ='{{#each su}}'
						+'	<div class="que-store">'
						+'		<div class="que-questionTitle">{{question}}<span class="que-questionTitle-logo"></span></div>'
						+'		<div class="que-breakLine"></div>'
						+'		<div class="que-answerBar">'
						+'			<p>回答</p>'
						+'			<p class="que-answerBar-answers">{{answer}}</p>'
						+'		</div>'
						+'	</div>'
						+'{{/each}}'
						+'{{#each wen}}'
						+'	<div class="que-store">'
						+'		<div class="que-questionTitle">{{question}}<span class="que-questionTitle-logo"></span></div>'
						+'		<div class="que-breakLine"></div>'
						+'		<div class="que-answerBar">'
						+'			<p>回答</p>'
						+'			{{#if url}}'
						+'				<a href="{{url}}" target="_blank"><p class="que-answerBar-answers-link">查看答案</p></a>'
						+'			{{else}}'
						+'				<a href="javascript:void(0)" target="_blank"><p class="que-answerBar-answers-link">暂无答案</p></a>'
						+'			{{/if}}'
						+'		</div>'
						+'	</div>'
						+'{{/each}}';
	T.set('newsQuestSu', newsQuestHtmlSu);
	return function(args){
		$(".m-newsQuest").html( T.get('newsQuestSu')(args.data.contentNewsQuest) );
		var def={
			content:'',//容器
			data: args.data.contentStore,//加载数据
			callback:function(){
			}   //回调函数
		};
		$.extend(def, args);
		//回调函数
		return def.callback();
	}
});

