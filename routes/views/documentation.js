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
	locals.section = 'Project Documentation Page';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		documents: [],
	};

    // initial page to documentation list
	view.on('init', function (next) {
		/** show all doc related to this project if any projectId exist for this user
		 * else nothing
		 */
		if (locals.user.projectId) {
			var id = locals.user.projectId;
			var query = Documentation.model.find();
			query.where('projectId', id);
			query.populate('createdBy');
			query.exec(function (err, result) {
				locals.data.documents = result;
				// console.log(result);
				next();
			});
		} else {
			console.log('No Documentation Page created');
			next();
		}

	});

	// Render the view which shows list of documents
	view.render('documentation', { layout: 'myUI' });
};

/**
 * create a New File for documentation
 */
exports.docCreate = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Create Documentation page';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// insert/save documentation page
	view.on('post', { action: 'add.doc' }, function (next) {
		var projectId = locals.user.projectId;
		if (projectId) {
			var newDocPage = new Documentation.model({
				title: locals.formData.title,
				createdBy: locals.user._id, // add user data
				documentContent: locals.formData.documentContent,
				projectId: projectId,
			});
		}
		// saving or inserting the data into database
		newDocPage.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				console.log('documentation page added....');
				// console.log(result);
				return res.redirect('/documentation/docDetail/' + result._id);
			}
			next();
		});
	});


	// Render the view
	// if doc has id then show data or show entry form
	view.render('docCreate', { layout: 'myUI' });
};

/**
 * Detail& Update doc page
 */
exports.docDetail = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Detail Documentation page';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// for specific doc id to details info only
	view.on('init', function (next) {
		console.log('Details of a Documentation Page');
		var docId = req.params.id;
		var query = Documentation.model.find();
		query.where('_id', docId);
		query.populate('createdBy');
		query.exec(function (err, result) {
			locals.document = result;
			// console.log(locals.document);
			next();
		});
	});

	// Update Documentation page
	view.on('post', { action: 'update.doc' }, function (next) {
		// updating doc
		var docId = locals.formData.id;
		// console.log(docId);
		Documentation.model.findById(docId).exec(function (err, result) {
			console.log(result);
			result.set({
				title: locals.formData.title,
				documentContent: locals.formData.documentContent,
			});
			result.save(function (err, newResult) {
				console.log('Documentation updated...........');
				if (err) {
					console.log(err);
				} else {
					console.log(newResult);
					locals.document = newResult;
					return res.redirect('/documentation/docDetail/' + newResult._id );
				}
			});
		});
	});

	// Render the view
	// if doc has id then show data or show entry form
	view.render('docDetail', { layout: 'myUI' });
};
