import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  age: integer("age"),
  language: text("language").default("en"),
  parentEmail: text("parent_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Progress table schema
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  todayStars: integer("today_stars").default(0),
  streak: integer("streak").default(0),
  wordsLearned: integer("words_learned").default(0),
  gamesCompleted: integer("games_completed").default(0),
  lastActive: timestamp("last_active").defaultNow(),
});

// Game Progress table schema
export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gameId: text("game_id").notNull(),
  timesPlayed: integer("times_played").default(0),
  timesCompleted: integer("times_completed").default(0),
  bestScore: integer("best_score").default(0),
  lastPlayed: timestamp("last_played").defaultNow(),
});

// Speech Recognition Attempt table schema
export const speechAttempts = pgTable("speech_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gameId: text("game_id").notNull(),
  phraseId: integer("phrase_id").notNull(),
  userSpeech: text("user_speech"),
  targetPhrase: text("target_phrase").notNull(),
  isCorrect: boolean("is_correct").default(false),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, lastActive: true });
export const insertGameProgressSchema = createInsertSchema(gameProgress).omit({ id: true, lastPlayed: true });
export const insertSpeechAttemptSchema = createInsertSchema(speechAttempts).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertGameProgress = z.infer<typeof insertGameProgressSchema>;
export type GameProgress = typeof gameProgress.$inferSelect;

export type InsertSpeechAttempt = z.infer<typeof insertSpeechAttemptSchema>;
export type SpeechAttempt = typeof speechAttempts.$inferSelect;

// Test Results table schema
export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  testName: text("test_name").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({ id: true, completedAt: true });
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type TestResult = typeof testResults.$inferSelect;
