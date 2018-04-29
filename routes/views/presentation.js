// @file presentation.js
// @path /routes/views/presentation.js
// @description Create presentation of artefact's by students
// @author: MD Ariful Islam

var keystone = require('keystone');
var Project = keystone.list('Project');
var TaskPlan = keystone.list('TaskPlan');
var Presentation = keystone.list('Presentation');
var Feedback = keystone.list('Feedback');

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
		tasks: [],
		presentationFiles: [],
		feedback: [],
	};
	/**
	 * 	initial view of artefact presentation
	 * 	shows project model info
	 * 	task plan model info
	 * 	shows added resources of presentation files
	 * 	display feedback of teacher and students
	 */
	view.on('init', function (next) {
		// get current projectId from user model
		var projectId = locals.user.projectId;
		if (projectId) {
			// find project data
			Project.model.findById(projectId).exec(function (err, result) {
				locals.data.project = result;
				if (result.participants) {
					var participants = JSON.parse(result.participants);
					locals.data.participants = participants;
				}
				else {
					locals.data.participants = result.participants;
				}
				if (result.allLearningGoals) {
					var allLearningGoals = JSON.parse(result.allLearningGoals);
					locals.data.allLearningGoals = allLearningGoals;
				}
				else {
					locals.data.allLearningGoals = result.allLearningGoals;
				}
			});
			var query = TaskPlan.model.find();
			query.where('projectId', projectId);
			query.populate('createdBy');
			query.exec(function (err, result) {
				locals.data.tasks = result;
				// console.log(result);
			});
			var presentationQuery = Presentation.model.find();
			presentationQuery.where('projectId', projectId);
			presentationQuery.populate('createdBy');
			presentationQuery.exec(function (err, result) {
				locals.data.presentationFiles = result;
				// console.log(result);
			});
			var feedbackQuery = Feedback.model.find();
			feedbackQuery.where('projectId', projectId);
			feedbackQuery.populate('createdBy');
			feedbackQuery.exec(function (err, result) {
				locals.data.feedback = result;
				console.log(result);
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


/**
 * Add presentation artefacts files and data
 */
exports.addArtefact = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Add artefact data';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	/**
	 *  Add files for Artefact presentation
	 */
	view.on('post', { action: 'add.presentationFile' }, function (next) {
		// get projectId from User
		// creating a new object for presentation data
		var newArtefactData = new Presentation.model({
			file_name: locals.formData.file_name,
			uploaded_file_path: locals.formData.uploaded_file_path,
			resources_upload: locals.formData.resources_upload,
			createdBy: locals.user._id, // add user data
			projectId: locals.user.projectId,
		});
		console.log(newArtefactData);
		// saving artefact data  in database
		newArtefactData.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				// console.log(result);
				return res.redirect('/presentation');
			}
			next();
		});

	});

	// Render the view
	view.render('addArtefact', { layout: 'myUI' });
};

/**
 * Add Feedback on the artefact
 */
exports.addFeedback = function (req, res) {
	var locals = res.locals;
	locals.formData = req.body || {};
	/**
	 *  insert feedback for the project
	 */
	var newFeedback = new Feedback.model({
		feedback_content: locals.formData.feedback_content,
		createdBy: locals.user._id, // add user data
		projectId: locals.user.projectId,
	});
	// console.log(newFeedback);
	// saving feedback data  in database
	newFeedback.save(function (err, result) {
		if (err) {
			locals.data.validationErrors = err.errors;
			console.log(err);
		} else {
			// console.log(result);
			return res.redirect('/presentation');
		}
	});
};


