var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Presentation Model
 * ==========
 */
var Presentation = new keystone.List('Presentation');

Presentation.add({
	createdBy: { type: Types.Relationship, ref: 'User' },
	projectId: { type: Types.Relationship, ref: 'Project' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
});

/**
 * page registration
 */
// default columns
// Presentation.defaultColumns = '';
Presentation.register();
