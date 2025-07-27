import { users, imageGenerationSessions, type User, type InsertUser, type ImageGenerationSession, type InsertSession, type UpdateSession } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSession(session: InsertSession): Promise<ImageGenerationSession>;
  getSession(id: number): Promise<ImageGenerationSession | undefined>;
  updateSession(id: number, updates: UpdateSession): Promise<ImageGenerationSession | undefined>;
  getAllSessions(): Promise<ImageGenerationSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sessions: Map<number, ImageGenerationSession>;
  private currentUserId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSession(insertSession: InsertSession): Promise<ImageGenerationSession> {
    const id = this.currentSessionId++;
    const session: ImageGenerationSession = {
      id,
      userPrompt: insertSession.userPrompt,
      aiDescription: insertSession.aiDescription || null,
      userFeedback: insertSession.userFeedback || null,
      finalDescription: insertSession.finalDescription || null,
      generatedImageUrl: insertSession.generatedImageUrl || null,
      status: insertSession.status || "prompt",
      energySaved: insertSession.energySaved || null,
      timeSaved: insertSession.timeSaved || null,
      createdAt: new Date(),
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: number): Promise<ImageGenerationSession | undefined> {
    return this.sessions.get(id);
  }

  async updateSession(id: number, updates: UpdateSession): Promise<ImageGenerationSession | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async getAllSessions(): Promise<ImageGenerationSession[]> {
    return Array.from(this.sessions.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }
}

export const storage = new MemStorage();
 
