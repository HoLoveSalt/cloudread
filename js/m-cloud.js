/**
 * 云谱图
 * @author shiyangyang
 */
define("cloud",['TEMP','requestAFrame','cloudMap'],function(T,R){
	var $ = jQuery;
	T.set('cloud-newsItem','{{#each this}}<li class="newsItem"><a target="_blank" href="{{docUrl}}" title="{{docName}}">{{docName}}</a></li>{{/each}}');

	var renderData = function(e, data){

		$('#cloud-newsPanel').remove();
		$('<div id="cloud-newsPanel" class="piece-trouble"><span class="arrow"></span><span class="arrow2"></span><div class="bg">&nbsp;</div><ul></ul><span class="close">×</span></div>').appendTo( $('body') );
		
		var np = $('#cloud-newsPanel'),
			ul = $('ul', np);
		
		ul.html( T.get('cloud-newsItem')(data) );
			
		np.css({
			left: e.x,
			top : e.y
		});
		
		$('.close', np).on('click', function() {
			np.remove();
		});
	};

	/**
	 * 垃圾回收 弹出框依赖cloud-container
	 */
	R.addTimeout('cloud-newsPanel',function(){
		if( !$('#cloud-container:visible').length ){
			$('#cloud-newsPanel').remove();
		}
	});

	return function(args){
		var content = args.content,
			data = args.data.contentCloud;
		content.html('<div id="cloud-container"></div>');
		var map = new CloudSpectrum({
			node: '#cloud-container', 
			width: content.width(), 
			height:400, 
			mode: 'view'
		});
		map.render( data.cloudJson.content );

		/**
		 * 点击关键词显示新闻列表
		 */
		map.on('nodeClick', function(e){
			var kw = e.name;
			var _url = encodeURI('/xhCNS/search.htm?keyword='+kw+'&retype=json&searchType=union&pageSize=5');
			$.ajax({
				url: _url,
				cache:false,
				dataType:'json',
				success:function(res){
					renderData(e, res.content);
				}
			});
		});
		/**
		 * 点击关系问号显示新闻列表
		 */
		map.on('relationClick', function(e){
			var kw = e.name+','+e.parentName;
			var _url = encodeURI('/xhCNS/search.htm?keyword='+kw+'&retype=json&searchType=union&pageSize=5');
			$.ajax({
				url: _url,
				cache:false,
				dataType:'json',
				success:function(res){
					renderData(e, res.content);
				}
			});
		});
	}
});