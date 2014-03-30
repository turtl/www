var modal		=	null;
var slideshow	=	null;

// get the next tag of type "type" in the chain up the dom
function next_tag_up(tag, element)
{
	return element.get('tag') == tag ? element : next_tag_up(tag, element.getParent());
}

function track_goal(id, price)
{
	var goals	=	JSON.parse(localStorage['goals'] || '[]');
	goals.push([id, price]);
	localStorage['goals']	=	JSON.stringify(goals);
}

function run_goals()
{
	var goals	=	JSON.parse(localStorage['goals'] || '[]');
	goals.each(function(goal) {
		console.log('tracking goal: ', goal);
		_paq.push(['trackGoal', goal[0], goal[1]]);
	});
	delete localStorage['goals'];
}

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

		var slide_email_inp	=	$(document.body).getElement('.slideshow li.join input.email');
		var was_running		=	false;
		slide_email_inp.addEvent('focus', function() {
			if(slideshow)
			{
				was_running	=	slideshow.state.started;
				slideshow.stop();
			}
		});
		slide_email_inp.addEvent('blur', function() {
			if(slideshow && was_running) slideshow.start();
		});
		$(document.body).addEvent('click:relay(.slideshow li.slide.join a[href=#join])', function(e) {
			if(e) e.stop();
			if(slide_email_inp) slide_email_inp.focus();
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

	setup_download_buttons: function()
	{
		var using_chrome	=	!!(window.chrome && window.chrome.webstore);
		document.body.addEvent('click:relay(.download .buttons li[rel=chrome] a)', function(e) {
			if(!using_chrome) return;
			if(e) e.stop();
			chrome.webstore.install();
		});

		document.body.addEvent('click:relay(.download ul.buttons li a)', function(e) {
			_paq.push(['trackGoal', 2]);
		});

		var buttons	=	document.getElement('div:not(.download-page) .download ul.buttons');
		if(!buttons) return false;

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

	setup_newsletter: function()
	{
		document.body.addEvent('submit:relay(.mailing-list form)', function(e) {
			_paq.push(['trackGoal', 3]);
		});
	},

	setup_track_goals: function()
	{
		$(document.body).addEvent('click:relay(div.pricing .button.buy)', function(e) {
			var div		=	next_tag_up('div', e.target);
			var price	=	div.className.replace(/.*price-([0-9]+).*?$/, '$1');
			track_goal(1, price);
		});
	},

	setup_smoothscroll: function()
	{
		var smoothscroll	=	new Fx.SmoothScroll({
			links: '.smoooth',
			wheelStops: false
		});
	},

	show_tumblr: function()
	{
		var tumblr_box	=	document.getElement('.news .blog');
		if(!tumblr_box) return false;

		new Request.JSONP({
			//url: 'http://turtlapp.tumblr.com/api/read?start=0&num=1&format=json',
			url: '/blog-jsonp',
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
	run_goals();
	turtl.setup_header();
	turtl.setup_slideshow();
	turtl.setup_modal();
	turtl.setup_download_buttons();
	turtl.setup_newsletter();
	turtl.setup_track_goals();
	turtl.setup_smoothscroll();
	turtl.show_tumblr();
	hljs.initHighlightingOnLoad();
});

/**
 * When the desktop client first runs, it opens a port (7471) for 10s that will
 * listen for invite codes from the client. So here we just jsonp endlessly to
 * that port on 127.0.0.1 until we get a response or the user leaves the page.
 */
function invite_comm()
{
	var url			=	window.location.pathname;
	var split		=	url.replace(/^\/?.*?\//, '').split(/\//);
	var code		=	split[0];
	var invite_id	=	split[1];
	var key			=	split[2];
	var invite		=	JSON.stringify({code: code, id: invite_id, key: key});
	var code_el		=	document.getElement('body.invite div.code');
	if(code_el)
	{
		var box_code	=	btoa(invite);
		code_el.set('html', '<strong>'+box_code+'</strong>');
	}

	var all	=	document.getElement('body.invite a.all');
	if(all)
	{
		all.addEvent('click', function(e) {
			if(e) e.stop();
			var ul	=	document.getElement('body.invite .download ul.buttons');
			if(!ul) return false;
			ul.getElements('li').each(function(el) {
				if(el.hasClass('div')) return;
				el.setStyle('display', '');
				all.dispose();
			});
		});
	}

	var complete	=	false;
	var do_send		=	function()
	{
		if(complete) return;
		var req			=	new Request.JSONP({
			url: 'http://127.0.0.1:7471/invite',
			callbackKey: 'callback',
			data: {invite: invite},
			timeout: 1000,
			onComplete: function(res) {
				complete	=	true;		// stop sending invites over
				if(res.error) return false;

				console.log('done! ', res);
				if(code_el)
				{
					code_el.set('html', '<span class="success">Code successfully sent to app!</span>');
				}
			}
		}).send();

		do_send.delay(5000);
	};
	do_send();
}

