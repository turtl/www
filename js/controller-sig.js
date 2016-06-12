var CLASigController = Composer.Controller.extend({
	elements: {
		'form': 'el_form',
		'ul.error': 'el_errlist',
		'input[name=type]': 'inp_type',
		'input[name=entity]': 'inp_entity',
		'input[name=fullname]': 'inp_fullname',
		'input[name=email]': 'inp_email',
		'input[name=address1]': 'inp_address1',
		'input[name=address2]': 'inp_address2',
		'input[name=city]': 'inp_city',
		'input[name=state]': 'inp_state',
		'input[name=zip]': 'inp_zip',
		'select[name=country]': 'inp_country',
		'input[name=phone]': 'inp_phone',
		'input[name=github]': 'inp_github',
		'input[name=website]': 'inp_website',
		'input[name=sign]': 'inp_sign',
		'input[type=submit]': 'btn_submit'
	},

	events: {
		'submit form': 'submit'
	},

	redirect: window.location.protocol+'//'+window.location.hostname+'/contributing/sign-thanks',
	redirect_err: window.location.protocol+'//'+window.location.hostname+'/contributing/sign-error',

	init: function()
	{
		this.render();
	},

	render: function()
	{
		// CSS should hide this field, but just in case...
		this.inp_website.set('placeholder', 'LEAVE BLANK. Used for catching spam');
		new Element('input')
			.set('type', 'hidden')
			.set('name', 'redirect')
			.set('value', this.redirect)
			.inject(this.el_form);
		new Element('input')
			.set('type', 'hidden')
			.set('name', 'redirect-err')
			.set('value', this.redirect_err)
			.inject(this.el_form);
	},

	submit: function(e)
	{
		if(e) e.stop();
		var inputs = Object.keys(this).filter(function(k) { return k.match(/^inp_/); });
		var data = {};

		// if the website field is filled in, make this a fake post
		var fake_post = false;

		inputs.forEach(function(key) {
			var el = this[key];
			var val = (el && el.get('value')) || null;
			data[key.replace(/^inp_/, '')] = val;
		}.bind(this));

		var req = [
			{field: 'fullname', name: 'full name'},
			{field: 'email', name: 'email address'},
			{field: 'address1', name: 'address'},
			{field: 'city', name: 'city'},
			{field: 'country', name: 'country'},
			{field: 'phone', name: 'phone number'},
			{field: 'github', name: 'github username'},
		];
		if(this.inp_type.get('value') == 'ecla')
		{
			req.unshift({field: 'entity', name: 'company/organization/entity name'});
		}

		this.el.getElements('.error-field').forEach(function(el) { el.removeClass('error-field'); });
		this.el_errlist.addClass('hide');
		this.el_errlist.set('html', '');

		var errors = [];
		req.forEach(function(row) {
			var key = row.field;
			var name = row.name;
			if(data[key] && data[key].trim()) return;
			errors.push([this['inp_'+key], 'Please give your '+name]);
		}.bind(this));

		if(data.sign !== 'I AGREE') errors.push([this.inp_sign, 'Please type "I AGREE" in the signature box']);
		if(data.website) fake_post = true;

		if(errors.length)
		{
			this.el_errlist.removeClass('hide');
			errors.forEach(function(err) {
				var inp = err[0];
				var msg = err[1];
				inp.addClass('error-field');
				new Element('li').set('html', msg).inject(this.el_errlist);
			}.bind(this));
			var first = this.el.getElement('input.error-field, select.error-field');
			if(first) first.focus();
			return;
		}

		if(fake_post)
		{
			window.location = this.redirect;
			return;
		}

		this.el_form.submit();
	}
});

