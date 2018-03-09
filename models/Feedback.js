var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Feedback Model
 * ==========
 */
var Feedback = new keystone.List('Feedback');

Feedback.add({
	feedback_content: { type: Types.Textarea },
	createdBy: { type: Types.Relationship, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
	projectId: { type: Types.Relationship, ref: 'Project' },
});

/**
 * page registration
 */
Feedback.register();
