// @file project.js
// @path /routes/views/project.js
// @description Project generate by creating a driving question
// @author: MD Ariful Islam

var keystone = require('keystone');
var Project = keystone.list('Project');
var User = keystone.list('User');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Generate new project';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.projectSubmitted = false;
	// locals.page.title = 'Generate Project';

	locals.data = {
		project: [],
		participants: [],
		allLearningGoals: [],
	};

	// initial view  and after insert view of project
	view.on('init', function (next) {
		if (req.params.id) {
			// console.log('successfully create new project...');
			Project.model.findById(req.params.id).populate('createdBy').exec(function (err, result) {
				locals.data.project = result;
				if (result.participants) {
					var participants = JSON.parse(result.participants);
					locals.data.participants = participants;
				}
				else {
					locals.data.participants = '';
				}
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

	// insert/update if id exist
	view.on('post', { action: 'pbl.create' }, function (next) {
		if (locals.formData.allLearningGoals) {
			var arr = locals.formData.allLearningGoals;
			var i;
			var learningGoalArr = [];
			for (i = 0; i < arr.length; i++) {
				learningGoalArr.push({ goal: arr[i] });
			}
			var objlearningGoalArr = JSON.stringify(learningGoalArr);
		}
		var userId = locals.user._id;
		// creating a new object for project data
		var newProject = new Project.model({
			title: locals.formData.title,
			description: locals.formData.description,
			createdBy: userId, // add user data
			allLearningGoals: (objlearningGoalArr) ? objlearningGoalArr : '',
			file_name: locals.formData.file_name,
			uploaded_file_path: locals.formData.uploaded_file_path,
			resources_upload: locals.formData.resources_upload,
			status: 'Created',
		});
		// console.log('Generating new PBL project.....');
		var id = req.params.id;
		// console.log(id);
		if (id) {
			Project.model.findById(id).exec(function (err, item) {
				if (err) return res.apiError('database error', err);
				if (!item) return res.apiError('not found');
				// console.log(item.allLearningGoals[1]);
				item.getUpdateHandler(req).process(newProject, function (err) {
					// console.log(newProject.allLearningGoals[1]);
				});
				return res.redirect('/project/' + id);
			});
		} else {
			// saving or inserting the data into database
			newProject.save(function (err, result) {
				if (err) {
					locals.data.validationErrors = err.errors;
					console.log(err);
				} else {
					req.flash('success', { success: 'A new Project data saved successfully' });
					locals.projectSubmitted = true;
					// console.log(result);
					// insert this project in user model of teacher
					User.model.findById(userId).exec(function (err, item) {
						// set only projectId to insert in user model
						item.projectId = result._id;
						item.save(function () {
							// console.log('project Id added');
						});
					});
					return res.redirect('/project/' + result._id);
				}
				next();
			});
		}
	});

	// add participants into project
	view.on('post', { action: 'project.participants' }, function (next) {
		// get participants string
		var participants = locals.formData.participants;
		// console.log(participants);
		var arr = participants.split(',');
		// console.log(arr[0]);
		var i;
		var participantsArr = [];
		for (i = 0; i < arr.length; i++) {
			participantsArr.push({ email: arr[i] });
		}
		var objparticipantsArr = JSON.stringify(participantsArr);

		var newData = new Project.model({
			// title: locals.formData.title,
			// description: locals.formData.description,
			createdBy: locals.user._id, // add user data
			// allLearningGoals: locals.formData.allLearningGoals,
			// file_name: locals.formData.file_name,
			// uploaded_file_path: locals.formData.uploaded_file_path,
			// resources_upload: locals.formData.resources_upload,
			participants: objparticipantsArr,
		});
		// creating a new object for project data
		var id = req.params.id;
		// console.log(id);
		Project.model.findById(id).exec(function (err, item) {
			item.getUpdateHandler(req).process(newData, function (err) {
				// console.log(newData);
			});
		});
		return res.redirect('/project/' + id);
	});

	// Render the view
	// add session layout view for signin ignore default layout
	view.render('project', { layout: 'myUI' });
};
