// @file taskPlan.js
// @path /routes/views/taskPlan.js
// @description Tasks planning for project will be shown here
// include: add new tasks, check task status, flow experience supported task as doing
// @author: MD Ariful Islam

var keystone = require('keystone');
var TaskPlan = keystone.list('TaskPlan');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Task Planning';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// initial page to create task and shows list of task and their status

	// add task

	// Render the view
	view.render('taskPlanning', { layout: 'myUI' });
};
