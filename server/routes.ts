import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSessionSchema, updateSessionSchema } from "@shared/schema";
import { generateImageDescription, refineImageDescription, generateImage } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new image generation session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Get a session by ID
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getSession(id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to get session" });
    }
  });

  // Update a session
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = updateSessionSchema.parse(req.body);
      const session = await storage.updateSession(id, updates);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Generate AI description from user prompt
  app.post("/api/sessions/:id/generate-description", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (!session.userPrompt) {
        return res.status(400).json({ error: "No user prompt found" });
      }

      // Update status to describing
      await storage.updateSession(id, { status: "describing" });

      const aiDescription = await generateImageDescription(session.userPrompt);
      
      const updatedSession = await storage.updateSession(id, {
        aiDescription,
        status: "feedback"
      });

      res.json(updatedSession);
    } catch (error) {
      console.error("Error generating description:", error);
      await storage.updateSession(parseInt(req.params.id), { status: "prompt" });
      res.status(500).json({ error: "Failed to generate description" });
    }
  });

  // Refine AI description based on user feedback
  app.post("/api/sessions/:id/refine-description", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { userFeedback } = req.body;
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if (!session.aiDescription) {
        return res.status(400).json({ error: "No AI description found" });
      }

      const refinedDescription = await refineImageDescription(session.aiDescription, userFeedback);
      
      const updatedSession = await storage.updateSession(id, {
        userFeedback,
        aiDescription: refinedDescription,
        finalDescription: refinedDescription
      });

      res.json(updatedSession);
    } catch (error) {
      console.error("Error refining description:", error);
      res.status(500).json({ error: "Failed to refine description" });
    }
  });

  // Generate final image
  app.post("/api/sessions/:id/generate-image", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const description = session.finalDescription || session.aiDescription;
      if (!description) {
        return res.status(400).json({ error: "No description found for image generation" });
      }

      // Update status to generating
      await storage.updateSession(id, { status: "generating" });

      const { url } = await generateImage(description);
      
      // Calculate mock energy and time savings
      const energySaved = Math.floor(Math.random() * 30) + 50; // 50-80%
      const timeSaved = Math.floor(Math.random() * 30) + 30; // 30-60 minutes

      const updatedSession = await storage.updateSession(id, {
        generatedImageUrl: url,
        status: "completed",
        energySaved,
        timeSaved,
        finalDescription: description
      });

      res.json(updatedSession);
    } catch (error) {
      console.error("Error generating image:", error);
      await storage.updateSession(parseInt(req.params.id), { status: "feedback" });
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Get all sessions (for dashboard/history)
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
