var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Learning Agenda Model for answers
 * ==========
 */
var LearningAgendaAnswer = new keystone.List('LearningAgendaAnswer');

LearningAgendaAnswer.add({
	answer: { type: String, required: true, initial: true },
	createdBy: { type: Types.Relationship, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
	questionId: { type: Types.Relationship, ref: 'LearningAgenda' },
});

/**
 * page registration
 */
LearningAgendaAnswer.register();
