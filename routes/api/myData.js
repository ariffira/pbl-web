var async = require('async'),
	keystone = require('keystone');
var exec = require('child_process').exec;
var MyStudent = keystone.list('MyStudent');
var Project = keystone.list('Project');
var User = keystone.list('User');
var Notification = keystone.list('Notification');

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
 * insert notification for each project generate
 */
exports.projectGenerateNotification = function (req, res) {
	var projectId = req.params.id;
	// console.log('notification get project id test');
	// console.log(projectId);
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
