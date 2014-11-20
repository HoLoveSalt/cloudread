define('TEMP',['template'],function(){
	var H={}, T = {};
	H.main='<div class="main">'
			  // +'	<div class="m-liulan"><strong>浏览</strong><span>323</span>'
			  // +'	</div>'
			  +'	<div class="m-title">'
			  +'		<h1 class="m-title-name">{{{title}}}</h1>'
			  +'		<p class="m-title-info"><span>{{sortDate}}</span><span>本文出处:{{origin}}</span><a target="_blank" href="{{url}}">[原版模式]</a></p>'
			  +'	</div>'
			  +'	<div class="m-tablist-wrapper"><ul class="m-tablist">'
			  +'		{{#if hasTxt}}<li data-type="m-txt" class="tab-txt">正文</li>{{/if}}'
			  +'		{{#if hasGallery}}<li data-type="m-gallery" class="tab-gallery">图集</li>{{/if}}'
			  +'		{{#if hasEmbed}}<li data-type="m-embed" class="tab-embed">视频</li>{{/if}}'
			  // +'		{{#if contentDebate}}<li data-type="m-debate" class="tab-debate">互动</li>{{/if}}'
			  // +'		{{#if contentAttr}}<li data-type="m-attr" class="tab-attr">百科</li>{{/if}}'
			  +'		{{#if contentChart}}<li data-type="m-chart" class="tab-chart">图表</li>{{/if}}'
			  // +'		{{#if contentStore}}<li data-type="m-store" class="tab-store">集成</li>{{/if}}'
			  +'		{{#if contentTimeLine}}<li data-type="m-timeLine" class="tab-timeLine">追溯</li>{{/if}}'
			  +'		{{#if contentCloud}}<li data-type="m-cloud" class="tab-cloud">云谱</li>{{/if}}'
			  // +'		{{#if contentNewsMap}}<li data-type="m-newsMap" class="tab-newsMap">地图</li>{{/if}}'
			  // +'		{{#if contentNewsQuest}}<li data-type="m-newsQuest" class="tab-newsQuest">问答</li>{{/if}}'
			  +'	</ul></div>'
			  +'	<div class="m-tabcont"></div>'
			  +'	<a href="http://app.news.cn" class="m-banner" target="_blank"></a>'
			  +'	<p class="m-copyright">Copyright © 2000 - 2014 XINHUANET.com　All Rights Reserved. </p>'
			  +'    <div class="m-prev">'
			  +'    	5'
			  +'    </div>'
			  +'    <div class="m-next">'
			  +'    	6'
			  +'    </div>'
			  +'</div>';
	H.catalogue='{{#each this}}'
			+'<li class="clearfix" data-id="{{id}}" data-url="{{url}}">'
			+'	<img src="{{img}}" />'
			+'	<h3>{{{title}}}</h3>'
			+'	<p>{{date}}</p>'
			+'</li>'
			+'{{/each}}';

	H.demo=''
		+'<div class="demo">'
		+'	<span><strong>title:</strong>{{title}}</span>'
		+'	<span><strong>id:</strong>{{id}}</span>'
		+'	<span><strong>sortDate:</strong>{{sortDate}}</span>'
		+'</div>';

	return {
		set:function(key,tpl){
			H[key] = tpl;
		},
		get:function(key){
			if( !T[key] ){
				try{
					T[key] = Handlebars.compile( H[key] )
				}catch(e){
					throw new Error('模板未设置! key:' + key)					
				}
			}
			return T[key]
		}
	}

});
	