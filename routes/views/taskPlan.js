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
