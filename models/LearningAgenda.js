var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Learning Agenda Model
 * ==========
 */
var LearningAgenda = new keystone.List('LearningAgenda');

LearningAgenda.add({
	question: { type: String, required: true, initial: true },
	// content: { type: Types.Markdown },
	createdBy: { type: Types.Relationship, ref: 'User' },
	answeredBy: { type: Types.Relationship, ref: 'User' },
	projectId: { type: Types.Relationship, ref: 'Project' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
});

/**
 * page registration
 */
LearningAgenda.register();
