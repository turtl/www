var app = {
	init: function() {
		app.init_signature();
	},

	init_signature: function() {
		document.getElements('.sign-cla').forEach(function(el) {
			new CLASigController({el: el});
		});
	}
};

window.addEvent('domready', function() {
	app.init();
});

