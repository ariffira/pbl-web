// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var handlebars = require('express-handlebars');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'ePbl',
	'brand': 'ePbl',

	'less': 'public',
	'static': 'public',
	// new icon added
	'favicon': 'public/pbl_logo.png',
	// 'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '.hbs',

	'custom engine': handlebars.create({
		layoutsDir: 'templates/views/layouts',
		partialsDir: 'templates/views/partials',
		defaultLayout: 'default',
		helpers: new require('./templates/views/helpers')(),
		extname: '.hbs',
	}).engine,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));
// set sign-in logo out of module
keystone.set('signin logo', '/images/logo-email-pbl.gif');

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	galleries: 'galleries',
	enquiries: 'enquiries',
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server


// keystone.start();
var socketio = require('socket.io');

keystone.start(
	{
		onHttpServerCreated: function () {
			keystone.set('io', socketio.listen(keystone.httpServer));
			var io = keystone.get('io');
			// Whenever someone connects this gets executed
			io.on('connection', function (socket) {
				console.log('Socket message: A user connected.......');
				socket.emit('notifytest', { description: 'A custom event named testerEvent!' });
				socket.emit('projectGenerate', { content: 'A new Project is generated for you!' });
				// Whenever someone disconnects this piece of code executed
				socket.on('disconnect', function () {
					console.log('Socket message: A user disconnected..........');
				});
			});
		},
		/*
		onStart: function () {
			var io = keystone.get('io');
			io.on('connect', function (socket) {
				console.log('connected............');
				socket.on('disconnect', function () {
					console.log('disconnected........');
				});
			});
		}
		*/
	});
