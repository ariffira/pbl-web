var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Notification Model
 * ==========
 */
var Notification = new keystone.List('Notification');

Notification.add({
	content: { type: String, required: true, initial: true },
	createdAt: { type: Date, default: Date.now },
	status: { type: Types.Select, options: 'Read, Unread' },
	flowExperience: { type: Types.Select, options: 'on, off' },
});

/**
 * Relationships
 */
Notification.relationship({ ref: 'Project', path: 'projects', refPath: 'notificationId' });
/**
 * page registration
 */
// default columns
Notification.register();
