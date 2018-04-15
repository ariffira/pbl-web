var keystone = require('keystone');
var User = keystone.list('User');
var Project = keystone.list('Project');
var MyProfile = keystone.list('MyProfile');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.data = {
		myProfile: [],
		project: [],
		participants: [],
		allLearningGoals: [],
	};

	// locals.section is used to set the currently selected
	locals.section = 'My ePortfolio Profile';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.profileSubmitted = false;

	// initial view of the profile
	view.on('init', function (next) {
		// add ePortfolio data
		/**
		 * search in MyProfile collection for this users data
		 */
		var userId = locals.user._id;
		var queryForProfileData = MyProfile.model.find();
		queryForProfileData.where('createdBy', userId);
		queryForProfileData.exec(function (err, result) {
			locals.data.myProfile = result;
			next();
		});
		var projectId = locals.user.projectId;
		if (projectId) {
			Project.model.findById(projectId).exec(function (err, result) {
				if (result.status === 'Running') {
					locals.data.project = result;
					if (result.allLearningGoals) {
						var allLearningGoals = JSON.parse(result.allLearningGoals);
						locals.data.allLearningGoals = allLearningGoals;
					}
					if (result.participants) {
						var participants = JSON.parse(result.participants);
						locals.data.participants = participants;
					}
				} else if (result.status === 'Created') {
					result.set({ status: 'Running' });
					result.save(function (err, newResult) {
						if (err) {
							console.log(err);
						} else {
							console.log(newResult);
							locals.data.project = newResult;
							var allLearningGoals = JSON.parse(newResult.allLearningGoals);
							locals.data.allLearningGoals = allLearningGoals;
							var participants = JSON.parse(newResult.participants);
							locals.data.participants = participants;
						}
					});
				}
			});
			next();
		}
		else {
			next();
		}
	});

	// add/update about me
	view.on('post', { action: 'add.aboutMe' }, function (next) {
		var userId = locals.user._id;
		User.model.findById(userId).exec(function (err, result) {
			console.log(result);
			result.set({
				aboutMe: locals.formData.aboutMe,
			});
			result.save(function (err, newResult) {
				console.log('About me data added...........');
				if (err) {
					console.log(err);
				} else {
					console.log(newResult);
					req.flash('success', { title: 'About me information successfully added' });
					locals.profileSubmitted = true;
					locals.aboutMe = newResult;
					return res.redirect('/myProfile');
				}
				next();
			});
		});
	});

	// Render the view
	view.render('myProfile', { layout: 'myUI' });
};

/**
 * Add ePortfolio files
 */
exports.addProfile = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	locals.section = 'Add MyProfile Files';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	/**
	 *  Add profile files
	 */
	view.on('post', { action: 'add.profileFile' }, function (next) {
		// creating a new object for myProfile data
		var newFile = new MyProfile.model({
			file_name: locals.formData.file_name,
			uploaded_file_path: locals.formData.uploaded_file_path,
			resources_upload: locals.formData.resources_upload,
			createdBy: locals.user._id, // add user data
		});
		console.log(newFile);
		// saving profile data  in database
		newFile.save(function (err, result) {
			if (err) {
				locals.data.validationErrors = err.errors;
				console.log(err);
			} else {
				console.log(result);
				return res.redirect('/myProfile');
			}
			next();
		});

	});

	// Render the view
	view.render('addProfile', { layout: 'myUI' });
};
