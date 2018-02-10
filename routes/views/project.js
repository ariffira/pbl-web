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

	// insert if new/update if id exist
	view.on('post', { action: 'pbl.create' }, function (next) {
		console.log(req.params.id);
		// console.log(locals.formData);
		// creating a new object for project data
		var newProject = new Project.model({
			title: locals.formData.title,
			description: locals.formData.description,
			createdBy: locals.user._id, // add user data
			learningGoals: locals.formData.learningGoals,
			file_name: locals.formData.file_name,
			uploaded_file_path: locals.formData.uploaded_file_path,
			resources_upload: locals.formData.resources_upload,
		});
		console.log('Generating new PBL project.....');
		var id = req.params.id;
		console.log(id);
		// saving or inserting the data into database
		newProject.save({ _id: id }, function (err, result) {
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
	});

	// update existing data by id
	view.on('post', { action: 'pbl.update' }, function (next) {
		console.log('Updating .................');
		console.log(req.params.id);
		var id = req.params.id;
		Project.model.findById(id, function (err, project) {
			console.log(project);
			project.save(function (err, result) {
				if (err) {
					locals.data.validationErrors = err.errors;
					console.log(err);
				} else {
					locals.projectSubmitted = true;
					// console.log(result);
					return res.redirect('/project/' + result._id);
				}
			});
		});
		next();
	});

	// Render the view
	// add session layout view for signin ignore default layout
	view.render('project', { layout: 'myUI' });
};
