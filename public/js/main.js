// file uploads
function uploadMyFile () {
	// debugger;

	var selectedFile = $('#file_upload').get(0).files[0];

	// Error handling
	if (selectedFile == undefined)
	{ alert('You did not select a file!'); }

	// Create the FormData data object and append the file to it.
	var newFile = new FormData();
	newFile.append('file_upload', selectedFile); // This is the raw file that was selected
	// console.log(newFile);
	// Set the form options.
	var opts = {
		url: '/api/fileupload/create',
		data: newFile,
		cache: false,
		contentType: false,
		processData: false,
		type: 'POST',

		// This function is executed when the file uploads successfully.
		success: function (data) {
			// Dev Note: KeystoneAPI only allows file and image uploads with the file itself. Any extra metadata will have to
			// be uploaded/updated with a second call.
            // console.log(data);
			// debugger;
			console.log('File upload succeeded! ID: ' + data.file_upload._id);

			// Fill out the file metadata information
			data.file_upload.name = $('#file_name').val();
			data.file_upload.url = '/protected/uploads/files/' + data.file_upload.file.filename;
			data.file_upload.fileType = data.file_upload.file.mimetype;
			data.file_upload.createdTimeStamp = new Date();

			// Update the file with the information above.
			$.get('/api/fileupload/' + data.file_upload._id + '/update', data.file_upload, function (data) {
				// debugger;
                console.log(data.collection);
				console.log('File information updated.....');

				// Add the uploaded file to the uploaded file list.
				$('#file_list').append('<li>' + data.collection.name + '</li>');
                // sending back file new path input
				$('#new_path').append('<input type="hidden" name="uploaded_file_path" value="' + data.collection.url + '">');


			})

			// If the metadata update fails:
				.fail(function (data) {
					debugger;

					console.error('The file metadata was not updated. Here is the error message from the server:');
					console.error('Server status: ' + err.status);
					console.error('Server message: ' + err.statusText);

					alert('Failed to connect to the server while trying to update file metadata!');
				});
		},

		// This error function is called if the POST fails for submitting the file itself.
		error: function (err) {
			// debugger;

			console.error('The file was not uploaded to the server. Here is the error message from the server:');
			console.error('Server status: ' + err.status);
			console.error('Server message: ' + err.statusText);

			alert('Failed to connect to the server!');
		},
	};

	// Execute the AJAX call.
	jQuery.ajax(opts);

}

