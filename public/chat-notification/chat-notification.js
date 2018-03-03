var socket = io();
// chat me methods and files start
$('#chatForm').submit(function () {
	socket.emit('chat message', $('#m').val());
	$('#m').val('');
	return false;
});
socket.on('chat message', function (msg) {
	$('#messages').append($('<li>').text(msg));
});
// chat me methods and files end

// push notification to project participants start testing
/*
* on log in user will see notifications
* 1. first: save every changes, updates, messages in Notification collection in database with project ID
* 2. after login a query will search for all notifications where project id match and show this notifications by socket emit/on
* 3. if user flow-experience is on step 2 will not happen, no notifications
 */
socket.emit('project generated', { content: 'A new Project has been generated' });
socket.on('project generated', function (data)
{
	// alert(data.content);
	document.getElementById('onProjectGenerate').innerHTML = data.content;
});
// push notification to project ends testing

// when generate a project insert project id to user and add a notification for this project
$('#projectGenerate').click(function () {
	var id = $(this).data('id'); // project id
	// alert(id);
	$.ajax({
		url: '/api/myData/' + id + '/participants',
		type: 'POST',
		success: function (result) {
			var participants = JSON.parse(result);
			// loop to find each user of this project
			for (var i = 0; i < participants.length; i++) {
				if (participants[i].email != null) {
					// alert(participants[i].email);
					// insert project id to all users database/model
					var newData = {
						projectId: id,
						userEmail: participants[i].email,
					};
					$.ajax({
						url: '/api/myData/addProjectId',
						data: newData,
						type: 'POST',
						success: function () {
							// alert('project Id Inserted to each participants');
						},
					});
				}
			}
		},
	});
	// create a notification for project generate
	$.ajax({
		url: '/api/myData/' + id + '/projectGenerateNotification',
		type: 'POST',
		success: function () {
			// nothing now
		},
	});
});

