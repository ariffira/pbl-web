// @file project.js
// @path /routes/views/project.js
// @description Project generate by creating a driving question
// @author: MD Ariful Islam

var keystone = require('keystone');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Generate new project';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.projectSubmitted = false;
	// locals.page.title = 'Generate Project';

	locals.data = {
		project: [],
	};

	// initial view  and after insert view of project
	view.on('init', function (next) {
		if (req.params.id) {
			console.log('successfully create new project...');
			Project.model.findById(req.params.id).exec(function (err, result) {
				locals.data.project = result;
				// console.log(result);
			});
			next();
		}
		else {
			next();
		}
	});

	// insert/update if id exist
	view.on('post', { action: 'pbl.create' }, function (next) {
		console.log(req.params.id);
		// console.log(locals.formData);
		// creating a new object for project data
		var newProject = new Project.model({
			title: locals.formData.title,
			description: locals.formData.description,
			createdBy: locals.user._id, // add user data
			allLearningGoals: locals.formData.allLearningGoals,
			file_name: locals.formData.file_name,
			uploaded_file_path: locals.formData.uploaded_file_path,
			resources_upload: locals.formData.resources_upload,
			// participants: locals.formData.participants,
		});
		console.log(newProject);
		console.log('Generating new PBL project.....');
		var id = req.params.id;
		console.log(id);
		if (id) {
			Project.model.findById(id).exec(function (err, item) {
				if (err) return res.apiError('database error', err);
				if (!item) return res.apiError('not found');

				var data = (req.method == 'POST') ? req.body : req.query;
				data.createdBy = locals.user._id;
				item.getUpdateHandler(req).process(data, function (err) {
					console.log(data);
				});
				return res.redirect('/project/' + id);
			});
		} else {
			// saving or inserting the data into database
			newProject.save(function (err, result) {
				if (err) {
					locals.data.validationErrors = err.errors;
					console.log(err);
				} else {
					req.flash('success', { success: 'A new Project data saved successfully' });
					locals.projectSubmitted = true;
					// console.log(result);
					return res.redirect('/project/' + result._id);
				}
				next();
			});
		}
	});

	// add participants into project
	view.on('post', { action: 'project.participants' }, function (next) {
		// console.log(locals.formData);
		// creating a new object for project data
		var participants = new Project.model({
			// createdBy: locals.user._id, // add user data
			participants: locals.formData.participants,
		});
		console.log(participants);
		var id = req.params.id;
		console.log(id);
		Project.model.findById(id).exec(function (err, item) {
			var data = (req.method == 'POST') ? req.body : req.query;
			item.getUpdateHandler(req).process(data, function (err) {
				console.log(data);
			});
		});
		console.log('added students');
		next();
	});

	// Render the view
	// add session layout view for signin ignore default layout
	view.render('project', { layout: 'myUI' });
};
