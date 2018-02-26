var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * MyStudent Model
 * ==========
 */
var MyStudent = new keystone.List('MyStudent');

MyStudent.add({
	name: { type: String, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	createdBy: { type: Types.Relationship, ref: 'User' },
});

/**
 * Relationships
 */
MyStudent.relationship({ ref: 'Project', path: 'projects', refPath: 'participants' });

/**
 * page registration
 */
// default columns
MyStudent.defaultColumns = 'name, email';
MyStudent.register();
