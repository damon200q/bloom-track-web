import { pgTable, text, serial, integer, date, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cycles = pgTable("cycles", {
  id: serial("id").primaryKey(),
  startDate: date("start_date").notNull(),
  cycleLength: integer("cycle_length").notNull().default(28),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pregnancies = pgTable("pregnancies", {
  id: serial("id").primaryKey(),
  calculationMethod: text("calculation_method").notNull(), // 'lmp' or 'conception'
  referenceDate: date("reference_date").notNull(),
  dueDate: date("due_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const weightEntries = pgTable("weight_entries", {
  id: serial("id").primaryKey(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  date: date("date").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postpartumChecks = pgTable("postpartum_checks", {
  id: serial("id").primaryKey(),
  checkDate: date("check_date").notNull(),
  mood: integer("mood").notNull(), // 1-5
  energy: integer("energy").notNull(), // 1-5
  physicalRecovery: text("physical_recovery"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCycleSchema = createInsertSchema(cycles).omit({ id: true, createdAt: true });
export const insertPregnancySchema = createInsertSchema(pregnancies).omit({ id: true, createdAt: true });
export const insertWeightSchema = createInsertSchema(weightEntries).omit({ id: true, createdAt: true });
export const insertPostpartumSchema = createInsertSchema(postpartumChecks).omit({ id: true, createdAt: true });

export type Cycle = typeof cycles.$inferSelect;
export type InsertCycle = z.infer<typeof insertCycleSchema>;
export type Pregnancy = typeof pregnancies.$inferSelect;
export type InsertPregnancy = z.infer<typeof insertPregnancySchema>;
export type WeightEntry = typeof weightEntries.$inferSelect;
export type InsertWeight = z.infer<typeof insertWeightSchema>;
export type PostpartumCheck = typeof postpartumChecks.$inferSelect;
export type InsertPostpartum = z.infer<typeof insertPostpartumSchema>;
