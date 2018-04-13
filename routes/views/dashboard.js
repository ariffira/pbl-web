// @file dashboard.js
// @path /routes/views/dashboard.js
// @description shows charts, project recent updates in real time
// @author: MD Ariful Islam

var keystone = require('keystone');
var Project = keystone.list('Project');
var Idea = keystone.list('Idea');
var Showcase = keystone.list('Showcase');
var CollectResource = keystone.list('CollectResource');
var TaskPlan = keystone.list('TaskPlan');
var LearningAgenda = keystone.list('LearningAgenda');
var LearningAgendaAnswer = keystone.list('LearningAgendaAnswer');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'My Timeline';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		project: [],
		tasks: [],
		collections: [],
		questions: [],
		answers: [],
		ideas: [],
		showcases: [],
	};

	/**
	 *  timeline view of all project updates, charts update data etc
	 *  1. search tasks, ideas, collect-resources, learning agendas etc by createdAt and short them by time from today to DSC
	 *  limit 7 days
	 *  2. for charts find tasks status and count them send dataset
	 */
	view.on('init', function (next) {
		// chart data queries start
		/**
		var projectid = locals.user.projectId;
		// count number of tasks to-do, done, doing for charts
		// to-do numbers
		var countTodo = TaskPlan.model.aggregate([
			{ $match: { projectId: projectid, status: 'Todo' } }, { $group: { _id: null, numberOfTodo: { $sum: 1 } } },
		]);
		countTodo.exec(function (err, result) {
			if (result[0].numberOfTodo) {
				console.log('Number of Todo:' + result[0].numberOfTodo);
			}
			else {
				console.log('0');
			}
		});
		// doing numbers
		var countDoing = TaskPlan.model.aggregate([
			{ $match: { projectId: projectid, status: 'Doing' } }, { $group: { _id: null, numberOfDoing: { $sum: 1 } } },
		]);
		countDoing.exec(function (err, result) {
			if (result[0].numberOfDoing) {
				console.log('Number of Doing:' + result[0].numberOfDoing);
			}
			else {
				console.log('0');
			}
		});
		// Done numbers
		var countDone = TaskPlan.model.aggregate([
			{ $match: { projectId: projectid, status: 'Done' } }, { $group: { _id: null, numberOfDone: { $sum: 1 } } },
		]);
		countDone.exec(function (err, result) {
			if (result[0].numberOfDone) {
				console.log('Number of Done:' + result[0].numberOfDone);
			}
			else {
				console.log('0');
			}
		});
		*/
		// chart data queries ends
		if (locals.user.projectId) {
			var id = locals.user.projectId;
			// tasks data search
			var queryForTask = TaskPlan.model.find();
			queryForTask.where('projectId', id);
			queryForTask.sort('-createdAt').limit(7);
			queryForTask.exec(function (err, result) {
				locals.data.tasks = result;
				// console.log(result);
			});
			// collect resource data search
			var queryForCollectRescource = CollectResource.model.find();
			queryForCollectRescource.where('projectId', id);
			queryForCollectRescource.sort('-createdAt').limit(7);
			queryForCollectRescource.exec(function (err, result) {
				locals.data.collections = result;
				// console.log(result);
			});
			// learning agendas questions search
			var queryForLearningAgenda = LearningAgenda.model.find();
			queryForLearningAgenda.where('projectId', id);
			queryForLearningAgenda.sort('-createdAt').limit(7);
			queryForLearningAgenda.exec(function (err, result) {
				locals.data.questions = result;
				// console.log(result);
				/**
				if (result) {
					// todo: loop and show data
					var questionId = result._id;
					console.log(questionId);
					// learning agendas Answers search
					var queryForLearningAgendaAnswer = LearningAgendaAnswer.model.find();
					queryForLearningAgendaAnswer.where('questionId', questionId);
					queryForLearningAgendaAnswer.sort('-createdAt').limit(7);
					queryForLearningAgendaAnswer.exec(function (err, resultAnswer) {
						locals.data.answers = resultAnswer;
						console.log(resultAnswer);
					});
				}
				 */
			});
			// idea search
			var queryForIdeas = Idea.model.find();
			queryForIdeas.where('projectId', id);
			queryForIdeas.sort('-createdAt').limit(7);
			queryForIdeas.exec(function (err, result) {
				locals.data.ideas = result;
				// console.log(result);
			});
			// showcases search
			var queryForshowcase = Showcase.model.find();
			queryForshowcase.where('projectId', id);
			queryForshowcase.sort('-createdAt').limit(7);
			queryForshowcase.exec(function (err, result) {
				locals.data.showcases = result;
				// console.log(result);
			});
		}
		next();
	});
    // Render the view
	// add session layout view for signin ignore default layout
	view.render('dashboard', { layout: 'myUI' });
};
