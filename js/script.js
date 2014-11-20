require(['TEMP','template'],function(TEMP){
	var URL = {
		main: location.hash.replace(/^#?([^\#]+)\#?.*?$/,'/cloudnews/$1_r.html') /* || '/cloudnews/mytm/20140704/1774014_r.html'*/,
		list: '/cloudc/web/preNextNews.htm',
		index: 'http://xuan.news.cn'
	};
	// console.log( URL.main );
	if( !URL.main ){
		require(['alerts'],function(){
			var i = 3;
			jTip('<p>页面不存在或已经删除,  <a href="javascript:void(0)" id="alerts-timeout">'+i+'</a> 秒后 跳转到<a href="'+URL.index+'">炫空间</a></p>',i*1000);
			var s = $('#alerts-timeout'), t = setInterval(function(){ s.html(--i); if( i<=0 ){location.href = URL.index;} },1000);
		});
		return;
	}
	//全局参数
	window.cacheDetail={
		channelId:'',//频道id
		id:'',//当前文章id
		mainJson:'',//当前文章数据
		contentLists:'' ,//目录
		prevId:'',//前一篇文章id
		prevUrl:'',
		nextId:'',//后一篇文章id
		nextUrl:''
	}

	//全局按钮
	window.cacheDom={
		body:$('body'),
		prevbtn:$('.content-page-prev'),
		nextbtn:$('.content-page-next'),
		contentwrapper:$('.content-wrapper'),
		contentfunc:$('.content-func li')
	}


	//主界面功能
	var globleFunc={
		init:function(){
			var me=this;
			mainDom.init({
				container:'.content-now',
				callback:function(res){
					//写入cacheCetail的当前文章id
					cacheDetail.id=res.id;
					cacheDetail.channelId=res.channelId;
					//加载目录
					$.ajax({
			    		url:URL.list,
						data:{contentId:res.id,channelId:res.channelId}, //需要参数 文章id  和  频道id
						dataType:"json",
						success:function(data){
							cacheDetail.contentLists=data.contentList.list;
							
							//寻找当前文章，并写入上下键信息
							me.pageId();

							

						}
			    	})
				}
			});
			me.pageTurning();//翻页效果
			me.wrapperMinHeight();//主界面最小高度
			me.navfunc();//主要功能
			me.catalogueChoose();//在目录中选择文章
			me.catalogueMore();


			//键盘操作

			$(document).keydown(function(event){
				//判断当event.keyCode 为37时（即左方面键），执行函数to_left();
				//判断当event.keyCode 为39时（即右方面键），执行函数to_right();
				if(!$('.popup :visible').length){
					if(event.keyCode == 37){
						cacheDom.prevbtn.click();
					}else if (event.keyCode == 39){
						cacheDom.nextbtn.click();
					}
				}
			}); 
		},
		pageTurning:function(){
			var me=this;
			cacheDom.nextbtn.click(function(){
				me.moveAnimate('next');
			});
			cacheDom.prevbtn.click(function(){
				me.moveAnimate('prev');
			})
		},
		moveAnimate:function(direction){
			var me=this;
			//计算距离数据
			var offset=cacheDom.contentwrapper.width();
			var topset=$(document).scrollTop();
			//移入动画效果函数
			function cssAnimate(c,o,t){
				c.css({'left':o,'top':t}).show();
				c.animate({'left':'0'},function(){
					c.addClass('content-now');
					c.css({'top':'0'})
					$(document).scrollTop(0);
				});
			}
			//创建新文章
			function createNext(){
				var newc=$('<div class="content-inner"><div class="content-loading"></div></div>');
				cacheDom.contentwrapper.append(newc);
				cssAnimate(newc,offset,topset);
				mainDom.init({
					url:newUrl,
					container:newc
				});
				// setTimeout(function(){
				// 	mainDom.init({
				// 		container:newc
				// 	});
				// },'2000') //延迟测试
			}
			function domain(){
				createNext(newUrl)
				//配置当前id 及其 上下文关系
				cacheDetail.id=newId;
				me.pageId();

				nowc.animate({'left':-offset},function(){
					nowc.remove();
				});	

				me.deleMainFunc();

				
				
			}

			var nowc=$('.content-now');//获取当前显示的容器
			var newId,newUrl;//id

			if(!nowc.is(':animated')){
				if(direction=='next' && cacheDetail.nextId){
					offset=offset;
					newId=cacheDetail.nextId;
					newUrl=cacheDetail.nextUrl;
					domain();

				}
				if(direction=='prev' && cacheDetail.prevId){
					offset=-offset;
					newId=cacheDetail.prevId;
					newUrl=cacheDetail.prevUrl;
					domain();

				}

			}

		},
		wrapperMinHeight:function(){
			cacheDom.contentwrapper.css('min-height',$(window).height());
			$(window).resize(function(){
				cacheDom.contentwrapper.css('min-height',$(window).height());
			});
		},
		navfunc:function(){
			var btn=cacheDom.contentfunc;
			var htmlScroll=$('html');

			btn.click(function(){
				//处理动画
				var btnType=$(this).data('type');
				var popup=$('.'+btnType),innerCont=popup.find('.popup-inner');

					//特殊处理内容
					if(btnType=='f-catalogue'){
						//如果是目录,且数据已经存在
						if(cacheDetail.contentLists){
							var catalogueUl=innerCont.find('ul');
							//初始化目录
			    			catalogueUl.html($( TEMP.get('catalogue')(cacheDetail.contentLists)));

			    			popup.show();
			    			htmlScroll.css('overflow','hidden');

			    			//为当前文章的目录 突出显示
							var catalogueLi=catalogueUl.find('li');
							catalogueLi.removeClass('on');
							for(var i=0;i<catalogueLi.length;i++){
								if(catalogueLi.eq(i).data('id')==cacheDetail.id){
									catalogueLi.eq(i).addClass('on');
									//重置滚动条高度
									popup.scrollTop(catalogueLi.eq(i).position().top-100);
								}
							}

							var innerTop=innerCont.find('.catalogue-header');
							innerTop.hide();
							var iWhith=innerCont.width();

							innerCont.width(1).animate({'width':iWhith},function(){
								innerTop.fadeIn();
							});
						}	
					}else{
						if(!popup.length){
							cacheDom.body.prepend('<div class="popup '+btnType+'"><div class="popup-close iconfont">&#xe606;</div><div class="popup-inner"></div></div>');
							popup=$('.'+btnType);
							innerCont=popup.find('.popup-inner');
							require([btnType.substring(2)],function(m){
								m({content:innerCont,data:cacheDetail.mainJson});
							});
						}
						var iWhith=innerCont.width();
						innerCont.width(1).animate({'width':iWhith});
						popup.show();
			    		htmlScroll.css('overflow','hidden');
					}
				
				

				//设置最小高度
				innerCont.css('min-height',$(window).height());


			})
		
			cacheDom.body.on('click','.popup-close',function(){
				$(this).parent().hide();
				htmlScroll.css('overflow','auto');
			});
			cacheDom.body.on('click','.popup',function(){
				$(this).hide();
				htmlScroll.css('overflow','auto');
			});

			cacheDom.body.on('click','.popup-inner',function(event){
				event.stopPropagation();
			});

		},
		pageId:function(){
			var me=this;
			$.map(cacheDetail.contentLists,function(n){
				if(n.id==cacheDetail.id){
					var index=$.inArray(n,cacheDetail.contentLists)
					var len=cacheDetail.contentLists.length;
					// console.log(cacheDetail);

					//写入前一个键信息
					if(index!=0){
						cacheDetail.prevId=cacheDetail.contentLists[index-1].id;
						cacheDetail.prevUrl=cacheDetail.contentLists[index-1].url;

						cacheDom.prevbtn.removeClass('ending');
					}else{
						cacheDetail.prevId='';
						cacheDetail.prevUrl='';
						cacheDom.prevbtn.addClass('ending');

						//载入新列表
						me.addnewList('prev',true);
					}
					
					//写入后一个键信息
					if(index+1!=len){
						cacheDetail.nextId=cacheDetail.contentLists[index+1].id;
						cacheDetail.nextUrl=cacheDetail.contentLists[index+1].url;

						cacheDom.nextbtn.removeClass('ending');
					}else{
						cacheDetail.nextId='';
						cacheDetail.nextUrl='';

						cacheDom.nextbtn.addClass('ending');

						//载入新列表
						me.addnewList('next',true);							
						
					}
				}
			})

		},
		addnewList:function(direction,needSetPageId){
			var me=this;
			var lastId,nextNeed;
			needSetPageId=needSetPageId || false;

			if(direction=='prev'){
				lastId=cacheDetail.contentLists[0].id;
				nextNeed=true;
			}else if(direction=="next"){
				lastId=cacheDetail.contentLists[cacheDetail.contentLists.length-1].id;
				nextNeed=false;
			}else{
				//错误
			}

			$.ajax({
	    		url:URL.list,
	    		// url:'json/list2.json',
				data:{contentId:lastId,channelId:cacheDetail.channelId,next:nextNeed}, //需要参数 文章id  和  频道id
				dataType:"json",
				success:function(data){
						if(data.contentList.list){
							
		
							if(needSetPageId){
								//拼接数据
								if(direction=='prev'){
									Array.prototype.push.apply(data.contentList.list, cacheDetail.contentLists);  
									cacheDetail.contentLists=data.contentList.list;
								}else if(direction=='next'){
									Array.prototype.push.apply(cacheDetail.contentLists, data.contentList.list);  
								}
								//如果事件触发来自翻页按钮
								//寻找当前文章，并写入上下键信息
								me.pageId();

							}else{
								//如果事件触发来自加载更多目录按钮
								var catalogueUl=$('.f-catalogue ul');
								if(direction=='prev'){
									catalogueUl.prepend($( TEMP.get('catalogue')(data.contentList.list)));
									$('#prevMore').fadeIn();
								}else if(direction=='next'){
									catalogueUl.append($( TEMP.get('catalogue')(data.contentList.list)));
									$('#nextMore').fadeIn();
								}
								//拼接数据
								if(direction=='prev'){
									Array.prototype.push.apply(data.contentList.list, cacheDetail.contentLists);  
									cacheDetail.contentLists=data.contentList.list;
								}else if(direction=='next'){
									Array.prototype.push.apply(cacheDetail.contentLists, data.contentList.list);  
								}
								
							}
							
						}
				}
	    	})
		},
		catalogueMore:function(){
			var me=this;
			$('#prevMore').click(function(){
				me.addnewList('prev');
				$(this).hide();
			});
			$('#nextMore').click(function(){
				me.addnewList('next');
				$(this).hide();
			});

		},
		
		deleMainFunc:function(){
			//删除配置的功能模块
			$('.popup').each(function(){
				var _this=$(this);
				if(_this.hasClass('f-catalogue')){}
				else{
					_this.remove();
				}
			})
		},
		catalogueChoose:function(){
			var me=this;
			var catalogueUl=$('.f-catalogue ul');
			catalogueUl.on('click','li',function(){
				$('.popup-close').click();
				//创建一个新文章
				var id=$(this).data('id'),url=$(this).data('url');
				mainDom.init({
					url:url,
					container:'.content-inner'
				});
				//重置上下文关系
				cacheDetail.id=id;
				me.pageId();
				me.deleMainFunc();
			});
		}
	}



	//实例化main模块
	var mainDom={
		init:function(options){
			var def={
	        	url:URL.main,	 //接口地址,可以没有
	        	parameter:{},//接口参数,可以没有
	        	compile:TEMP.get('main'),  //html模板,如果数组多个模板,则将模板添加到到对应的container中
	        	container:'.content-inner',//容器,可以是jquery对象,也可以是字符串
	        	callback:function(){} //回调函数
	    	};
	    	$.extend(def, options);

	    	//将container转换成jquery对象
	    	if(!(def.container instanceof jQuery)){
	    		def.container=$(def.container);
	    	}

	    	//主方法
	    	var me=this;
	    	//改变 hash
	    	location.hash = def.url.replace( /\/cloudnews\/(.*?)_r\.html/, '$1') ;
	    	$.ajax({
	    		url:def.url,
				data:def.parameter,
				dataType:"json",
				beforeSend:function(){},
				success:function(res){
					if(true){
	    				//数据返回成功
	    				res=me.dataAready(res);
	
						//缓存当前数据
						cacheDetail.mainJson=res;

	    				var dom=$( def.compile(res));
	    				def.container.html(dom);
	    				
	
						me.addEvent(def.container,res);//为Dom绑定事件
						
						
						document.title =$('<i>'+res.title+'</i>').text();

						return def.callback(res);
	    			}else{
	    				me.unsuccess();//数据返回失败
	    			}
				},
				error:function(){
					//如果有目录就
					if(window.cacheDetail.contentLists.length){
						return false;
					}else{
						require(['alerts'],function(){
							var i = 3;
							jTip('<p>页面不存在或已经删除,  <a href="javascript:void(0)" id="alerts-timeout">'+i+'</a> 秒后 跳转到<a href="'+URL.index+'">炫空间</a></p>',i*1000);
							var s = $('#alerts-timeout'), t = setInterval(function(){ s.html(--i); if( i<=0 ){location.href = URL.index;} },1000);
						});
					}
				}
	    	})

		},
		dataAready:function(res){
			res.hasTxt=false;
			res.hasGallery=false;
			res.hasEmbed=false;

			if(res.contentType==2){
				//如果是图集
				res.hasGallery=true;
				//判断是否有视频
				if(res.txt.match('edui-faked-video')){res.hasEmbed=true;}
			}else if(res.contentType==10){
				//如果是视频
				res.hasEmbed=true;
				//判断是否图集
				if(res.txt.match('ui-gallery')){res.hasGallery=true;}
			}else{
				res.hasTxt=true;
				//判断是否有图集和视频
				if(res.txt.match('ui-gallery')){res.hasGallery=true;}
				if(res.txt.match('edui-faked-video')){res.hasEmbed=true;}
			}
			return res;
		},
		addEvent:function(container,res){
		
				var list=container.find('.m-tablist').children();//列表
				var tabCont=container.find('.m-tabcont');//tab容器
				if(list.length==1 || container.find('.m-tablist :visible').length==1){list.parent().hide();}//如果只有一个选项，隐藏
				//点击事件绑定
				list.click(function(){
					var _this=$(this);
					_this.addClass('on').siblings().removeClass('on');

					var liType=_this.data('type');
					liCont=tabCont.find('.'+liType);
					if(!liCont.length){
						tabCont.append('<div class="m-tabinner '+liType+'"></div>');
						liCont=tabCont.find('.'+liType);
						/*
						//写入数据
						switch(liType){
							case 'm-txt':
							break;
							case 'm-gallery':
							break;
							case 'm-embed':
							break;
							case 'm-debate':
							break;
							case 'm-attr':
							break;
							case 'm-chart':
								require(['chart'],function(chart){
									chart({content:liCont,data:res})
								});
							break;
							case 'm-store':
							break;
							case 'm-timeLine':
							break;
							case 'm-cloud':
							break;
							case 'm-newsMap':
							break;
							case 'm-newsQuest':
							break;
						}
						*/
						require([liType.substring(2)],function(m){
							m({content:liCont,data:res});
						});
						
					}
					//后期动画处理-----  ----- ----- -----
					tabCont.find('.m-tabinner').trigger('off-tab').hide();
					liCont.trigger('on-tab').show();
					
				});

				/*
				var liCont;
				//初始化信息
				if(res.contentType==2){
					//确定标签
					list.parent().find('li[data-type="m-gallery"]').addClass('on');
					//初始化图集容器
					tabCont.append('<div class="m-tabinner m-gallery"></div>');
					liCont=tabCont.find('.m-gallery');
					//加载图集



				}else if(res.contentType==10){
					//确定标签
					list.parent().find('li[data-type="m-embed"]').addClass('on');
					//初始化视频容器
					tabCont.append('<div class="m-tabinner m-embed"></div>');
					liCont=tabCont.find('.m-embed');
					//加载视频


				}else{
					//确定标签
					list.parent().find('li[data-type="m-txt"]').addClass('on');
					//初始化正文容器
					tabCont.append('<div class="m-tabinner m-txt"></div>');
					liCont=tabCont.find('.m-txt');
					//加载正文
					liCont.show();
				}
				*/
				var tabTo = 'm-txt';
				switch(res.contentType){
					case '2': tabTo = 'm-gallery';break;
					case '10': tabTo = 'm-embed';break;
				}
				list.filter('[data-type="'+tabTo+'"]').trigger('click');
		},
		beforeSend:function(){

		}

	}




	//加载主框架
	globleFunc.init();
});
