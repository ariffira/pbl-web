// @file myStudent.js
// @path /routes/views/myStudent.js
// @description add student for teacher
// @author: MD Ariful Islam

var keystone = require('keystone');
var MyStudent = keystone.list('MyStudent');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {
		students: [],
	};

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'My Students';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// initial view and show all students list
	view.on('init', function (next) {
		MyStudent.model.find().exec(function (err, result) {
			locals.data.students = result;
			console.log(result);
			next();
		});

	});

	// add students
	view.on('post', { action: 'add.student' }, function (next) {
		// console.log(locals.formData);
		// creating a new object
		var newStudent = new MyStudent.model({
			name: locals.formData.name,
			email: locals.formData.email,
			createdBy: locals.user._id, // add user data
		});
		// saving or inserting the data into database
		newStudent.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				console.log('one student added...');
				console.log(result);
				return res.redirect('/myStudent');
			}
			next();
		});
	});


	// Render the view
	// add session layout view for signin ignore default layout
	view.render('myStudent', { layout: 'myUI' });
};
