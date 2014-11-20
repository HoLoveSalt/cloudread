/**
 * 加载视频
 * @author shiyangyang
 */
define("embed", ['TEMP', 'checkFlash'], function(T, CF) {

	var h5Video = ''
	+ '		<video id="em-h5-video" src="{{mp4Path}}" controls="controls" >'
	+ '		</video>';
	var videoHtml = ''
	+ '<div class="em-summary">'
	+ '		<span class="em-sName">视频简介</span>'
	+ '		<div class="em-ta">'
	+ ' 	<a class="em-sText" href="javascript:void(0);" title="{{description}}">{{description}}</a>'
	+ '		</div>'
	+ '</div>';
			
	T.set('embed', videoHtml);
	T.set('video', h5Video);
	function Embed(args) {
		this.content = args.content;
		this.data = args.data;
		this.embed = this.data.txt.match(/<object.*?>.*?<\/object\>/)[0].replace('style="display:none"','');
		this.dataUrl = $(this.embed).attr('data-url').replace('http://xuan.news.cn', '');
		this.objData = {};
	}
	jQuery.extend(Embed.prototype, {
		init: function() {
			var _this = this,
				bgURL = _this.embed.match(/bgURL=.*?.jpg/)[0].replace('bgURL=', '');
			$.ajax({
				type: "GET",
				url: _this.dataUrl,
				success: function(msg) {
					if (msg.description) {
						var videoText = T.get('embed'),
							video = T.get('video'),
							vh = CF.isFlash ? _this.embed : Modernizr.video ? video(msg) : '<img src="' + bgURL + '"/>';
						_this.content.html(vh + videoText(msg));
						$('video').attr('poster', bgURL);
					}
				}
			});
			$(this.content).bind('off-tab', function(){
				var vi = document.getElementById('em-h5-video');
				vi ? vi.pause() : '';
			});
		}
	});
	return function(args) {
		var e = new Embed(args);
		e.init();
	}
});