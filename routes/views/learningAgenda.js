// @file learningAgenda.js
// @path /routes/views/learningAgenda.hbs.js
// @description add list of questionnaire for project
// @author: MD Ariful Islam

var keystone = require('keystone');
// var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Learning agenda';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// Render the view
	view.render('learningAgenda.hbs', { layout: 'myUI' });
};
