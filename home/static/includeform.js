// $.fn.includeForm = function(url, callback) {
// 	var obj = null;
// 	var u = '';
// 	if (url.split('?').length == 2) u = url + '&rnd=' + new Date().getTime();
// 	else u = url + '?rnd=' + new Date().getTime();
//
// 	var e = function() {
// 		var form = obj.find('form');
// 		form.submit(function() {
// 			$.post(u, form.serialize(), v);
// 			return false;
// 		});
//
// 		try{
// 			// Init form calendars
// 			obj.find('.init-calendar').each(function(i){
// 				new tcal({
// 					'controlname':this.id,
// 					'place':this.parentNode,
// 					'lang':'ru'
// 				});
//
// 			});
//
// 			// Init form calendar intervals
// 			obj.find('.init-calendar-interval').each(function(i){
// 				for(j=0; j<2; ++j){
// 					e = f_getElement(this.id + '['+j+']');
// 					new tcal({
// 						'controlname':e.id,
// 						'place':e.parentNode,
// 						'lang':'ru',
// 						'intervalpair':[
// 							this.id + '[0]',
// 							this.id + '[1]'
// 						],
// 						'intervalupdatecont' : this.id
// 					});
// 				}
// 			});
//
// 			$(".phone_input").mask("+7(999) 999-99-99");
//
// 			// Fix mg CAPTCHAs
// 			captcha = form.find('input[name=_cn]');
// 			if (captcha.length) {
// 				var head = document.getElementsByTagName('HEAD').item(0);
// 				var script = document.createElement("script");
// 				with (script) {
// 					type	= "text/javascript";
// 					charset = "UTF-8";
// 					src		= "http://captcha.oml.ru/static/captcha.js?2";
// 				};
// 				script.onload = script.onreadystatechange = function() {
// 					if (!script.onloadDone && (!this.readyState ||
// 								this.readyState === "loaded" || this.readyState === "complete") ) {
// 						script.onloadDone = true;
// 						var d = captcha.prev();
// 						mgCaptcha.draw("/my/s3/captcha/get.php", (d.length ? d[0] : null));
// 						// Handle memory leak in IE
// 						script.onload = script.onreadystatechange = null;
// 						if (head && script.parentNode) {
// 							head.removeChild(script);
// 						}
// 					}
// 				};
// 				/* Use insertBefore instead of appendChild  to circumvent an IE6 bug.
// 				 This arises when a base node is used (#2709 and #4378). */
// 				head.insertBefore(script, head.firstChild);
// 			};
// 		}catch(ex){}
// 	};
// 	var v = function(text, status, xhr) {
// 		if (status == 'success'){
// 			text = text.split('<!--includeForm-->');
// 			if (text.length == 3) {
// 				obj.html(text[1].replace(/[\r\n]/g, '').replace(/<script[^>]*>.*?<\/script>/g, ''));
// 				e();
// 				if (callback && typeof callback == "function")
// 					callback(obj);
// 			}
// 		}
// 	}
//
// 	obj = $(this);
// 	$.get(u, null, v);
// }
// vim: noet ts=4 sts=4 sw=4