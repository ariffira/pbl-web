// @file projectGenerate.js
// @path /routes/views/currentProject.hbs.js
// @description show all project data, insert status = Generated, show participants list and deadline
// @author: MD Ariful Islam

var keystone = require('keystone');
var Project = keystone.list('Project');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Current project';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	locals.data = {
		project: [],
		participants: [],
		allLearningGoals: [],
	};

	/*
	   initial view of generated project
	   student only can access if his email is in the project list
	   update:status: Generated
	 */
	view.on('init', function (next) {
		console.log('Project generated.....');
		var projectId = req.params.id;
		if (projectId) {
			Project.model.findById(projectId).exec(function (err, result) {
				if (result.status === 'Running') {
					console.log('Running already...');
					locals.data.project = result;
					var participants = JSON.parse(result.participants);
					var allLearningGoals = JSON.parse(result.allLearningGoals);
					locals.data.participants = participants;
					locals.data.allLearningGoals = allLearningGoals;
				} else if (result.status === 'Created') {
					result.set({ status: 'Running' });
					result.save(function (err, newResult) {
						console.log('Status of project updated to Running............');
						if (err) {
							console.log(err);
						} else {
							console.log(newResult);
							locals.data.project = newResult;
							var participants = JSON.parse(newResult.participants);
							var allLearningGoals = JSON.parse(newResult.allLearningGoals);
							locals.data.participants = participants;
							locals.data.allLearningGoals = allLearningGoals;
						}
					});
				} else if (result.status === 'Finished') {
					return res.redirect('/projectFinished/' + req.params.id);
				} else {
					return res.redirect('/project');
				}
			});
			next();
		}
		else {
			next();
		}
	});

	// Render the view
	view.render('currentProject', { layout: 'myUI' });
};
