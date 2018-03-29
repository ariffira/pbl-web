var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	role: { type: Types.Select, options: 'teacher, student', required: true, initial: true },
	// phone: { type: String, width: 'short' },
	// photo: { type: Types.CloudinaryImage, collapse: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	institution: { type: String },
	institutionType: { type: Types.Select, options: 'School, College, University' },
	password: { type: Types.Password, initial: true, required: true },
	//password_confirm: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	pblUser: { type: Boolean, label: 'Can access Dashboard', index: true },
	projectId: { type: Types.Relationship, ref: 'Project' },
	mute: { type: Types.Select, options: 'on, off', default: 'off' },
	aboutMe: { type: Types.Textarea },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

// Provide Access to Keystone and create pblUser
User.schema.virtual('canAccessDashboard').get(function () {
	return this.pblUser;
});

/**
 * Relationships
 */
User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
User.relationship({ ref: 'Project', path: 'projects', refPath: 'createdBy' });
// User.relationship({ ref: 'TaskPlan', path: 'taskPlans', refPath: 'assignTo' });

/**
 * Registration
 */
// default columns for adminUI
User.defaultColumns = 'name, email, isAdmin, pblUser';
User.register();
