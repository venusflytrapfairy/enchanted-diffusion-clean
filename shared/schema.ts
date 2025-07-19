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
