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
* 3. if user mute is on then step 2 will not happen, no notifications
 */
// onload search for notifications and emit msg and alerts
$(function () {
	$.ajax({
		url: '/api/myData/getNotificationData',
		type: 'GET',
		success: function (result) {
			socket.emit('alert notifications', result);
			socket.on('alert notifications', function (newData)
			{
				// var newData = JSON.parse(newData);
				// var newData = JSON.stringify(newData);
				for (var i = 0; i < newData.length; i++) {
					document.getElementById('onProjectGenerate').innerHTML = '' + newData + '<a class="dropdown-item" href="#">\n' +
						'<span class="text-success">\n' + newData.content + '</span>\n' +
						'<span class="small float-right text-muted">' + newData[0].createdAt + '</span>\n' +
						'<div class="dropdown-message small">extra data here</div>\n' +
						'</a>';
				}
			});
		},
	});
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

