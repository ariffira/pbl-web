$(document).ready(function () {
	Chart.scaleService.updateScaleDefaults('linear', {
		ticks: {
			min: 0,
		},
	});
	var ctx = document.getElementById('myBarChart').getContext('2d');
	var barChart = new Chart(ctx, {
		type: 'horizontalBar',
		data: {
			labels: ['Total Tasks', 'Tasks Todo', 'Tasks Doing', 'Tasks Done'],
			datasets: [
				{
					label: 'All Tasks',
					backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#c45850'],
					data: [15, 9, 4, 2],
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

	// for pie chart
	var pieChart = new Chart(document.getElementById('myPieChart'), {
		type: 'pie',
		data: {
			labels: ['Tasks', 'Collected Resources', 'Learning Agendas', 'Documentations', 'Ideas'],
			datasets: [{
				label: 'numbers',
				backgroundColor: ['#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'],
				data: [10, 12, 17, 5, 11],
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
