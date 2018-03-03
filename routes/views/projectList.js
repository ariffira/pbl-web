// @file projectList.js
// @path /routes/views/projectList.js
// @description Shows list of ongoing project and other project info for teacher
// @author: MD Ariful Islam

var keystone = require('keystone');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Project List';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	locals.data = {
		projects: [],
	};

	// initial view  and after insert view of project
	view.on('init', function (next) {
		console.log('List of Projects created by teacher');
		// find all projects where createdBy = teacher Id
		var id = locals.user._id;
		var query = Project.model.find();
		query.where('createdBy', id);
		query.exec(function (err, result) {
			locals.data.projects = result;
			next();
		});
	});

	// Render the view
	view.render('projectList', { layout: 'myUI' });
};
