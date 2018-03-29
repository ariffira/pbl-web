var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {
		myProfile: [],
	};

	// locals.section is used to set the currently selected
	locals.section = 'My ePortfolio Profile';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.profileSubmitted = false;

	// initial view of the profile
	view.on('init', function (next) {
		// add ePortfolio datas
		next();
	});

	// add/update about me
	view.on('post', { action: 'add.aboutMe' }, function (next) {
		var userId = locals.user._id;
		User.model.findById(userId).exec(function (err, result) {
			console.log(result);
			result.set({
				aboutMe: locals.formData.aboutMe,
			});
			result.save(function (err, newResult) {
				console.log('About me data added...........');
				if (err) {
					console.log(err);
				} else {
					console.log(newResult);
					req.flash('success', { title: 'About me information successfully added' });
					locals.profileSubmitted = true;
					locals.aboutMe = newResult;
					return res.redirect('/myProfile');
				}
				next();
			});
		});
	});

	// Render the view
	view.render('myProfile', { layout: 'myUI' });
};
