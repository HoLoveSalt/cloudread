/**
 * 评论加载
 * @author shiyangyang
 */
define("discuss",['TEMP','template-init','requestAFrame','tabs','alerts'],function(T,TI,R){

	var loginCheck = '/cloudc/loadUser.xhtm?loginCheck=true',
		adComment = '/a/adComment.do',
		commAll = 'http://comment.home.news.cn/a/newsCommAll.do',
		commHot = 'http://comment.home.news.cn/a/commentsHot.do',
		discuss = 
				'<div class="discuss-holder"><h2>评论 <span class="discuss-num">(0)</span></h2>'+
				'<div class="discuss-handle">'+
				'	<textarea id="discuss-area" placeholder="评论写在这里"></textarea>'+
				'	<div class="discuss-submit">'+
				'		<a href="javascript:void(0);">发表评论</a>'+
				'		<span>剩余 <em id="discuss-area-chars">140</em> 字</span>'+
				'	</div>'+
				'</div>'+
				'<div id="discuss-tabs">'+
				'	<ul class="clearfix">'+
				'		<li><a href="#discuss-tabs-all">最新评论</a></li>'+
				'		<li><a href="#discuss-tabs-hot">精彩评论</a></li>'+
				'	</ul>'+
				'	<div id="discuss-tabs-all">'+
				'		<div class="tab-inner">'+
				'		</div>'+
				'	</div>'+
				'	<div id="discuss-tabs-hot">'+
				'		<div class="tab-inner">'+
				'		</div>'+
				'	</div>'+
				'</div></div>',
		comment =
				'{{#each contentAll}}'+
				'<dl class="clearfix">'+
				'	<dt>'+
				'		<img class="userImg" src="{{userImgUrl}}" alt="xiaojingc">'+
				'		<span class="nickName">{{nickName}}</span>: '+
				'		<span class="time-trace" data-time="{{commentTime}}"></span> '+
				'	</dt>'+
				'	<dd>{{{content}}}</dd>'+
				'</dl>'+
				'{{/each}}'+
				'{{#if more}}'+
				'<p style="text-align:right;"><a href="http://comment.home.news.cn/nc/{{newsId}}.html" target="_blank">'+
				'	后面还有 <em class="list_more_count">{{more}}</em> 条评论&gt;&gt;'+
				'</a>{{/if}}</p>',
		timeTrace = function(time){
			var d = new Date().getTime() / 1000, temp;
			d -= time / 1000;
			if(d < 0){
				return '刚刚';
			}else if( temp = Math.floor( d / (60*60*24*30) ) ){
				return temp + '个月前'
			}else if( temp = Math.floor( d / (60*60*24) ) ){
				return temp + '天前'
			}else if( temp = Math.floor( d / (60*60) ) ){
				return temp + '小时前'
			}else if( temp = Math.floor( d / (60) ) ){
				return temp + '分钟前'
			}else{
				return Math.floor( d / 1000 ) + '秒前'
			}
		};




	$(document).on('keyup blur','#discuss-area',function(){
		var l = 140 - this.value.length;
		if( l < 0 ){
			alert( '评论不得超过140字！' );
			$(this).focus();
		}
		$('#discuss-area-chars').html( l )
	});


	return function(args){
		var content = args.content,
			newsId  = args.data.fileUuid,
			tempAll = $('<script type="template">'+comment+'</script>'),
			tempHot = $('<script type="template">'+comment+'</script>');
		
		content.html( discuss );
		
		$('#discuss-tabs').tabs();

		R.addTimeout('time-trace',function(){
			$('.time-trace',content).each(function(){
				var time = $(this).data('time');
				$(this).html( '('+timeTrace(time)+')' );
			});
		},2000);
		/**
		 * 登录验证, 评论提交
		 */
		$('.discuss-submit a').on('click',function(){	
			if( !$.trim( $('#discuss-area').val() ) ){
				jAlert('评论内容不能为空!');
				return false;
			}
			$.alerts.returnButton = '关闭';
			$.ajax({
				url: loginCheck,
				dataType: 'json',
				success:function(res){
					if(res.code == 404){
						require(['LoginInTime'],function(LoginInTime){
							new LoginInTime(); 
						});
					}else{
						$.ajax({
							url: adComment,
							type:'post',
							data:{
								newsId: newsId,
								parentId: '',
								shareToWb: 0,
								sourceId: 3,
								type: 0,
								rurl: '',
								content: $('#discuss-area').val()
							},
							dataType:'json',
							success:function(json){
								jTip(json.description,3000);
								$('#discuss-area').val("");
							},
							error:function(){
								jTip('服务端异常!')
							}
						});
					}
				}
			});
		});


		var t_all = {
			tmpl: tempAll,
			sourceUrl: commAll,
			target: '#discuss-tabs-all .tab-inner',
			sourceData:function(){
				return {
					newsId : newsId
				}
			},
			dataType:'jsonp',
			begin:function(o){
				o.source.more = o.source.totalRows-o.source.contentAll.length;
				o.source.newsId = newsId;
			},
			callback:function(o){
				var discuss_num = o.source.totalRows | 0;
				$( '.discuss-num', content ).html( '('+discuss_num+')' );
			}
		}, t_hot = {
			tmpl: tempHot,
			sourceUrl: commHot,
			target: '#discuss-tabs-hot .tab-inner',
			sourceData:function(){
				return {
					newsId : newsId
				}
			},
			begin:function(o){
				o.source.more = o.source.totalRows-o.source.contentAll.length;
			},
			dataType:'jsonp'
		};

		TI.init( t_all );

		$('[href="#discuss-tabs-hot"]',content).one('click',function(){
			TI.init( t_hot )
		});

	}
});