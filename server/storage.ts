import { cycles, pregnancies, weightEntries, postpartumChecks, type Cycle, type InsertCycle, type Pregnancy, type InsertPregnancy, type WeightEntry, type InsertWeight, type PostpartumCheck, type InsertPostpartum } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Cycle
  createCycle(cycle: InsertCycle): Promise<Cycle>;
  getCycles(): Promise<Cycle[]>;
  deleteCycle(id: number): Promise<void>;
  
  // Pregnancy
  createPregnancy(pregnancy: InsertPregnancy): Promise<Pregnancy>;
  getPregnancies(): Promise<Pregnancy[]>;

  // Weight
  createWeight(weight: InsertWeight): Promise<WeightEntry>;
  getWeights(): Promise<WeightEntry[]>;

  // Postpartum
  createPostpartum(check: InsertPostpartum): Promise<PostpartumCheck>;
  getPostpartumChecks(): Promise<PostpartumCheck[]>;
}

export class DatabaseStorage implements IStorage {
  // Cycle
  async createCycle(insertCycle: InsertCycle): Promise<Cycle> {
    const [cycle] = await db.insert(cycles).values(insertCycle).returning();
    return cycle;
  }

  async getCycles(): Promise<Cycle[]> {
    return await db.select().from(cycles).orderBy(desc(cycles.startDate));
  }

  async deleteCycle(id: number): Promise<void> {
    await db.delete(cycles).where(eq(cycles.id, id));
  }

  // Pregnancy
  async createPregnancy(insertPregnancy: InsertPregnancy): Promise<Pregnancy> {
    const [pregnancy] = await db.insert(pregnancies).values(insertPregnancy).returning();
    return pregnancy;
  }

  async getPregnancies(): Promise<Pregnancy[]> {
    return await db.select().from(pregnancies).orderBy(desc(pregnancies.createdAt));
  }

  // Weight
  async createWeight(insertWeight: InsertWeight): Promise<WeightEntry> {
    const [weight] = await db.insert(weightEntries).values(insertWeight).returning();
    return weight;
  }

  async getWeights(): Promise<WeightEntry[]> {
    return await db.select().from(weightEntries).orderBy(desc(weightEntries.date));
  }

  // Postpartum
  async createPostpartum(insertPostpartum: InsertPostpartum): Promise<PostpartumCheck> {
    const [check] = await db.insert(postpartumChecks).values(insertPostpartum).returning();
    return check;
  }

  async getPostpartumChecks(): Promise<PostpartumCheck[]> {
    return await db.select().from(postpartumChecks).orderBy(desc(postpartumChecks.checkDate));
  }
}

export const storage = new DatabaseStorage();
