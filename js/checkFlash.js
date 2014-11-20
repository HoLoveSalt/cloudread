define("checkFlash", function() {	
			var hasFlash = 0, flashVersion = 0;　　
			if (document.all) {
				var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (swf) {
					hasFlash = 1;
					VSwf = swf.GetVariable("$version");
					flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
				}
			} else {
				if (navigator.plugins && navigator.plugins.length > 0) {
					var swf = navigator.plugins["Shockwave Flash"];
					if (swf) {
						hasFlash = 1;
						var words = swf.description.split(" ");
						for (var i = 0; i < words.length; ++i) {
							if (isNaN(parseInt(words[i]))) continue;
							flashVersion = parseInt(words[i]);
						}
					}
				}
			}
	return {
		isFlash: hasFlash,
		version: flashVersion
	};	
});