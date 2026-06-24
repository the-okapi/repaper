import { relations } from 'drizzle-orm';
import { pgTable, text, boolean } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
	id: text('id')
		.primaryKey()
		.$default(() => crypto.randomUUID()),
	title: text('title').notNull(),
	code: text('code').unique().notNull(),
	editorPassword: text('editor_password').notNull(),
	viewerPassword: text('viewer_password'),
	content: text('content')
		.notNull()
		.$default(() => ''),
	passwordRequired: boolean('passwordRequired').notNull(),
	autosave: boolean('autosave').notNull(),
	classroom: boolean('classroom').notNull().default(false),
	createdAt: text('created_at')
		.notNull()
		.$default(() => new Date().toISOString()),
	updatedAt: text('updated_at')
		.notNull()
		.$default(() => new Date().toISOString())
		.$onUpdate(() => new Date().toISOString())
});

export const documentsRelations = relations(documents, ({ one }) => ({
	sessions: one(sessions)
}));

export const sessions = pgTable('sessions', {
	token: text('token')
		.primaryKey()
		.$default(() => crypto.randomUUID()),
	permissions: text('permissions').notNull().default('viewer'),
	documentCode: text('document_code')
		.notNull()
		.references(() => documents.code, { onDelete: 'cascade', onUpdate: 'cascade' }),
	date: text('date')
		.$default(() => new Date().toISOString())
		.notNull(),
	userAgent: text('user_agent')
});

export const logs = pgTable('logs', {
	id: text('id')
		.primaryKey()
		.$default(() => crypto.randomUUID()),
	dateTime: text('date_time')
		.notNull()
		.$default(() => new Date().toISOString()),
	userAgent: text('user_agent'),
	action: text('action').notNull(),
	info: text('info').notNull(),
	success: boolean('success').notNull(),
	error: text('error').default('no error')
});
