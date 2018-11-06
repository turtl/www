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
		image: "/images/favicon.128.png",
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
				onSuccess: function(res) {
				},
				onFailure: function(xhr) {
				},
			};
			Sexhr(req)
				.spread(function(res, xhr) {
					console.log('gffft: ', res);
				})
				.catch(function(obj) {
					console.log('oh noo: ', obj);
				});
		},
	});

	document.getElement(btnsel).addEventListener('click', function(e) {
		e.preventDefault();
		handler.open();
	});
};

