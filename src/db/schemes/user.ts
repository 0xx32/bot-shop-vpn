import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

const timestamps = {
	updated_at: timestamp(),
	created_at: timestamp().defaultNow().notNull(),
	deleted_at: timestamp(),
}

const users = pgTable('users_table', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	uniqueID: text().unique(),
	telegramID: text().notNull().unique(),
	tgUserName: text(),
	ballance: integer().default(0).notNull(),
	lang: text().$type<'ru' | 'en'>().default('ru'),
})

export type User = typeof users.$inferSelect

const subscriptions = pgTable('subscriptions_table', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer()
		.notNull()
		.references(() => users.id),
})

const payments = pgTable('payments_table', {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	userId: integer()
		.notNull()
		.references(() => users.id),

	amount: integer().notNull(),
	status: text().notNull().$type<'pending' | 'success' | 'failed' | 'expired'>().default('pending'),
	...timestamps,
})

export { payments as paymentsTable, subscriptions as subscriptionsTable, users as usersTable }

//RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
	subscriptions: many(subscriptions),
	payments: many(payments),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id],
	}),
}))
export const paymentsRelations = relations(payments, ({ one }) => ({
	user: one(users, {
		fields: [payments.userId],
		references: [users.id],
	}),
}))
