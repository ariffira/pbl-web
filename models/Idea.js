var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Idea Model
 * ==========
 */
var Idea = new keystone.List('Idea');

Idea.add({
	title: { type: String, required: true, initial: true },
	description: { type: Types.Textarea },
	createdAt: { type: Date, default: Date.now },
	createdBy: { type: Types.Relationship, ref: 'User' },
	publishedAt: Date,
	file_upload: { type: Types.Code, language: 'json' },
});

/**
 * Registration
 */
// default columns
Idea.defaultColumns = 'title, description, createdBy, createdAt';
Idea.register();
