// @file collectResource.js
// @path /routes/views/CollectResource.js
// @description add links, videos, web references, cite etc.
// @author: MD Ariful Islam

var keystone = require('keystone');
var CollectResource = keystone.list('CollectResource');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Collect resources';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.data = {
		website: [],
		article: [],
		image: [],
		video: [],
	};

	// initial page of collected resources
	view.on('init', function (next) {
		/* show all resource collections related to this project if any projectId exist for this user
		   else nothing
		 */
		if (locals.user.projectId) {
			var id = locals.user.projectId;
			var query1 = CollectResource.model.find();
			query1.where('projectId', id);
			query1.where('resource_type', 'Website');
			query1.populate('createdBy');
			query1.exec(function (err, result) {
				if (err) {
					console.log(err);
				}
				locals.data.website = result;
				// console.log(result);
				next();
			});
			var query2 = CollectResource.model.find();
			query2.where('projectId', id);
			query2.where('resource_type', 'Article');
			query2.populate('createdBy');
			query2.exec(function (err, result) {
				if (err) {
					console.log(err);
				}
				locals.data.article = result;
			});
			var query3 = CollectResource.model.find();
			query3.where('projectId', id);
			query3.where('resource_type', 'Image');
			query3.populate('createdBy');
			query3.exec(function (err, result) {
				if (err) {
					console.log(err);
				}
				locals.data.image = result;
			});
			var query4 = CollectResource.model.find();
			query4.where('projectId', id);
			query4.where('resource_type', 'Video');
			query4.populate('createdBy');
			query4.exec(function (err, result) {
				if (err) {
					console.log(err);
				}
				locals.data.video = result;
			});
		} else {
			console.log('No Collected resources for this project');
			next();
		}

	});

	// insert resource collections
	view.on('post', { action: 'add.collection' }, function (next) {
		// get user id
		var userId = locals.user._id;
		// get projectId
		var projectId = locals.user.projectId;
		// creating a new object for project data
		var newResource = new CollectResource.model({
			resource_name: locals.formData.resource_name,
			resource_type: locals.formData.resource_type,
			// webUrlResource: locals.formData.webUrlResource,
			createdBy: userId, // add user data
			projectId: projectId,
		});
		// add which data resource selected
		if (locals.formData.webUrlResource) {
			newResource.webUrlResource = locals.formData.webUrlResource;
		} else if (locals.formData.articleResource) {
			newResource.articleResource = locals.formData.articleResource;
		} else if (locals.formData.uploaded_file_path) {
			newResource.uploaded_file_path = locals.formData.uploaded_file_path;
		} else if (locals.formData.photoResource) {
			newResource.photoResource = locals.formData.photoResource;
		} else {
			console.log('No resource type');
		}
		// saving or inserting the data into database
		newResource.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				locals.projectSubmitted = true;
				// console.log(result);
				return res.redirect('/collectResource/');
			}
			next();
		});
	});

	// Render the view
	view.render('collectResource', { layout: 'myUI' });
};
