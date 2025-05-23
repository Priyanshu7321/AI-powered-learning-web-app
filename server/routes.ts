import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema,
  insertUserProgressSchema,
  insertGameProgressSchema,
  insertSpeechAttemptSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
 

  // Auth routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create token with expiration (15 minutes)
      const expirationTime = Date.now() + (15 * 60 * 1000); // 15 minutes in milliseconds
      const token = `user_${user.id}_${expirationTime}`;

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, token });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Middleware to check token expiration
  const checkTokenExpiration = (req: Request, res: Response, next: Function) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [, , expirationTime] = token.split('_');
    if (!expirationTime || Date.now() > parseInt(expirationTime)) {
      return res.status(401).json({ message: "Token expired" });
    }

    next();
  };

  // Get current user data
  app.get("/api/users/me", checkTokenExpiration, async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const userId = parseInt(token!.split('_')[1]);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user data" });
    }
  });

  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user" });
    }
  });

  // User Progress routes
  app.get("/api/progress", checkTokenExpiration, async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const userId = parseInt(token!.split('_')[1]);
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        const newProgress = await storage.createUserProgress({
          userId,
          todayStars: 0,
          streak: 0,
          wordsLearned: 0,
          gamesCompleted: 0
        });
        return res.json(newProgress);
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve progress" });
    }
  });

  app.put("/api/progress", checkTokenExpiration, async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const userId = parseInt(token!.split('_')[1]);
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId
      });
      const updatedProgress = await storage.updateUserProgress(userId, progressData);
      res.json(updatedProgress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Failed to update progress" });
      }
    }
  });

  // Game Progress routes
  app.get("/api/game-progress/:gameId", async (req: Request, res: Response) => {
    try {
      // In a real app, we would get the user ID from the session
      const userId = 1; // Mock user ID for demo
      const gameId = req.params.gameId;
      const progress = await storage.getGameProgress(userId, gameId);
      if (!progress) {
        // Create default game progress if none exists
        const newProgress = await storage.createGameProgress({
          userId,
          gameId,
          timesPlayed: 0,
          timesCompleted: 0,
          bestScore: 0
        });
        return res.json(newProgress);
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve game progress" });
    }
  });

  app.get("/api/game-progress/all", async (req: Request, res: Response) => {
    try {
      // In a real app, we would get the user ID from the session
      const userId = 1; // Mock user ID for demo
      const progress = await storage.getAllGameProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve all game progress" });
    }
  });

  app.post("/api/game-progress", checkTokenExpiration, async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const userId = parseInt(token!.split('_')[1]);
      const { gameId, ...data } = req.body;
      
      // First check if the game progress exists
      let progress = await storage.getGameProgress(userId, gameId);
      
      if (!progress) {
        // Create new game progress
        progress = await storage.createGameProgress({
          userId,
          gameId,
          timesPlayed: 1,
          timesCompleted: data.completed ? 1 : 0,
          bestScore: data.score || 0,
          lastEvaluation: data.evaluation || null,
          lastAttemptDate: new Date()
        });
      } else {
        // Update existing game progress
        const updateData = {
          timesPlayed: (progress.timesPlayed || 0) + 1,
          timesCompleted: data.completed ? (progress.timesCompleted || 0) + 1 : (progress.timesCompleted || 0),
          bestScore: data.score > (progress.bestScore || 0) ? data.score : progress.bestScore,
          lastEvaluation: data.evaluation || progress.lastEvaluation,
          lastAttemptDate: new Date()
        };
        
        progress = await storage.updateGameProgress(userId, gameId, updateData);
      }
      
      // Also update the user progress
      const userProgress = await storage.getUserProgress(userId);
      if (userProgress) {
        await storage.updateUserProgress(userId, {
          userId,
          todayStars: (userProgress.todayStars || 0) + (data.starsEarned || 0),
          wordsLearned: (userProgress.wordsLearned || 0) + (data.wordsLearned || 0),
          gamesCompleted: data.completed ? (userProgress.gamesCompleted || 0) + 1 : (userProgress.gamesCompleted || 0),
          streak: userProgress.streak || 0,
          lastActive: new Date()
        });
      } else {
        // Create new user progress if none exists
        await storage.createUserProgress({
          userId,
          todayStars: data.starsEarned || 0,
          wordsLearned: data.wordsLearned || 0,
          gamesCompleted: data.completed ? 1 : 0,
          streak: 0,
          lastActive: new Date()
        });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update game progress" });
    }
  });

  // Speech Recognition Attempt routes
  app.post("/api/speech-attempts", async (req: Request, res: Response) => {
    try {
      // In a real app, we would get the user ID from the session
      const userId = 1; // Mock user ID for demo
      const attemptData = insertSpeechAttemptSchema.parse({
        ...req.body,
        userId
      });
      const attempt = await storage.createSpeechAttempt(attemptData);
      res.status(201).json(attempt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Failed to record speech attempt" });
      }
    }
  });

  app.get("/api/speech-attempts/:gameId", async (req: Request, res: Response) => {
    try {
      // In a real app, we would get the user ID from the session
      const userId = 1; // Mock user ID for demo
      const gameId = req.params.gameId;
      const attempts = await storage.getSpeechAttemptsByGame(userId, gameId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve speech attempts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
