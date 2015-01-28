//插件功能：集成
//开发人员：jiangyannian
define("store",['TEMP'], function(T) {
	var storeHtml = ''
			+'<div class="sto-store">'
			+'	<ul class="sto-tab">'
			+'		<li class="sto-tab-li"></li>'
			+'		<li class="sto-tab-li"></li>'
			+'		<li class="sto-tab-li"></li>'
			+'	</ul>'
			+'</div>';
		T.set('store', storeHtml);
	return function(args){
		var def={
			id: args.data.id,							//当前文章id
			channelId: args.data.channelId,				//当前文章所属栏目id
			content:'',									//容器
			dataDefault: args.data.contentStore,		//默认数据
			dataLabel: args.data.tagStr.split(','),		//标签名 数据
			tag: args.data.tag,
			callback:function(){
				var _this = this;
				var stoTab = "<li class='sto-tab-li sto-tab0' stoTabNum='0'><a>新闻报道</a></li>";
				var stoContent = "<div class='stoContent'></div>";
				var stoTabNum = 0;
				var defaultTitleNum = 0;	//默认数据类型数
				var defaultDates = [] ;		//默认推荐集成数据  defaultDates

				//生成tab
				$(this.dataLabel).each(function(i,v){
					stoTabNum += 1;
					stoTab += "<li class='sto-tab-li " + "sto-tab" + stoTabNum + "' stoTabNum='"+stoTabNum+"'><a>"+v+"</a></li>" 
				})

				//重新生成默认推荐集成数据  defaultDates
				for(var i in this.dataDefault){
					$(this.dataDefault[i]).each(function(index,v){
						v.part = i;
						defaultDates.push(v);
					})
				}
				//推荐喜欢数据
				if(!defaultDates.length){
					$.ajax({
						type: 'get',
						url:  "../../cloudapi/web/youLike?contentId="+this.id+"&channelId="+this.channelId+"&count=12",
						dataType: "json",
						async: false,
						success: function(data){
							$(data.content).each(function(i,v){
								v.part = "新闻报道";
								v.title = v.text;
								v.url = "../.."+v.url
								defaultDates.push(v)
							})
						} ,
						error:function(errorData){
							return;
						}
					});
				}
				
				stoTab = '<ul class="sto-tab">'+stoTab+'</ul>';
				$(".m-store").append( stoTab + stoContent );

				//点击tab切换
				$(".sto-tab-li").click(function(){
					$(".sto-tab-li a").removeClass('on');
					$(this).children().addClass('on');
					$(".stoContent,.stoContent div").hide();
					showMod( $(this).text(),$(this).attr("stotabnum") );
				});
				//生成默认的标签块
				function showMod( modName,i ){
					if(!$(".stoContent"+i).hasClass("stoContent"+i)){	//未加载过执行
						var contentBlk = "<div class='stoShowDiv "+"stoContent"+i+"'>";
						if(i==0){	//默认初始数据
							$(defaultDates).each(function(i,v){
								var stoOddEven = i%2?"stoEven":"stoOdd";
								contentBlk +=	""
												+"	<p class='"+stoOddEven+"'>"
												// +"		<img src='http://tmisc.home.news.cn/cloudnews/res/assets/img/enterprise-search/xuan_logo.jpg' title='"+v.title+"'>"
												+"		<span class='stoTitle'><a href='"+ v.url +"' target='_blank' title='"+v.title+"'>"+v.title+"</a></span>"
												// +"		<span class='stoDate'><span>2014-10-10 22:22&nbsp&nbsp|&nbsp&nbsp</span><span>数据库</span></span>"
												+"		<span class='stoDate'><span>"+v.part+"</span></span>"
												+"	</p>"
												+""
							})
							contentBlk+="</div>"
							$(".stoContent").append(contentBlk).fadeIn();
						}else{	//有标签的数据
							 var tagId ; 
							 (function(){
								$(_this.tag).each(function(i,v){
									if(v.tagName==modName){
										tagId = this.tagId;
									}
								})
							})()
							function handleData(data){
								$(data.content).each(function(i,v){
									var stoOddEven = i%2?"stoEven":"stoOdd";
									contentBlk +=	""
									+"	<p class='"+stoOddEven+"'>"
									// +"		<img src='http://tmisc.home.news.cn/cloudnews/res/assets/img/enterprise-search/xuan_logo.jpg' title='"+v.title+"'>"
									+"		<span class='stoTitle'><a href='"+ v.docUrl +"' target='_blank' title='"+v.docName+"'>"+v.docName+"</a></span>"
									// +"		<span class='stoDate'><span>2014-10-10 22:22&nbsp&nbsp|&nbsp&nbsp</span><span>数据库</span></span>"
									+"		<span class='stoDate'><span>"+v.docCategory+"</span></span>"
									+"	</p>"
									+""
								})
								contentBlk+="</div>"
								$(".stoContent").append(contentBlk).fadeIn();
							}

							//   console.log( tagId );
							if(tagId){
								$.ajax({
									type: 'get',
									url: "../../cloudc/web/getTagDoc?contentId="+_this.id+"&tagId="+tagId,
									dataType: "json",
									async: false,
									cache: false,
									success: function(data){
										if(data.content.length){
											handleData(data);
										}else{
											getTagNews();
										}
										
									} ,
									error:function(errorData){
										console.log(errorData)
										return;
									}
								});
							
							}else{
								getTagNews();
							}
							function getTagNews(){
							   $.ajax({
									type: 'get',
									url: "../../xhCNS/search.htm?keyword="+encodeURIComponent(modName)+"&retype=json&searchType=union" ,
									dataType: "json",
									async: false,
									cache: false,
									success: function(data){
										handleData(data);
									} ,
									error:function(errorData){
										return;
									}
								});
							}
						}
					}else{	//已加载过执行
						$(".stoContent"+i).show();
						$(".stoContent").fadeIn();
					}
				}
				$(".sto-tab-li")[0].click();
			}
		};
		return def.callback();
	}
});