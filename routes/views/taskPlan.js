// @file taskPlan.js
// @path /routes/views/taskPlan.js
// @description Tasks planning for project will be shown here
// include: add new tasks, check task status, flow experience task
// @author: MD Ariful Islam

var keystone = require('keystone');
// var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Task Planning';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// Render the view
	view.render('taskPlanning', { layout: 'myUI' });
};
