;(function($) {
	// wrap tables in content for swipe on mobile devices
	$(function() {
		$('article.content').find('table').wrap('<div class="for-mobile-view"></div>');
	});
	
	$(function(){
	  $(".phone_input").mask("+7 (999) 999 99 99");
	});
	
}(jQuery));$(function() {

	var debounce = (function () {
		return function (fn, time) {
			var timer, func;
			func = function() {
				var args = [].slice.call(arguments, 0);
				window.clearTimeout(timer);
				timer = window.setTimeout(function () {
					window.requestAnimationFrame && window.requestAnimationFrame(function() {
						fn.apply(null, args);
					}) || fn.apply(null, args);
				}, time)
			};
			return func;
		}
	}());

	var throttle = (function() {
		return function (fn, threshhold, scope) {
			threshhold || (threshhold = 250);
			var last,
				deferTimer,
				func;
			func = function () {
				var context = scope || this;
				var now = +new Date,
					args = arguments;
				if (last && now < last + threshhold) {
					// hold on to it
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function () {
						last = now;
						fn.apply(context, args);
					}, threshhold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
			return func;
		}
	}());

	$('.blocklist').each(function() {
		var $blocklist = $(this),
			$items = $blocklist.find('.item-outer'),
			$list = $blocklist.find('.list'),
			$body = $blocklist.find('.body'),
			$controls = $blocklist.find('.controls'),
			$pagers = $blocklist.find('.bx-pager-wrap'),
			$auto_controls = $blocklist.find('.auto_controls'),
			options = {},
			count,
			col_arr, pager_arr, controls_arr,
			bxslider,
			auto_controls_arr,
			containerWidth,
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			 media_type,
			slider_arr = $blocklist.attr('data-slider').split(","),
			swipe_arr = $blocklist.attr('data-swipe').split(",");

		if (slider_arr.indexOf('1')>-1 && $.fn.bxSlider) {

			options.pagerSelector= $blocklist.attr('data-setting-pager_selector');
			options.prevSelector = $blocklist.attr('data-setting-prev_selector');
			options.nextSelector = $blocklist.attr('data-setting-next_selector');
			options.prevText = $blocklist.attr('data-setting-prev_text') || '';
			options.nextText = $blocklist.attr('data-setting-next_text') || '';
			options.auto = !!parseInt($blocklist.attr('data-setting-auto'));
			options.controls = !!parseInt($blocklist.attr('data-setting-controls'));
			options.pager = !!parseInt($blocklist.attr('data-setting-pager').split(',')[0]);
			options.pause = parseInt($blocklist.attr('data-setting-pause'), 10) || 4000;
			options.useCSS = isMobile;
			options.infiniteLoop = true;
			options.adaptiveHeight = false;
			options.mode = $blocklist.attr('data-setting-mode') || 'horizontal';
			options.touchEnabled = options.mode === 'horizontal';
			options.slideMargin = 0;
			options.maxSlides = parseInt($blocklist.attr('data-setting-count'), 10) || 1;
			options.minSlides = options.mode === 'horizontal' ? 1 : options.maxSlides;
			options.moveSlides = $blocklist.attr('data-setting-move') || 0;
			options.autoControlsSelector = $blocklist.attr('data-setting-auto_controls_selector');
			options.autoControls =  !!parseInt($blocklist.attr('data-setting-auto_controls').split(',')[0]);;
			options.autoControlsCombine =  !!parseInt($blocklist.attr('data-setting-autoControlsCombine'));

			col_arr = $blocklist.attr('data-setting-columns').split(",");
			pager_arr = $blocklist.attr('data-setting-pager').split(",");
			controls_arr = $blocklist.attr('data-setting-controls').split(",");
			auto_controls_arr = $blocklist.attr('data-setting-auto_controls').split(",");

			if (!options.autoControls && options.auto) {
				options.onSlideAfter = function() {
					bxslider.startAuto();
				}
			}

			$items.removeClass('hidden');
			if ($list.parent().hasClass('bx-viewport')) {
				$list.unwrap();
				$list.unwrap();
			}

			function init(force) {
				var setting_columns,
					isJustify, space_between,
					body_width = $('body').width(),
					mediaList = ["screen", "tablet_landscape", "tablet_portrait", "mobile_landscape", "mobile_portrait"],
					slider_arr = $blocklist.attr('data-slider').split(",");


				if (body_width >= 961) {
					media_type = "screen";
				} else if (body_width <= 960 && body_width >= 769) {
					media_type = "tablet_landscape";
				} else if (body_width <= 768 && body_width >= 641) {
					media_type = "tablet_portrait";
				} else if (body_width <= 640 && body_width >= 481) {
					media_type = "mobile_landscape";
				} else if (body_width <= 480) {
					media_type = "mobile_portrait";
				}
				var media_ind = mediaList.indexOf(media_type);
				var newContainerWidth = $blocklist.width(), itemHeight, viewportHeight;

				if (!$blocklist.is(':visible')) {
					if (bxslider) {
						bxslider.destroySlider();
					}
					return;
				}
				if (!force && containerWidth && containerWidth === newContainerWidth) {
					return;
				}
				containerWidth = newContainerWidth;

				if (bxslider) {
					bxslider.destroySlider();
				}

				count = parseInt($blocklist.attr('data-setting-count'), 10);

				isJustify = $body.css('justify-content') == "space-between" ? true : false;

				$list.width('auto');
				$items
					.attr('style', '')
					.slice(1).addClass('hidden').end()
					.width(options.slideWidth = $items.width())
					.removeClass('hidden');

				if (pager_arr.length > 1) {
					options.pager = !!parseInt(pager_arr[media_ind]);
				}
				if (controls_arr.length > 1) {
					options.controls = !!parseInt(controls_arr[media_ind]);
				}
				if (auto_controls_arr.length > 1) {
					options.autoControls = !!parseInt(auto_controls_arr[media_ind]);
				}

				$(options.pagerSelector).css({"display": options.pager == true ? "flex" : "none"});
				$blocklist.find(".controls").css({"display": options.controls == true ? "flex" : "none"});

				if (options.mode === 'vertical') {
					itemHeight = Math.max.apply(Math, $items.map(function() {
						return $(this).height()
					}).get());
					$items.css('min-height', itemHeight);
					viewportHeight = itemHeight * count;
				} else {
					setting_columns = col_arr[media_ind] == "auto" ? false : parseInt(col_arr[media_ind]);
					if (setting_columns) {
						count = setting_columns;
					}
					options.maxSlides = Math.min(count, Math.ceil($items.parent().width() / $items.width()));
				}

				if (isJustify) {
					if (options.maxSlides > 1) {
						space_between = Math.floor(($body.width() - $items.width() * options.maxSlides)/ (options.maxSlides-1));
						space_between = space_between < 0 ? 0 : space_between;
					} else {
						space_between = 0;
					}
					options.slideMargin = space_between;
				}
				if ($items.length > options.maxSlides && slider_arr[media_ind] == 1) {
					$list.css({'justify-content': 'flex-start'});
					if (bxslider) {
						bxslider.reloadSlider(options);
					} else {
						$list.data('bxslider', (bxslider = $list.bxSlider(options)));
					}
					if(options.pager){
						$pagers.css('display', 'flex');
					}
				} else {
					if(swipe_arr[media_ind]!=1){
						$list.css({'justify-content': isJustify ? 'space-between' : 'inherit', 'flex-wrap': 'wrap'});
						$items.css('width', $items.width()-1);
					} else {
						$list.css({'flex-wrap': 'nowrap'});
					}
					$pagers.hide();
					$controls.hide();
				}

				if (viewportHeight) {
					$list.parent().css('min-height', viewportHeight);
				}
				if (options.mode === 'horizontal') {
					var align = {};
					switch ($body.css('justify-content')) {
						case 'flex-end':
							align['margin-left'] = 'auto';
							align['margin-right'] = '0px';
							break;
						case 'center':
							align['margin-left'] = 'auto';
							align['margin-right'] = 'auto';
							break;
						default:
							align['margin-left'] = '0px';
							align['margin-right'] = 'auto';
					}
					$blocklist.find('.bx-wrapper').css(align);
				}
			}

			$(window).on('resize', debounce(init, 300));
			$(window).on('load', function(){
				init(true);
			});

			init();
		} else {
			$pagers.hide();
			$controls.hide();
		}

		$(window).on('resize', debounce(swipeScrollInit, 300));
		swipeScrollInit();

		function swipeScrollInit() {
			var $shadowLeft = $blocklist.find(".swipe-shadow-left");
			var $shadowRight = $blocklist.find(".swipe-shadow-right");
			if ($list.css("overflow-x") == "auto") {
				var scroll_width = $list.get(0).scrollWidth;
				var view_width = $list.width();
				$shadowLeft.css("pointer-events","none");
				$shadowRight.css("pointer-events","none");

				$list.off('scroll');
				$list.on('scroll', throttle(swipeScrollCheack, 200));

				swipeScrollCheack();

				function swipeScrollCheack() {
					var scroll_left = $list.scrollLeft();

					if (scroll_left > 0) {
						$shadowLeft.show();
					} else {
						$shadowLeft.hide();
					}

					if (scroll_left + view_width >= scroll_width - 1) {
						$shadowRight.hide();
					} else {
						$shadowRight.show();
					}
				}
			} else {
				$shadowLeft.hide();
				$shadowRight.hide();
			}
		}

	});
});
$(function () {
	$(document).click(function (event) {
		$('.contacts-block').each(function() {
			if ($(event.target).closest($(this)).length) {
				return;
			} else {
				$(this).find('.tgl-but').prop("checked", false);
				$(this).find('.icon').removeClass('active');
			}
		});
	});

	function setMargin($block) {
		if ($(window).width() > 960) {
			$block.find(".block-body-drop").css({
				"margin-left": "0px"
			});
		} else {
			var left = $block.offset().left * -1;
			$block.find(".block-body-drop").css({
				"margin-left": left + "px"
			});
		}
	}

	$('.contacts-block').each(function() {
		var $block = $(this),
			allClasses = $block.attr("class").split(" "),
			mainClass = allClasses[0],
			mainSelector = ".side-panel ."+mainClass+" .block-body-drop",
			styles = document.styleSheets;

		for(var i = 0; i < styles.length; i++) {
			if (styles[i].href && styles[i].href.indexOf("styles.css") !== -1) {
				for(var j = 0; j < styles[i].cssRules.length; j++) {
					if (styles[i].cssRules[j].selectorText == mainSelector && styles[i].cssRules[j].style.width == "100vw") {
						$block.data("fullwidth", 1);
						setMargin($block);
						break;
					}
				}
				break;
			}
		}
	});

	$(window).resize(function() {
		$('.contacts-block').each(function() {
			var $block = $(this);
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
		});
	});

	$('.contacts-block').each(function() {
		var $block = $(this);
		$block.find('.icon').click(function() {
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
			if ($block.find('.tgl-but').prop("checked")) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});
	});
});
$(function () {
	$(document).click(function (event) {
		$('.contacts-block').each(function() {
			if ($(event.target).closest($(this)).length) {
				return;
			} else {
				$(this).find('.tgl-but').prop("checked", false);
				$(this).find('.icon').removeClass('active');
			}
		});
	});

	function setMargin($block) {
		if ($(window).width() > 960) {
			$block.find(".block-body-drop").css({
				"margin-left": "0px"
			});
		} else {
			var left = $block.offset().left * -1;
			$block.find(".block-body-drop").css({
				"margin-left": left + "px"
			});
		}
	}

	$('.contacts-block').each(function() {
		var $block = $(this),
			allClasses = $block.attr("class").split(" "),
			mainClass = allClasses[0],
			mainSelector = ".side-panel ."+mainClass+" .block-body-drop",
			styles = document.styleSheets;

		for(var i = 0; i < styles.length; i++) {
			if (styles[i].href && styles[i].href.indexOf("styles.css") !== -1) {
				for(var j = 0; j < styles[i].cssRules.length; j++) {
					if (styles[i].cssRules[j].selectorText == mainSelector && styles[i].cssRules[j].style.width == "100vw") {
						$block.data("fullwidth", 1);
						setMargin($block);
						break;
					}
				}
				break;
			}
		}
	});

	$(window).resize(function() {
		$('.contacts-block').each(function() {
			var $block = $(this);
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
		});
	});

	$('.contacts-block').each(function() {
		var $block = $(this);
		$block.find('.icon').click(function() {
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
			if ($block.find('.tgl-but').prop("checked")) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});
	});
});
/*
 *  wmS3Menu v1.0.0
 *  K.I. 433
 */
;(function ($, window, document, undefined ) {
	var pluginName = 'wmS3Menu',
		defaults = {
			screenButton: false,
			responsiveTl: false,
			responsiveTp: false,
			responsiveMl: false,
			moreText: '...',
			childIcons: false,
			childIconsClass: 'has-child-icon'
		};
	// Проверка на касание
	var isTouchable = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
	var $win = $(window);
	var winWidth = $win.width();
	var $doc = $(document);

	var pluginObj = {
		_events: {
			hover: function(menuWrap, item, settings){
				var link = item.find('> a');
				var linkIcon = link.find('.' + settings.childIconsClass);
				var iconLen = linkIcon.length;
				var subMenu = item.find('> ul');
				var showTimeout;
				// Отображение
				function menuShow() {
					clearTimeout(showTimeout);
					item.siblings().find('> ul').css('display', '');
					// Определение положения выпадашки чтобы не выводилось за пределы окна
					pluginObj._menuPosition(subMenu);

					link.addClass('hover');
					if (iconLen) {
						linkIcon.addClass('hover');
					}
				}
				// Скрытие
				function menuHide() {
					showTimeout = setTimeout(function(){
						link.removeClass('hover');
						subMenu.css('display', '');
						if (iconLen) {
							linkIcon.removeClass('hover');
						}
					}, 500);
				}
				// Отключение и подключение событий
				item.off({
					'mouseenter.wmS3Menu': menuShow,
					'mouseleave.wmS3Menu': menuHide
				});
				item.on({
					'mouseenter.wmS3Menu': menuShow,
					'mouseleave.wmS3Menu': menuHide
				});
			},
			click: function(menuWrap, item, settings){
				var link = item.find('> a');
				var linkIcon = link.find('.' + settings.childIconsClass);
				var iconLen = linkIcon.length;
				var subMenu = item.find('> ul');
				// Переключение отображения
				function menuToggle() {
					if (subMenu.is(':visible')) {
						if (isTouchable) {
							document.location = link.attr('href');
						}
						link.removeClass('hover');
						subMenu.css('display', '');
						item.removeClass('submenu-opened');
						if (iconLen) {
							linkIcon.removeClass('hover');
						}
					} else {
						// Определение положения выпадашки чтобы не выводилось за пределы окна
						pluginObj._menuPosition(subMenu);

						link.addClass('hover');
						item.addClass('submenu-opened');
						if (iconLen) {
							linkIcon.addClass('hover');
						}
					}
					return false;
				}
				// Отключение и подключение событий
				link.off('click.wmS3Menu');
				link.on('click.wmS3Menu', menuToggle);
			},
			click_tree: function(menuWrap, item, settings){
				var link = item.find('> a');
				var linkIcon = link.find('.' + settings.childIconsClass);
				var subMenu = item.find('> ul');
				// Переключение отображения
				function menuToggle(event) {
					var targ = $(event.target);

					if (targ.closest(linkIcon).length) {
						if (subMenu.is(':visible')) {
							link.removeClass('hover');
							subMenu.css('display', '');
							item.removeClass('submenu-opened');
							linkIcon.removeClass('hover');
						} else {
							// Определение положения выпадашки чтобы не выводилось за пределы окна
							pluginObj._menuPosition(subMenu);

							link.addClass('hover');
							item.addClass('submenu-opened');
							linkIcon.addClass('hover');
						}
						return false;
					}
				}
				// Отключение и подключение событий
				link.off('click.wmS3Menu');
				link.on('click.wmS3Menu', menuToggle);
			}
		},
		_menuPosition: function(subMenu) {
			// Определение положения выпадашки чтобы не выводилось за пределы окна
			winWidth = $win.width();

			subMenu.css('display', 'block');

			if (subMenu.parent().hasClass('first-level') === false) {
				subMenu.css({
					'visibility': 'hidden',
					'opacity': 0
				});

				var menuRect = subMenu[0].getBoundingClientRect();
				var marginR = parseInt(subMenu.css('margin-right'));
				var parentWidth = subMenu.parent().width();

				if (marginR > parentWidth) {
					subMenu.css('margin-right', parentWidth);
				}

				if (menuRect.right >= winWidth) {
					subMenu.css({
						'left': '-100%',
						'margin-left': 0
					});
				}
				subMenu.css({
					'visibility': '',
					'opacity': ''
				});
			}
		}
	};
	function Plugin(element, options) {
		this.element = element;

		this.options = $.extend({}, defaults, options, $(this.element).data()) ;

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}
	Plugin.prototype = {
		init: function () {
			var settings = this.options;
			// Определение ширины медиа
			var moreButFlag = false;
			if (window.matchMedia('all and (max-width: 640px)').matches) {
				moreButFlag = settings.responsiveMl;
			} else if (window.matchMedia('all and (max-width: 768px)').matches) {
				moreButFlag = settings.responsiveTp;
			} else if (window.matchMedia('all and (max-width: 960px)').matches) {
				moreButFlag = settings.responsiveTl;
			} else {
				moreButFlag = settings.screenButton;
			}
			// Обертка меню
			var menuWrap = $(this.element);
			var menuClass = menuWrap.attr('class');
			var menuMainUl = $(this.element.querySelector('ul'));
			// Проверка на наличие меню в Side panel
			if (menuWrap.closest('.side-panel-content').length) {
				moreButFlag = false;
			}

			menuMainUl.children().addClass('first-level');
			// Настройки для горизонтального меню
			if (!!menuClass.match(/horizontal/i)) {
				var menuWidth = menuMainUl.width();
				var itemsWidth = 0, hideArr = [], hideLength;
				// Кнопка More
				var moreBut = menuMainUl.find('.more-button');
				if (!moreBut.length) {
					moreBut = $('<li class="more-button"><a href="#"><span>' + settings.moreText + '</span></a></li>');// data-trigger="click"
					menuMainUl.append(moreBut);
				}
				// Меню More
				var moreMenu = moreBut.find('> ul');
				if (!moreMenu.length) {
					moreMenu = $('<ul></ul>');
					moreBut.append(moreMenu);
				}

				moreBut.removeClass('removed').attr('data-trigger', 'hover');
				menuMainUl.children().css('display', '');

				var firstLevelItems = menuMainUl.children(':visible').not('.more-button');
				moreMenu.html('');

				if (moreButFlag === 'more' || moreButFlag === 'button') {
					moreBut.removeClass('disabled');

					menuWidth -= moreBut.outerWidth();

					firstLevelItems.each(function(){
						var thisItem = $(this);
						itemsWidth += thisItem.outerWidth(true);
						if (itemsWidth >= menuWidth) {
							hideArr.push(thisItem.clone());
							thisItem.hide();
						}
					});

					hideLength = hideArr.length;
					if (hideLength) {
						for (var ind = 0; ind < hideLength; ind++) {
							moreMenu.append(hideArr[ind]);
						}
						moreBut.removeClass('disabled');
					} else {
						moreBut.addClass('disabled');
					}
				} else {
					moreBut.addClass('disabled');
				}
			}
			// Вложенные подуровни меню
			var menuInner = menuMainUl.find('ul');
			var menuItems = menuInner.parent();
			var menuLinks = menuItems.find('> a');
			// Стрелочки для подуровней
			var menuLinksIcons = menuLinks.find('.' + settings.childIconsClass);
			var childIconLen = menuLinksIcons.length;
			// Тип отображения меню
			var mShow = 'popup';
			if (!!menuClass.match(/dropdown/i)) {
				mShow = 'dropdown';
			} else if (!!menuClass.match(/treemenu/i)) {
				mShow = 'treemenu';
			}
			if (mShow === 'popup') {
				menuInner.hide();
			}
			if (childIconLen) {
				menuLinksIcons.remove();
			}
			if (!!settings.childIcons) {
				// Добавление стрелочек для подуровней
				var childIconHTML = '<em class="' + settings.childIconsClass + '"></em>';

				if (mShow === 'treemenu') {
					childIconHTML = '<em class="' + settings.childIconsClass + '"><b style="position: absolute; top: 50%; left: 50%; width: 30px; height: 30px; margin: -15px 0 0 -15px;"></b></em>';
				}

				var childIconTag = $(childIconHTML);
				menuLinks.append(childIconTag.clone());

				menuLinksIcons = menuLinks.find('.' + settings.childIconsClass);
				childIconLen = menuLinksIcons.length;
			}
			// Удаление всех событий на ссылках
			menuLinks.removeClass('hover').off('click.wmS3Menu');
			menuInner.css('display', '');
			if (childIconLen) {
				menuLinksIcons.removeClass('hover');
			}

			menuItems.each(function() {
				var thisItem = $(this);
				var trigger = thisItem.data('trigger') || 'hover';

				if (mShow === 'dropdown' || isTouchable) {
					trigger = 'click';
				} else if (mShow === 'treemenu') {
					trigger = 'click_tree';
				}
				pluginObj._events[trigger](menuWrap, thisItem, settings);
			});
			// Клик по документу
			if (isTouchable) {
				function docClick(e) {
					var target = $(e.target);
					if (target.closest(menuWrap).length === 0) {
						menuLinks.removeClass('hover');
						menuInner.css('display', '');
						menuItems.removeClass('submenu-opened');

						if (childIconLen) {
							menuLinksIcons.removeClass('hover');
						}
					}
				}
				$doc.off('touchstart.wmS3Menu', docClick);
				$doc.on('touchstart.wmS3Menu', docClick);
			}
		},
		update: function () {
			this.init();
		}
	};
	if (!$.fn[pluginName]) {
		$.fn[pluginName] = function (options) {
			var args = arguments;
			if (options === undefined || typeof options === 'object') {
				return this.each(function () {
					if (!$.data(this, 'plugin_' + pluginName)) {
						$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
					}
				});
			} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
				var returns;
				this.each(function () {
					var instance = $.data(this, 'plugin_' + pluginName);
					if (instance instanceof Plugin && typeof instance[options] === 'function') {
						returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					}
					if (options === 'destroy') {
						$.data(this, 'plugin_' + pluginName, null);
					}
				});
				return returns !== undefined ? returns : this;
			}
		};
	}
	$(function () {
		var wmMenuWrap = $('.wm-widget-menu.horizontal');
		wmMenuWrap[pluginName]();

		$win.on('resize.wmS3Menu', function(){
			wmMenuWrap[pluginName]('update');
		});
	});

	setTimeout(function(){
		$win.trigger('resize');
	}, 300);
}(jQuery, window, document));
$(function () {
	$(document).click(function (event) {
		$('.contacts-block').each(function() {
			if ($(event.target).closest($(this)).length) {
				return;
			} else {
				$(this).find('.tgl-but').prop("checked", false);
				$(this).find('.icon').removeClass('active');
			}
		});
	});

	function setMargin($block) {
		if ($(window).width() > 960) {
			$block.find(".block-body-drop").css({
				"margin-left": "0px"
			});
		} else {
			var left = $block.offset().left * -1;
			$block.find(".block-body-drop").css({
				"margin-left": left + "px"
			});
		}
	}

	$('.contacts-block').each(function() {
		var $block = $(this),
			allClasses = $block.attr("class").split(" "),
			mainClass = allClasses[0],
			mainSelector = ".side-panel ."+mainClass+" .block-body-drop",
			styles = document.styleSheets;

		for(var i = 0; i < styles.length; i++) {
			if (styles[i].href && styles[i].href.indexOf("styles.css") !== -1) {
				for(var j = 0; j < styles[i].cssRules.length; j++) {
					if (styles[i].cssRules[j].selectorText == mainSelector && styles[i].cssRules[j].style.width == "100vw") {
						$block.data("fullwidth", 1);
						setMargin($block);
						break;
					}
				}
				break;
			}
		}
	});

	$(window).resize(function() {
		$('.contacts-block').each(function() {
			var $block = $(this);
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
		});
	});

	$('.contacts-block').each(function() {
		var $block = $(this);
		$block.find('.icon').click(function() {
			if ($block.data("fullwidth") == 1) {
				setMargin($block);
			}
			if ($block.find('.tgl-but').prop("checked")) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');
			}
		});
	});
});
$(function() {
	if (window.ymaps) {
		ymaps.ready(function () {
			$('.widget-type-map[data-center]').each(function () {
				var self = $(this);
				var id = self.attr('id');
				var data = false;
				if (self.find('[type=hidden]').val()) {
					data = typeof JSON.parse == 'function' ? JSON.parse(self.find('[type=hidden]').val()) : eval(self.find('[type=hidden]').val());
				}
				var params = {
					type: self.data('type') || 'yandex#map',
					center: self.data('center').split(',').map(function (e) {
						return $.trim(e)
					}),
					zoom: self.data('zoom') || 9,
					controls: self.data('controls') ? self.data('controls').split(',').map(function (e) {
						return $.trim(e)
					}) : []
				};
				var myMap = new ymaps.Map(id, params);
				myMap.behaviors.disable('scrollZoom');
				if (data) {
					for (var i in data) {
						var myPlacemark = new ymaps.Placemark(data[i].point.split(',').map(function (e) {
							return $.trim(e);
						}), {
							iconContent: $('<div>').html(data[i].iconContent).text(),
							balloonContent: $('<div>').html(data[i].balloonContent).html()
						}, {
							preset: data[i].preset
						});
						myMap.geoObjects.add(myPlacemark);
					}
				}
			});
		});
	}
});
$(function() {

	var debounce = (function () {
		return function (fn, time) {
			var timer, func;
			func = function() {
				var args = [].slice.call(arguments, 0);
				window.clearTimeout(timer);
				timer = window.setTimeout(function () {
					window.requestAnimationFrame && window.requestAnimationFrame(function() {
						fn.apply(null, args);
					}) || fn.apply(null, args);
				}, time)
			};
			return func;
		}
	}());

	var throttle = (function() {
		return function (fn, threshhold, scope) {
			threshhold || (threshhold = 250);
			var last,
				deferTimer,
				func;
			func = function () {
				var context = scope || this;
				var now = +new Date,
					args = arguments;
				if (last && now < last + threshhold) {
					// hold on to it
					clearTimeout(deferTimer);
					deferTimer = setTimeout(function () {
						last = now;
						fn.apply(context, args);
					}, threshhold);
				} else {
					last = now;
					fn.apply(context, args);
				}
			};
			return func;
		}
	}());

	$('.bx-reviews').each(function() {
		var $reviews = $(this),
			$items = $reviews.find('.item-outer'),
			$list = $reviews.find('.list'),
			$body = $reviews.find('.body'),
			$controls = $reviews.find('.controls'),
			$pagers = $reviews.find('.bx-pager-wrap'),
			options = {},
			auto_controls_arr,
			count,
			col_arr, pager_arr, controls_arr,
			bxslider,
			containerWidth,
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			slider_arr = $reviews.attr('data-slider').split(","),
			swipe_arr = $reviews.attr('data-swipe').split(",");

		if (slider_arr.indexOf('1')>-1 && $.fn.bxSlider) {

			options.pagerSelector= $reviews.attr('data-setting-pager_selector');
			options.prevSelector = $reviews.attr('data-setting-prev_selector');
			options.nextSelector = $reviews.attr('data-setting-next_selector');
			options.prevText = $reviews.attr('data-setting-prev_text') || '';
			options.nextText = $reviews.attr('data-setting-next_text') || '';
			options.auto = !!parseInt($reviews.attr('data-setting-auto'));
			options.controls = !!parseInt($reviews.attr('data-setting-controls'));
			options.pager = !!parseInt($reviews.attr('data-setting-pager').split(',')[0]);
			options.pause = parseInt($reviews.attr('data-setting-pause'), 10) || 4000;
			options.useCSS = isMobile;
			options.infiniteLoop = true;
			options.adaptiveHeight = false;
			options.mode = $reviews.attr('data-setting-mode') || 'horizontal';
			options.touchEnabled = options.mode === 'horizontal';
			options.slideMargin = 0;
			options.maxSlides = parseInt($reviews.attr('data-setting-count'), 10) || 1;
			options.minSlides = options.mode === 'horizontal' ? 1 : options.maxSlides;
			options.moveSlides = $reviews.attr('data-setting-move') || 0;
			options.autoControlsSelector = $reviews.attr('data-setting-auto_controls_selector');
			options.autoControls =  !!parseInt($reviews.attr('data-setting-auto_controls').split(',')[0]);
			options.autoControlsCombine =  !!parseInt($reviews.attr('data-setting-autoControlsCombine'));

			col_arr = $reviews.attr('data-setting-columns').split(",");
			pager_arr = $reviews.attr('data-setting-pager').split(",");
			controls_arr = $reviews.attr('data-setting-controls').split(",");
			auto_controls_arr = $reviews.attr('data-setting-auto_controls').split(",");

			if (!options.autoControls && options.auto) {
				options.onSlideAfter = function() {
					bxslider.startAuto();
				}
			}

			$items.removeClass('hidden');
			if ($list.parent().hasClass('bx-viewport')) {
				$list.unwrap();
				$list.unwrap();
			}

			function init(force) {
				var media_type,
					body_width = $('body').width();

				var mediaList = ["screen", "tablet_landscape", "tablet_portrait", "mobile_landscape", "mobile_portrait"];
				var media_ind, setting_columns,
					isJustify, space_between;
				var slider_arr = $reviews.attr('data-slider').split(",");

				var newContainerWidth = $reviews.width(), itemHeight, viewportHeight;
				if (!$reviews.is(':visible')) {
					if (bxslider) {
						bxslider.destroySlider();
					}
					return;
				}
				if (!force && containerWidth && containerWidth === newContainerWidth) {
					return;
				}
				containerWidth = newContainerWidth;

				if (bxslider) {
					bxslider.destroySlider();
				}

				if (body_width >= 961) {
					media_type = "screen";
				} else if (body_width <= 960 && body_width >= 769) {
					media_type = "tablet_landscape";
				} else if (body_width <= 768 && body_width >= 641) {
					media_type = "tablet_portrait";
				} else if (body_width <= 640 && body_width >= 481) {
					media_type = "mobile_landscape";
				} else if (body_width <= 480) {
					media_type = "mobile_portrait";
				}
				media_ind = mediaList.indexOf(media_type);
				count = parseInt($reviews.attr('data-setting-count'), 10);

				isJustify = $body.css('justify-content') == "space-between" ? true : false;

				$list.width('auto');
				$items
					.attr('style', '')
					.slice(1).addClass('hidden').end()
					.width(options.slideWidth = $items.width())
					.removeClass('hidden');

				if (pager_arr.length > 1) {
					options.pager = !!parseInt(pager_arr[media_ind]);
				}
				if (controls_arr.length > 1) {
					options.controls = !!parseInt(controls_arr[media_ind]);
				}
				if (auto_controls_arr.length > 1) {
					options.autoControls = !!parseInt(auto_controls_arr[media_ind]);
				}

				$(options.pagerSelector).css({"display": options.pager == true ? "flex" : "none"});
				$reviews.find(".controls").css({"display": options.controls == true ? "flex" : "none"});

				if (options.mode === 'vertical') {
					itemHeight = Math.max.apply(Math, $items.map(function() {
						return $(this).height()
					}).get());
					$items.css('min-height', itemHeight);
					viewportHeight = itemHeight * count;
				} else {
					setting_columns = col_arr[media_ind] == "auto" ? false : parseInt(col_arr[media_ind]);
					if (setting_columns) {
						count = setting_columns;
					}
					options.maxSlides = Math.min(count, Math.ceil($items.parent().width() / $items.width()));
				}

				if (isJustify) {
					if (options.maxSlides > 1) {
						space_between = Math.floor(($body.width() - $items.width() * options.maxSlides)/ (options.maxSlides-1));
						space_between = space_between < 0 ? 0 : space_between;
					} else {
						space_between = 0;
					}
					options.slideMargin = space_between;
				}

				if ($items.length > options.maxSlides && slider_arr[media_ind] == 1) {
					$list.css({'justify-content': 'flex-start'});
					if (bxslider) {
						bxslider.reloadSlider(options);
					} else {
						$list.data('bxslider', (bxslider = $list.bxSlider(options)));
					}
					if(options.pager){
						$pagers.css('display', 'flex');
					}
				} else {
					if(swipe_arr[media_ind]!=1){
						$list.css({'justify-content': isJustify ? 'space-between' : 'inherit', 'flex-wrap': 'wrap'});
						$items.css('width', $items.width()-1);
					} else {
						$list.css({'flex-wrap': 'nowrap'});
					}
					$pagers.hide();
					$controls.hide();
				}

				if (viewportHeight) {
					$list.parent().css('min-height', viewportHeight);
				}
				if (options.mode === 'horizontal') {
					var align = {};
					switch ($body.css('justify-content')) {
						case 'flex-end':
							align['margin-left'] = 'auto';
							align['margin-right'] = '0px';
							break;
						case 'center':
							align['margin-left'] = 'auto';
							align['margin-right'] = 'auto';
							break;
						default:
							align['margin-left'] = '0px';
							align['margin-right'] = 'auto';
					}
					$reviews.find('.bx-wrapper').css(align);
				}
			}

			$(window).on('resize', debounce(init, 300));
			$(window).on('load', function(){
				init(true);
			});

			init();
		} else {
			$pagers.hide();
			$controls.hide();
		}

		$(window).on('resize', debounce(swipeScrollInit, 300));
		swipeScrollInit();

		function swipeScrollInit() {
			var $shadowLeft = $reviews.find(".swipe-shadow-left");
			var $shadowRight = $reviews.find(".swipe-shadow-right");
			if ($list.css("overflow-x") == "auto") {
				var scroll_width = $list.get(0).scrollWidth;
				var view_width = $list.width();
				$shadowLeft.css("pointer-events","none");
				$shadowRight.css("pointer-events","none");

				$list.off('scroll');
				$list.on('scroll', throttle(swipeScrollCheack, 200));

				swipeScrollCheack();

				function swipeScrollCheack() {
					var scroll_left = $list.scrollLeft();

					if (scroll_left > 0) {
						$shadowLeft.show();
					} else {
						$shadowLeft.hide();
					}

					if (scroll_left + view_width >= scroll_width - 1) {
						$shadowRight.hide();
					} else {
						$shadowRight.show();
					}
				}
			} else {
				$shadowLeft.hide();
				$shadowRight.hide();
			}
		}

	});
});
/*
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

"use strict";

(function (exports) {

	function sign(number) {
		if (number < 0)
			return -1;
		if (number > 0)
			return 1;
		return 0;
	}

	function Animator(delegate) {
		this.delegate = delegate;
		this.startTimeStamp = 0;
		this.request_ = null;
	};

	Animator.prototype.scheduleAnimation = function () {
		if (this.request_)
			return;
		this.request_ = requestAnimationFrame(this.onAnimation_.bind(this));
	};

	Animator.prototype.startAnimation = function () {
		this.startTimeStamp = 0;
		this.scheduleAnimation();
	};

	Animator.prototype.stopAnimation = function () {
		cancelAnimationFrame(this.request_);
		this.startTimeStamp = 0;
		this.request_ = null;
	};

	Animator.prototype.onAnimation_ = function (timeStamp) {
		this.request_ = null;
		if (!this.startTimeStamp)
			this.startTimeStamp = timeStamp;
		if (this.delegate.onAnimation(timeStamp))
			this.scheduleAnimation();
	};

	function VelocityTracker() {
		this.recentTouchMoves_ = [];
		this.velocityX = 0;
		this.velocityY = 0;
	}

	VelocityTracker.kTimeWindow = 50;

	VelocityTracker.prototype.pruneHistory_ = function (timeStamp) {
		for (var i = 0; i < this.recentTouchMoves_.length; ++i) {
			if (this.recentTouchMoves_[i].timeStamp > timeStamp - VelocityTracker.kTimeWindow) {
				this.recentTouchMoves_ = this.recentTouchMoves_.slice(i);
				return;
			}
		}
		// All touchmoves are old.
		this.recentTouchMoves_ = [];
	};

	VelocityTracker.prototype.update_ = function (e) {
		this.pruneHistory_(e.timeStamp);
		this.recentTouchMoves_.push(e);

		var oldestTouchMove = this.recentTouchMoves_[0];

		var deltaX = e.changedTouches[0].clientX - oldestTouchMove.changedTouches[0].clientX;
		var deltaY = e.changedTouches[0].clientY - oldestTouchMove.changedTouches[0].clientY;
		var deltaT = e.timeStamp - oldestTouchMove.timeStamp;

		if (deltaT > 0) {
			this.velocityX = deltaX / deltaT;
			this.velocityY = deltaY / deltaT;
		} else {
			this.velocityX = 0;
			this.velocityY = 0;
		}
	};

	VelocityTracker.prototype.onTouchStart = function (e) {
		this.recentTouchMoves_.push(e);
		this.velocityX = 0;
		this.velocityY = 0;
	};

	VelocityTracker.prototype.onTouchMove = function (e) {
		this.update_(e);
	};

	VelocityTracker.prototype.onTouchEnd = function (e) {
		this.update_(e);
		this.recentTouchMoves_ = [];
	};

	function LinearTimingFunction() {
	};

	LinearTimingFunction.prototype.scaleTime = function (fraction) {
		return fraction;
	};

	function CubicBezierTimingFunction(spec) {
		this.map = [];
		for (var ii = 0; ii <= 100; ii += 1) {
			var i = ii / 100;
			this.map.push([
				3 * i * (1 - i) * (1 - i) * spec[0] +
				3 * i * i * (1 - i) * spec[2] + i * i * i,
				3 * i * (1 - i) * (1 - i) * spec[1] +
				3 * i * i * (1 - i) * spec[3] + i * i * i
			]);
		}
	};

	CubicBezierTimingFunction.prototype.scaleTime = function (fraction) {
		var fst = 0;
		while (fst !== 100 && fraction > this.map[fst][0]) {
			fst += 1;
		}
		if (fraction === this.map[fst][0] || fst === 0) {
			return this.map[fst][1];
		}
		var yDiff = this.map[fst][1] - this.map[fst - 1][1];
		var xDiff = this.map[fst][0] - this.map[fst - 1][0];
		var p = (fraction - this.map[fst - 1][0]) / xDiff;
		return this.map[fst - 1][1] + p * yDiff;
	};

	var presetTimingFunctions = {
		'linear': new LinearTimingFunction(),
		'ease': new CubicBezierTimingFunction([0.25, 0.1, 0.25, 1.0]),
		'ease-in': new CubicBezierTimingFunction([0.42, 0, 1.0, 1.0]),
		'ease-out': new CubicBezierTimingFunction([0, 0, 0.58, 1.0]),
		'ease-in-out': new CubicBezierTimingFunction([0.42, 0, 0.58, 1.0]),
	};

	function DrawerController(options) {
		this.velocityTracker = new VelocityTracker();
		this.animator = new Animator(this);

		this.target = options.target;
		this.left = options.left;
		this.right = options.right;
		this.position = options.position;

		this.width = this.right - this.left;
		this.curve = presetTimingFunctions[options.curve || 'linear'];

		this.willOpenCallback = options.willOpen;
		this.didCloseCallback = options.didClose;
		this.animateCallback = options.onAnimate;

		this.state = DrawerController.kClosed;

		this.defaultAnimationSpeed = (this.right - this.left) / DrawerController.kBaseSettleDurationMS;

		this.onTouchMove = this.onTouchMove.bind(this);
		this.onTouchEnd = this.onTouchEnd.bind(this);

		this.target.addEventListener('touchstart', this.onTouchStart.bind(this));
	}

	DrawerController.kOpened = 'opened';
	DrawerController.kClosed = 'closed';
	DrawerController.kOpening = 'opening';
	DrawerController.kClosing = 'closing';
	DrawerController.kDragging = 'dragging';
	DrawerController.kFlinging = 'flinging';

	DrawerController.kBaseSettleDurationMS = 246;
	DrawerController.kMaxSettleDurationMS = 600;

	DrawerController.kMinFlingVelocity = 0.4;  // Matches Android framework.
	DrawerController.kTouchSlop = 5;  // Matches Android framework.
	DrawerController.kTouchSlopSquare = DrawerController.kTouchSlop * DrawerController.kTouchSlop;

	DrawerController.prototype.restrictToCurrent = function (offset) {
		return Math.max(this.left, Math.min(this.position, offset));
	};

	DrawerController.prototype.restrictToBounds = function (offset) {
		return Math.max(this.left, Math.min(this.right, offset));
	};

	DrawerController.prototype.onTouchStart = function (e) {
		this.velocityTracker.onTouchStart(e);

		var touchX = e.changedTouches[0].clientX;
		var touchY = e.changedTouches[0].clientY;

		if (this.state != DrawerController.kOpened) {
			if (touchX != this.restrictToCurrent(touchX))
				return;
			this.state = DrawerController.kDragging;
		}

		this.animator.stopAnimation();
		this.target.addEventListener('touchmove', this.onTouchMove);
		this.target.addEventListener('touchend', this.onTouchEnd);
		// TODO(abarth): Handle touchcancel.

		this.startX = touchX;
		this.startY = touchY;
		this.startPosition = this.position;
		this.touchBaseX = Math.min(touchX, this.startPosition);
	};

	DrawerController.prototype.onTouchMove = function (e) {
		this.velocityTracker.onTouchMove(e);

		if (this.state == DrawerController.kOpened) {
			var deltaX = e.changedTouches[0].clientX - this.startX;
			var deltaY = e.changedTouches[0].clientY - this.startY;

			if (deltaX * deltaX + deltaY * deltaY < DrawerController.kTouchSlopSquare) {
				e.preventDefault();
				return;
			}

			if (Math.abs(deltaY) > Math.abs(deltaX)) {
				this.target.removeEventListener('touchmove', this.onTouchMove);
				this.target.removeEventListener('touchend', this.onTouchEnd);
				return;
			}

			this.state = DrawerController.kDragging;
		}

		e.preventDefault();
		var touchDeltaX = e.changedTouches[0].clientX - this.touchBaseX;
		this.position = this.restrictToBounds(this.startPosition + touchDeltaX);
		this.animator.scheduleAnimation();
	};

	DrawerController.prototype.onTouchEnd = function (e) {
		this.velocityTracker.onTouchEnd(e);
		this.target.removeEventListener('touchmove', this.onTouchMove);
		this.target.removeEventListener('touchend', this.onTouchEnd);

		var velocityX = this.velocityTracker.velocityX;
		if (Math.abs(velocityX) > DrawerController.kMinFlingVelocity) {
			this.fling(velocityX);
		} else if (this.isOpen()) {
			this.open();
		} else {
			this.close();
		}
	};

	DrawerController.prototype.openFraction = function () {
		var width = this.right - this.left;
		var offset = this.position - this.left;
		return offset / width;
	};

	DrawerController.prototype.isOpen = function () {
		return this.openFraction() >= 0.5;
	};

	DrawerController.prototype.isOpening = function () {
		return this.state == DrawerController.kOpening ||
			(this.state == DrawerController.kFlinging && this.animationVelocityX > 0);
	}

	DrawerController.prototype.isClosing = function () {
		return this.state == DrawerController.kClosing ||
			(this.state == DrawerController.kFlinging && this.animationVelocityX < 0);
	}

	DrawerController.prototype.toggle = function () {
		if (this.isOpen())
			this.close();
		else
			this.open();
	};

	DrawerController.prototype.open = function () {
		if (!this.position)
			this.willOpenCallback.call(this.target);

		this.animator.stopAnimation();
		this.animationDuration = 400;
		this.state = DrawerController.kOpening;
		this.animate();
	};

	DrawerController.prototype.close = function () {
		this.animator.stopAnimation();
		this.animationDuration = 400;
		this.state = DrawerController.kClosing;
		this.animate();
	};

	DrawerController.prototype.fling = function (velocityX) {
		this.animator.stopAnimation();
		this.animationVelocityX = velocityX;
		this.state = DrawerController.kFlinging;
		this.animate();
	};

	DrawerController.prototype.animate = function () {
		this.positionAnimationBase = this.position;
		this.animator.startAnimation();
	};

	DrawerController.prototype.targetPosition = function (deltaT) {
		if (this.state == DrawerController.kFlinging)
			return this.positionAnimationBase + this.animationVelocityX * deltaT;
		var targetFraction = this.curve.scaleTime(deltaT / this.animationDuration);
		var animationWidth = this.state == DrawerController.kOpening ?
		this.width - this.positionAnimationBase : -this.positionAnimationBase;
		return this.positionAnimationBase + targetFraction * animationWidth;
	};

	DrawerController.prototype.onAnimation = function (timeStamp) {
		if (this.state == DrawerController.kDragging) {
			this.animateCallback.call(this.target, this.position);
			return false;
		}

		var deltaT = timeStamp - this.animator.startTimeStamp;
		var targetPosition = this.targetPosition(deltaT);
		this.position = this.restrictToBounds(targetPosition);

		this.animateCallback.call(this.target, this.position);

		if (targetPosition <= this.left && this.isClosing()) {
			this.state = DrawerController.kClosed;
			this.didCloseCallback.call(this.target);
			return false;
		}
		if (targetPosition >= this.right && this.isOpening()) {
			this.state = DrawerController.kOpened;
			return false;
		}

		return true;
	};


	exports.DrawerController = DrawerController;

})(window);

document.addEventListener('DOMContentLoaded', function() {
	var bodyScrollBarWidth = (function () {
		var widthHidden, widthScroll, currentValue, currentPriority;
		currentValue = document.body.style.getPropertyValue('overflow');
		currentPriority = document.body.style.getPropertyPriority('overflow');
		document.body.style.setProperty('overflow', 'hidden', 'important');
		widthHidden = document.body.clientWidth;
		document.body.style.setProperty('overflow', 'scroll', 'important');
		widthScroll = document.body.clientWidth;
		document.body.style.setProperty('overflow', currentValue ? currentValue : '', currentPriority);
		return widthHidden - widthScroll;
	}());
	var media = {
		'tablet-landscape': 960,
		'tablet-portrait': 768,
		'mobile-landscape': 640,
		'mobile-portrait': 480
	};
	var side_panel = document.querySelector('.side-panel');
	var side_panel_content, side_panel_content_inner, side_panel_top, side_panel_mask, side_panel_button, side_panel_close, side_panel_controller, leftEdge, rightEdge;
	var layers, elements = {}, comments = {};

	if (!side_panel || side_panel.classList.contains('removed')) {
		return;
	}

	try {
		layers =  JSON.parse(side_panel.getAttribute('data-layers').replace(/\[/g, '{').replace(/\]/g, '}').replace(/\'/g, '"'));
	} catch(e) {
		console.error(e);
	}

	if (typeof layers !== 'object' || Object.keys(layers).length === 0) {
		return;
	}

	Object.keys(layers).forEach(function(clss) {
		elements[clss] = document.querySelector('.' + clss);
		comments[clss] = document.createComment(clss);
		if (elements[clss]) {
			elements[clss].parentNode.insertBefore(comments[clss], elements[clss]);
		} else {
			delete layers[clss];
		}
	});

	side_panel_button = side_panel.querySelector('.side-panel-button');
	side_panel_close = side_panel.querySelector('.side-panel-close');
	side_panel_content = side_panel.querySelector('.side-panel-content');
	side_panel_content_inner = side_panel.querySelector('.side-panel-content-inner') || side_panel_content;
	side_panel_mask = side_panel.querySelector('.side-panel-mask');
	side_panel_top = side_panel.querySelector('.side-panel-top-inner');

	side_panel.classList.remove('hidden');
	side_panel_button.classList.remove('hidden');
	side_panel_button.style.display = 'none';
	side_panel_content.classList.remove('hidden');
	side_panel_content.style.display = 'none';
	side_panel_mask.classList.remove('hidden');
	side_panel_mask.style.display = 'none';

	leftEdge = 0;
	rightEdge = parseInt(getComputedStyle(side_panel_content, null).width) + 50;

	window.side_panel_controller = side_panel_controller = new DrawerController({
		target: side_panel,
		left: leftEdge,
		right: rightEdge,
		position: 0,
		curve: 'ease-in-out',
		willOpen: function() {
			side_panel_mask.style.display = 'block';
			side_panel_content.style.display = 'block';
			document.body.classList.add('noscroll');
			if (bodyScrollBarWidth && document.documentElement.scrollHeight > document.documentElement.clientHeight) {
				document.body.style.borderRight = bodyScrollBarWidth + 'px solid transparent'
			}
		},
		didClose: function() {
			side_panel_mask.style.display = 'none';
			side_panel_content.style.display = 'none';
			document.body.classList.remove('noscroll');
			if (bodyScrollBarWidth && document.documentElement.scrollHeight > document.documentElement.clientHeight) {
				document.body.style.borderRight = ''
			}
		},
		onAnimate: function(position) {
			side_panel_mask.style.opacity = (position ) / rightEdge;
			side_panel_content.style.transform = 'translate3d(' + (position - rightEdge) + 'px,0,0)'
		}
	});

	side_panel_controller.inPanel = function(clss) {
		var viewportWidth;
		var current_media;

		if (typeof clss !== 'string') {
			return false;
		}

		if (clss.charAt(0) === '.') {
			clss = clss.slice(1);
		}

		viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		Object.keys(media).forEach(function(key) {
			if (viewportWidth <= media[key]) {
				current_media = key;
			}
		});

		if (typeof current_media === 'undefined') {
			current_media = 'screen';
		}

		return layers[clss] && layers[clss][current_media];
	};

	side_panel_button.addEventListener('click', function(e) {
		e.preventDefault();
		side_panel_controller.toggle();
		return false;
	});

	if (side_panel_close) {
		side_panel_close.addEventListener('click', function(e) {
			e.preventDefault();
			side_panel_controller.close();
			return false;
		});
	}

	side_panel_mask.addEventListener('click', function() {
		side_panel_controller.close();
		return false;
	});


	var debounce = (function () {
		return function (fn, time) {
			var timer, func;
			if (window.requestAnimationFrame) {
				func = function() {
					timer && cancelAnimationFrame(timer);
					timer = requestAnimationFrame(fn);
				}
			} else {
				func = function() {
					window.clearTimeout(timer);
					timer = window.setTimeout(function () {
						fn();
					}, time)
				};
			}
			return func;
		}
	}());

	function checkSidePanel() {
		var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var current_media;
		var emptySide = true;
		var emptyTop = true;

		if (checkSidePanel.viewportWidth === viewportWidth) {
			return;
		}

		checkSidePanel.viewportWidth = viewportWidth;

		Object.keys(media).forEach(function(key) {
			if (viewportWidth <= media[key]) {
				current_media = key;
			}
		});

		if (typeof current_media === 'undefined') {
			current_media = 'screen';
		}

		Object.keys(layers).forEach(function(clss){
			var element, comment;

			element = elements[clss];
			comment = comments[clss];

			if (current_media in layers[clss]) {
				if (layers[clss][current_media] == 'onTop') {
					side_panel_top.appendChild(element);
					emptyTop = false;
				} else {
					side_panel_content_inner.appendChild(element);
					emptySide = false;
				}
			} else {
				if (comment) {
					comment.parentNode.insertBefore(element, comment);
				}
			}
		});

		if (emptySide) {
			side_panel_button.style.display = 'none';
		} else {
			side_panel_button.style.display = 'block';
		}

		if (!emptyTop || !emptySide) {
			side_panel.style.display = 'block';
		} else {
			side_panel.style.display = 'none';
			side_panel_controller.close();
		}
	}

	checkSidePanel = debounce(checkSidePanel, 40);

	checkSidePanel();
	window.addEventListener('resize', checkSidePanel);
});