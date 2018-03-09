var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Showcase Model
 * ==========
 */
var Showcase = new keystone.List('Showcase');

Showcase.add({
	title: { type: String, required: true, initial: true },
	showcase_content: { type: Types.Textarea },
	createdBy: { type: Types.Relationship, ref: 'User' },
	projectId: { type: Types.Relationship, ref: 'Project' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
	uploaded_file_path: { type: Types.Url },
});

/**
 * page registration
 */
Showcase.register();
