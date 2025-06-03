import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  product: text("product").notNull(),
  audience: text("audience").notNull(),
  goal: text("goal").notNull(),
  status: text("status").notNull().default("draft"), // draft, active, paused, completed
  platforms: text("platforms").array().notNull().default([]),
  budget: integer("budget"), // in cents
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  clickRate: text("click_rate").default("0.0"),
  spend: integer("spend").default(0), // in cents
  createdAt: timestamp("created_at").defaultNow(),
});

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  headline: text("headline").notNull(),
  primaryText: text("primary_text").notNull(),
  callToAction: text("call_to_action").notNull(),
  platform: text("platform").notNull(), // facebook, instagram, linkedin, twitter
  status: text("status").notNull().default("draft"), // draft, active, paused
  performance: jsonb("performance").default({}), // {impressions, clicks, ctr, etc}
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // facebook, instagram, linkedin, twitter
  username: text("username").notNull(),
  isConnected: boolean("is_connected").default(false),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  adId: integer("ad_id").references(() => ads.id),
  socialAccountId: integer("social_account_id").references(() => socialAccounts.id),
  content: text("content").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, failed
  engagement: jsonb("engagement").default({}), // {likes, shares, comments, etc}
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
  impressions: true,
  clicks: true,
  clickRate: true,
  spend: true,
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  createdAt: true,
  performance: true,
});

export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({
  id: true,
  createdAt: true,
  accessToken: true,
  refreshToken: true,
});

export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
  engagement: true,
});

// Types
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

// Remove old user tables as they're not needed for this app
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
