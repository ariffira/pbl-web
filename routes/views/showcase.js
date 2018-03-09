// @file showcase.js
// @path /routes/views/showcase.js
// @description showcase add, display, share
// @author: MD Ariful Islam

var keystone = require('keystone');
var Showcase = keystone.list('Showcase');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {
		showcase: [],
	};

	// locals.section is used to set the currently selected
	locals.section = 'Showcases';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// initial view and show all showcases
	/**
	 *  find them by projectId also
	 */
	view.on('init', function (next) {
		var projectId = locals.user.projectId;
		var query = Showcase.model.find();
		query.where('projectId', projectId)
		query.populate('createdBy');
		query.exec(function (err, result) {
			locals.data.showcase = result;
			console.log(result);
			next();
		});
	});

	// add showcase
	view.on('post', { action: 'add.showcase' }, function (next) {
		// creating a new object
		var newShowcase = new Showcase.model({
			title: locals.formData.title,
			showcase_content: locals.formData.showcase_content,
			uploaded_file_path: locals.formData.uploaded_file_path,
			projectId: locals.user.projectId,
			createdBy: locals.user._id, // add user data
		});
		// saving or inserting the data into database
		newShowcase.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				return res.redirect('/showcase');
			}
			next();
		});
	});

	// Render the view
	// add session layout view for signin ignore default layout
	view.render('showcase', { layout: 'myUI' });
};

/**
 *  Details of a showcase and update also
 */
exports.detailShowcase = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Detail Showcase';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		showcase: [],
	};
	// Detail of a taskPlan by its Id
	view.on('init', function (next) {
		var showcaseId = req.params.id;
		// console.log(showcaseId);
		var query = Showcase.model.findById(showcaseId);
		query.exec(function (err, result) {
			locals.data.showcase = result;
			// console.log(result);
			next();
		});
	});

	// Update task
	view.on('post', { action: 'update.showcase' }, function (next) {
		// updating showcase
		var showcaseId = locals.formData.id;
		// console.log(showcaseId);
		Showcase.model.findById(showcaseId).exec(function (err, result) {
			console.log(result);
			result.set({
				title: locals.formData.title,
				showcase_content: locals.formData.showcase_content,
				uploaded_file_path: locals.formData.uploaded_file_path,
			});
			result.save(function (err, newResult) {
				if (err) {
					console.log(err);
				} else {
					console.log(newResult);
					locals.data.showcase = newResult;
					return res.redirect('/showcase');
				}
			});
		});
	});

	// Render the view
	view.render('detailShowcase', { layout: 'myUI' });
};
