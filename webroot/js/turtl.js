var modal		=	null;
var slideshow	=	null;

var turtl	=	{
	setup_header: function()
	{
		var header	=	document.getElement('header');
		if(!header || header.getStyle('position') == 'fixed') return false;

		var orig_top	=	header.getCoordinates().top;
		var monitor	=	function()
		{
			var coords	=	header.getCoordinates();
			var scroll	=	window.getScroll().y;

			if(scroll > coords.top && header.getStyle('position') == 'absolute')
			{
				header.setStyles({
					position: 'fixed',
					top: 0
				});
			}
			else if(scroll < orig_top)
			{
				header.setStyles({
					position: 'absolute',
					top: ''
				});
			}
			monitor.delay(25);
		};
		monitor();
	},

	setup_slideshow: function()
	{
		var slide_main	=	document.getElement('.slideshow');
		if(!slide_main) return false;
		var slide_ul	=	slide_main.getElement('ul');
		if(!slide_ul) return false;
		slideshow	=	new Slideshow(slide_ul, {
			delay: 10000,
			pager: slide_main.getElement('div.pager'),
			pager_builder: function(idx) {
				return '<a href="#'+idx+'"><span>'+idx+'</span></a>';
			},
			stop_on_pager: true,
			el_prev: slide_main.getElement('.slide-lol.back'),
			el_next: slide_main.getElement('.slide-lol.forward')
		});
	},

	setup_modal: function()
	{
		modal	=	new Modal({
			load_icon: '',
			overlay: true
		});
		var was_running	=	false;
		modal.addEvent('close', function() {
			modal.objects.content.set('html', '');
			if(slideshow && was_running) slideshow.start();
		});
		modal.addEvent('start', function() {
			if(slideshow)
			{
				was_running	=	slideshow.state.started;
				slideshow.stop();
			}
		});
	},

	setup_buttons: function()
	{
		var buttons	=	document.getElement('.download ul.buttons');
		if(!buttons) return false;
		return;

		var is_desktop	=	['win', 'linux', 'mac'].contains(Browser.Platform.name);

		buttons.getElements('li.desktop').each(function(el) {
			var rel	=	el.get('rel');
			if(rel == 'win32' && !Browser.Platform.win) el.hide();
			if(rel.match(/linux/))
			{
				var cpu64	=	window.navigator && (window.navigator.platform || '').toLowerCase().match(/x86_64/i)
				if(rel == 'linux64' && !cpu64) el.hide()
				if(rel == 'linux32' && cpu64) el.hide();
				if(Browser.Platform.name != 'linux') el.hide();
			}
			if(rel == 'mac' && !Browser.Platform.mac) el.hide();
		});

		buttons.getElements('li.extension').each(function(el) {
			var rel	=	el.get('rel');
			if(rel == 'chrome' && (!is_desktop || !window.chrome || !window.chrome.webstore)) el.hide();
			if(rel == 'firefox' && (!is_desktop || !Browser.firefox)) el.hide();
		});
	},

	show_tumblr: function()
	{
		var tumblr_box	=	document.getElement('.news .blog');
		if(!tumblr_box) return false;

		new Request.JSONP({
			url: 'http://turtlapp.tumblr.com/api/read?start=0&num=1&format=json',
			callbackKey: 'callback',
			onComplete: function(data) {
				var post	=	data.posts[0];
				if(!post) return false;
				var url		=	post['url-with-slug'];
				var title	=	new Element('h2').set('html', '<a href="'+url+'">'+post['regular-title']+'</a>');
				var bodytxt	=	post['regular-body']
				//bodytxt		=	bodytxt.replace(/<.*?>/g, '');
				//bodytxt		=	bodytxt.replace(/^(.{150}.*?[\n ]).*$/m, '$1');
				var body	=	new Element('div').set('html', bodytxt);
				title.inject(tumblr_box);
				body.inject(tumblr_box);
			}
		}).send();
	}
};

window.addEvent('domready', function() {
	turtl.setup_header();
	turtl.setup_slideshow();
	turtl.setup_modal();
	turtl.setup_buttons();
	turtl.show_tumblr();
});

