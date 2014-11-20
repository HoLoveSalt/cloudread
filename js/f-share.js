//插件功能：加载分享
//开发人员：wangdanfeng
define("share",['LoginInTime','alerts'],function(LoginInTime){
	var loginCheck = '/cloudc/loadUser.xhtm?loginCheck=true',
		toXuanblog = '/cloudc/member/shareFriend.xhtm',
		share = 
			'<!-- Baidu Button BEGIN -->'
			+'<div class="share">'
				+'<div class="station_to_share in">'
					+'<div class="share_title_wrap">站内分享</div>'
					+'<div class="share_content_wrap">'
						+'<ul class="coa_ul"  id="coa_ul">'
							+'<li class="coa_li"><a class="fun to_xuanblog" ><span class="btns">转发到炫文圈</span></a></li>'
							+'<li class="coa_li"><a class="fun to_xinhua" target="_blank"><span class="btns">分享到新华微博</span></a></li>'
						+'</ul>'
					+'</div>'
				+'</div>'
				+'<div class="station_to_share">'
					+'<div class="share_title_wrap">站外分享</div>'
					+'<div class="share_content_wrap">'
						+'<div class="bdsharebuttonbox bdshare-button-style1-24" data-tag="share_3">'
							+'<a class="bds_mshare fixed" data-cmd="mshare" target="_blank">一键分享</a>'
							+'<a class="bds_qzone fixed" data-cmd="qzone" target="_blank">QQ空间</a>'
							+'<a class="bds_tsina fixed" data-cmd="tsina" target="_blank">新浪微博</a>'
							+'<a class="bds_renren fixed" data-cmd="renren" target="_blank">人人网</a>'
							+'<a class="bds_tqq fixed" data-cmd="tqq" target="_blank">腾讯微博</a>'
							+'<a class="bds_tsohu fixed" data-cmd="tsohu" target="_blank">搜狐微博</a>'
						+'</div>'
						+'<div id="code-table">'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';

	var CMD_MAP = {
		'mshare': "http://s.share.baidu.com/mshare?click=1&url={{href}}&uid=0&to=mshare&type=text&pic=&title={{title}}&key={{key}}&desc=&comment=&relateUid=&searchPic=0&sign=on&l=",
		'qzone': "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{href}}&title={{title}}&desc=&summary=&site=",
		'tsina':"http://service.weibo.com/share/share.php?url={{href}}&title={{title}}&appkey=1343713053&searchPic=false",
		'renren':"http://widget.renren.com/dialog/share?resourceUrl={{href}}&srcUrl={{href}}&title={{title}}&description=",
		'tqq':"http://share.v.t.qq.com/index.php?c=share&a=index&url={{href}}&title={{title}}&appkey=",
		'tsohu':"http://t.sohu.com/third/post.jsp?url={{href}}&title={{title}}"
	};
	var createQrcode = function(){
		require(['qrcode'],function(QRCode){
			var url = location.href,
			    qrcode	= new QRCode(-1, 2);
			qrcode.addData(url);
			qrcode.make();

			var h = {
				width: 256,
				height: 256,
				typeNumber: -1,
				correctLevel: 2,
				background: "#ffffff",
				foreground: "#000000"
			};
			var c = document.createElement("canvas");
			$("#code-table").html("").append(c);
			c.width = h.width;
			c.height = h.height;
			if(c.getContext){
				var d = c.getContext("2d");
			}
			var c = qrcode.getModuleCount(),
				b = h.width / c,
				e = h.height / c;
			for (var f = 0; f < c; f++){ 
				for (var i = 0; i < c; i++) {
					d.fillStyle = qrcode.isDark(f, i) ? h.foreground : h.background;
					var g = Math.ceil((i + 1) * b) - Math.floor(i * b),
						j = Math.ceil((f + 1) * b) - Math.floor(f * b);
					d.fillRect(Math.round(i * b), Math.round(f * e), g, j);
				}
			}
		});
	};
	return function(args){
		var contentId = args.data.id,
			url  = args.data.url,
			title = args.data.title;

		var def={
			content:'',//容器
			data:'',//加载数据
			callback:function(){} //回调函数
		};
		$.extend(def, args);
		def.content.html(share);
		//百度分享控件
		// window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"1","bdSize":"24"},"share":{}};
		// with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
	  //站外分享
	  	$('.bdsharebuttonbox a',def.content).on('click',function(){	
		  	var day = new Date().getDay(),
		  		cmd = $(this).data('cmd'),
		  		data = {
		  			title: document.title,
		  			href: location.href
		  		};
		  	if(CMD_MAP[cmd]){
		  		this.href = CMD_MAP[cmd].replace(/\{\{(\w+)\}\}/g,function(match,key){
		  			return data[key] ? encodeURIComponent( data[key] ) : "";
		  		});
		  	}
	  	});
	  //转发到炫文圈
	  	$('.to_xuanblog',def.content).on('click',function(){
			$.alerts.returnButton = '关闭';
			$.ajax({
				url: loginCheck,
				dataType: 'json',
				success:function(res){
					if(res.code == 404){
						// require(['LoginInTime'],function(LoginInTime){
							new LoginInTime(); 
						// });
					}else{
						$.ajax({
							url: toXuanblog,
							type:'post',
							data:{
								contentId: contentId
							},
							dataType:'json',
							success:function(json){
								if(json.code == 200){
									jTip('转发成功',1000);
								}else if(json.code == 302){
									var _login = new LoginInTime();
								}else{
									jTip('转发失败',1000);
								}
							},
							error:function(){
								jTip('服务端异常!');
							}
						});
					}
				}
			});
		});
	  //分享到新华微博
   		$('.to_xinhua',def.content).on('click',function(event){
   			this.href = "http://t.home.news.cn/share.jsp?url="+encodeURIComponent('http://xuan.news.cn/cloudnews'+url)+"&title="+encodeURIComponent(title)+"&pic=";
   		});
   	  //支持canvas的就创建二维码
   		if(Modernizr.canvas){
   			var t = setTimeout(function(){
   				createQrcode();
   				$("#code-table").fadeIn('slow');
   			},500);
   		}
	}
});