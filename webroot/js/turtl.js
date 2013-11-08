window.addEvent('domready', function() {
	var using_chrome	=	!!(window.chrome && window.chrome.webstore);

	// add a listener for chrome ext clicks
	$(document.body).addEvent('click:relay(div.button.chrome > a)', function(e) {
		if(!using_chrome) return;
		if(e) e.stop();
		chrome.webstore.install();
	});

	// show/hide the right button
	var buttons	=	document.getElement('.button-row');
	if(buttons)
	{
		buttons.getElements('div.button').each(function(el) {
			if(	(el.hasClass('chrome') && using_chrome) ||
				(el.hasClass('firefox') && !using_chrome) )
			{
				return false;
			}
			el.dispose();
		});
	}

	// highlight code
	hljs.initHighlightingOnLoad();
});

