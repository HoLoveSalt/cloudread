//插件功能：加载echarts图表
//开发人员：nian
define("chart",['json'],function(JSON){
	return function(args){
		//Modernizr.canvas	检测当前浏览器是否支持canvas
		//chartDatas:获取到的图表相关数据; chartLength:图表个数; chartShowHtml:展示图表所需的HTML模板; showIndex:当前所展示图表的index
		var chartreader = {
			chartDatas: args.data.contentChart,
			chartLength: 0, 
			charts: [], 
			chartShowHtml: "", 
			showIndex: null, 
			key: null, 
			showWidth: null,
			chartHtmlLoading: '<div style="position: absolute;left:0px;width:100%;height:100%;background-color:#fff;z-index: 10;" class="chart-load"><div class="content-loading"></div></div>',
			chartHtml: '',
			init:function(){
				var _this = this;
				for (key in this.chartDatas) {
					if (this.chartDatas.hasOwnProperty(key)){
						this.charts.push(this.chartDatas[key]);
						this.chartShowHtml = this.chartShowHtml + '<div class="e-chartShow-list" id="e-chart-main'+this.chartLength+'"></div>';
						this.chartLength++;
					}
				}
				this.chartHtml ='<div class="content-loading loading-small-logo" style="top: 280px;z-index:9;"></div>'
						+'<div class="e-chart">'
						+'	<div class="e-btn e-btn-left" id="lastChart"><</div>'
						+'	<div class="e-container"><div class="e-showNum"></div><div class="e-chartShow" id="e-chart-main"><div class="e-tab-lists">'+this.chartShowHtml+'</div></div></div>'
						+'  <div class="e-btn e-btn-right e-btn-active" id="nextChart">></div>'
						+'</div>';
				args.content.append( this.chartHtmlLoading );
				args.content.append( this.chartHtml );


				//获取页面首次加载时，图表区通过css自适应页面大小   并赋值给当前区域 
				$(".e-chart").css("width",$(".e-chart").width());
				$(".e-chart .e-chartShow").css("width",$(".e-chart .e-chartShow").width());

				this.showWidth = $(".e-chartShow").width();
				$(".e-tab-lists>div").css( {"width":this.showWidth,"height":"100%","float":"left"});
				$(".e-tab-lists").css( {"width":this.showWidth*this.chartLength,"position":"relative","left":0});
				$('.e-showNum').html(1+" / "+this.chartLength);

				this.chartLength==1 && $(".e-btn").hide();
				this.chartChange();
				require(['http://tmisc.home.news.cn/cloudnews/res/dest/xuan-chart/echarts-plain-map-min.js'],function(){
					_this.chartShowFun(0);
				});
			},
			chartShowFun:function(i){
				var _this = this;
				$(".loading-small-logo").show();
				this.showIndex = i;
				this.chartDatas[i].myChart = echarts.init(document.getElementById('e-chart-main'+i));
				$.ajax({
					type: "GET",
					async: false,
					//url: http:\//172.18.11.191/prettify?http:\//172.18.11.191/json/main.json,
					url: this.chartDatas[i].url,
					dataType: "json",
					success: function(data){
						data = JSON.expendWithFunction(data);
						_this.chartDatas[i].myChart.setOption(data,true);
						$(".chart-load,.loading-small-logo").hide();
					}
				});
			},
			lastChart:function(){
				var _this = this;
				if(this.showIndex){
					this.showIndex -= 1;
					toLeft = -this.showWidth*this.showIndex;
					$(".e-tab-lists").stop().animate({left: toLeft},600,function(){
						_this.btnActive(_this.showIndex);
					});
				}
			},

			nextChart:function(){
				var _this = this;
				if(this.showIndex!=this.chartLength-1){
					this.showIndex += 1;
					//若当前图表已经渲染过，则不再渲染
					!$("#"+'e-chart-main'+this.showIndex+">div").length && this.chartShowFun(this.showIndex);
					toLeft = -this.showWidth*this.showIndex;
					$(".e-tab-lists").stop().animate({left: toLeft},600,function(){
						_this.btnActive(_this.showIndex);
					});
				}
			},
			btnActive:function(showIndex){
				var _this = this;
				$('.e-showNum').html(showIndex+1+" / "+_this.chartLength);
				$(".e-btn-left").addClass("e-btn-active");
				$(".e-btn-right").addClass("e-btn-active");
				if(showIndex==0){
					$(".e-btn-left").removeClass("e-btn-active");
				}else if(showIndex==_this.chartLength-1){
					$(".e-btn-right").removeClass("e-btn-active");
				}
			},
			chartChange:function(){
				var _this = this;
				$(".e-btn").click(function(){
					_this.btnActive(_this.showIndex);
					//前一图表
					if(this.id=="lastChart"){
						_this.lastChart();
					//后一图表
					}else if(this.id=="nextChart"){
						_this.nextChart();
					}
				});
			
			}
		}
		chartreader.init();
	}
});