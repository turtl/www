var do_replace = function(iframe)
{
	var base_url = new String(window.location).replace(/([a-z]:\/\/[^\/]+).*/i, '$1');
	var style = '<link rel="stylesheet" href="'+base_url+'/css/twitter.css">';
	var doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
	if(!doc.head) return;
	(function() {
		doc.head.innerHTML += style;
	}).delay(10);
};

var poll_contents = function(iframe)
{
	var doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
	var ol = doc.getElementsByTagName('ol');
	if(ol.length == 0)
	{
		(function() { poll_contents(iframe); }).delay(10);
	}
	iframe.removeProperty('width').removeProperty('height');
	do_replace(iframe);
};

var poll_iframe = function()
{
	var iframe = document.getElement('.twitter-timeline-rendered');
	if(!iframe)
	{
		poll_iframe.delay(10);
		return;
	}
	poll_contents(iframe);
};

poll_iframe.delay(10);

