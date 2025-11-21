export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  stats: UserStats;
}

export interface UserStats {
  quizzesCreated: number;
  quizzesTaken: number;
  totalScore: number;
  level: number;
  achievements: string[];
}
