/**
 * 评论加载
 * @author shiyangyang
 */
define("discuss",['TEMP','template-init','requestAFrame','tabs','alerts'],function(T,TI,R){

	var loginCheck = '/cloudc/loadUser.xhtm?loginCheck=true',
		adComment = '/a/adComment.do',
		commAll = 'http://comment.home.news.cn/a/newsCommAll.do',
		commHot = 'http://comment.home.news.cn/a/commentsHot.do',
		emoticon='/cloudnews/'+location.href.replace(/[\s\S]+#/,"")+'_emoticon.html?t='+new Date().getTime(),
		hiteMoticon ='http://comment.home.news.cn/a/emoUp?newsId='+'{{newsId}}'+'&emoId='+'{{emoId}}'+'&typeId='+'{{typeId}}',
		moticonStatus ='http://comment.home.news.cn/a/emoList?newsId='+'{{newsId}}',
		discuss = 
				'<div class="discuss-holder">'+
				'<div class="xuan_news_face">'+
				'</div>'+
				'<h2>评论 <span class="discuss-num">(0)</span></h2>'+
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
		emoticonHtml =
				'<p class="emoticontitle">看完新闻的心情如何?</p>'+
				'	<table>'+
				'		<tbody>'+
				'		<tr>'+
				'{{#each data.itemList}}'+
				'			<td>'+
				'				<a class="btn_face" data-emoid="{{id}}" title="{{emoticonTagName}}" data-typeid="{{emoticonTagId}}" data-emotagname="{{emoticonTagName}}">'+
				'					<img class="face_img" src="{{url}}">'+
				'					<img class="face_grayImg hide" src="{{grayUrl}}">'+
				'					<span class="plus_one"></span>'+
				'					<span class="face_dec">{{name}}</span></a>'+
				'				</a>'+
				'				<div class="face_num">[0]</div>'+
				'			</td>'+
				'{{/each}}'+
				'		</tr>'+
				'		</tbody>'+
				'	</table>',
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
			tempHot = $('<script type="template">'+comment+'</script>'),
			tempemoticon = $('<script type="template">'+emoticonHtml+'</script>');
		
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

		$.ajax({
			url:emoticon,
			dataType:"json",
			success:function(data){
				if(data.success){
					var moticonSource = tempemoticon.html();
					var moticonTemplate = Handlebars.compile(moticonSource);
					$('.xuan_news_face').append(moticonTemplate(data));
					$(".xuan_news_face").next("h2").remove();
					$(".xuan_news_face").after('<p class="emoticontitle">'+'再说点啥吧?'+'</p>');
					$.ajax({
						url:moticonStatus.replace('{{newsId}}',newsId),
						dataType:"jsonp",
						success:function(data){
							$(".xuan_news_face a").each(function(){
								if(data.content.list){
									for(var i = 0; i < data.content.list.length; i++){
										if( data.content.list[i].id==$(this).data("emoid")){
											$(this).next(".face_num").html("["+data.content.list[i].value+"]");
										}
									}
								}
							});

							if(data.content.flag=="0"){
								$(".face_img").hide();
								$(".face_grayImg").show();
								$(".xuan_news_face a").each(function(){
									$(this).css({"cursor":"default"})
								})
							}else{
								var bindfuc=function(){
									var _this=this;
									$.ajax({
										url:hiteMoticon.replace('{{emoId}}',$(this).data('emoid')).replace('{{typeId}}', $(this).data('typeid')).replace('{{newsId}}',newsId),
										dataType:"jsonp",
										success:function(data){
											var numTime=0;
											function topAction(){
												numTime++;
												if(numTime == 1){
													$(".plus_one",$(_this)).animate({opacity:'0'})
													clearInterval(topAction)
												}
											}
											$(".plus_one",$(_this)).animate({top:'0px', opacity:'1'},function(){setInterval(topAction,1000)});
											if(data.code){
												$(".xuan_news_face a").each(function(){
													$(this).css({"cursor":"default"});
												})
												var domAdd = $(_this).next(".face_num");
												domAdd.html(domAdd.html().replace(/\w/,function(n){
													return ++n;
												}));
												$(".face_img").hide();
												$(".face_grayImg").show();
												$(".xuan_news_face a").unbind('click', bindfuc)
											}
										}
									})
								}
								$(".xuan_news_face a").bind("click",bindfuc)
							}
							
						}
					});
				}else{
					$(".xuan_news_face").remove();
				}
			},
			error:function(){
				$(".xuan_news_face").remove();
			}
		})

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