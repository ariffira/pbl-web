// @file documentation.js
// @path /routes/views/documentation.js
// @description documentation for project work flows by students
// @author: MD Ariful Islam

var keystone = require('keystone');
var Documentation = keystone.list('Documentation');


exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Project Documentation';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// add documentation page
	view.on('post', { action: 'add.document' }, function (next) {
		console.log(req.body);
		var newDocPage = new Documentation.model({
			title: locals.formData.question,
			createdBy: locals.user._id, // add user data
			documentContent: locals.formData.documentContent,
		});
		// saving or inserting the data into database
		newDocPage.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				console.log('documentation page added....');
				console.log(result);
				return res.redirect('/documentation');
			}
			next();
		});
	});


	// Render the view
	view.render('documentation', { layout: 'myUI' });
};
