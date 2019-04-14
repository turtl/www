const ManageController = Composer.Controller.extend({
	elements: {
		'.top-msg': '$msg',
		'.form-container': '$form_container',
		'input[name=billing-email]': '$email_billing',
		'input[name=account-email]': '$email_account',
		'.linked-icon': '$icon',
	},

	events: {
		'submit form': 'submit',
		'click a[href=#cancel]': 'cancel_subscription',
		'input input[name=account-email]': 'check_email',
	},

	model: null,
	init: function() {
		var id = Composer.Router.prototype.get_param(window.location.search, 'id');
		var token = Composer.Router.prototype.get_param(window.location.search, 'token');
		if(!id || !token) {
			this.error('Your payment information could not be found. Please verify you have the correct URL.');
			this.hide(true);
			return;
		}
		this.model = new ManageModel({id: id, manage_token: token});
		this.model.grab()
			.bind(this)
			.then(this.render.bind(this))
			.catch(function(err) {
				this.error(err);
				this.hide(true);
			});
	},

	render: function() {
		var account_email = this.model.get('account_email');
		this.$email_billing.set('value', this.model.get('email'));
		this.$email_account.set('value', account_email);
		if(account_email) {
			this.$icon.setStyles({display: ''});
		} else {
			this.$icon.setStyles({display: 'none'});
		}
	},

	submit: function(e) {
		if(e) e.stop();
		var billing_email = this.$email_billing.get('value');
		var account_email = this.$email_account.get('value');
		this.model.set({email: billing_email, account_email: account_email});
		return this.model.update()
			.bind(this)
			.then(function(saved) {
				var account_email = this.model.get('account_email');
				if(account_email) {
					var extra = ' and has been linked to the Turtl account '+account_email+'.';
				} else {
					var extra = ', however there is not a Turtl account linked to your billing information.';
				}
				this.success('Your billing information has been saved'+extra);
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

	hide: function(truefalse) {
		if(truefalse) {
			this.$form_container.addClass('uk-hidden');
		} else {
			this.$form_container.removeClass('uk-hidden');
		}
	},

	check_email: function(e) {
		if(this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}
		this._timeout = setTimeout(function() {
			this.model.check_email(this.$email_account.get('value'))
				.bind(this)
				.catch(function(e) {
					console.error('err: ', e);
					return false;
				})
				.then(function(email) {
					if(!email) {
						this.$icon.setStyles({display: 'none'});
						return false;
					}
					this.$icon.setStyles({display: ''});
					this.$email_account.set('value', email);
				});
			console.log('check email');
		}.bind(this), 500);
	},

	cancel_subscription: function(e) {
		if(e) e.stop();
		if(!confirm('Are you sure you want to cancel your Turtl subscription?')) {
			return false;
		}
		this.model.cancel()
			.bind(this)
			.then(function() {
				this.el.set('html', '<h2>Your subscription has been cancelled</h2><p>Thanks for giving Turtl a try!</p><p><a class="uk-button uk-button-primary" href="/">Return to the homepage &raquo;</a>');
			})
			.catch(function(err) {
				this.error('There was a problem cancelling: '+err.message);
			});
	},
});

const ManageModel = Composer.Model.extend({
	get_url: function() {
		const api_url = window.location.toString().match(/turtl\.loc/) ?
			'http://api.turtl.loc:8181' :
			'https://apiv3.turtlapp.com';
		return api_url+'/payment/'+encodeURIComponent(this.id())+'/'+encodeURIComponent(this.get('manage_token'));
	},

	grab: function() {
		var req = {
			url: this.get_url(),
		};
		return Sexhr(req)
			.bind(this)
			.spread(function(payment, _xhr) {
				this.set(JSON.parse(payment));
				return this;
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

