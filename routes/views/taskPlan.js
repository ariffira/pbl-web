// @file taskPlan.js
// @path /routes/views/taskPlan.js
// @description Tasks planning for project will be shown here
// include: add new tasks, check task status, flow experience supported task as doing
// @author: MD Ariful Islam

var keystone = require('keystone');
var TaskPlan = keystone.list('TaskPlan');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Task Planning';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		tasks: [],
	};

	// initial page to create task and shows list of task and their status
	view.on('init', function (next) {
		/* show all task related to this project if any projectId exist for this user
		   else nothing
		 */
		if (locals.user.projectId) {
			var id = locals.user.projectId;
			var query = TaskPlan.model.find();
			query.where('projectId', id);
			query.exec(function (err, result) {
				locals.data.tasks = result;
				// console.log(result);
				next();
			});
		} else {
			console.log('No tasks for this project');
			next();
		}

	});
	// add task
	view.on('post', { action: 'add.task' }, function (next) {
		// get a project Id and then create a task and put this projectId in task doc
		// creating a new object for task data
		if (locals.user.projectId) {
			var newTask = new TaskPlan.model({
				title: locals.formData.title,
				description: locals.formData.description,
				createdBy: locals.user._id, // add user data
				assignTo: locals.formData.assignTo,
				status: 'Todo',
				projectId: locals.user.projectId,
			});
			// console.log(newTask);
			// saving or inserting the data into database
			newTask.save(function (err, result) {
				if (err) {
					locals.data.validationErrors = err.errors;
					console.log(err);
				} else {
					console.log(result);
					return res.redirect('/taskPlan');
				}
				next();
			});
		}
	});

	// Render the view
	view.render('taskPlan', { layout: 'myUI' });
};

/**
 *  Details of a task plan
 */
exports.detailTaskPlan = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Detail Task Planning';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		tasks: [],
	};
    // Detail of a taskPlan by its Id
	view.on('init', function (next) {
		console.log('Details of a Task Planning');
		var taskId = req.params.id;
		// console.log(taskId);
		var query = TaskPlan.model.findById(taskId);
		query.exec(function (err, result) {
			locals.data.tasks = result;
			// console.log(result);
			next();
		});
	});

	// Update task
	view.on('post', { action: 'update.task' }, function (next) {
		// updating task data
		var taskId = locals.formData.id;
		// console.log(taskId);
		TaskPlan.model.findById(taskId).exec(function (err, result) {
			console.log(result);
			result.set({
				title: locals.formData.title,
				description: locals.formData.description,
				assignTo: locals.formData.assignTo,
				status: locals.formData.status,
			});
			result.save(function (err, newResult) {
				console.log('Task plan updated...........');
				if (err) {
					console.log(err);
				} else {
					console.log(newResult);
					locals.data.tasks = newResult;
					return res.redirect('/taskPlan/' + newResult._id + '/detailTaskPlan');
				}
			});
		});
	});

	// Render the view
	view.render('detailTaskPlan', { layout: 'myUI' });
};
