import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.cycles.list.path, async (_req, res) => {
    const cycles = await storage.getCycles();
    res.json(cycles);
  });

  app.post(api.cycles.create.path, async (req, res) => {
    try {
      const input = api.cycles.create.input.parse(req.body);
      const cycle = await storage.createCycle(input);
      res.status(201).json(cycle);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.cycles.delete.path, async (req, res) => {
    await storage.deleteCycle(Number(req.params.id));
    res.status(204).send();
  });

  // Pregnancy
  app.get(api.pregnancy.list.path, async (_req, res) => {
    const data = await storage.getPregnancies();
    res.json(data);
  });

  app.post(api.pregnancy.create.path, async (req, res) => {
    try {
      const input = api.pregnancy.create.input.parse(req.body);
      const data = await storage.createPregnancy(input);
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // Weight
  app.get(api.weight.list.path, async (_req, res) => {
    const data = await storage.getWeights();
    res.json(data);
  });

  app.post(api.weight.create.path, async (req, res) => {
    try {
      const input = api.weight.create.input.parse(req.body);
      const data = await storage.createWeight(input);
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // Postpartum
  app.get(api.postpartum.list.path, async (_req, res) => {
    const data = await storage.getPostpartumChecks();
    res.json(data);
  });

  app.post(api.postpartum.create.path, async (req, res) => {
    try {
      const input = api.postpartum.create.input.parse(req.body);
      const data = await storage.createPostpartum(input);
      res.status(201).json(data);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // Simple seed
  const existing = await storage.getCycles();
  if (existing.length === 0) {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setDate(today.getDate() - 28);
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setDate(today.getDate() - 57);

    await storage.createCycle({ 
      startDate: oneMonthAgo.toISOString().split('T')[0], 
      cycleLength: 28, 
      note: "Last month's cycle" 
    });
    await storage.createCycle({ 
      startDate: twoMonthsAgo.toISOString().split('T')[0], 
      cycleLength: 29, 
      note: "Two months ago" 
    });
  }

  return httpServer;
}
