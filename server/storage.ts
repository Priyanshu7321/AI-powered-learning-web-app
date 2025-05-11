import { 
  User, InsertUser, 
  UserProgress, InsertUserProgress,
  GameProgress, InsertGameProgress,
  SpeechAttempt, InsertSpeechAttempt
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User Progress operations
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  
  // Game Progress operations
  getGameProgress(userId: number, gameId: string): Promise<GameProgress | undefined>;
  getAllGameProgress(userId: number): Promise<GameProgress[]>;
  createGameProgress(progress: InsertGameProgress): Promise<GameProgress>;
  updateGameProgress(userId: number, gameId: string, progress: Partial<InsertGameProgress>): Promise<GameProgress>;
  
  // Speech Attempt operations
  getSpeechAttempt(id: number): Promise<SpeechAttempt | undefined>;
  getSpeechAttemptsByGame(userId: number, gameId: string): Promise<SpeechAttempt[]>;
  createSpeechAttempt(attempt: InsertSpeechAttempt): Promise<SpeechAttempt>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProgress: Map<number, UserProgress>;
  private gameProgress: Map<string, GameProgress>;
  private speechAttempts: Map<number, SpeechAttempt>;
  
  private userIdCounter: number;
  private progressIdCounter: number;
  private gameProgressIdCounter: number;
  private speechAttemptIdCounter: number;

  constructor() {
    this.users = new Map();
    this.userProgress = new Map();
    this.gameProgress = new Map();
    this.speechAttempts = new Map();
    
    this.userIdCounter = 1;
    this.progressIdCounter = 1;
    this.gameProgressIdCounter = 1;
    this.speechAttemptIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = {
      ...userData,
      id,
      age: userData.age ?? null,
      language: userData.language ?? null,
      parentEmail: userData.parentEmail ?? null,
      createdAt: new Date() as unknown as Date | null
    };
    this.users.set(id, user);
    return user;
  }

  // User Progress operations
  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return this.userProgress.get(userId);
  }

  async createUserProgress(progressData: InsertUserProgress): Promise<UserProgress> {
    const id = this.progressIdCounter++;
    const progress: UserProgress = {
      id,
      userId: progressData.userId,
      todayStars: progressData.todayStars ?? 0,
      streak: progressData.streak ?? 0,
      wordsLearned: progressData.wordsLearned ?? 0,
      gamesCompleted: progressData.gamesCompleted ?? 0,
      lastActive: new Date() as unknown as Date | null
    };
    this.userProgress.set(progressData.userId, progress);
    return progress;
  }

  async updateUserProgress(userId: number, progressData: Partial<InsertUserProgress>): Promise<UserProgress> {
    const existingProgress = this.userProgress.get(userId);
    if (!existingProgress) {
      throw new Error("User progress not found");
    }
    
    const updatedProgress: UserProgress = {
      ...existingProgress,
      ...progressData,
      lastActive: new Date() as unknown as Date | null
    };
    this.userProgress.set(userId, updatedProgress);
    return updatedProgress;
  }

  // Game Progress operations
  async getGameProgress(userId: number, gameId: string): Promise<GameProgress | undefined> {
    return this.gameProgress.get(`${userId}_${gameId}`);
  }

  async getAllGameProgress(userId: number): Promise<GameProgress[]> {
    return Array.from(this.gameProgress.values()).filter(progress => progress.userId === userId);
  }

  async createGameProgress(progressData: InsertGameProgress): Promise<GameProgress> {
    const id = this.gameProgressIdCounter++;
    const progress: GameProgress = {
      id,
      userId: progressData.userId,
      gameId: progressData.gameId,
      timesPlayed: progressData.timesPlayed ?? 0,
      timesCompleted: progressData.timesCompleted ?? 0,
      bestScore: progressData.bestScore ?? 0,
      lastPlayed: new Date() as unknown as Date | null,
      lastEvaluation: progressData.lastEvaluation ?? null,
      lastAttemptDate: progressData.lastAttemptDate ?? null
    };
    this.gameProgress.set(`${progressData.userId}_${progressData.gameId}`, progress);
    return progress;
  }

  async updateGameProgress(userId: number, gameId: string, progressData: Partial<InsertGameProgress>): Promise<GameProgress> {
    const key = `${userId}_${gameId}`;
    const existingProgress = this.gameProgress.get(key);
    if (!existingProgress) {
      throw new Error("Game progress not found");
    }
    
    const updatedProgress: GameProgress = {
      ...existingProgress,
      ...progressData,
      lastPlayed: new Date() as unknown as Date | null
    };
    this.gameProgress.set(key, updatedProgress);
    return updatedProgress;
  }

  // Speech Attempt operations
  async getSpeechAttempt(id: number): Promise<SpeechAttempt | undefined> {
    return this.speechAttempts.get(id);
  }

  async getSpeechAttemptsByGame(userId: number, gameId: string): Promise<SpeechAttempt[]> {
    return Array.from(this.speechAttempts.values())
      .filter(attempt => attempt.userId === userId && attempt.gameId === gameId);
  }

  async createSpeechAttempt(attemptData: InsertSpeechAttempt): Promise<SpeechAttempt> {
    const id = this.speechAttemptIdCounter++;
    const attempt: SpeechAttempt = {
      id,
      userId: attemptData.userId,
      gameId: attemptData.gameId,
      phraseId: attemptData.phraseId,
      targetPhrase: attemptData.targetPhrase,
      language: attemptData.language ?? null,
      userSpeech: attemptData.userSpeech ?? null,
      isCorrect: attemptData.isCorrect ?? null,
      createdAt: new Date() as unknown as Date | null
    };
    this.speechAttempts.set(id, attempt);
    return attempt;
  }
}

// Export the storage instance
export const storage = new MemStorage();
