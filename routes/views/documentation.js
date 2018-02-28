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
	locals.data = {
		documents: [],
	};

	// initial page
	view.on('init', function (next) {
		// todo: find docs where projectid matched with project id from user
		var id = locals.user._id;
		var query = Documentation.model.find();
		query.where('createdBy', id);
		query.exec(function (err, result) {
			locals.data.documents = result;
			// console.log(result);
			next();
		});

	});
	// Render the view which shows list of documents
	view.render('documentation', { layout: 'myUI' });
};

/**
 * create a New File
 */
exports.create = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Create Documentation page';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	// console.log(req.params.id);

	// for specific doc id to edit or details
	view.on('init', function (next) {
		var id = req.params.id;
		var query = Documentation.model.find();
		query.where('_id', id);
		query.exec(function (err, result) {
			locals.document = result;
			// console.log(locals.document);
			next();
		});

	});

	// insert/save/update documentation page
	view.on('post', { action: 'add.document' }, function (next) {
		// console.log(req.body);
		var newDocPage = new Documentation.model({
			title: locals.formData.title,
			createdBy: locals.user._id, // add user data
			documentContent: locals.formData.documentContent,
		});
		console.log(newDocPage);
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
	// if doc has id then show data or show entry form
	view.render('docCreate', { layout: 'myUI' });
};
