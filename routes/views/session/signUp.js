// @file signUp.js
// @path /routes/views/session/signUp.js
// @description Handles the post request when the user tries to signUp up.
// @author: MD Ariful Islam

var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'signUp';
	locals.institutionTypes = User.fields.institutionType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.signUpSubmitted = false;

	view.on('post', { action: 'user.create' }, function (next) {

		if (locals.formData.password !== locals.formData.password_confirm) {
			req.flash('error', 'The passwords do not match.');
			next();
		}

		var newUser = new User.model({
			name: {
				first: locals.formData.first,
				last: locals.formData.last,
			},
			email: locals.formData.email,
			institution: locals.formData.institution,
			institutionType: locals.formData.institutionType,
			role: locals.formData.role,
			password: locals.formData.password,
			//password_confirm: locals.formData.password_confirm,
		});
		// console.log(newUser); // here newuser isAdmin is false
		newUser.pblUser = true;
		console.log(newUser); // here newuser isAdmin is true
		newUser.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				req.flash('success', 'Account created. Please sign in.');
				// console.log(result); //here result makes password encrypted
				// redirect to sign in page for teacher& student
				return res.redirect('/signIn');
			}
			next();
		});

	});

	// Render the view of template
	// add session layout view for signin ignore default layout
	view.render('signUp', { layout: 'session' });
};
