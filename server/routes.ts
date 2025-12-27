import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

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
