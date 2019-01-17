const DeleteAccountController = Composer.Controller.extend({
	elements: {
		'.top-msg': '$msg',
		'form': '$form',
		'input[name=email]': '$inp_email',
	},

	events: {
		'submit form': 'submit',
	},

	model: null,
	init: function() {
		this.model = new DeleteAccountModel();
	},

	submit: function(e) {
		if(e) e.stop();
		const email = this.$inp_email.get('value');
		this.model.set({email: email});
		return this.model.start()
			.bind(this)
			.then(function() {
				this.success('We have sent you an email with your deletion link.');
			})
			.catch(function(err) {
				this.error(err);
			});
	},

	error: function(msg) {
		this.$msg.set('html', '<div class="uk-card uk-card-small uk-card-body uk-card-default uk-margin-bottom"><div class="uk-text-danger">'+msg+'</div></div>');
	},

	success: function(msg) {
		this.$msg.set('html', '<div class="uk-card uk-card-small uk-card-body uk-card-default uk-margin-bottom"><div class="uk-text-success">'+msg+'</div></div>');
	},
});

const DeleteAccountModel = Composer.Model.extend({
	get_url: function() {
		const api_url = window.location.toString().match(/turtl\.loc/) ?
			'http://api.turtl.loc:8181' :
			'https://apiv3.turtlapp.com';
		return api_url+'/users/delete/'+encodeURIComponent(this.get('email'));
	},

	start: function() {
		var req = {
			method: 'post',
			url: this.get_url(),
		};
		return Sexhr(req)
			.bind(this)
			.then(function() {
				return true;
			})
			.catch(this.err.bind(this));
	},

	check_email: function(email) {
		var req = {
			url: this.get_url()+'/email/'+encodeURIComponent(email),
		};
		return Sexhr(req)
			.bind(this)
			.spread(function(res, _xhr) {
				var emailobj = JSON.parse(res);
				return emailobj.username;
			})
			.catch(this.err.bind(this));
	},

	update: function() {
		var req = {
			url: this.get_url(),
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			data: JSON.stringify(this.toJSON()),
		};
		return Sexhr(req)
			.bind(this)
			.spread(function(payment, _xhr) {
				this.reset(JSON.parse(payment));
				return this;
			})
			.catch(this.err.bind(this));
	},

	cancel: function() {
		var req = {
			url: this.get_url(),
			method: 'DELETE',
		};
		var modal = UIkit.modal($('loading-modal'));
		modal.show();
		return Sexhr(req)
			.catch(this.err.bind(this))
			.finally(function() {
				modal.hide();
			});
	},

	err: function(errobj) {
		console.log(errobj);
		throw JSON.parse(errobj.msg).error.message;
	},
});

