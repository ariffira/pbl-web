var async = require('async'),
	keystone = require('keystone');
var exec = require('child_process').exec;
var fs = require('file-system');
var FileData = keystone.list('FileUpload');

/**
 * List Files
 */
exports.list = function (req, res) {
	FileData.model.find(function (err, items) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			collections: items,
		});

	});
};

/**
 * Get File by ID
 */
exports.get = function (req, res) {

	FileData.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		res.apiResponse({
			collection: item,
		});

	});
};


/**
 * Update File by ID
 */
exports.update = function (req, res) {
	FileData.model.findById(req.params.id).exec(function (err, item) {
		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		var data = (req.method == 'POST') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function (err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				collection: item,
			});

		});
	});
};

/**
 * Upload a New File
 */
exports.create = function (req, res) {

	var item = new FileData.model();
	var	data = (req.method == 'POST') ? req.body : req.query;
	item.getUpdateHandler(req).process(req.files, function (err) {

		if (err) return res.apiError('error', err);

		res.apiResponse({
			file_upload: item,
		});

	});
};

/**
 * Upload a New File for sir trevor image instance
 */
exports.createNew = function (req, res) {
	// var	data = (req.method == 'POST') ? req.body : req.query;
	// console.log(data);
	// console.log(req.files); // req.files is an object not json file
	// var myJSON = JSON.stringify(req.files); // convert object into json file
	// console.log(myJSON);
	var tmpFile = req.files['attachment[file]'];
	console.log(tmpFile);
	fs.readFile(tmpFile.path, function (err, data) {

		var newPath = 'public/uploads/files/' + tmpFile.name;  // log data to find your right files path
		fs.writeFile(newPath, data, function (err) {

			if (err)
			{
				console.log('Error writing file');
				console.log(err);
				res.json(null);
			}
			else
			{
				// todo: fix path name problem among sir-trevor file-system and keystone
				// rename path as keystone image only take /uploads/files format not public/uploads/files
				var finalPath = '/uploads/files/' + tmpFile.name;
				// save file url based on sir trevor format { file: { url: '/xyz/abc.jpg' }}
				var path = {
					file: {
						url: finalPath
					}
				};

				res.json(path); // Respond with json! This will be attached to your sir trevor block
			}
		});
	});

};

/**
 * Delete File by ID
 */
exports.remove = function (req, res) {
	var fileId = req.params.id;
	FileData.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);

		if (!item) return res.apiError('not found');

		item.remove(function (err) {

			if (err) return res.apiError('database error', err);

			// Delete the file
			exec('rm public/uploads/files/' + fileId + '.*', function (err, stdout, stderr) {
				if (err) {
					console.log('child process exited with error code ' + err.code);
					return;
				}
				console.log(stdout);
			});

			return res.apiResponse({
				success: true,
			});
		});

	});
};
