import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const imageGenerationSessions = pgTable("image_generation_sessions", {
  id: serial("id").primaryKey(),
  userPrompt: text("user_prompt").notNull(),
  aiDescription: text("ai_description"),
  userFeedback: text("user_feedback"),
  finalDescription: text("final_description"),
  generatedImageUrl: text("generated_image_url"),
  status: text("status").notNull().default("prompt"), // "prompt", "describing", "feedback", "generating", "completed"
  energySaved: integer("energy_saved").default(0),
  timeSaved: integer("time_saved").default(0),
  moonbeamsEarned: integer("moonbeams_earned").default(0),
  magicalEnergyUsed: integer("magical_energy_used").default(5), // stardust particles
  createdAt: timestamp("created_at").defaultNow(),
});

export const moonbeamTasks = pgTable("moonbeam_tasks", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id"),
  taskType: text("task_type").notNull(), // "delete_emails", "close_tabs", "dark_mode", etc.
  taskDescription: text("task_description").notNull(),
  reward: integer("reward").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSessionSchema = createInsertSchema(imageGenerationSessions).omit({
  id: true,
  createdAt: true,
});

export const updateSessionSchema = createInsertSchema(imageGenerationSessions).omit({
  id: true,
  createdAt: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ImageGenerationSession = typeof imageGenerationSessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UpdateSession = z.infer<typeof updateSessionSchema>;
