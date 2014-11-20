/*
date:2014-10-15
author:xh-zeq
version:1.0.2
discrip:即时炫空间登录组件。jQuery版
参数说明：
1、obj.wraper:容器，用于承载组件的html元素选择器。可空，默认值 body元素的jQuery对象
2、obj.skinStyle:皮肤，现在只有一套皮肤。可空，默认值 0
3、obj.callbackUrl:登录成功以后的跳转地址，可空（如果空值，登录成功就重新加载页面）
4、obj.usernameBlur:光标离开用户名输入框时的回调函数
5、obj.passwordBlur:光标离开密码输入框时的回调函数
一键注册接口：
0：注册成功并登录
1：已经登录
2：注册失败
*/
define('LoginInTime',function(){
	var $ = jQuery;
	var Lgn = function (obj) {
		this._wraper = $('body');
		this._skinStyle = 0;
		this._callbackUrl = '';
		this.usernameBlur = obj ? obj.usernameBlur : null;
		this.passwordBlur = obj ? obj.passwordBlur : null;
		if(obj){
			if(obj.wraper)
				this._wraper = $(obj.wraper);
			if(obj.skinSytle)
				this._skinStyle = $(obj.skinSytle);
			if(obj.callbackUrl)
				this._callbackUrl = $(obj.callbackUrl);
		}
		this.init();
	};

	var substitute = function(s,o){
		return s.replace(/{([^{}]*?)}/g,function(a,b){
			var r= o[b];
			return typeof r === "string" || typeof r === "number" || typeof r === "boolean" ? r:a;
		});
	};

	Lgn.prototype.needVerifyCode = false;

	Lgn.prototype.createHtml = function(){
		var _html = '';
		var divLgnwin = $("<div>");
		var chooseBackSkin = substitute("lgnwin{skin}",{skin:this._skinStyle});
		divLgnwin.addClass(chooseBackSkin);
		var divPopwin = $("<div id='popLoginFormWin'></div>");
		var chooseFormSkin = substitute("popwin{skin}",{skin:this._skinStyle});
		divPopwin.addClass(chooseFormSkin);
		divPopwin.html(substitute('<div class="divlgn"> <form id="lgnForm"> <div class="divTitle"> <div class="div-text"> \u767b\u5f55\u70ab\u7a7a\u95f4 </div> <a id="pop-btnClose" class="div-close" href="javascript:void(0)" title="\u70b9\u51fb\u5173\u95ed"></a> </div> <div class="div-info"> <div class="div-un"> <span title="\u7528\u6237\u540d"></span> <input id="pop-txtUserName" type="text" placeholder="\u7528\u6237\u540d\u002f\u624b\u673a\u53f7\u002f\u90ae\u7bb1\u002f\u70ab\u0049\u0044"> </div> <div class="div-psw"> <span title="\u5bc6\u7801"></span> <input id="pop-txtPassword" type="password" placeholder="\u8bf7\u8f93\u5165\u5bc6\u7801"> </div> <div id="div-verify" class="div-verify"><span title="\u9a8c\u8bc1\u7801"></span> <input id="pop-txtVerify" type="text"> <img id="sp-verifyImg" title="\u9a8c\u8bc1\u7801" src="{verifyCode}" /> <span title="\u70b9\u51fb\u6362\u4e00\u5f20" class="change-pic">\u6362\u4e00\u5f20?</span> <p>\u60a8\u5df2\u7ecf\u8fde\u7eed\u0033\u6b21\u767b\u5f55\u9519\u8bef\uff0c\u4e3a\u786e\u4fdd\u5b89\u5168\uff0c\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801</p> </div> </div> <div class="div-lgnconfig"> <div class="div-lgnconfig-left"> <input type="checkbox" id="pop-cbAutoLogin"><label for="pop-cbAutoLogin">\u81ea\u52a8\u767b\u5f55</label> <input type="checkbox" id="pop-cbHideLogin"><label for="pop-cbHideLogin">\u9690\u8eab\u767b\u5f55</label> </div> <div class="div-lgnconfig-right"> <a href="http://login.home.news.cn/reg.jsp" id="pop-btnRegister" target="_blank">\u6ce8\u518c</a> <a href="http://login.home.news.cn/getPwd.do#phone" id="pop-btnforgetpsw" target="_blank">\u5fd8\u8bb0\u5bc6\u7801</a> </div> </div> <input id="pop-btnlogin" class="pop-btnlogin" type="button" value="\u767b\u0020\u5f55"> <input id="pop-btnregist" class="pop-btnregist" type="button" value="&#x4E00;&#x952E;&#x6CE8;&#x518C;"> </form> </div> <div id="divCopLoginComshare"> <p>\u4f7f\u7528\u5408\u4f5c\u7f51\u7ad9\u8d26\u53f7\u767b\u5f55</p> <div> <ul><li class="shareItem0"> <a id="pop-btncoQQ" href="javascript:void(0)">QQ</a> </li> <li class="shareItem1"> <a id="pop-btncoSian" href="javascript:void(0)">\u65b0\u6d6a</a> </li> <li class="shareItem2"> <a id="pop-btnco163" href="javascript:void(0)">\u7f51\u6613</a> </li> <li class="shareItem3"> <a id="pop-btncoSohu" href="javascript:void(0)">\u641c\u72d0</a> </li> <li class="shareItem4"> <a id="pop-btnco189" href="javascript:void(0)">\u5929\u7ffc</a> </li><li class="shareItem5"> <a id="pop-btncoWechat" href="javascript:void(0)">\u5fae\u4fe1</a> </li></ul> </div> </div>',{verifyCode:Lgn.config.verifyImgUrl}));
		//divPopwin.innerHTML = substitute('<div class="divlgn"> <form id="lgnForm"> <div class="divTitle"> <div class="div-text"> 登录炫空间 </div> <a id="pop-btnClose" class="div-close" href="javascript:void(0)" title="点击关闭"></a> </div> <div class="div-info"> <div class="div-un"> <span title="用户名"></span> <input id="pop-txtUserName" type="text" placeholder="用户名/手机号/邮箱/炫ID"> </div> <div class="div-psw"> <span title="密码"></span> <input id="pop-txtPassword" type="password" placeholder="请输入密码"> </div> <div id="div-verify" class="div-verify"><span title="验证码"></span> <input id="pop-txtVerify" type="text"> <img id="sp-verifyImg" title="验证码" src="{verifyCode}" /> <span title="点击换一张" class="change-pic">换一张?</span> <p>您已经连续3次登录错误，为确保安全，请输入验证码</p> </div> </div> <div class="div-lgnconfig"> <div class="div-lgnconfig-left"> <input type="checkbox" id="pop-cbAutoLogin"><label for="pop-cbAutoLogin">自动登录</label> <input type="checkbox" id="pop-cbHideLogin"><label for="pop-cbHideLogin">隐身登录</label> </div> <div class="div-lgnconfig-right"> <a href="http://login.home.news.cn/reg.jsp" id="pop-btnRegister">注册</a> <a href="http://login.home.news.cn/getPwd.do#phone" id="pop-btnforgetpsw">忘记密码</a> </div> </div> <input id="pop-btnlogin" class="pop-btnlogin" type="button" value="登 录"> </form> </div> <div id="divCopLoginComshare"> <p>使用合作网站账号登录</p> <div> <ul><li class="shareItem0"> <a id="pop-btncoQQ" href="javascript:void(0)">QQ</a> </li> <li class="shareItem1"> <a id="pop-btncoSian" href="javascript:void(0)">新浪</a> </li> <li class="shareItem2"> <a id="pop-btnco163" href="javascript:void(0)">网易</a> </li> <li class="shareItem3"> <a id="pop-btncoSohu" href="javascript:void(0)">搜狐</a> </li> <li class="shareItem4"> <a id="pop-btnco189" href="javascript:void(0)">天翼</a> </li></ul> </div> </div>',{verifyCode:Lgn.config.verifyImgUrl});
		divLgnwin.appendTo($(this._wraper));
		divPopwin.appendTo($(this._wraper));
		var formLeft = (document.body.clientWidth - $("." + chooseFormSkin).width()) / 2;
		$("." + chooseFormSkin).css({left: formLeft});
		if(this.needVerifyCode){
			$(".div-verify").css("display","block");
		}
	};
	Lgn.prototype.bindEvent = function(){
		var that = this;
		var $txtUn = $("#pop-txtUserName");
		var $txtPwd = $("#pop-txtPassword");
		$txtUn.blur(function(){
			that.usernameBlur && that.usernameBlur();
		});
		$txtPwd.blur(function(){
			that.passwordBlur && that.passwordBlur();
		});
		var changePic = function(){					
			var imgUrl = Lgn.config.verifyImgUrl + "?time=" + new Date().getTime();
			$("#sp-verifyImg").attr('src',imgUrl);
		};

		var destory = function(){
			$('.lgnwin0').remove();
			$('.popwin0').remove();
		};

		$('#pop-btnlogin').click(function(){
			var userName = $txtUn.val();
			var password = $txtPwd.val();
			var autoLogin = $("#pop-cbAutoLogin").attr("checked") == "checked" ? true:false;
			var hideLogin = $("#pop-cbHideLogin").attr("checked") == "checked" ? true:false;
			var verifyCode = $("#pop-txtVerify").val();
			userName = Base64.encode(userName);
			password = Base64.encode(password);
			$.ajax({
				dataType:"jsonp",
				type:'get',
				url:Lgn.config.lgnUrl,
				data:{
					loginID:userName,
					password:password,
					al:autoLogin,
					ishidden:hideLogin,
					vefifycode:verifyCode
				},
				crossDomain:true,
				jsonp:"popLoginCallback",
				success:function(d){
					d = eval("("+ d+ ")");
					if(d.code == 200){
						destory();
						if(that._callbackUrl){
							top.location.href = 'http://' + top.location.host +  top.location.pathname + '?backurl=' + that._callbackUrl;
						} else {
							top.location.reload();
						}
					} else if (d.code == 401){
						alert(d.message);
						that.needVerifyCode = true;
						$(".div-verify").css("display","block");
					} else if (d.code == 300){
						alert("\u9700\u8981\u7ed1\u5b9a\u7528\u6237\u6635\u79f0\u3002\u5373\u5c06\u8fdb\u5165\u7ed1\u5b9a\u7528\u6237\u6635\u79f0\u754c\u9762\u3002");
						window.location.href = d.message;
					} else if (d.code == 402){
						that.needVerifyCode = true;
						$(".div-verify").css("display","block");
						alert(d.message);
					} else {
						alert(d.message);
					};
				}
			});
});
$("#popLoginFormWin").bind("keydown",function(e){
	e = e || window.event;
	var keycode = e.keyCode || e.which;
	if(keycode == 13){
		$("#pop-btnlogin").click();
	}
});
$('#pop-btnregist').click(function(){
	$.ajax({
		dataType:'jsonp',
		url:Lgn.config.urlregist,
		data:{ajax:0},
		jsonp:"popRegistCallback",
		crossDomain:true,
		success:function(d){
			if(d && d.code == 0){
				top.location.reload();
			}
			else if(d && d.code == 2){
				alert(d.msg);
			}
			else if(d && d.code == 1){
			}
		}
	});
});
$(".lgnwin0").click(destory);
$("#pop-btnClose").click(destory);

$("#div-verify .change-pic").click(changePic);
$("#div-verify img").click(changePic);
$("#pop-btncoQQ").click(function(){
	window.location.href = Lgn.config.urlQQ + encodeURI(window.location.href);
});
$("#pop-btncoSian").click(function(){
	window.location.href = Lgn.config.urlSina + encodeURI(window.location.href);
});
$("#pop-btnco163").click(function(){
	window.location.href = Lgn.config.url163 + encodeURI(window.location.href);
});
$("#pop-btncoSohu").click(function(){
	window.location.href = Lgn.config.urlSohu + encodeURI(window.location.href);
});
$("#pop-btnco189").click(function(){
	window.location.href = Lgn.config.url189 + encodeURI(window.location.href);
});
$("#pop-btncoWechat").click(function(){
	window.location.href = Lgn.config.urlWechat + encodeURI(window.location.href);
});
}; 

Lgn.config = {
	lgnUrl:'http://login.home.news.cn/ilogin.do',
	// verifyImgUrl:'http://login.home.news.cn/captcha.do',// 测试地址
	verifyImgUrl:'http://login.home.news.cn/rcaptcha.do',
	urlregist:'http://login.home.news.cn/fastregist.do',
	urlQQ:'http://login.home.news.cn/profile/cologin.do?t=qq&callback=',
	urlSina:'http://login.home.news.cn/profile/cologin.do?t=sina&callback=',
	url163:'http://login.home.news.cn/profile/cologin.do?t=163&callback=',
	urlSohu:'http://login.home.news.cn/profile/cologin.do?t=sohu&callback=',
	url189:'http://login.home.news.cn/profile/cologin.do?t=tianyi&callback=',
	urlWechat:'http://login.home.news.cn/profile/cologin.do?t=weixin&callback='
};
Lgn.prototype.init = function(){
	this.createHtml();
	this.bindEvent();

};
var Base64 = {
	/* private property*/
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	/* public method for encoding */
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
			Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

		}

		return output;
	},

	/* public method for decoding */
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = Base64._keyStr.indexOf(input.charAt(i++));
			enc2 = Base64._keyStr.indexOf(input.charAt(i++));
			enc3 = Base64._keyStr.indexOf(input.charAt(i++));
			enc4 = Base64._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	/* private method for UTF-8 encoding */
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	/* private method for UTF-8 decoding */
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
};
return Lgn;
})