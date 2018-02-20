var async = require('async'),
	keystone = require('keystone');
var exec = require('child_process').exec;
var MyStudent = keystone.list('MyStudent');

/**
 * List of Students by createdBy(teacher)
 */
exports.list = function (req, res) {
	// var id = locals.user._id;
	var id = '5a71a0ebc252020d4c127911';
	var query = MyStudent.model.find();
	query.where('createdBy', id);
	query.exec(function (err, result) {
		// console.log(result);
		res.send(result);
	});
};
