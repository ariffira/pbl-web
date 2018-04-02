// @file dashboard.js
// @path /routes/views/dashboard.js
// @description shows charts, project recent updates in real time
// @author: MD Ariful Islam

var keystone = require('keystone');
var Project = keystone.list('Project');
var CollectResource = keystone.list('CollectResource');
var TaskPlan = keystone.list('TaskPlan');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'My Timeline';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		project: [],
		tasks: [],
		collections: [],
	};

	/**
	 *  timeline view of all project updates, charts update data etc
	 */
	view.on('init', function (next) {
		next();
	});
    // Render the view
	// add session layout view for signin ignore default layout
	view.render('dashboard', { layout: 'myUI' });
};
