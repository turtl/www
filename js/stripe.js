const load_modal_template = function(modal, template_data) {
	template_data || (template_data = {});
	var copy = modal.clone();
	copy.set('html', copy.get('html').replace(/\[\[([a-z0-9_-]+)\]\]/gi, function(_, match) {
		return template_data[match] || '';
	}));
	UIkit.modal(copy).show();
};

const stripe_success = function(res) {
	if(!res) return;
	load_modal_template($('payment-success-modal'), res);
};

const stripe_error = function(errobj) {
	var errormsg = errobj.msg;
	try { var jsonerr = JSON.parse(errormsg); } catch(_) {}
	var msg = jsonerr ? jsonerr.error.message : errormsg;
	var tpl = {
		error: msg,
	}
	load_modal_template($('payment-error-modal'), tpl);
};

const stripe_handler = function(btnsel, type) {
	const payment_types = {
		'premium': {
			title: 'Turtl Premium ($8/mo)',
			button: 'Get Premium',
			amount: 800,
		},
	};
	const payment_title = payment_types[type].title;
	const button_txt = payment_types[type].button;
	const amount = payment_types[type].amount;

	var handler = StripeCheckout.configure({
		key: "pk_test_VZ4KZj7x2unpKJNG0ytfh9uI",
		image: "/images/logo.svg",
		name: "Turtl",
		description: payment_title,
		amount: amount,
		zipCode: true,
		panelLabel: button_txt,
		allowRememberMe: false,
		token: function(tokenobj) {
			var url = window.location.toString().match(/turtl\.loc/) ?
				'http://api.turtl.loc:8181/payment' :
				'https://apiv3.turtlapp.com/payment';
			var paymentinfo = {
				type: type,
				token: tokenobj,
			};
			var req = {
				url: url,
				method: 'POST',
				data: JSON.stringify(paymentinfo),
				headers: {
					'Content-Type': 'application/json',
				},
			};
			Sexhr(req)
				.spread(function(res, xhr) {
					stripe_success(JSON.parse(res));
				})
				.catch(function(err) {
					stripe_error(err);
				});
		},
	});

	document.getElement(btnsel).addEventListener('click', function(e) {
		e.preventDefault();
		handler.open();
	});
};

