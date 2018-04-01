$(document).ready(function () {
	/**
	 * Sir trevor instance for uploading various types of files
	 */
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

	/**
	 * Sir trevor instance for Only Image files
	 */
	$('.sir-trevor-image-file').each(function (i, el) {
		var editor = new SirTrevor.Editor({
			el: el,
			defaultType: 'Image',
			blockTypes: ['Image'],
		});
		SirTrevor.setDefaults({
			uploadUrl: '/api/fileupload/newImgFile',
			iconUrl: '/sir-trevor-0.6.6/sir-trevor-icons.svg',
		});
	});
});

