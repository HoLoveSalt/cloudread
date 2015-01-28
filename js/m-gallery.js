/**
 * 加载图集
 * @author houjiwei
 */
define("gallery", ['TEMP'],function(T){
	
	var galleryHtml = ''
			+'<div class="ga-gallery">'
			+'	<ul class="ga-li_pic">'
			+'		<li class="ga-cur">'
			+'			<img class="ga-Bigimg" src="{{origin}}">'
			+'			<span class="ga-mid"></span>'
			+'			<div class="ga-info">'
			+'				<div class="ga-ta">'
			+'					<a class="ga-left_info" title="{{description}}">{{description}}</a>'
			+'				</div>'
			+'					<span class="ga-right_info">'
			+'					</span>'
			+'			</div>'
			+'			<div class="ga-bg"></div>'
			+'			<a href="{{origin}}" target="_blank" class="ga-toBigPic"></a>'
			+'		</li>'
			+'		<li class="ga-hover ga-mark_left" style="cursor:url(images/ga-left.ico), auto;"><span class="ga-prev"></span></li>'
			+'		<li class="ga-hover ga-mark_right" style="cursor:url(images/ga-right.ico), auto;"><span class="ga-next"></span></li>'
			+'		<li class="ga-pointer">'
			+'		</li>'
			+'	</ul>'
			+'</div>';
		T.set('gallery', galleryHtml);
			
	function Gallery(content, data){
		this.content = content;
		this.data = data;
		this.embed = $(this.data.txt.match(/<div[^<]+(\"ui\-gallery).*?<\/div>/)[0]);
		this.dataUrl = '/cloudnews'+$(this.embed).attr('data');
		this.ImgData = null;
	}
	Gallery.prototype = {		
		init: function(){
			var _this = this;
			$.ajax({
			   	type: "GET",
			   	url: _this.dataUrl,
			   	success: function(msg){
			     	_this.ImgData = msg.content.itemlist[0].imgArr;
			     	var gallery = T.get('gallery');
			     	_this.content.append(gallery(_this.ImgData[0]));
			     	var numImg = '<span class="ga-fontColor">1</span>/<span class="allImg">'+_this.ImgData.length+'</span>';
			     	$(numImg).appendTo($('.ga-right_info'));
			     	var pointer = '';
			     	var pointerClass = null;
			     	for(var i = 0; i < _this.ImgData.length; i++){
			     		pointerClass = i == 0 ? 'ga-this_pointer' : 'ga-next_pointer';
				     	pointer += '<a class="'+pointerClass+'" pIndex="'+i+'" href="javascript:void(0);"></a>';
			     	}
			     	$(pointer).appendTo($('.ga-pointer'));
			     	_this.movePointer();
			     	_this.gaHoverClick();
					//_this.pointerHover();
			   	}
			});
		},		
		movePointer: function(){
			var _this = this;
			$('.ga-pointer').delegate('.ga-next_pointer', 'click', function(){
				if(_this.ImgData){ 
					_this.movePic(this);
				}
			});
		},
		gaHoverClick: function(){
			var _this = this;
			$('.ga-li_pic').delegate('.ga-hover', 'click', function(e){
				var className = $(this).children().attr('class');
				var numDom = parseInt($('.ga-fontColor').html());
				var bool = false;
				if(className == 'ga-prev' && numDom != 1){
					numDom = numDom - 2;
					bool = true;
				}else if(className == 'ga-next' && numDom != parseInt($('.allImg').html())){
					numDom = numDom; 
					bool = true;
				}
				if(bool){
					bool = false;
					var pointerDom = $('.ga-pointer').children().eq(numDom);
					_this.movePic(pointerDom);	
				}
			});
		},
		movePic: function(dom, index){
			var pIndex = $(dom).attr('pIndex');
			var description = this.ImgData[pIndex].description;
			var imgStr = '<img class="ga-Bigimg" src="'+this.ImgData[pIndex].origin+'">';
			$('.ga-gallery .ga-Bigimg').remove();
			$('.ga-cur').prepend(imgStr);		
			$('.ga-toBigPic').attr('href', this.ImgData[pIndex].origin);
			$('.ga-Bigimg').hide().fadeIn(1000);
			$('.ga-fontColor').html(parseInt(pIndex)+1);
			$('.ga-left_info').attr('title', description).html(description);
			$(dom).removeClass().addClass('ga-this_pointer').siblings().removeClass('ga-this_pointer').addClass('ga-next_pointer');
		},
		pointerHover: function(){
			$('.ga-hover').mouseenter(function(){
				$(this).children().fadeIn();
			}).mouseleave(function(){
				$(this).children().fadeOut();
			});
		}
	}
	return function(args){
		var gallery = new Gallery(args.content, args.data);
		gallery.init();
	 }
});
