$(document).ready(function () {
	var editor = new SirTrevor.Editor({
		el: document.querySelector('.sir-trevor'),
		defaultType: 'Text',
		blockTypes: ['Text', 'Image', 'Video', 'List'],
	});
	SirTrevor.setDefaults({
		uploadUrl: '/api/fileupload/newImgFile',
		iconUrl: '/sir-trevor-0.6.6/sir-trevor-icons.svg',
	});
	// only image upload
	var imageEditor = new SirTrevor.Editor({
		el: document.querySelector('.sir-trevor-image-upload'),
		defaultType: 'Image',
		blockTypes: ['Image'],
	});
});

