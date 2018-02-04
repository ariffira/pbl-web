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
		cb(null, 'protected/uploads/files')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now())
	},
});

var upload = multer({ storage: storage }).single('myPhoto');


// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),  // import API controllers File Upload
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
	app.get('/dashboard', middleware.requirePblUser, routes.views.dashboard);
	app.all('/idea', middleware.requirePblUser, routes.views.idea);
	app.all('/idea/:id', middleware.requirePblUser, routes.views.idea);
	app.get('/myStudent', middleware.requirePblUser, routes.views.myStudent);
	app.get('/myProfile', middleware.requirePblUser, routes.views.myProfile);
	app.all('/project', middleware.requirePblUser, routes.views.project);
	app.all('/project/:id', middleware.requirePblUser, routes.views.project);
	app.get('/showcase', middleware.requirePblUser, routes.views.showcase);

	// File Upload Route
	app.get('/api/fileupload/list', keystone.middleware.api, routes.api.fileupload.list);
	app.get('/api/fileupload/:id', keystone.middleware.api, routes.api.fileupload.get);
	app.all('/api/fileupload/:id/update', keystone.middleware.api, routes.api.fileupload.update);
	app.all('/api/fileupload/create', keystone.middleware.api, routes.api.fileupload.create);
	app.get('/api/fileupload/:id/remove', keystone.middleware.api, routes.api.fileupload.remove);
	// upload for sir trevor image file
	app.all('/api/fileupload/createNew', keystone.middleware.api, routes.api.fileupload.createNew);
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
