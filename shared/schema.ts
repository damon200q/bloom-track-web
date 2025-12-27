import { pgTable, text, serial, integer, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cycles = pgTable("cycles", {
  id: serial("id").primaryKey(),
  startDate: date("start_date").notNull(),
  cycleLength: integer("cycle_length").notNull().default(28),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCycleSchema = createInsertSchema(cycles).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertCycle = z.infer<typeof insertCycleSchema>;
export type Cycle = typeof cycles.$inferSelect;
