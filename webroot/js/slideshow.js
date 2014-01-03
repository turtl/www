var Slideshow = new Class({
	Implements: [Options],

	options: {
		duration: 1000,
		delay: 10000,
		pager: null,
		pager_builder: function(idx) { return '<a href="#'+idx+'">'+idx+'</a>'; },
		stop_on_pager: false,
		el_prev: null,
		el_next: null,
		transition: 'fade'
	},

	el: null,
	slides: null,
	pagers: null,

	state: {
		started: false,
		cur_slide: 0,
		timer: null,
		fx: [false, false]
	},

	initialize: function(el, options)
	{
		if(!el) return false;
		if(options.transition && !this['fx_'+options.transition]) options.transition = 'slide';
		this.setOptions(options);

		this.el	=	el;
		this.setup();
		this.start();
	},

	setup: function()
	{
		if(!this.el || this.slides) return false;
		this.slides		=	this.el.getChildren();
		if(this.slides.length == 0) return false;

		this.setup_pager();
		this.setup_prev_next();

		this.el.setStyles({
			position: 'relative'
		});
		this.slides.each(function(el) {
			el.setStyles({
				'position': 'absolute',
				'z-index': 2,
				'top': 0,
				'left': 0
			});
		});
	},

	start: function()
	{
		if(!this.el) return false;
		if(this.slides.length == 0) return false;
		this.state.started	=	true;
		this.show_slide(this.state.cur_slide);
	},

	stop: function()
	{
		this.stop_timer();
		this.state.started	=	false;
	},

	stop_timer: function()
	{
		if(this.state.timer) clearTimeout(this.state.timer);
	},

	show_slide: function(slide_num, options)
	{
		options || (options = {});

		if(this.state.fx[0] || this.state.fx[1])
		{
			if(options.from_timeout && this.state.started)
			{
				this.stop_timer();
				var args	=	arguments;
				this.state.timer	=	setTimeout(function() {
					this.state.timer	=	null;
					this.show_slide.apply(this, args);
				}.bind(this), 50);
			}
			return false;
		}
		this.stop_timer();

		if(typeof slide_num != 'number') slide_num = (this.state.cur_slide + 1) % this.slides.length;
		// direction: -1 is left, 1 is right
		var direction	=	slide_num < this.state.cur_slide && !options.from_timeout ? -1 : 1;
		if(options.direction == 'left') direction = -1;
		if(options.direction == 'right') direction = 1;
		var show_next	=	function()
		{
			this.state.cur_slide	=	slide_num;
			if(this.pagers)
			{
				this.pagers.each(function(el) {
					el.removeClass('active');
				});
				this.pagers[this.state.cur_slide].addClass('active');
			}
			if(!this.state.started) return false;
			this.state.timer	=	setTimeout(function() {
				this.state.timer	=	null;
				this.show_slide(null, {from_timeout: true});
			}.bind(this), this.options.delay);
		}.bind(this);
		var cur		=	this.slides[this.state.cur_slide];
		this.slides.each(function(el) { el.setStyle('z-index', 2); });
		cur.setStyle('z-index', 3);
		if(slide_num == this.state.cur_slide)
		{
			// don't do anything, just queue the next slide
			show_next();
			return;
		}
		var next	=	this.slides[slide_num];

		//if(this.state.fx[0]) this.state.fx[0].cancel();
		//if(this.state.fx[1]) this.state.fx[1].cancel();

		this['fx_'+this.options.transition](cur, next, direction);
		show_next();
	},

	setup_pager: function()
	{
		if(!this.options.pager) return;
		var pager	=	this.options.pager;
		if(!pager) return false;

		for(var i = 0; i < this.slides.length; i++)
		{
			var el	=	this.options.pager_builder(i + 1);
			if(typeof el == 'string')
			{
				pager.set('html', pager.get('html') + el);
			}
			else if(el.inject && el.getElement)
			{
				el.inject(pager);
			}
		}
		this.pagers	=	pager.getChildren();
		this.pagers.each(function(el, slide_num) {
			el.addEvent('click', function(e) {
				if(e) e.stop();
				this.show_slide(slide_num);
				if(this.options.stop_on_pager) this.stop();
			}.bind(this));
		}.bind(this));
	},

	setup_prev_next: function()
	{
		if(!this.options.el_prev && !this.options.el_next) return false;
		var prev	=	this.options.el_prev;
		var next	=	this.options.el_next;
		if(prev)
		{
			prev.addEvent('click', function(e) {
				if(e) e.stop();
				var slide_num	=	((this.state.cur_slide - 1) + this.slides.length) % this.slides.length;
				this.show_slide(slide_num, {direction: 'left'});
			}.bind(this));
		}
		if(next)
		{
			next.addEvent('click', function(e) {
				if(e) e.stop();
				var slide_num	=	(this.state.cur_slide + 1) % this.slides.length;
				this.show_slide(slide_num, {direction: 'right'});
			}.bind(this));
		}
	},

	fx_slide: function(cur, next, direction)
	{
		var curpos	=	cur.getCoordinates();
		var nextpos	=	next.getCoordinates();

		var next_start	=	direction < 0 ? '-100%' : '100%';
		var cur_end		=	direction < 0 ? 100 : -100;

		next.setStyles({
			'z-index': 3,
			'left': next_start
		});
		this.state.fx[0]	=	new Fx.Tween(cur, {
			duration: this.options.duration,
			property: 'left',
			unit: '%',
			onComplete: function() {
				this.state.fx[0]	=	null;
				cur.setStyle('z-index', 2);
			}.bind(this),
			onCancel: function() {
				this.state.fx[0]	=	null;
				cur.setStyle('z-index', 2);
			}.bind(this)
		}).start(cur_end);
		this.state.fx[1]	=	new Fx.Tween(next, {
			duration: this.options.duration,
			property: 'left',
			unit: '%',
			onComplete: function() {
				this.state.fx[1]	=	null;
				next.setStyle('z-index', 3);
			}.bind(this),
			onCancel: function() {
				this.state.fx[1]	=	null;
				next.setStyle('z-index', 2);
			}.bind(this)
		}).start(0);

	},

	fx_fade: function(cur, next)
	{
		cur.setStyles({
			'z-index': 3,
			'left': 0
		});
		next.setStyles({
			'z-index': 4,
			'left': 0,
			'opacity': 0
		});
		this.state.fx[0]	=	new Fx.Tween(next, {
			duration: this.options.duration,
			property: 'opacity',
			onComplete: function() {
				this.state.fx[0]	=	null;
				cur.setStyles({'z-index': 2, 'opacity': 1});
				next.setStyles({'z-index': 3});
			}.bind(this)
		}).start(1);
	}
});
