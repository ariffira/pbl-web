var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Collect Resources Model
 * ==========
 */
var CollectResource = new keystone.List('CollectResource');

CollectResource.add({
	resource_name: { type: String },
	createdBy: { type: Types.Relationship, ref: 'User' },
	projectId: { type: Types.Relationship, ref: 'Project' },
	createdAt: { type: Date, default: Date.now },
	resource_type: { type: Types.Select, options: 'Website, Video, Image, Article' },
	webUrlResource: { type: Types.Url },
	articleResource: { type: Types.Url },
	uploaded_file_path: { type: Types.Url },
	photoResource: { type: Types.Url },
});

/**
 * page registration
 */
CollectResource.register();
