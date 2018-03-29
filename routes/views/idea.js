// @file idea.js
// @path /routes/views/idea.js
// @description New idea generate for the project by students
// @author: MD Ariful Islam

var keystone = require('keystone');
var Idea = keystone.list('Idea');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Make New idea';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.ideaSubmitted = false;
	locals.data = {
		idea: [],
	};

	/**
	 *  Initial Idea page with list of ideas. here we have ideas with related project and ideas created by the user himself
	 *  ideas without projectId could be added later to the project if user want
	 */
	view.on('init', function (next) {
		/* show all task related to this project if any projectId exist for this user
		   else nothing
		 */
		if (locals.user.projectId) {
			var id = locals.user.projectId;
			var query = Idea.model.find();
			query.where('projectId', id);
			query.populate('createdBy');
			query.populate('projectId');
			query.exec(function (err, result) {
				locals.data.idea = result;
				console.log(result);
				next();
			});
		} else {
			console.log('No tasks for this project');
			next();
		}

	});
	/**
	 *  Generate your own Idea
	 */
	view.on('post', { action: 'idea.generate' }, function (next) {
		// get projectId from User if yes then add projectId in Idea or add general idea without any project
		// creating a new object for project data
		var newIdea = new Idea.model({
			title: locals.formData.title,
			description: locals.formData.description,
			createdBy: locals.user._id, // add user data
			resources_upload: locals.formData.resources_upload,
			uploaded_file_path: locals.formData.uploaded_file_path,
		});
		if (locals.user.projectId) {
			newIdea.projectId = locals.user.projectId;
		}
		console.log(newIdea);
		console.log('Generating new Ideas.....');
		// saving ideas in database
		newIdea.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				// console.log(result);
				locals.ideaSubmitted = true;
				req.flash('success', { title: 'A new idea successfully generated.....' });
				return res.redirect('/idea/' + result._id);
			}
			next();
		});

	});


	// Render the view
	// add session layout view for signin ignore default layout
	view.render('idea', { layout: 'myUI' });
};

/**
 * Detail info of an Idea
 */
exports.detailIdea = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Detail idea';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		idea: [],
	};

	// Detail of a Idea by its Id
	view.on('init', function (next) {
		console.log('Details of a Idea');
		var ideaId = req.params.id;
		// console.log(ideaId);
		var query = Idea.model.findById(ideaId);
		query.exec(function (err, result) {
			locals.data.idea = result;
			// console.log(result);
			next();
		});
	});

	// Update Idea
	view.on('post', { action: 'update.idea' }, function (next) {
		// updating idea data
		var ideaId = locals.formData.id;
		// console.log(ideaId);
		Idea.model.findById(ideaId).exec(function (err, result) {
			console.log(result);
			var uploaded_file_path = result.uploaded_file_path;
			result.set({
				title: locals.formData.title,
				description: locals.formData.description,
				resources_upload: locals.formData.resources_upload,
				uploaded_file_path: (uploaded_file_path) ? uploaded_file_path : locals.formData.uploaded_file_path,
			});
			result.save(function (err, newResult) {
				console.log('Idea updated...........');
				if (err) {
					console.log(err);
				} else {
					console.log(newResult);
					locals.ideaSubmitted = true;
					req.flash('success', { title: 'A new idea successfully Updated....' });
					locals.data.tasks = newResult;
					return res.redirect('/idea/detailIdea/' + ideaId);
				}
			});
		});
	});

	// Render the view
	view.render('detailIdea', { layout: 'myUI' });
};
