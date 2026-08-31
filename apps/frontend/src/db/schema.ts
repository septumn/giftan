import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  pgEnum, 
  integer, 
  doublePrecision, 
  primaryKey,
  unique
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const roleEnum = pgEnum('Role', ['USER', 'MODERATOR', 'ADMIN'])

export const users = pgTable('User', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').unique(),
  password: text('password'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  bio: text('bio'),
  confirmationSentAt: timestamp('confirmationSentAt', { mode: 'date' }),
  image: text('image'),
  role: roleEnum('role').default('USER').notNull(),
  isBlocked: boolean('isBlocked').default(false).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
})

export const gifts = pgTable('Gift', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  collection: text('collection').notNull(),
  modelName: text('modelName').notNull(),
  symbol: text('symbol').notNull(),
  backdrop: text('backdrop').notNull(),
  collectibleNumber: integer('collectibleNumber').notNull(),
  description: text('description').notNull(),
  price: doublePrecision('price').notNull(),
  categories: text('categories').array().default(sql`ARRAY['all']::text[]`).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  sellerId: text('sellerId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
})

export const purchases = pgTable('Purchase', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  pricePaid: doublePrecision('pricePaid').notNull(),
  buyerId: text('buyerId')
    .notNull()
    .references(() => users.id),
  giftId: integer('giftId')
    .notNull()
    .unique()
    .references(() => gifts.id)
})

export const disputes = pgTable('Dispute', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').default('OPEN').notNull(),
  purchaseId: text('purchaseId')
    .notNull()
    .unique()
    .references(() => purchases.id),
  userId: text('userId')
    .notNull()
    .references(() => users.id),
  moderatorId: text('moderatorId'),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
})

export const accounts = pgTable('Account', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state')
}, (table) => [{
  unq: unique().on(table.provider, table.providerAccountId)
}])

export const sessions = pgTable('Session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull()
})

export const verificationTokens = pgTable('VerificationToken', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull()
}, (table) => [{
  pk: primaryKey({ columns: [table.identifier, table.token] })
}])

export const activateTokens = pgTable('ActivateToken', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  token: text('token').notNull().unique(),
  email: text('email').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull()
})

export const favorites = pgTable('Favorite', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  giftId: integer('giftId')
    .notNull()
    .references(() => gifts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull()
}, (table) => [{
  pk: primaryKey({ columns: [table.userId, table.giftId] })
}])

export const cartItems = pgTable('CartItem', {
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  giftId: integer('giftId')
    .notNull()
    .references(() => gifts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).defaultNow().notNull()
}, (table) => [{
  pk: primaryKey({ columns: [table.userId, table.giftId] })
}])

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  favorites: many(favorites),
  cartItems: many(cartItems),
  soldGifts: many(gifts, { relationName: 'UserGifts' }),
  purchases: many(purchases, { relationName: 'UserPurchases' }),
  disputes: many(disputes, { relationName: 'UserDisputes' })
}))

export const giftsRelations = relations(gifts, ({ one, many }) => ({
  seller: one(users, {
    fields: [gifts.sellerId],
    references: [users.id],
    relationName: 'UserGifts'
  }),
  favoritedBy: many(favorites),
  inCartOf: many(cartItems),
  purchase: one(purchases, {
    fields: [gifts.id],
    references: [purchases.giftId]
  })
}))

export const purchasesRelations = relations(purchases, ({ one }) => ({
  buyer: one(users, {
    fields: [purchases.buyerId],
    references: [users.id],
    relationName: 'UserPurchases'
  }),
  gift: one(gifts, {
    fields: [purchases.giftId],
    references: [gifts.id]
  }),
  dispute: one(disputes, {
    fields: [purchases.id],
    references: [disputes.purchaseId]
  })
}))

export const disputesRelations = relations(disputes, ({ one }) => ({
  purchase: one(purchases, {
    fields: [disputes.purchaseId],
    references: [purchases.id]
  }),
  user: one(users, {
    fields: [disputes.userId],
    references: [users.id],
    relationName: 'UserDisputes'
  })
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id]
  })
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}))

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id]
  }),
  gift: one(gifts, {
    fields: [favorites.giftId],
    references: [gifts.id]
  })
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id]
  }),
  gift: one(gifts, {
    fields: [cartItems.giftId],
    references: [gifts.id]
  })
}))