var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Learning Agenda Model for questions
 * ==========
 */
var LearningAgenda = new keystone.List('LearningAgenda');

LearningAgenda.add({
	question: { type: String, required: true, initial: true },
	createdBy: { type: Types.Relationship, ref: 'User' },
	projectId: { type: Types.Relationship, ref: 'Project' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
});

/**
 * Relationships
 */
LearningAgenda.relationship({ ref: 'LearningAgendaAnswer', path: 'learningAgendaAnswers', refPath: 'questionId' });

/**
 * page registration
 */
LearningAgenda.register();
