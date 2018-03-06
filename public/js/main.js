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
			data.file_upload.url = '/uploads/files/' + data.file_upload.file.filename;
			data.file_upload.fileType = data.file_upload.file.mimetype;
			data.file_upload.createdTimeStamp = new Date();

			// Update the file with the information above.
			$.get('/api/fileupload/' + data.file_upload._id + '/update', data.file_upload, function (data) {
				// debugger;
				console.log(data.collection);
				console.log('File information updated.....');

				// Add the uploaded file to the uploaded file list.
				// $('#file_list').append('<li>' + data.collection.name + '</li>');
				$('#file_list').append('<li><a href="' + data.collection.url + '" download>' + data.collection.name + '</a></li>');
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

function addLearningGoals () {
	var goal = document.getElementById('inputlearningGoals').value;
	$('#learningGoalList').append('<li>' + goal + '</li>');
	/*
	var goals = [{
		content: goal
	}];
	*/
	// goals = JSON.stringify(goals);
	// goals = JSON.stringify('name');
	/*
	goals.push({
		goal: goal
	});
	*/
	$('#learningGoalList').append('<input type="hidden" name="allLearningGoals" value="' + goal + '">');
}

// selectize for multiple user choice
$(function () {

	var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@'
		+ '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';
	$.get('/api/myData/list', function (result) {
		var myStudent = result;
		// console.log(result);
		$('#participants').selectize({
			persist: false,
			maxItems: null,
			valueField: 'email',
			labelField: 'name',
			searchField: ['name', 'email'],
			/*
			options: [
				{ email: 'brian@thirdroute.com', name: 'Brian Reavis' },
				{ email: 'nikola@tesla.com', name: 'Nikola Tesla' },
				{ email: 'someone@gmail.com', name: result[0].name },
			],
			*/
			options: myStudent,
			render: {
				item: function (item, escape) {
					return '<div>'
						+ (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '')
						+ (item.email ? '<span class="email">' + escape(item.email) + '</span>' : '')
						+ '</div>';
				},
				option: function (item, escape) {
					var label = item.name || item.email;
					var caption = item.name ? item.email : null;
					return '<div>'
						+ '<span class="label">' + escape(label) + '</span>'
						+ (caption ? '<span class="caption">' + '(' + escape(caption) + ')' + '</span>' : '')
						+ '</div>';
				},
			},
			createFilter: function (input) {
				var match, regex;

				// email@address.com
				regex = new RegExp('^' + REGEX_EMAIL + '$', 'i');
				match = input.match(regex);
				if (match) return !this.options.hasOwnProperty(match[0]);

				// name <email@address.com>
				regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
				match = input.match(regex);
				if (match) return !this.options.hasOwnProperty(match[2]);

				return false;
			},
			create: function (input) {
				if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
					return { email: input };
				}
				var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
				if (match) {
					return {
						email: match[2],
						name: $.trim(match[1]),
					};
				}
				alert('Invalid email address.');
				return false;
			},
		});
	});
	// for loop to add option in select for assign member list from a project participants
	// get project participants
	$('#select-assign-to').click(function () {
		var projectId = $(this).data('id');
		$.get('/api/myData/' + projectId + '/participants', function (participants) {
			var participants = JSON.parse(participants);
			// alert(participants[0].email);
			var assignMembers = '';
			for (var i = 0; i < participants.length; i++) {
				assignMembers += '<option value="' + participants[i].email + '">' + participants[i].email + '</option>';
			}
			$('#select-assign-to').append(assignMembers);
		});
	});
});

// on resource type selection show the field
function myCollection() {
	var selectedValue = document.getElementById('resourceSelect').value;
	switch (selectedValue) {
		case 'Website':
			document.getElementById('selectionType').innerHTML = '' +
				'<label for="webUrlResource" class="col-sm-2 col-form-label">Website/hyperlink/url:</label>' +
				'<div class="col-sm-6">' +
				'<input type="text" name="webUrlResource" class="form-control" placeholder="paste a website/hyperlinks related to your project...">' +
				'</div>';
			break;
		case 'Article':
			document.getElementById('selectionType').innerHTML = '\t\t<label for="articleResource" class="col-sm-2 col-form-label">Article/Book/Scientific Paper:</label>\n' +
				'\t\t<div class="col-sm-6">\n' +
				'\t\t\t<input type="text" name="articleResource" class="form-control" placeholder="Add a Scientific paper/article/book references..">\n' +
				'\t\t</div>';
			break;
		case 'Video':
			document.getElementById('selectionType').innerHTML = '\t\t<label for="videoResource" class="col-sm-2 col-form-label">Upload a Video:</label>\n' +
				'\t\t<div class="col-sm-6">\n' +
				'\t\t\t<input type="text" name="videoResource" class="form-control" placeholder="Give a name..">\n' +
				'\t\t</div>';
			break;
		case 'Image':
			document.getElementById('selectionType').innerHTML = '\t\t<label for="photoResource" class="col-sm-2 col-form-label">Upload a Picture:</label>\n' +
				'\t\t<div class="col-sm-10">\n' +
				'\t\t\t<textarea name="photoResource" class="form-control sir-trevor-image-upload"></textarea>\n' +
				'\t\t</div>';
			break;
		default:
			document.getElementById('selectionType').innerHTML = '<p>Please select A Type</p>';
	}

}

// onclick show answer input section
$('#hideLink').click(function(){
	$('#answerLink').hide();
	$('#answerInput').show();
});

