var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Task Planning Model
 * ==========
 */
var TaskPlan = new keystone.List('TaskPlan');

TaskPlan.add({
	title: { type: String, required: true, initial: true },
	content: { type: Types.Markdown },
	createdBy: { type: Types.Relationship, ref: 'User' },
	assignTo: { type: Types.Relationship, ref: 'User' },
	projectId: { type: Types.Relationship, ref: 'Project' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
	task_resources: { type: Types.Code, language: 'json' },
	// participants: { type: Types.Relationship, ref: 'MyStudent', many: true },
	status: { type: Types.Select, options: 'Todo, Doing, Done' },
});

/**
 * page registration
 */
// default columns
TaskPlan.defaultColumns = '';
TaskPlan.register();
