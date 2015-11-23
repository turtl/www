var app = {
	init: function()
	{
		app.init_home_header();
		app.init_splash_downloads();
		app.init_splash_more();
		app.init_doc_anchors();
		//app.init_splash_parallax();
	},

	init_home_header: function()
	{
		if(!document.body.hasClass('home')) return;
		var header = document.body.getElement('header');
		var splash = document.body.getElement('.splash');
		if(!header || !splash) return;

		var header_height, splash_end, header_stop;
		var setup_static = function()
		{
			header_height = header.getCoordinates().height;
			splash_end = splash.getCoordinates().bottom;
			header_stop = splash_end - header_height;
		};
		setup_static();

		var scroller = function()
		{
			var scroll = window.scrollY;
			var top_cutoff = 10;
			if(scroll < top_cutoff && header.className.match(/scrolled/))
			{
				header.removeClass('scrolled');
			}
			else if(scroll >= top_cutoff && !header.className.match(/scrolled/))
			{
				header.addClass('scrolled');
			}
		};

		window.addEvent('scroll', scroller);
		window.addEvent('resize', function() {
			setup_static();
			scroller();
		});
		scroller();
	},

	init_splash_downloads: function()
	{
		var ul = document.getElement('.splash ul.download');
		if(!ul) return;

		var fam = platform.os.family;
		var os = null;
		if(fam.match(/windows(?!.*phone)/i)) os = 'desktop-windows';
		else if(fam.match(/osx/i)) os = 'desktop-osx';
		else if(fam.match(/linux/i)) os = 'desktop-linux';
		else if(fam.match(/android/i)) os = 'mobile-android';
		else if(fam.match(/ios/i)) os = 'mobile-ios';

		if(!os) return;

		var li = ul.getElement('li[rel='+os+']');
		if(!li) return;

		ul.getElements('> li').each(function(el) { el.addClass('hide'); });
		li.removeClass('hide');
		ul.removeClass('hide');
		var all = new Element('li')
			.addClass('all')
			.set('html', '<a href="#all" title="Show all downloads">All platforms &raquo;</a>');
		all.inject(ul, 'bottom');
		all.getElement('a').addEvent('click', function(e) {
			if(e) e.stop();
			all.destroy();
			ul.getElements('> li').each(function(el) { el.removeClass('hide'); });
		});
	},

	init_splash_more: function()
	{
		var a = document.getElement('.splash .more a');
		if(!a) return;

		var header = document.getElement('header');
		var anchor = $('home-intro');
		a.addEvent('click', function(e) {
			if(e) e.stop();
			var y = anchor.getCoordinates().top - (header.getCoordinates().height * 1.8);
			new Fx.Scroll(window).start(0, y + 20);
		});
	},

	init_splash_parallax: function()
	{
		var splash = document.body.getElement('.splash');
		if(!splash) return;

		var initial = splash
			.getStyle('background-position')
			.split(' ')
			.map(function(x) { return parseInt(x); });

		var splash_end;
		var setup_static = function()
		{
			console.log('setup');
			splash_end = splash.getCoordinates().bottom;
		};
		setup_static();

		var scroller = function()
		{
			var scroll = window.scrollY;
			var ratio = scroll / splash_end;
			var travel = 500;
			var position = initial[1] + (ratio * travel);
			console.log('scroll: ', position);
			splash.setStyle('background-position', initial[0]+'% '+position+'%');
		};
		window.addEvent('scroll', scroller);
		window.addEvent('resize', function() {
			setup_static();
			scroller();
		});
		scroller();
	},

	init_doc_anchors: function()
	{
		var doc = document.getElement('.documentation');
		if(!doc) return;
		var htags = doc.getElements('h1[id],h2[id],h3[id],h4[id]');
		htags.forEach(function(el) {
			var id = el.get('id');
			el.set('id', null);
			new Element('a')
				.addClass('toc-anchor')
				.set('name', id)
				.inject(el, 'before');
		});
	}
};

window.addEvent('domready', function() {
	app.init();
});

