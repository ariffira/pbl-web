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
	// task_resources: { type: Types.Code, language: 'json' },
	resource_type: { type: Types.Select, options: 'Website, Video, Image, Article' },
});

/**
 * page registration
 */
CollectResource.register();
