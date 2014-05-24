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
	// holds information about an actual board invite. as with invite_code, this
	// is sent repeatedly until the desktop client gets it.
	invite: null,

	// if a user came here from an invite link, store the invite code here. it
	// will be sent repeatedly to the desktop app until it responds
	// affirmatively. this allows us to track invite referrals as long as the
	// invitee opens the desktop app while the site is open in their browser
	// (which is a fairly high likelyhood).
	invite_code: null,

	// if a user comes here from a promo link, store the promo code here, and
	// sent to the desktop app (just like invite_code, see above).
	promo_code: null,

	setup_header: function()
	{
		var header	=	document.getElement('header');
		if(!header || header.getStyle('position') == 'fixed') return false;

		var orig_top	=	header.getCoordinates().top;
		var monitor	=	function()
		{
			var coords	=	header.getCoordinates();
			var scroll	=	window.getScroll().y;

			if(scroll > coords.top && header.getStyle('position') != 'fixed')
			{
				header.setStyles({
					position: 'fixed',
					top: 0
				});
			}
			else if(scroll < orig_top)
			{
				header.setStyles({
					position: '',
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
	},

	/**
	 * look for invite code cookies and send them to the desktop (if it's
	 * available)
	 */
	setup_invite_comm: function()
	{
		var spawn_sender	=	function(type, cookie, param, url)
		{
			var sent	=	false;
			var value	=	Cookie.read(cookie);
			if(value) turtl[type] = value;

			var do_send	=	function()
			{
				if(sent) return;
				if(turtl[type])
				{
					console.log('sending: ', type, turtl[type]);
					var data	=	{};
					data[param]	=	turtl[type];
					var req		=	new Request.JSONP({
						url: url,
						callbackKey: 'callback',
						data: data,
						timeout: 1500,
						onComplete: function(res) {
							sent	=	true;		// stop sending
							if(res.error) return false;

							// once the value is used, wipe it out.
							delete turtl[type];
							Cookie.dispose(cookie);
						}
					}).send();
				}
				do_send.delay(2000);
			};
			do_send();
		};

		spawn_sender('invite', 'inv', 'invite', 'http://127.0.0.1:7471/invite');
		spawn_sender('invite_code', 'invc', 'code', 'http://127.0.0.1:7471/invitecode');
		spawn_sender('promo_code', 'promo', 'code', 'http://127.0.0.1:7471/promo');
	}
};

window.addEvent('domready', function() {
	run_goals();
	//turtl.setup_header();
	//turtl.setup_slideshow();
	turtl.setup_modal();
	turtl.setup_download_buttons();
	turtl.setup_newsletter();
	turtl.setup_track_goals();
	turtl.setup_smoothscroll();
	turtl.show_tumblr();
	turtl.setup_invite_comm();
	hljs.initHighlightingOnLoad();
});

/**
 * When the desktop client first runs, it opens a port (7471) for 10s that will
 * listen for invite codes from the client. So here we just jsonp endlessly to
 * that port on 127.0.0.1 until we get a response or the user leaves the page.
 */
function invite_scrape()
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

	// save it so turtl can start blasting it around
	turtl.invite	=	invite;

	// make the invite available from other pages
	var domain	=	window.location.host.replace(/.*(turtl\.[a-z]+).*?$/, '$1');
	Cookie.write('inv', invite, {duration: 30, path: '/', domain: domain});
}

