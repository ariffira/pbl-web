/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// multer files
var multer = require('multer');
// var upload = multer({ dest: 'uploads/files' });
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'protected/uploads/files');
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now());
	},
});

var upload = multer({ storage: storage }).single('myPhoto');


// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),  // import API controllers
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);
	// new signUp and signIn routes for Users
	app.all('/signUp', routes.views.session.signUp);
	app.all('/signIn', routes.views.session.signIn);
	app.all('/signOut', routes.views.session.signOut);
	// Protected routes for login Users
	// dashboard routes
	app.get('/dashboard', middleware.requirePblUser, routes.views.dashboard);
	// idea generation routes
	app.all('/idea', middleware.requirePblUser, routes.views.idea);
	app.all('/idea/:id', middleware.requirePblUser, routes.views.idea);
	app.all('/idea/detailIdea/:id', middleware.requirePblUser, routes.views.idea.detailIdea);
	// student management routes
	app.all('/myStudent', middleware.requirePblUser, routes.views.myStudent);
	// profile page routes
	app.get('/myProfile', middleware.requirePblUser, routes.views.myProfile);
	// project create, generate, updates and other routes
	app.all('/project', middleware.requirePblUser, routes.views.project);
	app.all('/project/:id', middleware.requirePblUser, routes.views.project);
	app.get('/currentProject/:id', middleware.requirePblUser, routes.views.currentProject);
	app.get('/projectList', middleware.requirePblUser, routes.views.projectList);
	// task planning routes
	app.all('/taskPlan', middleware.requirePblUser, routes.views.taskPlan);
	app.all('/taskPlan/:id/detailTaskPlan', middleware.requirePblUser, routes.views.taskPlan.detailTaskPlan);
	// collect resources routes
	app.all('/collectResource', middleware.requirePblUser, routes.views.collectResource);
	// learning agenda routes
	app.all('/learningAgenda', middleware.requirePblUser, routes.views.learningAgenda);
	app.all('/learningAgenda/:id/detailLearningAgenda', middleware.requirePblUser, routes.views.learningAgenda.detailLearningAgenda);
	app.all('/learningAgenda/addLearningAgendaAnswer', middleware.requirePblUser, routes.views.learningAgenda.addLearningAgendaAnswer);
	// documentation page routes
	app.all('/documentation', middleware.requirePblUser, routes.views.documentation);
	app.all('/documentation/docDetail/:id', middleware.requirePblUser, routes.views.documentation.docDetail);
	app.all('/documentation/docCreate', middleware.requirePblUser, routes.views.documentation.docCreate);
	// presentation page routes
	app.all('/presentation', middleware.requirePblUser, routes.views.presentation);
	app.all('/presentation/addArtefact', middleware.requirePblUser, routes.views.presentation.addArtefact);
	app.all('/presentation/addFeedback', middleware.requirePblUser, routes.views.presentation.addFeedback);
	// showcase page routes
	app.all('/showcase', middleware.requirePblUser, routes.views.showcase);
	app.all('/showcase/detailShowcase/:id', middleware.requirePblUser, routes.views.showcase.detailShowcase);

	// my api routes
	app.get('/api/myData/list', keystone.middleware.api, routes.api.myData.list);
	app.all('/api/myData/:id/participants', keystone.middleware.api, routes.api.myData.participants);
	app.all('/api/myData/addProjectId', keystone.middleware.api, routes.api.myData.addProjectId);
	app.all('/api/myData/:id/projectGenerateNotification', keystone.middleware.api, routes.api.myData.projectGenerateNotification);

	// chat service and notifications routes
	app.all('/chat-notification', middleware.requirePblUser, routes.views.chatme);
	app.all('/chatme', middleware.requirePblUser, routes.views.chatme);


	// File Upload Route
	app.get('/api/fileupload/list', keystone.middleware.api, routes.api.fileupload.list);
	app.get('/api/fileupload/:id', keystone.middleware.api, routes.api.fileupload.get);
	app.all('/api/fileupload/:id/update', keystone.middleware.api, routes.api.fileupload.update);
	app.all('/api/fileupload/create', keystone.middleware.api, routes.api.fileupload.create);
	app.get('/api/fileupload/:id/remove', keystone.middleware.api, routes.api.fileupload.remove);
	// upload for sir trevor image file
	app.all('/api/fileupload/newImgFile', keystone.middleware.api, routes.api.fileupload.newImgFile);
	// File Upload Route end here

	// Image upload start
	app.post('/photoUpload', function (req, res) {
		upload(req, res, function (err) {
			if (err) {
				console.log(err);
			}
		});
		console.log('Photo Uploaded....');
		res.send(routes.views.myProfile);
	});
	// Image upload ends

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
