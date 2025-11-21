import { ResultService } from './result.service';
import { QuizService } from './quiz.service';
import { UserService } from './user.service';
import { QuizResult } from '../../models/Result';

export interface UserStatistics {
  totalQuizzesTaken: number;
  totalQuizzesCreated: number;
  averageScore: number;
  totalTimeSpent: number;
  bestScore: number;
  worstScore: number;
  categoryStats: Record<string, {
    quizzesTaken: number;
    averageScore: number;
  }>;
}

export class StatisticsService {
  // Obtener estadísticas del usuario
  static async getUserStatistics(userId: string): Promise<UserStatistics> {
    const results = await ResultService.getUserResults(userId);
    const user = await UserService.getUser(userId);

    if (results.length === 0) {
      return {
        totalQuizzesTaken: 0,
        totalQuizzesCreated: user.stats.quizzesCreated,
        averageScore: 0,
        totalTimeSpent: 0,
        bestScore: 0,
        worstScore: 0,
        categoryStats: {},
      };
    }

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = totalScore / results.length;
    const totalTimeSpent = results.reduce((sum, r) => sum + r.timeSpent, 0);
    const bestScore = Math.max(...results.map((r) => r.score));
    const worstScore = Math.min(...results.map((r) => r.score));

    // Estadísticas por categoría
    const categoryStats: Record<string, {
      quizzesTaken: number;
      averageScore: number;
    }> = {};

    for (const result of results) {
      const quiz = await QuizService.getQuiz(result.quizId);
      const category = quiz.category;

      if (!categoryStats[category]) {
        categoryStats[category] = {
          quizzesTaken: 0,
          averageScore: 0,
        };
      }

      categoryStats[category].quizzesTaken++;
      categoryStats[category].averageScore =
        (categoryStats[category].averageScore *
          (categoryStats[category].quizzesTaken - 1) +
          result.score) /
        categoryStats[category].quizzesTaken;
    }

    return {
      totalQuizzesTaken: results.length,
      totalQuizzesCreated: user.stats.quizzesCreated,
      averageScore,
      totalTimeSpent,
      bestScore,
      worstScore,
      categoryStats,
    };
  }

  // Obtener estadísticas de un quiz específico
  static async getQuizStatistics(quizId: string) {
    const results = await ResultService.getQuizResults(quizId);
    const quiz = await QuizService.getQuiz(quizId);

    if (results.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        completionRate: 0,
        averageTimeSpent: 0,
      };
    }

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = totalScore / results.length;
    const bestScore = Math.max(...results.map((r) => r.score));
    const worstScore = Math.min(...results.map((r) => r.score));
    const averageTimeSpent =
      results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length;

    return {
      totalAttempts: quiz.stats.totalAttempts,
      averageScore,
      bestScore,
      worstScore,
      completionRate: quiz.stats.completionRate,
      averageTimeSpent,
    };
  }
}
