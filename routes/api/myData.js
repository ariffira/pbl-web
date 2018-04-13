var async = require('async'),
	keystone = require('keystone');
var exec = require('child_process').exec;
var MyStudent = keystone.list('MyStudent');
var Project = keystone.list('Project');
var User = keystone.list('User');
var Notification = keystone.list('Notification');
var TaskPlan = keystone.list('TaskPlan');
var CollectResource = keystone.list('CollectResource');
var Documentation = keystone.list('Documentation');
var Idea = keystone.list('Idea');
var LearningAgenda = keystone.list('LearningAgenda');

/**
 * List of Students of the teacher: createdBy(teacher)
 */
exports.list = function (req, res) {
	var id = req.user.id;
	var query = MyStudent.model.find();
	query.where('createdBy', id);
	query.exec(function (err, result) {
		// console.log(result);
		res.send(result);
	});
};

/**
 * List of participants in a project
 */
exports.participants = function (req, res) {
	var id = req.params.id;
	// console.log(id);
	Project.model.findById(id).exec(function (err, result) {
		// console.log(result.participants);
		res.send(result.participants);
	});
};

/**
 * Insert projectId to each user Model of this email
 * parameter: data = {email, projectId}
 */
exports.addProjectId = function (req, res) {
	var data = req.body;
	// console.log(data);
	var email = data.userEmail;
	var projectId = data.projectId;
	// find user by this email and insert projectId to user model
	var users = User.model.find();
	users.where('email', email);
	users.exec(function (err, result) {
		// if result is not empty insert project id
		if (result.length) {
			// console.log(result);
			var userId = result[0]._id;
			// console.log(userId);
			User.model.findById(userId).exec(function (err, item) {
				// console.log(item);
				// set only projectId to insert in user model
				item.projectId = projectId;
				item.save(function () {
					// console.log('project Id added');
				});
			});
		}
		else {
			// console.log('No user account exist!!!');
		}
		// res.send(result);
	});
};

/**
 * Get all alert Notifications
 * todo: sort by createdAt date
 */
exports.getNotificationData = function (req, res) {
	var locals = res.locals;
	var projectId = req.user.projectId;
	// get all notifications related to this projectId
	var query = Notification.model.find();
	query.where('projectId', projectId);
	query.populate('projectId');
	query.exec(function (err, result) {
		// console.log(result);
		locals.notification = result;
		res.send(result);
	});
};

/**
 * insert notification for each project generate
 */
exports.projectGenerateNotification = function (req, res) {
	var projectId = req.params.id;
	/* save project id and notification msg to Notification model,
	 * later when user will log in and find notification for this projectId
	 */
	var newNotification = new Notification.model({
		content: 'You have been Added in a New Project.',
		status: 'Unread',
		projectId: projectId,
	});
	newNotification.save(function () {
		console.log('New Notification has been added on project generate....');
	});
};

/**
 * Mute notifications for flow-experience
 * user data mute is on
 */
exports.mute = function (req, res) {
	var userId = req.user._id;
	var data = req.body;
	var urlPath = data.path;
	// console.log(userId);
	User.model.findById(userId).exec(function (err, result) {
		result.set({
			mute: 'on',
		});
		result.save(function (err, newResult) {
			if (err) {
				console.log(err);
			} else {
				req.flash('success', { success: 'Mute Notification service is activated' });
				console.log(urlPath);
				res.redirect(urlPath);
			}
		});
	});
};

/**
 * Unmute notifications for flow-experience
 * user data mute is off
 */
exports.unmute = function (req, res) {
	var userId = req.user._id;
	var data = req.body;
	var urlPath = data.path;
	// console.log(userId);
	User.model.findById(userId).exec(function (err, result) {
		result.set({
			mute: 'off',
		});
		result.save(function (err, newResult) {
			if (err) {
				console.log(err);
			} else {
				req.flash('success', { success: 'Notification service is activated' });
				console.log(urlPath);
				res.redirect(urlPath);
			}
		});
	});
};

/**
 * getting number of total tasks
 */
exports.tasksTotal = function (req, res) {
	// var locals = res.locals;
	var projectid = req.user.projectId;
	// total tasks number
	var countTotalTask = TaskPlan.model.aggregate([
	{ $match: { projectId: projectid } }, { $group: { _id: null, numberOfTotalTask: { $sum: 1 } } },
	]);
	countTotalTask.exec(function (err, result) {
		if (result[0].numberOfTotalTask) {
			console.log('Number of Total tasks:' + result[0].numberOfTotalTask);
			res.send(result);
		}
		else {
			console.log('0');
		}
	});
};
/**
* getting number of total tasks To-do
*/
exports.tasksTodo = function (req, res) {
	// var locals = res.locals;
	var projectid = req.user.projectId;
	// total to-do tasks number
	var countTodo = TaskPlan.model.aggregate([
		{ $match: { projectId: projectid, status: 'Todo' } }, { $group: { _id: null, numberOfTodo: { $sum: 1 } } },
	]);
	countTodo.exec(function (err, result) {
		if (result[0].numberOfTodo) {
			console.log('Number of Todo:' + result[0].numberOfTodo);
			res.send(result);
		}
		else {
			console.log('0');
		}
	});
};
/**
* getting number of total tasks Doing
*/
exports.tasksDoing = function (req, res) {
	// var locals = res.locals;
	var projectid = req.user.projectId;
	// doing numbers
	var countDoing = TaskPlan.model.aggregate([
		{ $match: { projectId: projectid, status: 'Doing' } }, { $group: { _id: null, numberOfDoing: { $sum: 1 } } },
	]);
	countDoing.exec(function (err, result) {
		if (result[0].numberOfDoing) {
			console.log('Number of Doing:' + result[0].numberOfDoing);
			res.send(result);
		}
		else {
			console.log('0');
		}
	});
};
/**
* getting number of total tasks Done
*/
exports.tasksDone = function (req, res) {
	// var locals = res.locals;
	var projectid = req.user.projectId;
	// Done numbers
	var countDone = TaskPlan.model.aggregate([
		{ $match: { projectId: projectid, status: 'Done' } }, { $group: { _id: null, numberOfDone: { $sum: 1 } } },
	]);
	countDone.exec(function (err, result) {
		if (result[0].numberOfDone) {
			console.log('Number of Done:' + result[0].numberOfDone);
			res.send(result);
		}
		else {
			console.log('0');
		}
	});
};

/**
 * getting number of total collection of resources
 */
exports.collectionTotal = function (req, res) {
	// var locals = res.locals;
	var projectid = req.user.projectId;
	// total collection of resources number
	var countTotalCollection = CollectResource.model.aggregate([
		{ $match: { projectId: projectid } }, { $group: { _id: null, numberOfTotalCollection: { $sum: 1 } } },
	]);
	countTotalCollection.exec(function (err, result) {
		if (result[0].numberOfTotalCollection) {
			console.log('Number of Total Resource collections:' + result[0].numberOfTotalCollection);
			res.send(result);
		}
		else {
			console.log('0');
		}
	});
};

/**
 * getting number of total learningAgenda
 */
exports.learningAgendaTotal = function (req, res) {
	// var locals = res.locals;
	var projectid = req.user.projectId;
	// total learning Agenda number
	var countTotalLA = LearningAgenda.model.aggregate([
		{ $match: { projectId: projectid } }, { $group: { _id: null, numberOfTotalLearningAgenda: { $sum: 1 } } },
	]);
	countTotalLA.exec(function (err, result) {
		if (result) {
			console.log('Number of Total LA:' + result[0].numberOfTotalLearningAgenda);
			res.send(result);
		}
		else {
			console.log('0');
		}
	});
};

/**
 * getting number of total documentation
 */
exports.documentationTotal = function (req, res) {
	// var locals = res.locals;
	var projectid = req.user.projectId;
	// total docs number
	var countTotalDocs = Documentation.model.aggregate([
		{ $match: { projectId: projectid } }, { $group: { _id: null, numberOfTotalDocumentation: { $sum: 1 } } },
	]);
	countTotalDocs.exec(function (err, result) {
		if (!result == null) {
			console.log('Number of Total Docs:' + result[0].numberOfTotalDocumentation);
			res.send(result);
		}
		else {
			console.log('0');
		}
	});
};

/**
 * getting number of total Ideas
 */
exports.ideaTotal = function (req, res) {
	// var locals = res.locals;
	var projectid = req.user.projectId;
	// total idea number
	var countTotalIdea = Idea.model.aggregate([
		{ $match: { projectId: projectid } }, { $group: { _id: null, numberOfTotalIdea: { $sum: 1 } } },
	]);
	countTotalIdea.exec(function (err, result) {
		if (result[0].numberOfTotalIdea) {
			console.log('Number of Total ideas:' + result[0].numberOfTotalIdea);
			res.send(result);
		}
		else {
			console.log('0');
		}
	});
};
