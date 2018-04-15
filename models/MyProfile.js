var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * MyProfile Model
 * ==========
 */
var MyProfile = new keystone.List('MyProfile');

MyProfile.add({
	createdBy: { type: Types.Relationship, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	publishedAt: Date,
	resources_upload: { type: Types.Code, language: 'json' },
	uploaded_file_path: { type: Types.Url },
	file_name: { type: String },
});

/**
 * Relationships
 */
MyProfile.relationship({ ref: 'Project', path: 'projects', refPath: 'createdBy' });

/**
 * Registration
 */
MyProfile.register();
