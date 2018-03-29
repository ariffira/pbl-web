$(document).ready(function () {
	$('.sir-trevor').each(function (i, el) {
		var editor = new SirTrevor.Editor({
			el: el,
			defaultType: 'Text',
			blockTypes: ['Text', 'Image', 'Video', 'List', 'Quote', 'Heading'],
		});
		SirTrevor.setDefaults({
			uploadUrl: '/api/fileupload/newImgFile',
			iconUrl: '/sir-trevor-0.6.6/sir-trevor-icons.svg',
		});
	});

	// only image upload
	var imageEditor = new SirTrevor.Editor({
		el: document.querySelector('.sir-trevor-image-upload'),
		defaultType: 'Image',
		blockTypes: ['Image'],
	});
});

