// @file presentation.js
// @path /routes/views/presentation.js
// @description Create presentation of artefact's by students
// @author: MD Ariful Islam

var keystone = require('keystone');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Artefact Presentation';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		project: [],
		participants: [],
		allLearningGoals: [],
	};
	// initial view  and after insert view of project
	view.on('init', function (next) {
		var projectId = '5a8706973e4306202c424122';
		if (projectId) {
			Project.model.findById(projectId).exec(function (err, result) {
				locals.data.project = result;
				var participants = JSON.parse(result.participants);
				locals.data.participants = participants;
				if (result.allLearningGoals) {
					var allLearningGoals = JSON.parse(result.allLearningGoals);
					locals.data.allLearningGoals = allLearningGoals;
				}
				else {
					locals.data.allLearningGoals = result.allLearningGoals;
				}
			});
			next();
		}
		else {
			next();
		}
	});

	// Render the view
	view.render('presentation', { layout: 'myUI' });
};
