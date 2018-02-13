// @file collectResource.js
// @path /routes/views/collectResource.js
// @description add links, videos, web references, cite etc.
// @author: MD Ariful Islam

var keystone = require('keystone');
// var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Collect resources';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// Render the view
	view.render('', { layout: 'myUI' });
};
