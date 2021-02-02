/* PipUI v1.4.1 © Qexy | Site: https://pipui.ru | License: MIT */


/***** base.js *****/
var pipui = {
	v: '1.4.0',
	enable_compatible: true,

	array_unique: function(array){
		var result = [];

		for(var i = 0; i < array.length; i++){
			if(result.indexOf(array[i]) === -1){
				result.push(array[i]);
			}
		}

		return result;
	},

	indexOfCase: function(haystack, needle){
		var index = -1;

		needle = needle.toLowerCase();

		if(typeof haystack == 'object'){
			for(var i = 0; i < haystack.length; i++){
				if(haystack[i].toLowerCase() == needle){
					index = i; break;
				}
			}
		}else{
			index = haystack.toLowerCase().indexOf(needle);
		}

		return index;
	},

	top_space: function(e){
		return e.offset().top - window.pageYOffset;
	},

	bottom_space: function(e){
		return window.innerHeight - e.offset().top - e.outerHeight() + window.pageYOffset;
	},

	left_space: function(e){
		return e.offset().left - window.pageXOffset;
	},

	right_space: function(e){
		return window.innerWidth - e.offset().left - e.outerWidth() + window.pageXOffset;
	},

	dependencies: {},

	required: function(component, needle, version, operator){
		if(typeof operator == 'undefined'){
			operator = '=';
		}

		this.dependencies[component].push({
			'name': needle,
			'version': version,
			'operator': operator
		});
	},

	addModule: function(name, version){
		this.modules[name] = version;
		this.dependencies[name] = [];
	},

	modules: {},

	moduleExists: function(name){
		return typeof this.modules[name] != 'undefined';
	},

	moduleVersion: function(name){
		if(!this.moduleExists(name)){ return null; }

		return this.modules[name];
	},

	// <, >, <=, >=, =, !=, <>
	version_compare: function(v1, v2, operator){

		if(typeof operator == 'undefined'){
			operator = '=';
		}

		if(operator == '=' || operator == '==' || operator == '==='){
			return v1 === v2;
		}

		if(operator == '!=' || operator == '<>' || operator == '!=='){
			return v1 !== v2;
		}

		var i, x;
		var compare = 0;

		var vm = {
			'dev': -6,
			'alpha': -5,
			'a': -5,
			'beta': -4,
			'b': -4,
			'RC': -3,
			'rc': -3,
			'#': -2,
			'p': 1,
			'pl': 1
		};

		var _prepVersion = function(v){
			v = ('' + v).replace(/[_\-+]/g, '.');
			v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.');
			return (!v.length ? [-8] : v.split('.'))
		};

		var _numVersion = function(v){
			return !v ? 0 : (isNaN(v) ? vm[v] || -7 : parseInt(v, 10))
		};

		v1 = _prepVersion(v1);
		v2 = _prepVersion(v2);
		x = Math.max(v1.length, v2.length);

		for(i = 0; i < x; i++){
			if(v1[i] === v2[i]){ continue }

			v1[i] = _numVersion(v1[i]);
			v2[i] = _numVersion(v2[i]);

			if(v1[i] < v2[i]){
				compare = -1;
				break
			}else if(v1[i] > v2[i]){
				compare = 1;
				break
			}
		}

		if(!operator){ return compare; }

		switch(operator){
			case '>':
			case 'gt': return (compare > 0);
			case '>=':
			case 'ge': return (compare >= 0);
			case '<=':
			case 'le': return (compare <= 0);
			case '<':
			case 'lt': return (compare < 0);
		}

		return null;
	},

	compatible: function(){
		$.each(pipui.dependencies, function(k, v){
			if(!v.length){ return; }

			for(var i = 0; i < v.length; i++){
				if(typeof v[i] == 'undefined'){ continue; }

				if(!pipui.moduleExists(v[i].name)){
					console.warn('[PipUI] '+pipui.l(pipui.i18n.base.requires, [k, v[i].name]));

					return;
				}

				if(!pipui.version_compare(pipui.moduleVersion(v[i].name), v[i].version, v[i].operator)){
					console.warn('[PipUI] '+pipui.l(pipui.i18n.base.requires_version, [k, v[i].name, v[i].operator], v[i].version));
				}
			}

		});
	},

	l: function(str, data, symbol){
		if(typeof symbol == 'undefined'){ symbol = '%'; }

		if(typeof data == 'string'){ return str.replaceAll(symbol, data); }

		var symbol_len = symbol.length;

		var n = 0;

		while(true){
			var search = str.indexOf(symbol);

			if(search === -1 || typeof data[n] == 'undefined'){ break; }

			var replace1 = str.substr(0, search);
			var replace2 = str.substr(search+symbol_len);

			str = replace1+data[n]+replace2;

			n++;
		}

		return str;
	},

	i18n: {
		"base": {
			"requires": 'Component "%" requires component %',
			"requires_version": 'Component % requires component % version % %',
		},
	},
};

var p = pipui;

pipui.addModule('base', pipui.v);

$(function(){

	if(p.enable_compatible){
		p.compatible();
	}

	$('body').on('click', '.preventDefault', function(e){
		e.preventDefault();
	});
});




/***** navbar.js *****/
pipui.addModule('navbar', '1.0.0');

$(function(){
	$('html').on('click', 'body', function(e){

		var target = $(e.target);

		var trigger = target.closest('.nav-sub');

		var li = trigger.closest('.nav-li');

		if(!trigger.length && !target.closest('.nav-submenu').length){
			$('.navbar .nav-submenu.active, .navbar .nav-sub.active').removeClass('active left-pos right-pos');
		}else{
			var navbar = target.closest('.navbar');

			$('.navbar').not(navbar).find('.nav-sub.active, .nav-submenu.active').removeClass('active left-pos right-pos');

			li.siblings('.nav-li').not(li).find('.nav-sub.active, .nav-submenu.active').removeClass('active left-pos right-pos');
		}
	});

	$('body').on('click', '.navbar .nav-sub', function(e){
		e.preventDefault();

		var that = $(this);

		var submenu = that.closest('.nav-li').children('.nav-submenu');

		var navbar = that.closest('.navbar');

		var left = e.pageX-navbar.offset().left;

		var right = navbar.outerWidth() - left;

		if(!that.hasClass('active') || !submenu.hasClass('active')){
			if(left>right){
				submenu.addClass('right-pos');
			}else{
				submenu.addClass('left-pos');
			}

			that.addClass('active');
			submenu.addClass('active');
		}else{
			that.removeClass('active');
			submenu.removeClass('active left-pos right-pos');
			submenu.find('.nav-submenu.active, .nav-sub.active').removeClass('active');
		}

	}).on('click', '.navbar .navbar-wrapper .nav-mobile', function(e){
		e.preventDefault();

		$(this).closest('.navbar').toggleClass('open');
	});
});




/***** modal.js *****/
pipui.addModule('modal', '1.0.0');

pipui.modal = {
	open: function(e){
		if(e==''){ return false; }

		e = $('.modal[data-id="'+e+'"]');
		if(!e.length){ return false; }

		e.fadeIn('fast', function(){
			$(this).addClass('active');
		});

		return true;
	},

	close: function(e){
		if(e==''){ return false; }

		e = $('.modal[data-id="'+e+'"]');
		if(!e.length){ return false; }

		e.fadeOut('fast', function(){
			$(this).removeClass('active');
		});

		return true;
	},

	toggle: function(e){
		if(e==''){ return false; }

		e = $('.modal[data-id="'+e+'"]');
		if(!e.length){ return false; }

		e.fadeToggle('fast', function(){
			$(this).toggleClass('active');
		});

		return true;
	}
};

$(function(){
	$('body').on('click', '[data-modal]', function(e){
		if(e.target.tagName != 'INPUT'){
			e.preventDefault();
		}

		var that = $(this);

		var modal = that.attr('data-modal');

		$('.modal').fadeOut('fast');

		if(!modal){ modal = that.attr('href'); }

		if(modal){ pipui.modal.open(modal); }
	}).on('click', '.modal [data-modal-close]', function(e){
		e.preventDefault();

		pipui.modal.close($(this).closest('.modal').attr('data-id'));
	}).on('click', '.modal', function(e){
		var target = $(e.target);
		if(!target.closest('.modal-content').length){
			pipui.modal.close(target.closest('.modal').attr('data-id'));
		}
	});
});




/***** alert.js *****/
pipui.addModule('alert', '1.0.0');
pipui.required('alert', 'base', '1.4.0', '>=');
pipui.i18n.alert = {
	"close": 'ЗАКРЫТЬ',
};

pipui.alert = {
	openTimeout: 3000,

	open: function(text, title, placement, autoclose, complete){

		title = title === undefined ? '' : title;

		if(typeof placement != 'string'){
			placement = 'bottom-center';
		}

		var split = placement.split('-');

		if(split[0] != 'top' && split[0] != 'bottom' && split[0] != 'center'){
			split[0] = 'bottom';
		}

		if(split[1] != 'left' && split[1] != 'right' && split[1] != 'center'){
			split[1] = 'center';
		}

		placement = split[0] + '-' + split[1];

		var block = $('.alert[data-placement="'+placement+'"]');

		if(!block.length){
			block = $('<div class="alert" data-placement="'+placement+'"></div>');

			if(split[0] == 'top'){
				$('body').prepend(block);
			}else{
				$('body').append(block);
			}
		}

		var id = Math.random();

		var e = $('<div class="alert-id" style="display: none;" data-id="'+id+'">' +
					'<div class="alert-content">'+text+'</div>' +

					'<div class="alert-footer">' +
						'<div class="block-left"><div class="title">'+title+'</div></div>' +

						'<div class="block-right">' +
							'<button class="btn btn-transparent close-trigger">'+p.i18n.alert.close+'</button>' +
						'</div>' +
					'</div>' +
				'</div>');

		block.append(e);

		e.fadeIn('fast', function(){
			if(typeof complete != 'undefined'){
				complete();
			}
		});

		if(typeof autoclose == 'undefined'){
			autoclose = this.openTimeout;
		}

		if(typeof autoclose == 'number'){
			setTimeout(function(){
				pipui.alert.close('.alert .alert-id[data-id="'+id+'"]');
			}, autoclose);
		}

		return true;
	},

	close: function(e, complete){

		e = (typeof e == 'string') ? $(e) : e;

		var len = e.length;

		if(!len){ return false; }

		$('.alert').stop();

		e.each(function(i){
			var self = $(this);

			setTimeout(function(){
				self.fadeOut('fast', function(){
					$(this).remove();
				});
			}, i*300);
		});

		if(typeof complete != 'undefined'){
			complete();
		}
	},

	hide: function(e, complete){

		e = (typeof e == 'string') ? $(e) : e;

		var len = e.length;

		if(!len){ return false; }

		$('.alert').stop();

		e.each(function(i){
			var self = $(this);

			setTimeout(function(){
				self.fadeOut('fast');
			}, i*300);
		});

		if(typeof complete != 'undefined'){
			complete();
		}
	},

	show: function(e, complete){

		e = (typeof e == 'string') ? $(e) : e;

		var len = e.length;

		if(!len){ return false; }

		$('.alert').stop();

		e.each(function(i){
			var self = $(this);

			setTimeout(function(){
				self.fadeIn('fast');
			}, i*300);
		});

		if(typeof complete != 'undefined'){
			complete();
		}
	}
};

$(function(){
	$('body').on('click', '.alert > .alert-id .close-trigger', function(e){
		e.preventDefault();

		pipui.alert.close($(this).closest('.alert-id'));

	});

	setTimeout(function(){
		pipui.alert.close($('.alert > .alert-id[data-autoclose="true"]'));
	}, pipui.alert.openTimeout);
});




/***** confirm.js *****/
pipui.addModule('confirm', '1.0.0');
p.required('confirm', 'base', '1.4.0', '>=');
p.i18n.confirm = {
	"confirm": 'Подтвердите действие на странице',
	"success": 'OK',
	"cancel": 'Отмена'
};

pipui.confirm = {
	openTimeout: 3000,

	storage: {},

	open: function(params, title, success, fail, autoclose, complete, yes, no){
		var text = typeof params == 'string' || typeof params == 'number' ? params : '';

		if(typeof params == 'object'){

			if(typeof params.title != 'undefined'){
				title = params.title;
			}

			if(typeof params.text != 'undefined'){
				text = params.text;
			}

			if(typeof params.success == 'function'){
				success = params.success;
			}

			if(typeof params.fail == 'function'){
				fail = params.fail;
			}

			if(typeof params.autoclose != 'undefined'){
				autoclose = params.autoclose;
			}

			if(typeof params.complete == 'function'){
				complete = params.complete;
			}

			if(typeof params.yes == 'string' || typeof params.yes == 'number'){
				yes = params.yes;
			}

			if(typeof params.no == 'string' || typeof params.no == 'number'){
				no = params.no;
			}
		}

		if(typeof yes == 'undefined'){
			yes = p.i18n.confirm.success;
		}

		if(typeof no == 'undefined'){
			no = p.i18n.confirm.cancel;
		}

		var block = $('.confirm');

		if(!block.length){
			block = $('<div class="confirm"></div>');

			$('body').append(block);
		}

		if(typeof title == 'undefined'){
			title = p.i18n.confirm.confirm;
		}

		var id = Math.random().toString();

		var e = $('<div class="confirm-id" style="display: none;" data-id="'+id+'">' +
					'<div class="confirm-title">'+title+'</div>' +
					'<div class="confirm-text">'+text+'</div>' +

					'<div class="confirm-footer">' +
						'<button class="btn btn-transparent yes-trigger">'+yes+'</button>' +
						'<button class="btn btn-transparent no-trigger">'+no+'</button>' +
					'</div>' +
				'</div>');

		block.append(e);

		e.fadeIn('fast', function(){
			if(typeof complete == 'function'){
				complete();
			}
		});

		if(typeof autoclose == 'number' && autoclose > 0){
			setTimeout(function(){
				pipui.confirm.close(e);
			}, autoclose);
		}

		this.storage[id] = {
			'id': id,
			'success': success,
			'fail': fail,
			'yes': yes,
			'no': no,
			'autoclose': autoclose
		};
	},

	close: function(e, complete){

		e = (typeof e == 'string') ? $(e) : e;

		var len = e.length;

		if(!len){ return false; }

		$('.confirm').stop();

		var n = 0;

		e.each(function(i){
			var self = $(this);

			setTimeout(function(){
				self.fadeOut('fast', function(){
					$(this).remove();
				});
			}, i*300);

			n = i;
		});

		if(typeof complete == 'function'){
			setTimeout(function(){
				complete();
			}, n * 300);
		}
	},

	complete: function(e, type, complete){

		e = (typeof e == 'string') ? $(e) : e;

		type = type == 'yes' ? type : 'no';

		var len = e.length;

		if(!len){ return false; }

		$('.confirm').stop();

		var n = 0;

		e.each(function(i){
			var self = $(this);

			var item = pipui.confirm.storage[self.attr('data-id')];

			if(item != 'undefined'){
				if(type == 'yes'){
					if(typeof item.success == 'function'){
						item.success();
					}
				}else{
					if(typeof item.fail == 'function'){
						item.fail();
					}
				}

				delete pipui.confirm.storage[self.attr('data-id')];

				setTimeout(function(){
					self.fadeOut('fast', function(){
						$(this).remove();
					});
				}, i*300);
			}

			n = i;
		});

		if(typeof complete == 'function'){
			setTimeout(function(){
				complete();
			}, n * 300);
		}
	}
};

$(function(){
	$('body').on('click', '.confirm > .confirm-id .no-trigger, .confirm > .confirm-id .yes-trigger', function(e){
		e.preventDefault();

		var that = $(this);

		that.prop('disabled', true);

		pipui.confirm.complete(that.closest('.confirm-id'), that.hasClass('yes-trigger') ? 'yes' : 'no');

	});

	setTimeout(function(){
		pipui.confirm.close($('.confirm > .confirm-id[data-autoclose="true"]'));
	}, pipui.confirm.openTimeout);
});




/***** tabs.js *****/
pipui.addModule('tabs', '1.0.0');

pipui.tabs = {
	active: function(id){
		if(typeof id != 'string'){
			return false;
		}

		var link = $('.tabs > .tab-links .tab-link[data-id="'+id+'"]');

		var tab = $('.tabs > .tab-list > .tab-id'+id);

		if(link.hasClass('active') && tab.hasClass('active')){
			return false;
		}

		var tabs = link.closest('.tabs');

		tabs.children('.tab-links').find('.tab-link.active').removeClass('active');

		tabs.children('.tab-list').children('.tab-id.active').removeClass('active');

		link.addClass('active');
		tab.addClass('active');

		return true;
	}
};

$(function(){
	$('body').on('click', '.tabs > .tab-links .tab-link:not([data-link])', function(e){
		e.preventDefault();

		pipui.tabs.active($(this).attr('data-id'));
	});
});




/***** spoiler.js *****/
pipui.addModule('spoiler', '1.0.0');

pipui.spoiler = {
	show: function(e){

		e = (typeof e == 'string') ? $('.spoiler'+e) : e;

		var len = e.length;

		if(!len){ return this; }

		if(!e.length){ return this; }

		e.slideDown('fast', function(){
			$(this).addClass('active');
		});

		return this;
	},

	hide: function(e){

		e = (typeof e == 'string') ? $('.spoiler'+e) : e;

		var len = e.length;

		if(!len){ return this; }

		if(!e.length){ return this; }

		e.slideUp('fast', function(){
			$(this).removeClass('active');
		});

		return this;
	},

	toggle: function(e){

		e = (typeof e == 'string') ? $('.spoiler'+e) : e;

		var len = e.length;

		if(!len){ return this; }

		if(!e.length){ return this; }

		e.slideToggle('fast', function(){
			$(this).toggleClass('active');
		});

		return this;
	},

	showAll: function(){
		$('.spoiler').slideDown('fast', function(){
			$(this).addClass('active');
		});

		return this;
	},

	hideAll: function(){
		$('.spoiler').slideUp('fast', function(){
			$(this).removeClass('active');
		});

		return this;
	}
};

$(function(){
	$('body').on('click', '[data-spoiler]', function(e){
		e.preventDefault();

		var that = $(this);
		var target = that.attr('data-spoiler');

		if(typeof target == 'undefined' || $.trim(target) == ''){ target = that.attr('href'); }

		if(target){
			pipui.spoiler.toggle(target);
		}
	}).on('click', '[data-spoiler-show], [data-spoiler-hide]', function(e){
		e.preventDefault();

		var that = $(this);

		var show = that.attr('data-spoiler-show');
		var hide = that.attr('data-spoiler-hide');

		var is_show = typeof show != 'undefined';

		var target = that.attr(is_show ? show : hide);

		if(typeof target == 'undefined' || $.trim(target) == ''){ target = that.attr('href'); }

		if(target){
			if(is_show){
				pipui.spoiler.show(target);
			}else{
				pipui.spoiler.hide(target);
			}
		}
	}).on('click', '.accordion > .accordion-id > .accordion-trigger', function(e){
		e.preventDefault();

		var that = $(this);

		var accordion = that.closest('.accordion');

		accordion.children('.accordion-id.active').children('.accordion-target').slideUp('fast', function(){
			$(this).closest('.accordion-id').removeClass('active');
		});

		var item = that.closest('.accordion-id');

		if(item.hasClass('active')){
			item.children('.accordion-target').slideUp('fast', function(){
				item.removeClass('active');
			});
		}else{
			item.children('.accordion-target').slideDown('fast', function(){
				item.addClass('active');
			});
		}
	});
});




/***** textarea.js *****/
pipui.addModule('textarea', '1.0.0');

pipui.textarea = {
	element: '.textarea',

	render: function(e){
		if(!$(e).length){ return; }

		$(e).each(function(){
			var that = $(this);

			var id = that.attr('data-textarea-id');

			if(typeof id == 'undefined' || id==''){
				id = Math.random();
			}

			var el = '.textarea-numbers[data-textarea-id="'+id+'"] > ul';

			var list = $(el);

			var textarea = that.find('textarea');

			if(!list.length){
				that.append('<div class="textarea-numbers" data-textarea-id="'+id+'"><ul></ul></div>');
				textarea.attr('data-textarea-id', id);
				that.attr('data-textarea-id', id);
				list = $(el);
			}

			var value = textarea[0].value;

			var lines = value.split('\n').length;

			for(var i = 1; i <= lines; i++){
				list.append('<li data-id="'+i+'"><a href="#line-'+id+'-'+i+'">'+i+'</a></li>');
			}

			textarea.val(value.replace(/ {3}/g, '\t'));
		});
	}
};

$(function(){
	pipui.textarea.render(pipui.textarea.element);

	$('html').on('keydown', pipui.textarea.element+' textarea', function(e){

		if(e.keyCode==9){

			var target = $(e.target);

			var textarea = target.closest('textarea');

			if(textarea.length){
				setTimeout(function(){
					textarea.focus();

					var box = textarea[0];
					var start = box.selectionStart;
					var end = box.selectionEnd;

					var value = textarea.val();

					var beforeSelect = value.substring(0, start);
					var currentSelect = value.substring(start, end);
					var afterSelect = value.substring(end, value.length);

					currentSelect = currentSelect.replace(/\n/g, '\n\t');

					var num = currentSelect.split('\n').length;

					var string = beforeSelect+'\t'+currentSelect+afterSelect;

					textarea.val(string);

					box.setSelectionRange(start+1, end+num);
				}, 0);

			}
		}
	}).on('click', pipui.textarea.element+' textarea', function(){
		$(this).attr('data-prev-start', this.selectionStart).attr('data-prev-end', this.selectionEnd);
	}).on('input', pipui.textarea.element+' textarea', function(){
		var that = $(this);

		var beforeStart = parseInt(that.attr('data-prev-start'));
		var beforeEnd = parseInt(that.attr('data-prev-end'));

		var currentStart = this.selectionStart;
		var currentEnd = this.selectionEnd;

		var val = that.val();

		var id = that.attr('data-textarea-id');

		var isWrap = val.match(/ {3}/g, '\t');

		if(isWrap){
			that.val(val.replace(/ {3}/g, '\t'));
		}

		var last = that.closest(pipui.textarea.element).find('ul > li');

		var before = last.length;

		var now = val.split('\n').length;

		if(now!=before){
			if(now>before){

				var ul = last.closest('ul');

				for(var i = before+1; i <= now; i++){
					ul.append('<li data-id="'+i+'"><a href="#line-'+id+'-'+i+'">'+i+'</a></li>');
				}
			}else{
				that.closest(pipui.textarea.element).find('ul > li:nth-child('+now+')').nextAll().remove();
			}
		}

		if(isWrap){
			this.setSelectionRange(beforeStart-1, beforeEnd-1);
		}

		that.attr('data-prev-start', currentStart).attr('data-prev-end', currentEnd);

	}).on('click', pipui.textarea.element+' > .textarea-numbers > ul > li > a', function(e){
		e.preventDefault();

		var that = $(this);

		var href = that.attr('href').split('-');

		var num = parseInt(href[2])-1;

		var box = that.closest(pipui.textarea.element);

		var textarea = box.find('textarea');

		var value = textarea.val();

		var beforeLen = 0;
		var currentLen = 0;

		var currentKey = 0;

		$.each(value.split('\n'), function(k, v){
			var len = v.length;

			if(num==k){
				currentLen = len; currentKey = k; return false;
			}

			beforeLen = beforeLen+len+1;
		});

		textarea.focus();

		textarea[0].setSelectionRange(beforeLen, beforeLen+currentLen);

		setTimeout(function(){
			textarea.scrollTop(that.closest('li')[0].offsetTop+10-((textarea.outerHeight()/2).toFixed()));
		}, 0);
	});

	$('body '+pipui.textarea.element+' textarea').on('scroll', function(e){
		var that = $(e.target);

		var box = that.closest(pipui.textarea.element);

		box.find('.textarea-numbers > ul').css('top', -that.scrollTop()+'px');
	});
});




/***** bbpanel.js *****/
pipui.addModule('bbpanel', '1.0.0');
p.required('bbpanel', 'base', '1.4.0', '>=');
p.i18n.bbpanel = {
	"b": 'Жирный',
	"i": 'Курсив',
	"u": 'Подчеркнутый',
	"s": 'Зачеркнутый',
	"left": 'Выравнивание по левому краю',
	"center": 'Выравнивание по центру',
	"right": 'Выравнивание по правому краю',
	"spoiler": 'Скрытый текст',
	"color": 'Цвет текста',
	"size": 'Размер текста',
	"img": 'Изображени',
	"quote": 'Цитата',
	"urlAlt": 'Ссылка',
	"code": 'Код',
	"line": 'Горизонтальная линия',
	"youtube": 'Ссылка на YouTube видео',
	"hide": 'Скрыть панель'
};

pipui.bbpanel = {
	element: '.bbpanel',
	targetClass: 'bbpanel-target',
	codes: {
		'b': {'title': p.i18n.bbpanel.b, 'text': '<i class="fa fa-bold"></i>', 'left': '[b]', 'right': '[/b]'},
		'i': {'title': p.i18n.bbpanel.i, 'text': '<i class="fa fa-italic"></i>', 'left': '[i]', 'right': '[/i]'},
		'u': {'title': p.i18n.bbpanel.u, 'text': '<i class="fa fa-underline"></i>', 'left': '[u]', 'right': '[/u]'},
		's': {'title': p.i18n.bbpanel.s, 'text': '<i class="fa fa-strikethrough"></i>', 'left': '[s]', 'right': '[/s]'},
		'left': {'title': p.i18n.bbpanel.left, 'text': '<i class="fa fa-align-left"></i>', 'left': '[left]', 'right': '[/left]'},
		'center': {'title': p.i18n.bbpanel.center, 'text': '<i class="fa fa-align-center"></i>', 'left': '[center]', 'right': '[/center]'},
		'right': {'title': p.i18n.bbpanel.right, 'text': '<i class="fa fa-align-right"></i>', 'left': '[right]', 'right': '[/right]'},
		'spoiler': {'title': p.i18n.bbpanel.spoiler, 'text': '<i class="fa fa-eye-slash"></i>', 'left': '[spoiler=""]', 'right': '[/spoiler]'},
		'color': {'title': p.i18n.bbpanel.color, 'text': '<i class="fa fa-paint-brush"></i>', 'left': '[color="#"]', 'right': '[/color]'},
		'size': {'title': p.i18n.bbpanel.size, 'text': '<i class="fa fa-text-height"></i>', 'left': '[size="1"]', 'right': '[/size]'},
		'img': {'title': p.i18n.bbpanel.img, 'text': '<i class="fa fa-picture-o"></i>', 'left': '[img]', 'right': '[/img]'},
		'quote': {'title': p.i18n.bbpanel.quote, 'text': '<i class="fa fa-quote-right"></i>', 'left': '[quote]', 'right': '[/quote]'},
		'urlAlt': {'title': p.i18n.bbpanel.urlAlt, 'text': '<i class="fa fa-link"></i>', 'left': '[url=""]', 'right': '[/url]'},
		'code': {'title': p.i18n.bbpanel.code, 'text': '<i class="fa fa-code"></i>', 'left': '[code]', 'right': '[/code]'},
		'line': {'title': p.i18n.bbpanel.line, 'text': '<i class="fa fa-minus"></i>', 'left': '', 'right': '[line]'},
		'youtube': {'title': p.i18n.bbpanel.youtube, 'text': '<i class="fa fa-youtube-play"></i>', 'left': '[youtube]', 'right': '[/youtube]'},
		'hide': {'title': p.i18n.bbpanel.hide, 'text': '<i class="fa fa-angle-up"></i>', 'method': function(e){
				e.closest('.bbpanel-target').slideUp('fast');
			}}
	},
	items: null,
	renderItems: function(){
		if(pipui.bbpanel.items !== null){
			return false;
		}

		pipui.bbpanel.items = '';

		$.each(pipui.bbpanel.codes, function(k, v){

			if(typeof v.method != 'undefined'){
				pipui.bbpanel.items += '<li><a href="#bb-'+k+'" class="bbpanel-tag" data-method="'+k+'" title="'+v.title+'">'+v.text+'</a></li>';
			}else{
				v.left = v.left.replace(/"/g, '&quote;');
				v.right = v.right.replace(/"/g, '&quote;');
				pipui.bbpanel.items += '<li><a href="#bb-'+k+'" class="bbpanel-tag" data-left="'+v.left+'" data-right="'+v.right+'" title="'+v.title+'">'+v.text+'</a></li>';
			}

		});

		return true;
	},
	render: function(el){
		if(typeof el == 'string'){
			el = $(el);
		}

		el.each(function(){
			var that = $(this);

			var id = that.attr('data-panel-id');

			if(typeof id == 'undefined'){
				id = Math.random();
			}else{
				return;
			}

			if(pipui.bbpanel.items === null){
				pipui.bbpanel.renderItems();
			}

			that.attr('data-panel-id', id);
			var after = $('<div class="'+pipui.bbpanel.targetClass+'" data-panel-id="'+id+'"><ul data-panel-id="'+id+'">'+pipui.bbpanel.items+'</ul></div>');

			that.after(after);
		});
	}
};

$(function(){
	$('body').on('focus', pipui.bbpanel.element, function(e){
		e.preventDefault();

		var that = $(this);

		pipui.bbpanel.render(that);

		setTimeout(function(){
			$('.'+pipui.bbpanel.targetClass+'[data-panel-id="'+that.attr('data-panel-id')+'"]').slideDown('fast');
		}, 0);
	}).on('click', '.'+pipui.bbpanel.targetClass+' .bbpanel-tag', function(e){
		e.preventDefault();

		var that = $(this);

		var method = that.attr('data-method');

		if(typeof method != 'undefined'){

			pipui.bbpanel.codes[method].method(that);

			return;
		}

		var leftTag = that.attr('data-left').replace(/&quote;/g, '"');
		var rightTag = that.attr('data-right').replace(/&quote;/g, '"');

		var id = that.closest('.'+pipui.bbpanel.targetClass).attr('data-panel-id');

		var input = $(pipui.bbpanel.element+'[data-panel-id="'+id+'"]')[0];

		input.focus();

		var value = input.value;

		var startCaret = input.selectionStart;
		var endCaret = input.selectionEnd;

		var beforeText = value.substring(0, startCaret);
		var afterText = value.substr(endCaret);
		var currentText = value.substring(startCaret, endCaret);

		input.value = beforeText+leftTag+currentText+rightTag+afterText;

		input.setSelectionRange(startCaret, leftTag.length+rightTag.length+endCaret);
	});
});




/***** bbcodes.js *****/
pipui.addModule('bbcodes', '1.0.0');

$(function(){
	$('body').on('click', '.bb-spoiler-wrapper > .bb-spoiler > .bb-spoiler-trigger', function(e){
		e.preventDefault();

		var that = $(this);

		if(that.attr('data-bb-disabled')=='true'){ return; }

		that.attr('data-bb-disabled', 'true');

		var spoiler = that.closest('.bb-spoiler');

		spoiler.children('.bb-spoiler-text').slideToggle('fast', function(){
			that.attr('data-bb-disabled', 'false');

			spoiler.toggleClass('open');
		});
	});
});





/***** formvalidator.js *****/
pipui.addModule('formvalidator', '1.0.0');
p.required('formvalidator', 'base', '1.4.0', '>=');
p.i18n.formvalidator = {
	"incorrect": 'Поле заполнено неверно'
};

pipui.formvalidator = {
	form: '[data-formvalidator]',

	timeout: 2000,

	defaultType: 'warning',

	storage: {}
};

$(function(){
	$('body').on('click', pipui.formvalidator.form+' [type="submit"]', function(e){
		var that = $(this);

		var form = that.closest('form');

		var valid = true;

		var fields = form.find('input, textarea, select');

		for(var i = 0; i < fields.length; i++){

			var name = fields[i].getAttribute('name');

			if(name === null){
				continue;
			}

			var el = $(fields[i]);

			if(fields[i].checkValidity()){
				continue;
			}

			valid = false;

			var id = el.attr('data-formvalidator-id');

			if(typeof id === 'undefined'){
				id = Math.random().toString();
				el.attr('data-formvalidator-id', id);
			}

			var text = el.attr('data-formvalidator-text');

			if(typeof text == 'undefined'){
				text = p.i18n.formvalidator.incorrect;
			}

			var alert = $('.formvalidator-alert[data-formvalidator-id="'+id+'"]');

			if(!alert.length){
				var label = el.closest('label');
				if(label.length){
					label.after('<div class="formvalidator-alert" data-formvalidator-id="'+id+'"></div>');
				}else{
					el.after('<div class="formvalidator-alert" data-formvalidator-id="'+id+'"></div>');
				}
				alert = $('.formvalidator-alert[data-formvalidator-id="'+id+'"]');
			}

			var type = el.attr('data-formvalidator-type');

			if(typeof type == 'undefined'){
				type = pipui.formvalidator.defaultType;
			}

			alert.removeClass('warning info danger success').addClass(type);

			var icon = '';

			if(type == 'warning'){
				icon = '<i class="fa fa-exclamation-triangle"></i>';
			}else if (type == 'danger'){
				icon = '<i class="fa fa-exclamation-circle"></i>'
			}else if (type == 'info'){
				icon = '<i class="fa fa-info-circle"></i>'
			}else if (type == 'success'){
				icon = '<i class="fa fa-check-circle"></i>'
			}

			alert.html('<div class="wrapper"><div class="icon-block">'+icon+'</div><div class="text-block">'+text+'</div><div class="close-block"><a href="#" class="close">&times;</a></div></div>').fadeIn('fast');
		}

		if(!valid){
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();

			return false;
		}
	}).on('click', '.formvalidator-alert > .wrapper > .close-block > .close', function(e){
		e.preventDefault();

		$(this).closest('.formvalidator-alert').fadeOut('fast');
	}).on('input change', pipui.formvalidator.form+' input, '+pipui.formvalidator.form+' select, '+pipui.formvalidator.form+' textarea', function(){
		var that = $(this);

		if(that[0].checkValidity()){
			var alert = $('.formvalidator-alert[data-formvalidator-id="'+that.attr('data-formvalidator-id')+'"]');

			if(alert.length){
				alert.fadeOut('fast');
			}
		}
	});
});




/***** dropdown.js *****/
pipui.addModule('dropdown', '1.0.0');
p.required('dropdown', 'base', '1.4.0', '>=');

pipui.dropdown = {
	toggle: function(e){
		if(!e.length){ return false; }

		var dropdown = e.find('.dropdown-target:first');

		if(!dropdown.length){ return false; }

		if(dropdown.is(':visible')){
			pipui.dropdown.hide(e);
		}else{
			pipui.dropdown.show(e);
		}
	},

	show: function(e){
		if(!e.length){ return false; }

		e.addClass('active');

		var trigger = e.find('.dropdown-trigger:first');

		if(e.attr('data-dropdown-placement') == 'auto'){
			if(pipui.top_space(trigger) > pipui.bottom_space(trigger)){
				e.attr('data-dropdown-y', 'top');
			}else{
				e.attr('data-dropdown-y', 'bottom');
			}

			if(pipui.left_space(trigger) > pipui.right_space(trigger)){
				e.attr('data-dropdown-x', 'left');
			}else{
				e.attr('data-dropdown-x', 'right');
			}
		}

		trigger.addClass('active');
	},

	hide: function(e){
		if(!e.length){ return false; }

		e.removeClass('active');

		e.find('.dropdown.active, .dropdown-trigger.active').removeClass('active');
	}
};

$(function(){
	$('body').on('click', '.dropdown > .dropdown-trigger', function(e){
		e.preventDefault();

		pipui.dropdown.toggle($(this).closest('.dropdown'));
	});

	$('html').on('click', 'body', function(e){
		var target = $(e.target).closest('.dropdown:not(.dropdown-submenu)');

		$('.dropdown.active').each(function(){
			var that = $(this);

			var parent = that.closest('.dropdown:not(.dropdown-submenu)');

			if(!parent.is(target)){
				parent.removeClass('active');
				parent.find('.dropdown.active, .dropdown-trigger.active').removeClass('active');
			}
		});
	});
});




/***** toggle.js *****/
pipui.addModule('toggle', '1.0.0');

$(function(){
	$('body').on('click', '[data-toggle]', function(e){

		if(e.target.tagName != 'INPUT'){
			e.preventDefault();
		}

		var that = $(this);

		var toggle = that.attr('data-toggle');

		var item = $(toggle);

		if(!item.length){ return; }

		var classToggle = that.attr('data-toggle-class');

		var fade = that.attr('data-toggle-fade');

		if(fade == 'fade'){
			item.fadeToggle('fast', function(){
				if(classToggle){ $(this).toggleClass(classToggle); }
			});
		}else if(fade == 'slide'){
			item.slideToggle('fast', function(){
				if(classToggle){ $(this).toggleClass(classToggle); }
			});
		}else{
			item.toggle(function(){
				if(classToggle){ $(this).toggleClass(classToggle); }
			});
		}
	});
});




/***** tabindex.js *****/
pipui.addModule('tabindex', '1.0.0');

pipui.tabindex = {
	search_next: function(current, block){
		var indexes = block.find('[tabindex]');

		var length = indexes.length;

		if(!length){ return null; }

		if(current === null || length == 1){
			return indexes[0].getAttribute('tabindex');
		}

		var array_indexes = [];

		for(var i = 0; i < length; i++){
			array_indexes.push(parseInt(indexes[i].getAttribute('tabindex')));
		}

		array_indexes = array_indexes.sort(function(a, b){
			return a - b;
		});

		var index = 0;

		$.each(array_indexes, function(k, v){
			if(v == current){
				index = k;

				return false;
			}
		});

		var next = array_indexes[index+1];

		if(typeof next == 'undefined'){
			next = array_indexes[0];
		}

		return next;
	}
};

$(function(){
	$('body').on('keydown', function(e){
		if(e.which == 9){
			e.preventDefault();

			var that = $(e.target);

			var block = that.closest('[data-tabindex]');

			if(!block.length){
				block = $('body');
			}

			var tabindex = pipui.tabindex.search_next(e.target.getAttribute('tabindex'), block);

			$('[tabindex="'+tabindex+'"]').focus();
		}
	});
});




/***** pagination.js *****/
pipui.addModule('pagination', '1.0.0');

pipui.pagination = {
	get_data: function(e){
		var type = parseInt(e.attr('data-pagination'));

		if(isNaN(type)){
			type = 0;
		}

		var current = parseInt(e.attr('data-pagination-current'));

		if(isNaN(current) || current <= 0){
			current = 1;
		}

		var pages = parseInt(e.attr('data-pagination-pages'));

		if(isNaN(pages) || pages <= 0){
			pages = 1;
		}

		var url = e.attr('data-pagination-url');

		if(typeof url == 'undefined'){
			url = '/page-{NUM}';
		}

		return {'type': type, 'current': current, 'pages': pages, 'url': url};
	},

	init: function(){

		var pagin = $('.pagination[data-pagination]');

		pagin.each(function(){
			var that = $(this);

			var data = pipui.pagination.get_data(that);

			var filter = pipui.pagination.types[data.type];

			if(typeof filter == 'undefined'){
				return;
			}

			filter.update(that, data.current, data.pages, data.url)
		});

		pagin.fadeIn();
	},

	types: {
		0: {
			update: function(element, current, pages, url){
				var string = "";

				for(var i = 1; i <= pages; i++){
					string += '<li data-page="'+i+'" '+(i == current ? 'class="active"' : '')+'>';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				element.html(string);
			}
		},

		1: {
			pages: 2,
			update: function(element, current, pages, url){
				var string = "";

				var pagenum = this.pages;

				if(pages < (pagenum * 2 + 1)){
					pagenum = Math.floor(pages / 2) - 1
				}

				if(current > 1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current-1)+'">‹</a></li>';
				}

				for(var a = pagenum; a < current; a++){
					if(a<1){ continue; }
					string += '<li data-page="'+a+'" '+(a == current ? 'class="active"' : '')+'>';
					string += '<a title="'+a+'" href="'+url.replace('{NUM}', a)+'">'+a+'</a>';
					string += '</li>';
				}

				string += '<li class="active" data-page="'+current+'">';
				string += '<a title="'+current+'" href="'+url.replace('{NUM}', current)+'">'+current+'</a>';
				string += '</li>';

				for(var i = current+1; i <= pagenum; i++){
					if(i > pages){ continue; }
					string += '<li  data-page="'+i+'" '+(i == current ? 'class="active"' : '')+'>';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				if(current < pages){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current+1)+'">›</a></li>';
				}

				element.html(string);
			}
		},

		2: {
			pages: 2,
			update: function(element, current, pages, url){
				var string = "";

				var pagenum = this.pages;

				if(pages < (pagenum * 2 + 1)){
					pagenum = Math.floor(pages / 2) - 1
				}

				if(current-1 > 1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', 1)+'">«</a></li>';
				}

				if(current > 1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current-1)+'">‹</a></li>';
				}

				for(var a = pagenum; a < current; a++){
					if(a < 1){ continue; }
					string += '<li data-page="'+a+'" '+(a == current ? 'class="active"' : '')+'>';
					string += '<a title="'+a+'" href="'+url.replace('{NUM}', a)+'">'+a+'</a>';
					string += '</li>';
				}

				string += '<li data-page="'+current+'" class="active">';
				string += '<a title="'+current+'" href="'+url.replace('{NUM}', current)+'">'+current+'</a>';
				string += '</li>';

				for(var i = current+1; i <= pagenum; i++){
					if(i > pages){ continue; }
					string += '<li data-page="'+i+'" '+(i == current ? 'class="active"' : '')+'>';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				if(current < pages){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', current+1)+'">›</a></li>';
				}

				if(current < pages-1){
					string += '<li class="scroller"><a href="'+url.replace('{NUM}', pages)+'">»</a></li>';
				}

				element.html(string);
			}
		},

		3: {
			pages: 2,
			scroll: function(position, element){
				var data = pipui.pagination.get_data(element);

				var selected = parseInt(element.find('li.selected').attr('data-page'));

				if(position == 'prev'){
					if(selected-1 < 1){ selected = 2; }
					this.update(element, data.current, data.pages, data.url, selected-1);
				}else if(position == 'next'){
					if(selected+1 > data.pages){ selected = data.pages-1; }
					this.update(element, data.current, data.pages, data.url, selected+1);
				}else if(position == 'first'){
					this.update(element, data.current, data.pages, data.url, 1);
				}else if(position == 'last'){
					this.update(element, data.current, data.pages, data.url, data.pages);
				}
			},
			update: function(element, current, pages, url, selected){
				var string = "";

				var pagenum = pipui.pagination.types[3].pages;

				if(pages < (pagenum * 2 + 1)){
					pagenum = Math.floor(pages / 2) - 1
				}

				if(typeof selected == 'undefined'){
					selected = current;
				}

				var start = selected - pagenum;

				if(start < 1){
					start = 1;
				}

				var end = start + (pagenum * 2);

				if(end > pages) {
					end = pages;
					start = end - (pagenum * 2);
				}

				if(pagenum <= 1){
					start = 1;
					end = pages;
				}

				string += '<li class="scroller"><a data-pagination-scroll="first" href="#">«</a></li>';
				string += '<li class="scroller"><a data-pagination-scroll="prev" href="#">‹</a></li>';

				/*if(selected > 2){
					string += '<li class="scroller"><a data-pagination-scroll="first" href="#">«</a></li>';
				}

				if(selected > 1){
					string += '<li class="scroller"><a data-pagination-scroll="prev" href="#">‹</a></li>';
				}*/

				var is_current = '';
				var is_selected = '';

				for(var i = start; i <= end; i++){

					is_current = (i == current) ? 'active' : '';
					is_selected = (i == selected) ? 'selected' : '';

					string += '<li class="'+is_current+' '+is_selected+'" data-page="'+i+'">';
					string += '<a title="'+i+'" href="'+url.replace('{NUM}', i)+'">'+i+'</a>';
					string += '</li>';
				}

				string += '<li class="scroller"><a data-pagination-scroll="next" href="#">›</a></li>';
				string += '<li class="scroller"><a data-pagination-scroll="last" href="#">»</a></li>';

				/*if(selected < pages){
					string += '<li class="scroller"><a data-pagination-scroll="next" href="#">›</a></li>';
				}

				if(selected < pages-1){
					string += '<li class="scroller"><a data-pagination-scroll="last" href="#">»</a></li>';
				}*/

				element.html(string);
			}
		}
	}
};

$(function(){

	$('.pagination[data-pagination]').hide();
	pipui.pagination.init();

	$('body').on('click', '.pagination[data-pagination] [data-pagination-scroll]', function(e){
		e.preventDefault();

		var that = $(this);

		var pagination = that.closest('.pagination');

		var data = pipui.pagination.get_data(pagination);

		var position = that.attr('data-pagination-scroll');

		pipui.pagination.types[data.type].scroll(position, pagination);
	});
});




/***** navmenu.js *****/
pipui.addModule('navmenu', '1.0.0');

pipui.navmenu = {
	toggle: function(that){

		var item = that.closest('.nav-menu-item');

		var sub = item.children('.nav-sub-menu');

		if(!sub.length){ return false; }

		if(sub.is(':visible')){
			that.removeClass('active');
		}else{
			that.addClass('active');
		}

		sub.slideToggle('fast', function(){
			var self = $(this);

			if(self.is(':hidden')){
				item.removeClass('active');
			}else{
				item.addClass('active');
			}
		});
	}
};

$(function(){
	$('body').on('click', '.nav-menu .nav-menu-link.nav-menu-toggle', function(e){
		e.preventDefault();

		pipui.navmenu.toggle($(this));
	});
});




/***** autocomplete.js *****/
pipui.addModule('autocomplete', '1.0.0');
p.required('autocomplete', 'base', '1.4.0', '>=');
p.i18n.autocomplete = {
	"completed": 'Autocomplete: Search completed',
	"found": 'Autocomplete: Results found',
	"notfound": 'Autocomplete: Results not found',
	"installed": 'Autocomplete: installed',
	"typing": 'Autocomplete: Typing... % | Delay: %',
	"error": 'Autocomplete: Error "%"'
};

pipui.autocomplete_helper = {
	defaultSelector: "[data-ac]",

	is_init: function(input){
		var id = input.attr('data-ac-id');

		return typeof id == 'string' && id.length;
	},

	position: function(block, target){
		var offset = target.offset();

		var height = target.outerHeight();

		block.css({
			'top': (offset.top + height)+'px',
			'left': offset.left+'px'
		});
	}
};

pipui.autocomplete = function(input){
	var _input = input;

	var _type = 'text';

	var _data = '';

	var _id = Math.random().toString();

	var _url, _key, _timeout_typing, _block, _xhr;

	var _params = {};

	var _method = 'GET';

	var _timer = 400;

	var _min = 3;

	var _results = 10;

	var _debug = false;

	var self = this;

	var _value = '';

	var _result = [];

	var _templateBlock = '<div class="autocomplete" data-ac-id="{ID}"><ul class="autocomplete-list"></ul></div>';

	var _templateSelector = '<li class="autocomplete-item"><a href="#" class="autocomplete-link" data-key="{KEY}" data-index="{INDEX}" rel="nofollow">{VALUE}</a></li>';

	var draw = function(results){
		if(!results || !results.length){ _block.removeClass('visible'); return; }

		var list = _block.find('.autocomplete-list');

		list.empty();

		var item;

		$.each(results, function(key, obj){
			item = _templateSelector.replace(/\{KEY\}/g, obj.key);
			item = item.replace(/\{INDEX\}/g, obj.index);
			list.append(item.replace(/\{VALUE\}/g, obj.value));
		});

		_block.addClass('visible');

		_block.find('.autocomplete-link').on('click', function(e){
			e.preventDefault();

			var that = $(this);

			if(_block.hasClass('visible')){
				var id = that.attr('data-index');

				_input.val(results[id].value);

				_block.removeClass('visible');

				if(typeof choice == 'function'){
					choice(results[id], that);
				}
			}
		});
	};

	var search = function(list, str){
		_result = [];

		if(str.length < _min){
			return _result;
		}

		var founded = 0;

		if(_type == 'text'){
			list = list.split(',');
		}

		$.each(list, function(key, value){

			if(typeof _key == 'string'){
				value = value[_key];
			}

			if(typeof value == 'undefined'){
				return;
			}

			if(value.toLowerCase().indexOf(str.toLowerCase()) !== -1){
				_result.push({"value": value, "key": key, "index": founded});
				founded++;

				if(founded >= _results){
					return false;
				}
			}
		});

		if(_debug){ console.info('[PipUI] '+p.i18n.autocomplete.completed); }

		if(founded){
			if(_debug){ console.info('[PipUI] '+p.i18n.autocomplete.found); }

			if(typeof found == 'function'){
				found(_result);
			}

			pipui.autocomplete_helper.position(_block, _input);
		}else{
			if(_debug){ console.info('[PipUI] '+p.i18n.autocomplete.notfound); }

			if(typeof notfound == 'function'){
				notfound();
			}
		}

		return _result;
	};

	var initInput = function(trigger){
		trigger.attr('data-ac-id', _id);

		var data = trigger.attr('data-ac-data');
		var type = trigger.attr('data-ac-type');
		var key = trigger.attr('data-ac-key');
		var min = trigger.attr('data-ac-min');
		var url = trigger.attr('data-ac-url');
		var method = trigger.attr('data-ac-method');
		var timer = trigger.attr('data-ac-timer');
		var results = trigger.attr('data-ac-results');

		if(typeof type == 'string' && ['text', 'object', 'array', 'json'].indexOf(type.toLowerCase()) !== -1){
			self.setType(type.toLowerCase());
		}

		if(typeof data == 'string' && data.length){
			if(typeof type == 'undefined'){
				self.setType('text');
			}

			self.setData(data);
		}

		if(typeof key == 'string' && key.length){
			self.setKey(key);
		}

		if(typeof min == 'string' && min.length){
			self.setMin(parseInt(min));
		}

		if(typeof url == 'string' && url.length){
			self.setURL(url);
		}

		if(typeof method == 'string' && method.length){
			self.setMethod(method);
		}

		if(typeof timer == 'string' && timer.length){
			self.setTimer(parseInt(timer));
		}

		if(typeof results == 'string' && results.length){
			self.setResults(parseInt(results));
		}

		_block = $(_templateBlock.replace(/\{ID\}/g, _id));

		$('body').append(_block);

		if(_debug){ console.info('[PipUI] '+p.i18n.autocomplete.installed); }

		return self;
	};

	this.setParams = function(formdata){
		_params = formdata;

		return self;
	};

	this.setTemplateBlock = function(html){
		_templateBlock = html;

		return self;
	};

	this.setTemplateSelector = function(html){

		_templateSelector = html;

		return self;
	};

	this.getResult = function(){
		return _result;
	};

	this.getInput = function(){
		return _input;
	};

	this.setType = function(type){
		_type = typeof type != 'string' ? 'text' : type;

		return self;
	};

	this.setURL = function(url){
		_url = typeof url != 'string' ? '' : url;

		return self;
	};

	this.setData = function(data){
		_data = data;

		return self;
	};

	this.setMin = function(min){
		_min = typeof min != 'number' || min < 1 ? 1 : parseInt(min);

		return self;
	};

	this.setMethod = function(method){
		_method = typeof method != 'string' ? '' : method;

		return self;
	};

	this.setTimer = function(timeout){
		_timer = typeof timeout != 'number' || timeout < 0 ? 0 : parseInt(timeout);

		return self;
	};

	this.setResults = function(amount){
		_results = typeof amount != 'number' || amount < 1 ? 1 : parseInt(amount);

		return self;
	};

	this.setKey = function(key){
		_key = typeof key != 'string' ? undefined : key;

		return self;
	};

	var typing, found, notfound, error, choice, success;

	this.typing = function(f){
		if(typeof f != 'function'){ return self; }

		typing = f;

		return self;
	};

	this.choice = function(f){
		if(typeof f != 'function'){ return self; }

		choice = f;

		return self;
	};

	this.found = function(f){
		if(typeof f != 'function'){ return self; }

		found = f;

		return self;
	};

	this.notfound = function(f){
		if(typeof f != 'function'){ return self; }

		notfound = f;

		return self;
	};

	this.error = function(f){
		if(typeof f != 'function'){ return self; }

		error = f;

		return self;
	};

	this.success = function(f){
		if(typeof f != 'function'){ return self; }

		success = f;

		return self;
	};

	initInput(input);

	_input.on('input', function(){
		var that = $(this);

		_value = that.val();

		if(_debug){ console.info('[PipUI] '+p.l(p.i18n.autocomplete.typing, [_value, _timer])); }

		if(typeof typing == 'function'){
			typing(_value);
		}

		var s = {};

		if(!_url){
			if(typeof _timeout_typing != 'undefined'){ clearTimeout(_timeout_typing); }

			_timeout_typing = setTimeout(function(){
				s = search(_data, _value);

				draw(s);

				if(typeof success == 'function'){
					success(s, '');
				}
			}, _timer);
		}else{
			var formData = (_params.toString() === '[object FormData]') ? _params : new FormData();

			formData.append('value', _value);

			if(_params.toString() !== '[object FormData]'){
				if(typeof _params != 'undefined'){
					$.each(_params, function(key, value){
						formData.append(key.toString(), value.toString());
					});
				}
			}

			if(typeof _timeout_typing != 'undefined'){ clearTimeout(_timeout_typing); }

			_timeout_typing = setTimeout(function(){
				var ajax = {
					url: _url,
					type: _method,
					async: true,
					cache: false,
					contentType: false,
					processData: false,
					data: formData,

					error: function(data, textStatus, xhr){
						_xhr = xhr;

						if(_debug){ console.info('[PipUI] '+p.l(p.i18n.autocomplete.error, [textStatus])); console.error(data); }

						if(typeof error == 'function'){
							error(data);
						}
					},

					success: function(data, textStatus, xhr){
						_xhr = xhr;

						_data = data;

						s = search(_data, _value);

						draw(s);

						if(typeof success == 'function'){
							success(data, textStatus, xhr);
						}
					}
				};

				if(_type == 'json' || typeof _type == 'undefined'){
					ajax.dataType = 'json';
				}else if(_type == 'text'){
					ajax.dataType = 'text';
				}

				return $.ajax(ajax);
			}, _timer);
		}
	}).on('keydown', function(e){
		if(e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13){
			e.preventDefault();

			if(e.keyCode == 40 || e.keyCode == 38){

				var items = _block.find('.autocomplete-link');

				var length = items.length;

				var current = -1;

				var next = e.keyCode == 40 ? 0 : length-1;

				items.each(function(i){
					var that = $(this);

					if(that.hasClass('hover')){
						that.removeClass('hover');
						current = i;
					}
				});

				if(e.keyCode == 40){
					next = current == length-1 ? 0 : current + 1;
				}else{
					next = current == 0 ? length-1 : current - 1;
				}

				$(items[next]).addClass('hover');
			}else{
				var hovered = _block.find('.autocomplete-link.hover');

				if(hovered.length){
					hovered.trigger('click');
				}
			}
		}
	});
};

$(function(){
	window.onresize = function(){
		var element = $('.autocomplete.visible');

		if(element.length){
			var input = $('input[data-ac-id="'+element.attr('data-ac-id')+'"]');

			if(input.length){
				pipui.autocomplete_helper.position(element, input);
			}
		}
	};

	$('body').on('focus', pipui.autocomplete_helper.defaultSelector, function(){
		var that = $(this);

		if(!pipui.autocomplete_helper.is_init(that)){
			new pipui.autocomplete(that);
		}
	});
});




/***** poplight.js *****/
pipui.addModule('poplight', '1.0.0');

pipui.poplight = {
	'overlay_close': true,

	'overlay': function(status){
		var overlay = $('.poplight-overlay');

		if(!overlay.length){
			overlay = $('<div class="poplight-overlay"></div>');
			$('body').append(overlay);
		}

		if(this.overlay_close){
			overlay.addClass('canclose');
		}else{
			overlay.removeClass('canclose');
		}

		setTimeout(function(){
			if(status){
				overlay.addClass('active');
			}else{
				overlay.removeClass('active');
			}
		}, 0);

	},

	'active': function(e){
		if(typeof e == 'string'){ e = $(e); }

		if(!e.length){ return false; }

		this.overlay(true);

		var position = e.css('position');

		var prepos = e.attr('data-poplight-prepos');

		if(typeof prepos != 'undefined'){
			e.attr('data-poplight-prepos', position);
		}

		if(position == 'static'){
			e.css('position', 'relative');
		}

		e.addClass('poplight-box');

		var first = e.first();

		var offset = first.offset();

		var win = $(window);

		var window_width = win.width();
		var window_height = win.height();

		var top = offset.top - (window_height / 2) + (first.outerHeight() / 2);

		$('html').animate({
			scrollTop: top
		}, 500);

		e.each(function(i){
			var self = $(this);

			var msgbox = self.attr('data-poplight-message');

			var id = self.attr('data-poplight-id');

			if(typeof id == 'undefined'){
				id = Math.random();
				self.attr('data-poplight-id', id);
			}

			if(msgbox[0] == '#' || msgbox[0] == '[' || msgbox[0] == '.'){
				msgbox = $(msgbox);
				msgbox.attr('data-poplight-id', id);
			}else{
				var block = $('.poplight-message[data-poplight-id="'+id+'"]');

				if(!block.length){
					msgbox = $('<div class="poplight-message" data-poplight-id="'+id+'"><a href="#" class="poplight-message-close">&times;</a>'+msgbox+'</div>');
					$('body').append(msgbox);
				}else{
					block.html('<a href="#" class="poplight-message-close">&times;</a>'+msgbox);
					msgbox = block;
				}
			}

			var heigth = self.outerHeight();
			var width = self.outerWidth();

			var offset = self.offset();

			var top = offset.top;
			var left = offset.left;
			var right = window_width - (left + width);
			var bottom = window_height - (top + heigth);

			msgbox.removeClass('poplight-top poplight-bottom poplight-left poplight-right');

			if(top > bottom){
				msgbox.css({'top': 'auto', 'bottom': (window_height - top + 8)+'px'}).addClass('poplight-top');
			}else{
				msgbox.css({'bottom': 'auto', 'top': (top + heigth + 8)+'px'}).addClass('poplight-bottom');
			}

			if(left > right){
				msgbox.css({'left': 'auto', 'right': (right + 20)+'px'}).addClass('poplight-left');
			}else{
				msgbox.css({'right': 'auto', 'left': (left + 20)+'px'}).addClass('poplight-right');
			}

			setTimeout(function(){
				msgbox.addClass('active');
			}, i);
		});

		return true;
	},

	'deactive': function(e){
		if(typeof e == 'string'){ e = $(e); }

		if(!e.length){ return false; }

		var prepos = e.attr('data-poplight-prepos');

		e.css('position', prepos).removeClass('poplight-box').removeAttr('data-poplight-prepos');
		$('.poplight-message').removeClass('active');

		this.overlay(false);

		return true;
	}
};

$(function(){
	$('body').on('click', '[data-poplight]', function(e){
		e.preventDefault();

		pipui.poplight.active($(this).attr('data-poplight'));
	}).on('click', '.poplight-overlay.active.canclose', function(e){
		e.preventDefault();

		pipui.poplight.deactive('.poplight-box');
	}).on('click', '.poplight-message .poplight-message-close', function(e){
		e.preventDefault();

		var that = $(this);

		that.closest('.poplight-message').removeClass('active');

		if(!$('.poplight-message.active').length){
			pipui.poplight.deactive('.poplight-box');
		}
	});
});




/***** popup.js *****/
pipui.addModule('popup', '1.0.0');

pipui.popup = {
	'showSpeed': 'fast',
	'hideSpeed': 'fast',

	'arrowSize': 8,

	'lock': false,

	'create': function(block, header, body, closeover, placement){
		if(typeof block == 'string'){
			block = $(block);
		}

		if(!block.length){
			return false;
		}

		var id = block.attr('data-popup-id');

		var e;

		if(typeof placement == 'undefined'){ placement = 'top'; }

		if(typeof id != 'undefined'){
			var trigger = '.popup[data-popup-id="'+id+'"]';
			e = $(trigger);

			if(e.length){
				if(closeover){ e.attr('data-popup-closeover', 'true'); }

				e.attr('data-popup-placement', placement);

				this.show(e, block);

				return id;
			}
		}

		id = Math.random();

		e = $('<div class="popup" data-popup-id="'+id+'" data-popup-placement="'+placement+'"><div class="popup-header">'+header+'</div><div class="popup-body">'+body+'</div></div>');

		if(closeover){ e.attr('data-popup-closeover', 'true'); }

		$('body').append(e);

		this.show(e, block);

		return '.popup[data-popup-id="'+id+'"]';
	},

	'show': function(e, block){
		if(this.lock){ return false; }

		if(typeof e == 'string'){ e = $(e); }
		if(typeof block == 'string'){ block = $(block); }

		if(!e.length || block.length != 1){ return false; }

		this.lock = true;

		if(typeof e.attr('data-popup-id') == 'undefined'){
			var id = Math.random();
			e.attr('data-popup-id', id);
			block.attr('data-popup-id', id);
		}

		var position = this.calculate_position(e, block);

		e.css({'top': position.top+'px', 'left': position.left+'px'});

		e.fadeIn(this.showSpeed, function(){
			$(this).addClass('active');
			pipui.popup.lock = false;
		});

		return true;
	},

	'hide': function(e){
		if(this.lock){ return false; }

		if(typeof e == 'string'){ e = $(e); }

		if(!e.length){ return false; }

		this.lock = true;

		e.fadeOut(this.hideSpeed, function(){
			$(this).removeClass('active');
			pipui.popup.lock = false;
		});

		return true;
	},

	'toggle': function(e, block){
		if(this.lock){ return false; }
		if(typeof e == 'string'){ e = $(e); }

		if(e.hasClass('active')){
			this.hide(e);
		}else{
			this.show(e, block);
		}

		return true;
	},

	'calculate_placement': function(placement, top, right, bottom, left, e_w, e_h){

		if(placement != 'left' && placement != 'top' && placement != 'right' && placement != 'bottom'){
			placement = 'top';
		}

		if(placement == 'left'){
			if(left >= e_w+this.arrowSize){
				return 'left';
			}else if(right >= e_w+this.arrowSize){
				return 'right';
			}else if(bottom > top && bottom > e_h+this.arrowSize){
				return 'bottom';
			}
		}else if(placement == 'right'){
			if(right >= e_w+this.arrowSize){
				return 'right';
			}else if(left >= e_w+this.arrowSize){
				return 'left';
			}else if(bottom > top && bottom > e_h+this.arrowSize){
				return 'bottom';
			}
		}else if(placement == 'bottom'){
			if(bottom >= e_h+this.arrowSize){
				return 'bottom';
			}else if(top >= e_h+this.arrowSize){
				return 'top';
			}else if(left >= e_w+this.arrowSize){
				return 'left';
			}else if(right > e_w+this.arrowSize){
				return 'right';
			}
		}else if(placement == 'top'){
			if(top >= e_h+this.arrowSize){
				return 'top';
			}else if(bottom >= e_h+this.arrowSize){
				return 'bottom';
			}else if(left >= e_w+this.arrowSize){
				return 'left';
			}else if(right > e_w+this.arrowSize){
				return 'right';
			}
		}

		return 'top';
	},

	'calculate_position': function(e, block){
		var blockpos = block.offset();

		var e_w = e.outerWidth();
		var e_h = e.outerHeight();

		var block_w = block.outerWidth();
		var block_h = block.outerHeight();

		var placement = e.attr('data-popup-placement');

		var win = $(window);

		var win_w = win.width();
		var win_h = win.height();

		var free = {
			'top': blockpos.top-window.pageYOffset,
			'left': blockpos.left,
			'bottom': win_h - (blockpos.top-window.pageYOffset+block_h),
			'right': win_w - (blockpos.left+block_w)
		};

		placement = this.calculate_placement(placement, free.top, free.right, free.bottom, free.left, e_w, e_h);

		e.attr('data-popup-direction', placement);

		if(placement == 'left'){
			return {
				'top': blockpos.top + (block_h / 2) - (e_h / 2),
				'left': blockpos.left - e_w - this.arrowSize
			};
		}else if(placement == 'right'){
			return {
				'top': blockpos.top + (block_h / 2) - (e_h / 2),
				'left': blockpos.left + block_w + this.arrowSize
			};
		}else if(placement == 'bottom'){
			return {
				'top': blockpos.top + block_h + this.arrowSize,
				'left': blockpos.left + (block_w / 2) - (e_w / 2)
			};
		}else if(placement == 'top'){
			return {
				'top': blockpos.top - e_h - this.arrowSize,
				'left': blockpos.left + (block_w / 2) - (e_w / 2)
			};
		}

		return {
			'top': blockpos.top - e_h - this.arrowSize,
			'left': blockpos.left + (block_w / 2) - (e_w / 2)
		};
	},

	'update': function(){
		var list = $('.popup.active');

		if(!list.length){ return false; }

		list.each(function(){
			var e = $(this);
			var id = e.attr('data-popup-id');

			var block = $('[data-popup-id="'+id+'"]:not(.popup)');

			if(!block.length){ return; }

			var position = pipui.popup.calculate_position(e, block);

			e.css({'top': position.top+'px', 'left': position.left+'px'});
		});

		return true;
	}
};

$(function(){
	$('body').on('click', '[data-popup]', function(e){
		e.preventDefault();

		var that = $(this);

		pipui.popup.toggle(that.attr('data-popup'), that);
	});

	$('html').on('click', 'body', function(e){
		var popup = $(e.target).closest('.popup');

		if(!popup.length){
			pipui.popup.hide($('.popup[data-popup-closeover]'));
		}else{
			var id = popup.attr('data-popup-id');

			if(typeof id != 'undefined'){
				pipui.popup.hide($('.popup[data-popup-closeover]:not([data-popup-id="'+id+'"])'));
			}
		}
	});

	$(window).on('resize scroll', function(){
		pipui.popup.update();
	});
});




/***** slider.js *****/
pipui.addModule('slider', '1.0.0');

(function($){

	var slider_methods = {
		'setControl': function(num, slider){

			slider.find('.slider-control .slider-control-label.active').removeClass('active');

			slider.find('.slider-control .slider-control-label:nth-child('+(num+1)+')').addClass('active');

			return slider;
		},

		'prev': function(slider){

			if(typeof slider == 'undefined' || !slider.length){ return slider; }

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			var prev = options.current <= 0 ? options.slides.length-1 : options.current-1;

			return this.setSlide(prev, slider);
		},

		'next': function(slider){

			if(typeof slider == 'undefined' || !slider.length){ return slider; }

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			var next = options.current+1 >= options.slides.length ? 0 : options.current+1;

			return this.setSlide(next, slider);
		},

		'auto': function(slider, id){
			var self = this;

			var options = slider_options[id];

			if(typeof options.timeout != 'undefined'){
				clearTimeout(slider_options[id].timeout);
			}

			if(!slider.hasClass('paused') && options.auto && options.autoSpeed){
				slider_options[id].timeout = setTimeout(function(){
					self.next(slider);
				}, options.autoSpeed);
			}
		},

		'setSlide': function(num, slider){
			var self = this;

			if(typeof slider == 'undefined' || !slider.length){ return slider; }

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			if(typeof options == 'undefined' || slider.find('.slider-wrapper > .slider-slide').length == 1 || options.locked){ return slider; }

			slider.trigger('slider.change');

			slider_options[id].locked = true;

			var current = slider.find('.slider-wrapper > .slider-slide.active');

			current.removeClass('active');

			var next = slider.find('.slider-wrapper > .slider-slide:nth-child('+(num+1)+')');

			if(!next.length){ return; }

			if(options.current < num){
				next.css({'right': 'auto', 'left': '100%', 'z-index': '2'});
				current.css({'left': 'auto', 'right': '0', 'z-index': '1'});

				next.animate({
					'left': '0'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).addClass('active').trigger('slider.change.complete');
						self.auto(slider, id);
					}
				});

				current.animate({
					'right': '100%'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).removeClass('active').trigger('slider.change.complete');
						slider_options[id].locked = false;
						self.auto(slider, id);
					}
				});
			}else if(options.current > num){
				next.css({'left': 'auto', 'right': '100%', 'z-index': '2'});
				current.css({'right': 'auto', 'left': '0', 'z-index': '1'});

				next.animate({
					'right': '0'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).addClass('active').trigger('slider.change.complete');
						self.auto(slider, id);
					}
				});

				current.animate({
					'left': '100%'
				}, {
					duration: options.speed,
					easing: options.easing,
					queue: false,
					complete: function(){
						$(this).removeClass('active').trigger('slider.change.complete');
						slider_options[id].locked = false;
						self.auto(slider, id);
					}
				});
			}else{
				slider_options[id].locked = false;
				slider.trigger('slider.change.complete');
			}

			slider_options[id].current = num;

			return this.setControl(num, slider);
		}
	};

	var slider_options = {};

	$.fn.slider = function(options){

		var slider = this;

		var id = Math.random();

		slider_options[id] = $.extend({}, {
			'id': id,
			'height': '280px',
			'width': '100%',
			'slides': [],
			'control': 'default',
			'auto': true,
			'autoSpeed': 5000,
			'pauseOnHover': true,
			'timeout': undefined,
			'current': 0,
			'speed': 800,
			'easing': 'easeInOutQuint',
			'locked': false
		}, options);

		slider.setHeight = function(value){
			slider_options[id].height = value;
			return this;
		};

		slider.setWidth = function(value){
			slider_options[id].width = value;
			return this;
		};

		slider.setSlides = function(list){
			slider_options[id].slides = list;
			return this;
		};

		slider.setControl = function(type){
			slider_options[id].control = type;
			return this;
		};

		slider.setAuto = function(type){
			slider_options[id].auto = type;
			return this;
		};

		slider.setAutoSpeed = function(speed){
			slider_options[id].autoSpeed = speed;
			return this;
		};

		slider.setPauseOnHover = function(type){
			slider_options[id].pauseOnHover = type;
			return this;
		};

		slider.setSpeed = function(duration){
			slider_options[id].speed = duration;
			return this;
		};

		slider.setEasing = function(easing){
			slider_options[id].easing = easing;
			return this;
		};

		slider.setSlide = function(num){
			slider_methods.setSlide(num, this);
			return this;
		};

		slider.next = function(){
			slider_methods.next(this);
			return this;
		};

		slider.prev = function(){
			slider_methods.prev(this);
			return this;
		};

		slider.restoreControl = function(){
			var self = this;

			self.find('.slider-control').remove();

			self.append('<div class="slider-control"></div>');

			var control = self.children('.slider-control');

			var label = '';

			for(var i = 0; i < slider_options[id].slides.length; i++){
				label = $('<a href="#" class="slider-control-label"></a>');

				if(slider_options[id].current == i){ label.addClass('active'); }
				control.append(label);
			}

			return self;
		};

		slider.update = function(){
			var self = this;

			self.html('');

			self.addClass('slider active').attr('data-slider-id', slider_options[id].id).html('<div class="slider-wrapper" style="width: '+slider_options[id].width+'; height: '+slider_options[id].height+';"></div>');

			if(typeof slider_options[id].slides != 'object'){ return self; }

			var len = slider_options[id].slides.length;

			if(!len){ return self; }

			var slide = '';

			var wrapper = self.children('.slider-wrapper');

			for(var i = 0; i < len; i++){
				slide = slider_options[id].slides[i];

				if(typeof slide != 'string' || !slide.length){ continue; }

				slide = $(slide);

				if(i == slider_options[id].current){
					slide.addClass('active');
				}

				wrapper.append(slide);
			}

			if(typeof slider_options[id].timeout != 'undefined'){
				clearTimeout(slider_options[id].timeout);
			}

			if(slider_options[id].auto && slider_options[id].autoSpeed){
				slider_options[id].timeout = setTimeout(function(){
					self.next();
				}, slider_options[id].autoSpeed);
			}

			return self.restoreControl();
		};

		return slider.update();
	};

	$(function(){
		$('body').on('click', '.slider > .slider-control > .slider-control-label', function(e){
			e.preventDefault();

			var that = $(this);

			var id = that.closest('.slider').attr('data-slider-id');

			var slider = $('.slider[data-slider-id="'+id+'"]');

			if(typeof slider_options[id] == 'undefined'){ return; }

			var index = that.closest('.slider-control').find('.slider-control-label').index(that);

			slider_methods.setSlide(index, slider);
		}).on('mouseenter', '.slider', function(){

			var that = $(this);

			var slider = that.closest('.slider');

			var id = slider.attr('data-slider-id');

			var options = slider_options[id];

			if(options.pauseOnHover && typeof options.timeout != 'undefined'){
				if(options.auto && options.autoSpeed) {
					slider.addClass('paused');
				}

				clearTimeout(slider_options[id].timeout);
			}
		}).on('mouseleave', '.slider', function(){
			var that = $(this);

			var id = that.attr('data-slider-id');

			if(slider_options[id].pauseOnHover){
				that.removeClass('paused');
				slider_methods.auto(that, id);
			}
		});
	});
}(jQuery));




/***** tooltip.js *****/
pipui.addModule('tooltip', '1.0.0');

pipui.tooltip = {
	'margin': 2,

	'trigger': 'data-tooltip',

	'fadeInSpeed': 'fast',

	'fadeOutSpeed': 'fast',

	'getPosition': function(that){
		if(typeof that.attr(pipui.tooltip.trigger) != 'undefined'){
			return '';
		}

		if(typeof that.attr(pipui.tooltip.trigger+'-left') != 'undefined'){
			return '-left';
		}

		if(typeof that.attr(pipui.tooltip.trigger+'-right') != 'undefined'){
			return '-right';
		}

		if(typeof that.attr(pipui.tooltip.trigger+'-top') != 'undefined'){
			return '-top';
		}

		return '-bottom';
	},

	'setPosition': function(e, tooltip, position){

		var top = -9999;
		var left = -9999;

		tooltip.css({'top': top+'px', 'left': left+'px'});

		var pos = e.offset();

		var width = e.outerWidth();
		var height = e.outerHeight();

		var t_width = tooltip.outerWidth();
		var t_height = tooltip.outerHeight();

		if(position == '-left'){
			top = pos.top + (height / 2) - (t_height / 2);
			left = pos.left - t_width - 4 - pipui.tooltip.margin;
		}else if(position == '-right'){
			top = pos.top + (height / 2) - (t_height / 2);
			left = pos.left + width + 4 + pipui.tooltip.margin;
		}else if(position == '-bottom'){
			top = pos.top + height + 4 + pipui.tooltip.margin;
			left = pos.left + (width / 2) - (t_width / 2);
		}else{
			top = pos.top - t_height - 4 - pipui.tooltip.margin;
			left = pos.left + (width / 2) - (t_width / 2);
		}

		tooltip.css({'top': top+'px', 'left': left+'px'});
	}
};

$(function(){
	$('body').on('mouseenter', '['+pipui.tooltip.trigger+'], ['+pipui.tooltip.trigger+'-left], ['+pipui.tooltip.trigger+'-right],['+pipui.tooltip.trigger+'-top], ['+pipui.tooltip.trigger+'-bottom]', function(){
		var that = $(this);

		var id = that.attr('data-tooltip-id');

		var position = pipui.tooltip.getPosition(that);

		var trigger = pipui.tooltip.trigger+position;

		var text = that.attr(trigger);

		if($.trim(text) != ''){
			if(typeof id == 'undefined'){
				id = Math.random();
				that.attr('data-tooltip-id', id);
				var append = $('<div class="tooltip" data-tooltip-id="'+id+'">'+text+'</div>');

				$('body').append(append);
			}

			var tooltip = $('.tooltip[data-tooltip-id="'+id+'"]');

			tooltip.removeClass('tooltip-pos tooltip-pos-left tooltip-pos-right tooltip-pos-bottom tooltip-pos-top').addClass('tooltip-pos'+position);

			pipui.tooltip.setPosition(that, tooltip, position);

			tooltip.addClass('show');
		}
	}).on('mouseleave', '['+pipui.tooltip.trigger+'], ['+pipui.tooltip.trigger+'-left], ['+pipui.tooltip.trigger+'-right],['+pipui.tooltip.trigger+'-top], ['+pipui.tooltip.trigger+'-bottom]', function(){
		var tooltip = $('.tooltip.show');

		if(tooltip.length){
			tooltip.removeClass('show');
		}

	});
});




/***** alertblock.js *****/
pipui.addModule('alertblock', '1.0.0');

pipui.alertblock = {
	show: function(element){
		if(typeof element == 'string'){ element = $(element); }

		element.fadeIn('fast');
	},

	hide: function(element){
		if(typeof element == 'string'){ element = $(element); }

		element.fadeOut('fast');
	}
};

$(function(){
	$('body').on('click', '.alertblock .alertblock-close', function(e){
		e.preventDefault();

		pipui.alertblock.hide($(this).closest('.alertblock'));
	});
});




/***** tagselector.js *****/
pipui.addModule('tagselector', '1.0.0');
p.required('tagselector', 'base', '1.4.0', '>=');
p.i18n.tagselector = {
	"pushed": 'Tagselector: tag "%" by key "%" has been pushed',
	"installed": 'Tagselector: installed'
};

pipui.tagselector_helper = {
	defaultSelector: "[data-ts]",

	is_init: function(input){
		var id = input.attr('data-ts-id');

		return typeof id == 'string' && id.length;
	}
};

pipui.tagselector = function(input){

	var _input = input;

	var _id = Math.random().toString();

	var _keys = [',', 'Enter'];

	var _min_length = 1;

	var _max_length = 32;

	var _min_tags = 0;

	var _max_tags = 0;

	var _name = 'tags';

	var _position = 'end';

	var _debug = false;

	var self = this;

	var _disableEvents = false;

	var _block, onpush, onclear;

	var _separator = ',';

	var _templateBlock = '<div class="tagselector" data-ts-id="{ID}"><ul class="tagselector-list"></ul></div>';

	var _templateSelector = '<li class="tagselector-item"><a href="#" title="Удалить" class="tagselector-link" data-title="{TITLE}" data-key="{KEY}" rel="nofollow">{TITLE}</a><input type="hidden" name="{NAME}[{KEY}]" value="{TITLE}" class="tagselector-value"></li>';

	this.setTemplateBlock = function(html){
		_templateBlock = html;

		return self;
	};

	this.setTemplateSelector = function(html){

		_templateSelector = html;

		return self;
	};

	this.setDisableEvents = function(value){

		_disableEvents = value;

		return self;
	};

	this.setMin = function(length){
		_min_length = typeof length != 'number' || length < 1 ? 1 : parseInt(length);

		return self;
	};

	this.setMax = function(length){
		_max_length = typeof length != 'number' || length < 1 ? 1 : parseInt(length);

		return self;
	};

	this.setName = function(name){
		_name = name;

		return self;
	};

	this.setKeys = function(keys){
		_keys = keys;

		return self;
	};

	this.setSeparator = function(separator){
		_separator = separator;

		return self;
	};

	this.setPosition = function(pos){
		_position = pos;

		return self;
	};

	this.setMinTags = function(length){
		_min_tags = typeof length != 'number' || length < 1 ? 1 : parseInt(length);

		return self;
	};

	this.setMaxTags = function(length){
		_max_tags = typeof length != 'number' || length < 1 ? 1 : parseInt(length);

		return self;
	};

	this.push = function(position, title, key){

		if(typeof key == 'undefined'){
			key = title;
		}

		if(self.exists(key)){ return self; }

		var html = _templateSelector.replace(/\{TITLE\}/g, title);

		html = html.replace(/\{NAME\}/g, _name);
		html = html.replace(/\{KEY\}/g, key);

		var list = _block.find('.tagselector-list');

		if(typeof position == 'undefined' || position == 'end'){
			list.append(html);
		}else{
			list.prepend(html);
		}

		if(_debug){ console.info('[PipUI] '+p.l(p.i18n.tagselector.pushed, [title, key])); }

		list.find('.tagselector-link').on('click', function(e){
			e.preventDefault();

			var tags = self.length();

			if(_min_tags <= 0 || tags > _min_tags){
				$(this).fadeOut('fast', function(){
					self.remove($(this).attr('data-key'));
				});
			}

		});

		if(typeof onpush == 'function'){
			onpush(title, key, position);
		}

		return self;
	};

	this.exists = function(key){

		if(typeof key == 'undefined' || !key.toString().length){ return false; }

		return _block.find('.tagselector-link[data-key="'+key+'"]').length > 0;
	};

	this.remove = function(key){

		if(typeof key == 'undefined' || !key.length){ return self; }

		var tags = self.length();

		if(_min_tags > 0 && tags <= _min_tags){
			return self;
		}

		var item = _block.find('.tagselector-link[data-key="'+key+'"]');

		if(item.length){
			item.closest('.tagselector-item').remove();
		}

		return self;
	};

	this.getInput = function(){
		return _input;
	};

	this.prepend = function(value, name){
		return self.push('start', value, name);
	};

	this.append = function(value, name){
		return self.push('end', value, name);
	};

	this.clear = function(){
		_block.find('.tagselector-list').empty();

		return self;
	};

	this.onclear = function(f){
		if(typeof f != 'function'){ return self; }

		onclear = f;

		return self;
	};

	this.onpush = function(f){
		if(typeof f != 'function'){ return self; }

		onpush = f;

		return self;
	};

	this.length = function(){
		return _block.find('.tagselector-link').length;
	};

	var initInput = function(trigger){
		trigger.attr('data-ts-id', _id);

		var value = trigger.val();

		var separator = trigger.attr('data-ts-separator');
		var min = trigger.attr('data-ts-min');
		var max = trigger.attr('data-ts-max');
		var name = trigger.attr('data-ts-name');
		var position = trigger.attr('data-ts-position');
		var mintags = trigger.attr('data-ts-mintags');
		var maxtags = trigger.attr('data-ts-maxtags');

		if(typeof min == 'string' && min.length){
			self.setMin(parseInt(min));
		}

		if(typeof max == 'string' && max.length){
			self.setMax(parseInt(max));
		}

		if(typeof name == 'string' && name.length){
			self.setName(name);
		}

		if(typeof separator == 'string' && separator.length){
			self.setSeparator(separator);
		}

		if(typeof position == 'string' && position.length){
			self.setPosition(position == 'end' ? position : 'start');
		}

		if(typeof mintags == 'string' && mintags.length){
			self.setMinTags(parseInt(mintags));
		}

		if(typeof maxtags == 'string' && maxtags.length){
			self.setMaxTags(parseInt(maxtags));
		}

		_block = $(_templateBlock.replace(/\{ID\}/g, _id));

		if(_max_length > 0){
			trigger.attr('maxlength', _max_length);
		}

		trigger.after(_block);

		if(value.length){
			value = p.array_unique(value.split(_separator));

			for(var i = 0; i < value.length; i++){
				if(typeof value[i] == 'undefined'){ continue; }

				self.push(_position, value[i]);
			}

			trigger.val('');
		}

		trigger.on('keydown', function(e){

			if(!_disableEvents && _keys.indexOf(e.key) !== -1){
				e.preventDefault();

				var val = trigger.val();

				if(!self.exists(val)){
					var len = val.length;

					if(_min_length > 0 && len < _min_length){
						return;
					}

					if(_max_length > 0 && len > _max_length){
						return;
					}

					var tags = self.length();

					if(_max_tags > 0 && tags >= _max_tags){
						return;
					}

					self.push(_position, val);

					trigger.val('');
				}
			}
		});

		if(_debug){ console.info('[PipUI] '+p.i18n.tagselector.installed); }

		return self;
	};

	initInput(_input);
};

$(function(){

	var list = $(pipui.tagselector_helper.defaultSelector);

	if(list.length){
		list.each(function(){
			var that = $(this);

			if(!pipui.tagselector_helper.is_init(that)){
				new pipui.tagselector(that);
			}
		});
	}
});




/***** anchor.js *****/
pipui.addModule('anchor', '1.0.0');

pipui.anchor = {
	defaultDuration: 400,
	defaultEasing: '',

	goto: function(selector, duration, easing, complete){
		var to = $(selector);

		if(!to.length){ return false; }

		var offset = to.offset();

		if(!offset){ return false; }

		duration = typeof duration == 'undefined' ? pipui.anchor.defaultDuration : parseInt(duration);

		easing = typeof easing == 'undefined' ? pipui.anchor.defaultEasing : easing;

		if(isNaN(duration)){
			duration = pipui.anchor.defaultDuration;
		}

		var scroll = offset.top;

		if(typeof complete != 'function'){
			complete = function(){};
		}

		$('html').animate({
			scrollTop: scroll
		}, duration, easing, complete);
	}
};

$(function(){
	$('body').on('click', '[data-anchor]', function(e){

		var that = $(this);

		var selector = that.attr('data-anchor');

		var hash = that.attr('data-anchor-hash');

		e.preventDefault();

		pipui.anchor.goto(selector, that.attr('data-anchor-duration'), that.attr('data-anchor-easing'), function(){
			if(hash == 'true'){
				location.hash = selector;
			}
		});
	});
});




/***** datepicker.js *****/
pipui.addModule('datepicker', '1.0.0');
p.required('datepicker', 'base', '1.4.0', '>=');
p.i18n.datepicker = {
	"jan": 'Января',
	"feb": 'Февраля',
	"mar": 'Марта',
	"apr": 'Апреля',
	"may": 'Мая',
	"jun": 'Июня',
	"jul": 'Июля',
	"aug": 'Августа',
	"sep": 'Сентября',
	"oct": 'Октября',
	"nov": 'Ноября',
	"dec": 'Декабря',
	"year": 'Год'
};

pipui.datepicker = {
	months: [
		p.i18n.datepicker.jan, p.i18n.datepicker.feb, p.i18n.datepicker.mar,
		p.i18n.datepicker.apr, p.i18n.datepicker.may, p.i18n.datepicker.jun,
		p.i18n.datepicker.jul, p.i18n.datepicker.aug, p.i18n.datepicker.sep,
		p.i18n.datepicker.oct, p.i18n.datepicker.nov, p.i18n.datepicker.dec
	],

	template_month: '<option class="month-id" value="{MONTH_NUM}" {MONTH_SELECTED} data-value="{MONTH_NUM}">{MONTH_NAME}</option>',

	template_hour: '<option class="hour-id" value="{HOUR_NUM}" {HOUR_SELECTED} data-value="{HOUR_NUM}">{HOUR_NUM}</option>',

	template_minute: '<option class="minute-id" value="{MINUTE_NUM}" {MINUTE_SELECTED} data-value="{MINUTE_NUM}">{MINUTE_NUM}</option>',

	template_second: '<option class="second-id" value="{SECOND_NUM}" {SECOND_SELECTED} data-value="{SECOND_NUM}">{SECOND_NUM}</option>',

	template_day: '<div class="day-id {DAY_SELECTED}" data-value="{DAY_NUM}">{DAY_NUM}</div>',

	template_date: '<div class="datepicker" style="display:none;" data-datepicker-id="{ID}">' +
						'<div class="datepicker-wrapper">' +
							'<div class="datepicker-block window" data-datepicker-type="date">' +
								'<div class="block-date">' +
									'<div class="top">' +
										'<div class="block-left"><input type="number" class="datepicker-year" placeholder="'+p.i18n.datepicker.year+'" value="{CURRENT_YEAR}"></div>' +
										'<div class="block-right"><select class="datepicker-month">{MONTHLIST}</select></div>' +
									'</div>' +

									'<div class="middle">' +
										'<div class="daylist">{DAYLIST}</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>',

	template_datetime: '<div class="datepicker" style="display:none;" data-datepicker-id="{ID}">' +
							'<div class="datepicker-wrapper">' +
								'<div class="datepicker-block window" data-datepicker-type="datetime">' +
									'<div class="block-date">' +
										'<div class="top">' +
											'<div class="block-left"><input type="number" class="datepicker-year" placeholder="'+p.i18n.datepicker.year+'" value="{CURRENT_YEAR}"></div>' +
											'<div class="block-right"><select class="datepicker-month">{MONTHLIST}</select></div>' +
										'</div>' +

										'<div class="middle">' +
											'<div class="daylist">{DAYLIST}</div>' +
										'</div>' +

										'<div class="footer">' +
											'<select class="datepicker-hour">{HOURLIST}</select>' +
											'<select class="datepicker-minute">{MINUTELIST}</select>' +
											'<select class="datepicker-second">{SECONDLIST}</select>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>',

	monthlist: function(selected){
		var tpl = "";

		var monthlist = "";

		for(var m = 1; m <= 12; m++){
			var monthname = pipui.datepicker.months[m-1];

			tpl = pipui.datepicker.template_month.replace(/\{MONTH_NAME\}/ig, monthname);

			tpl = tpl.replace(/\{MONTH_NUM\}/ig, m.toString());

			tpl = tpl.replace(/\{MONTH_SELECTED\}/ig, selected == m ? 'selected' : '');

			monthlist += tpl;
		}

		return monthlist;
	},

	daylist: function(days, selected){
		var tpl = "";

		var daylist = "";

		for(var d = 1; d <= days; d++){
			tpl = pipui.datepicker.template_day.replace(/\{DAY_NUM\}/ig, d);

			tpl = tpl.replace(/\{DAY_SELECTED\}/ig, selected == d ? 'selected' : '');

			daylist += tpl;
		}

		return daylist;
	},

	hourlist: function(selected){
		var tpl = "";

		var hourlist = "";

		for(var h = 0; h <= 23; h++){
			h = h < 10 ? '0'+h : h;
			tpl = pipui.datepicker.template_hour.replace(/\{HOUR_NUM\}/ig, h);

			tpl = tpl.replace(/\{HOUR_SELECTED\}/ig, selected == h ? 'selected' : '');

			hourlist += tpl;
		}

		return hourlist;
	},

	minutelist: function(selected){
		var tpl = "";

		var minutelist = "";

		for(var m = 0; m <= 59; m++){
			m = m < 10 ? '0'+m : m;
			tpl = pipui.datepicker.template_minute.replace(/\{MINUTE_NUM\}/ig, m);

			tpl = tpl.replace(/\{MINUTE_SELECTED\}/ig, selected == m ? 'selected' : '');

			minutelist += tpl;
		}

		return minutelist;
	},

	secondlist: function(selected){
		var tpl = "";

		var secondlist = "";

		for(var s = 0; s <= 59; s++){
			s = s < 10 ? '0'+s : s;
			tpl = pipui.datepicker.template_second.replace(/\{SECOND_NUM\}/ig, s);

			tpl = tpl.replace(/\{SECOND_SELECTED\}/ig, selected == s ? 'selected' : '');

			secondlist += tpl;
		}

		return secondlist;
	},

	daysInMonth: function(month, year){
		return new Date(year, month, 0).getDate();
	},

	drawdays: function(picker, days, selected){
		var daylist = picker.find('.daylist');

		daylist.html(pipui.datepicker.daylist(days, selected));
	},

	update: function(picker, m, y){
		var id = picker.attr('data-datepicker-id');

		var trigger = $('[data-datepicker-trigger="'+id+'"]');

		var date = new Date();

		var year = parseInt(picker.find('.datepicker-year').val());

		var month = parseInt(picker.find('.datepicker-month').val());

		var day = parseInt(picker.find('.day-id.selected').attr('data-value'));

		if(isNaN(year) || year < 0){
			year = date.getFullYear();
		}

		if(isNaN(month) || month < 0 || month > 12){
			month = date.getMonth()+1;
		}

		if(isNaN(day) || day < 1 || day > 31){
			day = date.getDate();
		}

		var days = pipui.datepicker.daysInMonth(month, year);

		if(day > days){ day = days; }

		var type = typeof trigger.attr('data-datepicker') != 'undefined' ? 'datepicker' : 'datetimepicker';

		var str = (day<10?'0'+day:day)+'.'+(month<10?'0'+month:month)+'.'+year;

		if(type == 'datetimepicker'){
			var hour = parseInt(picker.find('.datepicker-hour').val());

			var minute = parseInt(picker.find('.datepicker-minute').val());

			var second = parseInt(picker.find('.datepicker-second').val());

			if(isNaN(hour) || hour < 0 || hour > 23){
				hour = date.getHours();
			}

			if(isNaN(minute) || minute < 0 || minute > 59){
				minute = date.getMinutes();
			}

			if(isNaN(second) || second < 0 || second > 59){
				second = date.getSeconds();
			}

			str += ' '+(hour<10?'0'+hour:hour)+':'+(minute<10?'0'+minute:minute)+':'+(second<10?'0'+second:second);
		}

		if(trigger[0].tagName == 'INPUT' || trigger[0].tagName == 'TEXTAREA'){
			trigger.val(str);
			trigger.attr('data-'+type, str);
		}

		if(m || y){
			pipui.datepicker.drawdays(picker, days, day);
		}
	},

	drawdate: function(trigger, id){
		if(typeof id == 'undefined'){
			id = trigger.attr('data-datepicker-trigger');
		}

		var current = trigger.attr('data-datepicker');

		var date = new Date();

		var value = trigger.val();

		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();

		var ms = date.getTime();

		if(current != '' || value != ''){
			var splitter = current != '' ? current : value;

			var split_cur = splitter.split('.');

			var p_year_cur = parseInt(split_cur[2]);
			var p_month_cur = parseInt(split_cur[1]);
			var p_day_cur = parseInt(split_cur[0]);

			if(isNaN(p_day_cur) || p_day_cur < 1 || p_day_cur > 31){ p_day_cur = day; }

			if(isNaN(p_month_cur) || p_month_cur < 1 || p_month_cur > 12){ p_month_cur = month; }

			if(isNaN(p_year_cur)){ p_year_cur = year; }

			ms = Date.parse(p_year_cur+'-'+p_month_cur+'-'+p_day_cur);

			date = new Date(ms);

			year = date.getFullYear();
			month = date.getMonth()+1;
			day = date.getDate();
		}

		var template = pipui.datepicker.template_date.replace(/\{ID\}/ig, id);

		template = template.replace(/\{CURRENT_YEAR\}/ig, year);

		template = template.replace(/\{MONTHLIST\}/ig, pipui.datepicker.monthlist(month));

		template = template.replace(/\{DAYLIST\}/ig, pipui.datepicker.daylist(pipui.datepicker.daysInMonth(month, year), day));

		template = $(template);

		return template;
	},

	drawdatetime: function(trigger, id){
		if(typeof id == 'undefined'){
			id = trigger.attr('data-datepicker-trigger');
		}

		var current = trigger.attr('data-datetimepicker');

		var date = new Date();

		var value = trigger.val();

		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();

		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();

		var ms = date.getTime();

		if(current != '' || value != ''){
			var splitter = current != '' ? current : value;

			splitter = splitter.split(' ');

			if(typeof splitter[1] == 'undefined'){
				splitter[1] = '00:00:00';
			}

			var split_date_cur = splitter[0].split('.');
			var split_time_cur = splitter[1].split(':');

			var p_year_cur = parseInt(split_date_cur[2]);
			var p_month_cur = parseInt(split_date_cur[1]);
			var p_day_cur = parseInt(split_date_cur[0]);

			var p_second_cur = parseInt(split_time_cur[2]);
			var p_minute_cur = parseInt(split_time_cur[1]);
			var p_hour_cur = parseInt(split_time_cur[0]);

			if(isNaN(p_day_cur) || p_day_cur < 1 || p_day_cur > 31){ p_day_cur = day; }

			if(isNaN(p_month_cur) || p_month_cur < 1 || p_month_cur > 12){ p_month_cur = month; }

			if(isNaN(p_year_cur)){ p_year_cur = year; }

			if(isNaN(p_second_cur) || p_second_cur < 0 || p_second_cur > 59){ p_second_cur = second; }

			if(isNaN(p_minute_cur) || p_minute_cur < 0 || p_minute_cur > 59){ p_minute_cur = minute; }

			if(isNaN(p_hour_cur) || p_hour_cur < 0 || p_hour_cur > 23){ p_hour_cur = hour; }

			ms = Date.parse(p_year_cur+'-'+p_month_cur+'-'+p_day_cur+' '+p_hour_cur+':'+p_minute_cur+':'+p_second_cur);

			date = new Date(ms);

			year = date.getFullYear();
			month = date.getMonth()+1;
			day = date.getDate();

			hour = date.getHours();
			minute = date.getMinutes();
			second = date.getSeconds();
		}

		var template = pipui.datepicker.template_datetime.replace(/\{ID\}/ig, id);

		template = template.replace(/\{CURRENT_YEAR\}/ig, year);

		template = template.replace(/\{MONTHLIST\}/ig, pipui.datepicker.monthlist(month));

		template = template.replace(/\{DAYLIST\}/ig, pipui.datepicker.daylist(pipui.datepicker.daysInMonth(month, year), day));

		template = template.replace(/\{HOURLIST\}/ig, pipui.datepicker.hourlist(hour));

		template = template.replace(/\{MINUTELIST\}/ig, pipui.datepicker.minutelist(minute));

		template = template.replace(/\{SECONDLIST\}/ig, pipui.datepicker.secondlist(second));

		template = $(template);

		return template;
	},

	init_date: function(input){
		var id = input.attr('data-datepicker-trigger');

		if(typeof id == 'undefined'){
			id = Math.random().toString();

			input.attr('data-datepicker-trigger', id);
		}

		var picker = $('.datepicker[data-datepicker-id="'+id+'"]');

		if(picker.length){
			return picker;
		}

		var draw = pipui.datepicker.drawdate(input, id);

		$('body').append(draw);

		return draw;
	},

	init_datetime: function(input){
		var id = input.attr('data-datepicker-trigger');

		if(typeof id == 'undefined'){
			id = Math.random().toString();

			input.attr('data-datepicker-trigger', id);
		}

		var picker = $('.datepicker[data-datepicker-id="'+id+'"]');

		if(picker.length){
			return picker;
		}

		var draw = pipui.datepicker.drawdatetime(input, id);

		$('body').append(draw);

		return draw;
	}
};

$(function(){
	$('body').on('mousedown', '[data-datepicker]', function(e){
		e.preventDefault();

		var that = $(this);

		setTimeout(function(){ that.trigger('blur'); }, 10);

		var picker = pipui.datepicker.init_date(that);

		picker.replaceWith(picker);

		picker.fadeIn('fast');
	}).on('click', '[data-datetimepicker]', function(e){
		e.preventDefault();

		var that = $(this);

		setTimeout(function(){ that.trigger('blur'); }, 10);

		var picker = pipui.datepicker.init_datetime(that);

		picker.replaceWith(picker);

		picker.fadeIn('fast');
	}).on('input', '.datepicker input', function(){
		var picker = $(this).closest('.datepicker');

		pipui.datepicker.update(picker);
	}).on('change', '.datepicker select', function(){
		var picker = $(this).closest('.datepicker');

		pipui.datepicker.update(picker, undefined, true);
	}).on('click', '.datepicker .day-id', function(){
		var that = $(this);

		var picker = that.closest('.datepicker');

		var id = picker.attr('data-datepicker-id');

		var trigger = $('[data-datepicker-trigger="'+id+'"]');

		picker.find('.day-id.selected').removeClass('selected');

		that.addClass('selected');

		pipui.datepicker.update(picker, true);

		if(trigger.attr('data-datepicker-autoclose') == 'true'){
			picker.fadeOut('fast');
		}
	});

	$('html').on('click', 'body', function(e){

		var target = $(e.target);

		if(!target.closest('.datepicker-block').length){
			target.closest('.datepicker').fadeOut('fast');
		}
	});
});




/***** progress.js *****/
pipui.addModule('progress', '1.0.0');

pipui.progress = {
	defaultBorderSize: 12,
	defaultBorderPadding: 3,
	defaultBackgroundColor: '#000',
	defaultBorderColor: '#fff',

	init: function(selector){
		var elements = document.querySelectorAll(selector);

		if(!elements){ return false; }

		var length = elements.length;

		for(let i = 0; i < length; i++){
			if(typeof elements[i] == 'undefined'){ continue; }
			pipui.progress.draw(elements[i]);
		}

		return true;
	},

	draw: function(e){
		var context = e.getContext('2d');

		context.clearRect(0, 0, e.width, e.height);

		var borderSize = parseInt(e.getAttribute('data-border-size'));
		var borderColor = e.getAttribute('data-border-color');
		var borderPadding = parseInt(e.getAttribute('data-border-padding'));
		var backgroundColor = e.getAttribute('data-background-color');
		var radius = parseFloat(e.getAttribute('data-radius'));

		if(isNaN(borderSize)){ borderSize = pipui.progress.defaultBorderSize; }
		if(isNaN(borderPadding)){ borderPadding = pipui.progress.defaultBorderPadding; }
		if(isNaN(radius)){ radius = 0; }

		borderPadding *= 2;

		var half = (e.width - borderSize) / 2;

		var margin = half + (borderSize / 2);

		var start = Math.PI * 1.5;

		backgroundColor = typeof backgroundColor != 'string' ? pipui.progress.defaultBackgroundColor : backgroundColor;
		borderColor = typeof borderColor != 'string' ? pipui.progress.defaultBorderColor : borderColor;

		context.beginPath();
		context.strokeStyle = backgroundColor;
		context.lineWidth = borderSize;
		context.arc(margin, margin, half, 0, Math.PI * 2, false);
		context.stroke();

		var end = start + (3.6 * radius * (Math.PI / 180));

		context.beginPath();
		context.shadowColor = borderColor;
		context.shadowBlur = borderPadding/2 - 1;
		context.strokeStyle = borderColor;
		context.lineWidth = borderSize - borderPadding;
		context.arc(margin, margin, half, start, end, false);
		context.stroke();

		var timer = parseInt(e.getAttribute('data-timer'));

		if(!isNaN(timer)){
			setTimeout(function(){ pipui.progress.draw(e); }, timer);
		}

		return context;
	}
};

$(function(){
	pipui.progress.init('.progress-radial > .bar');
});