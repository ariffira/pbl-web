// @file chatme.js
// @path /routes/views/chat-notification.js
// @description Chat service for project members
// @author: MD Ariful Islam

var keystone = require('keystone');
// var Idea = keystone.list('Idea');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Chat with project members';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	locals.data = {
		chatme: []
	};

	// initial view of chat-notification
	view.on('init', function (next) {
		console.log('Welcome to chat service');
		next();
	});

	view.on('post', { action: 'chatme.generate' }, function (next) {
		console.log('chat post testing...');
	});


	// Render the view
	// add session layout view for signin ignore default layout
	view.render('chatme', { layout: 'myUI' });
};
