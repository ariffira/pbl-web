// @file learningAgenda.js
// @path /routes/views/learningAgenda.hbs.js
// @description add list of questionnaire for project
// @author: MD Ariful Islam

var keystone = require('keystone');
var LearningAgenda = keystone.list('LearningAgenda');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Learning agenda';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		learningAgenda: [],
	};

	// initial page
	view.on('init', function (next) {
		// todo: find learning agenda where projectid matched with project id from user
		var id = locals.user._id;
		var query = LearningAgenda.model.find();
		query.where('createdBy', id);
		query.exec(function (err, result) {
			locals.data.learningAgenda = result;
			next();
		});

	});
	// add task
	view.on('post', { action: 'add.learningAgenda' }, function (next) {
		// creating a new object for task data
		var newLearningAgenda = new LearningAgenda.model({
			question: locals.formData.question,
			createdBy: locals.user._id, // add user data
		});
		// saving or inserting the data into database
		newLearningAgenda.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				console.log('learning agenda added....');
				console.log(result);
				return res.redirect('/learningAgenda');
			}
			next();
		});
	});

	// Render the view
	view.render('learningAgenda', { layout: 'myUI' });
};
