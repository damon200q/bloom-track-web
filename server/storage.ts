import { cycles, type Cycle, type InsertCycle } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createCycle(cycle: InsertCycle): Promise<Cycle>;
  getCycles(): Promise<Cycle[]>;
  deleteCycle(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createCycle(insertCycle: InsertCycle): Promise<Cycle> {
    const [cycle] = await db
      .insert(cycles)
      .values(insertCycle)
      .returning();
    return cycle;
  }

  async getCycles(): Promise<Cycle[]> {
    return await db
      .select()
      .from(cycles)
      .orderBy(desc(cycles.startDate));
  }

  async deleteCycle(id: number): Promise<void> {
    await db
      .delete(cycles)
      .where(eq(cycles.id, id));
  }
}

export const storage = new DatabaseStorage();
