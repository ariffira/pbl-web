$(document).ready(function () {
	var editor = new SirTrevor.Editor({
		el: document.querySelector('.sir-trevor'),
		defaultType: 'Text',
		blockTypes: ['Text', 'Image', 'Video', 'Tweet', 'List'],
	});
	SirTrevor.setDefaults({
		uploadUrl: '/api/fileupload/createNew',
		iconUrl: 'sir-trevor-0.6.6/sir-trevor-icons.svg',
	});
});

