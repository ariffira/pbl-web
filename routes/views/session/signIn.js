/* eslint-disable no-trailing-spaces */
// @file signIn.js
// @path /routes/views/session/signIn.js
// @description login for PBL dashboard Users(teacher & students)
// @author: MD Ariful Islam

var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	if (req.user) {
		return res.redirect('/');
	}
	
	locals.section = 'signIn';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.signInSubmitted = false;
	console.log(locals.formData);
	view.on('post', { action: 'user.login' }, function (next) {
		
		if (!locals.formData.email || !locals.formData.password) {
			req.flash('error', 'Please enter your username and password.');
			return next();
		}

		var onSuccess = function () {
			if (req.user)
			{
				if (!req.user.pblUser) {
					res.redirect('/keystone');
				} else {
					res.redirect('/dashboard');
				}
			}
			else {
				req.flash('error', 'Please enter your username and password.');
				res.redirect('/signIn');
			}
		};

		var onFail = function () {
			req.flash('error', 'Your username or password were incorrect, please try again.');
			return next();
		};

		keystone.session.signin({ email: locals.formData.email, password: locals.formData.password }, req, res, onSuccess, onFail);

	});
	
	// Render the view
	// add session layout view for signin ignore default layout
	view.render('signIn', { layout: 'session' });
};
