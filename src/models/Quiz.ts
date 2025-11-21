import { QuizCategory } from './Category';

export enum QuizLevel {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export const LevelLabels: Record<QuizLevel, string> = {
  [QuizLevel.BASIC]: 'Básico',
  [QuizLevel.INTERMEDIATE]: 'Intermedio',
  [QuizLevel.ADVANCED]: 'Avanzado'
};

export interface Question {
  questionId: string;
  question: string;
  type: 'multiple' | 'boolean';
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
  imageURL?: string;
}

export interface QuizStats {
  totalAttempts: number;
  totalCompletions: number;
  averageScore: number;
  averageRating: number;
  totalRatings: number;
}

export interface QuizSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  allowRetake: boolean;
  timeLimit?: number;
}

export interface QuizCreator {
  userId: string;
  displayName: string;
  photoURL?: string | null;
}

export interface Quiz {
  quizId: string;
  title: string;
  description: string;
  category: string;
  level: string;
  isPublic: boolean;
  questions: Question[];
  stats: QuizStats;
  settings: QuizSettings;
  createdBy?: QuizCreator;
  createdAt?: any; // Firestore Timestamp or Date
  updatedAt?: any;
  publishedAt?: any;
  imageUrl?: string | null;
  tags?: string[];
}
