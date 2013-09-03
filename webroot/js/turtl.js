window.addEvent('domready', function() {
	// add a listener for chrome ext clicks
	$(document.body).addEvent('click:relay(div.button.chrome > a', function(e) {
		if(!chrome.webstore) return;
		if(e) e.stop();
		chrome.webstore.install();
	});
});

