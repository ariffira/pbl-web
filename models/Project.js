var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Project Model
 * ==========
 */
var Project = new keystone.List('Project');

Project.add({
	title: { type: String, required: true, initial: true },
	description: { type: Types.Textarea },
	createdBy: { type: Types.Relationship, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
	// allLearningGoals: { type: String },
	allLearningGoals: { type: Types.Code, language: 'json' },
	file_name: { type: String },
	uploaded_file_path: { type: Types.Url },
	resources_upload: { type: Types.Code, language: 'json' },
	// participants: { type: String },
	participants: { type: Types.Code, language: 'json' },
	// participants: { type: Types.Relationship, ref: 'MyStudent', many: true },
	status: { type: Types.Select, options: 'Created, Running, Finished' },
	notificationId: { type: Types.Relationship, ref: 'Notification' },
	startDate: { type: Date },
	endDate: { type: Date },
});

/**
 * Relationships
 */
Project.relationship({ ref: 'User', path: 'users', refPath: 'projectId' });
Project.relationship({ ref: 'TaskPlan', path: 'taskplans', refPath: 'projectId' });

/**
 * page registration
 */
// default columns
Project.defaultColumns = 'title, createdBy, createdAt';
Project.register();
