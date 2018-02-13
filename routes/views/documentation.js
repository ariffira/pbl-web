// @file documentation.js
// @path /routes/views/documentation.js
// @description documentation for project work flows by students
// @author: MD Ariful Islam

var keystone = require('keystone');
// var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Documentation';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// Render the view
	view.render('', { layout: 'myUI' });
};
