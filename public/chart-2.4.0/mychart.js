$(document).ready(function () {
	// bar chart data
	var totalTask;
	var totalCollection;
	var totalIdea;
	var totalLearningAgenda;
	var totalDocumentation;
	var toDoTask;
	var doingTask;
	var doneTask;
	var totalAll;
	// bar chart data start
	$.get('/api/myData/tasksTotal', function (result) {
		totalTask = result[0].numberOfTotalTask;
		Chart.scaleService.updateScaleDefaults('linear', {
			ticks: {
				min: 0,
				max: totalTask,
			},
		});
		var ctx = document.getElementById('myBarChart').getContext('2d');
		$.get('/api/myData/tasksTodo', function (result) {
			toDoTask = result[0].numberOfTodo;
			$.get('/api/myData/tasksDoing', function (result) {
				doingTask = result[0].numberOfDoing;
				$.get('/api/myData/tasksDone', function (result) {
					doneTask = result[0].numberOfDone;
					var barChart = new Chart(ctx, {
						type: 'horizontalBar',
						data: {
							labels: ['Total Tasks', 'Tasks Todo', 'Tasks Doing', 'Tasks Done'],
							datasets: [
								{
									label: 'All Tasks',
									backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#c45850'],
									data: [totalTask, toDoTask, doingTask, doneTask],
								},
							],
						},
						options: {
							title: {
								display: true,
								text: 'Project Progress chart',
							},
						},
					});
				});
			});
		});
	});
	// bar chart data ends
	// pie chart start
	$.get('/api/myData/tasksTotal', function (result) {
		totalTask = result[0].numberOfTotalTask;
		$.get('/api/myData/tasksTotal', function (result) {
			totalTask = result[0].numberOfTotalTask;
			$.get('/api/myData/collectionTotal', function (result) {
				totalCollection = result[0].numberOfTotalCollection;
				$.get('/api/myData/learningAgendaTotal', function (result) {
					totalLearningAgenda = result[0].numberOfTotalLearningAgenda;
					$.get('/api/myData/documentationTotal', function (result) {
						totalDocumentation = result[0].numberOfTotalDocumentation;
					});
					$.get('/api/myData/ideaTotal', function (result) {
						totalIdea = result[0].numberOfTotalIdea;
						totalAll = totalTask + totalCollection + totalLearningAgenda + totalDocumentation + totalIdea;
						Chart.scaleService.updateScaleDefaults('linear', {
							ticks: {
								min: 0,
								max: totalAll,
							},
						});
						var pieChart = new Chart(document.getElementById('myPieChart'), {
							type: 'pie',
							data: {
								labels: ['Tasks', 'Collected Resources', 'Learning Agendas', 'Documentations', 'Ideas'],
								datasets: [{
									label: 'numbers',
									backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
									data: [totalTask, totalCollection, totalLearningAgenda, totalDocumentation, totalIdea],
								}],
							},
							options: {
								title: {
									display: true,
									text: 'Project activities in number',
								},
							},
						});
					});
				});
			});
		});
	});
});
