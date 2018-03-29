// @file learningAgenda.js
// @path /routes/views/learningAgenda.hbs.js
// @description add list of questionnaire for project
// @author: MD Ariful Islam

var keystone = require('keystone');
var LearningAgenda = keystone.list('LearningAgenda');
var LearningAgendaAnswer = keystone.list('LearningAgendaAnswer');

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
		/* show all learning agenda related to this project if any projectId exist for this user
		else nothing
		*/
		if (locals.user.projectId) {
			var id = locals.user.projectId;
			var query = LearningAgenda.model.find();
			query.where('projectId', id);
			query.populate('createdBy');
			query.exec(function (err, result) {
				locals.data.learningAgenda = result;
				next();
			});
		} else {
			console.log('No learning agenda for this project');
			next();
		}
	});
	// add learningAgenda
	view.on('post', { action: 'add.learningAgenda' }, function (next) {
		// get and add projectId of user model
		// creating a new object for learningAgenda data
		if (locals.user.projectId) {
			var newLearningAgenda = new LearningAgenda.model({
				question: locals.formData.question,
				createdBy: locals.user._id, // add user data
				projectId: locals.user.projectId,
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
		}

	});

	// Render the view
	view.render('learningAgenda', { layout: 'myUI' });
};

/**
 *  Details of a Learning Agenda
 */
exports.detailLearningAgenda = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Detail Learning Agenda';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		learningAgenda: [],
		learningAgendaAnswer: [],
	};
	// Detail of a learningAgenda by its Id
	view.on('init', function (next) {
		console.log('Details of a learningAgenda');
		var questionId = req.params.id;
		// console.log(questionId);
		var query = LearningAgenda.model.findById(questionId);
		query.populate('createdBy');
		query.exec(function (err, result) {
			locals.data.learningAgenda = result;
			next();
		});
		var queryForAnswers = LearningAgendaAnswer.model.find();
		queryForAnswers.populate('createdBy');
		queryForAnswers.where('questionId', questionId);
		queryForAnswers.exec(function (err, result) {
			locals.data.learningAgendaAnswer = result;
		});
	});

	// Update LearningAgenda
	view.on('post', { action: 'update.learningAgenda' }, function (next) {
		// updating learningAgenda data
		var learningAgendaId = locals.formData.id;
		LearningAgenda.model.findById(learningAgendaId).exec(function (err, result) {
			console.log(result);
			result.set({
				question: locals.formData.question,
				answer: locals.formData.answer,
				answeredBy: locals.user._id,
			});
			result.save(function (err, newResult) {
				console.log('learningAgenda updated...........');
				if (err) {
					console.log(err);
				} else {
					console.log(newResult);
					locals.data.learningAgenda = newResult;
					return res.redirect('/learningAgenda/' + newResult._id + '/detailLearningAgenda');
				}
			});
		});
	});

	// Render the view
	view.render('detailLearningAgenda', { layout: 'myUI' });
};


/**
 *  Add answer to the Learning Agenda question
 */
exports.addLearningAgendaAnswer = function (req, res) {
	var locals = res.locals;
	locals.formData = req.body || {};
	var questionId = locals.formData.questionId;
	var addNewAnswer = new LearningAgendaAnswer.model({
		answer: locals.formData.answer,
		createdBy: locals.user._id,
		questionId: questionId, // parent question of this answer
	});
	addNewAnswer.save(function () {
		console.log('Answer added to the question');
		res.redirect('/learningAgenda/' + questionId + '/detailLearningAgenda');
	});
};
