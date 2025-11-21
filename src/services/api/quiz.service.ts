import { FirestoreService } from '../firebase/firestore.service';
import { COLLECTIONS } from '../firebase/config';
import { Quiz, QuizCategory, QuizLevel } from '../../models/Quiz';
import firestore from '@react-native-firebase/firestore';

export class QuizService {
  // Crear quiz
  static async createQuiz(quiz: Omit<Quiz, 'id'>): Promise<Quiz> {
    const docRef = firestore().collection(COLLECTIONS.QUIZZES).doc();
    const newQuiz: Quiz = {
      ...quiz,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalAttempts: 0,
        averageScore: 0,
        ratings: 0,
        averageRating: 0,
        completionRate: 0,
      },
    };

    await FirestoreService.create(COLLECTIONS.QUIZZES, newQuiz.id, newQuiz);
    return newQuiz;
  }

  // Obtener quiz por ID
  static async getQuiz(quizId: string): Promise<Quiz> {
    const quiz = await FirestoreService.get<Quiz>(COLLECTIONS.QUIZZES, quizId);
    if (!quiz) throw new Error('Quiz no encontrado');
    return quiz;
  }

  // Actualizar quiz
  static async updateQuiz(
    quizId: string,
    data: Partial<Quiz>
  ): Promise<void> {
    await FirestoreService.update(COLLECTIONS.QUIZZES, quizId, {
      ...data,
      updatedAt: new Date(),
    });
  }

  // Eliminar quiz
  static async deleteQuiz(quizId: string): Promise<void> {
    await FirestoreService.delete(COLLECTIONS.QUIZZES, quizId);
  }

  // Obtener quizzes públicos
  static async getPublicQuizzes(limit: number = 20): Promise<Quiz[]> {
    return FirestoreService.query<Quiz>(
      COLLECTIONS.QUIZZES,
      [{ field: 'isPublic', operator: '==', value: true }],
      { field: 'createdAt', direction: 'desc' },
      limit
    );
  }

  // Obtener quizzes por categoría
  static async getQuizzesByCategory(
    category: QuizCategory,
    limit: number = 20
  ): Promise<Quiz[]> {
    return FirestoreService.query<Quiz>(
      COLLECTIONS.QUIZZES,
      [
        { field: 'isPublic', operator: '==', value: true },
        { field: 'category', operator: '==', value: category },
      ],
      { field: 'createdAt', direction: 'desc' },
      limit
    );
  }

  // Obtener quizzes por nivel
  static async getQuizzesByLevel(
    level: QuizLevel,
    limit: number = 20
  ): Promise<Quiz[]> {
    return FirestoreService.query<Quiz>(
      COLLECTIONS.QUIZZES,
      [
        { field: 'isPublic', operator: '==', value: true },
        { field: 'level', operator: '==', value: level },
      ],
      { field: 'createdAt', direction: 'desc' },
      limit
    );
  }

  // Obtener quizzes por creador
  static async getQuizzesByCreator(
    creatorId: string,
    includePrivate: boolean = false
  ): Promise<Quiz[]> {
    const filters = [{ field: 'creatorId', operator: '==', value: creatorId }];

    if (!includePrivate) {
      filters.push({ field: 'isPublic', operator: '==', value: true });
    }

    return FirestoreService.query<Quiz>(
      COLLECTIONS.QUIZZES,
      filters as any,
      { field: 'createdAt', direction: 'desc' }
    );
  }

  // Buscar quizzes
  static async searchQuizzes(searchTerm: string): Promise<Quiz[]> {
    // Firestore no soporta búsqueda de texto completo nativamente
    // Esta es una solución simple que busca por título
    const allQuizzes = await this.getPublicQuizzes(100);
    return allQuizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Obtener quizzes recomendados
  static async getRecommendedQuizzes(limit: number = 10): Promise<Quiz[]> {
    return FirestoreService.query<Quiz>(
      COLLECTIONS.QUIZZES,
      [{ field: 'isPublic', operator: '==', value: true }],
      { field: 'stats.averageRating', direction: 'desc' },
      limit
    );
  }

  // Obtener quizzes populares
  static async getPopularQuizzes(limit: number = 10): Promise<Quiz[]> {
    return FirestoreService.query<Quiz>(
      COLLECTIONS.QUIZZES,
      [{ field: 'isPublic', operator: '==', value: true }],
      { field: 'stats.totalAttempts', direction: 'desc' },
      limit
    );
  }

  // Incrementar intentos de quiz
  static async incrementAttempts(quizId: string): Promise<void> {
    const quiz = await this.getQuiz(quizId);
    await FirestoreService.update(COLLECTIONS.QUIZZES, quizId, {
      'stats.totalAttempts': quiz.stats.totalAttempts + 1,
    });
  }

  // Actualizar calificación promedio
  static async updateAverageScore(
    quizId: string,
    newScore: number
  ): Promise<void> {
    const quiz = await this.getQuiz(quizId);
    const totalAttempts = quiz.stats.totalAttempts;
    const currentAverage = quiz.stats.averageScore;
    const newAverage =
      (currentAverage * totalAttempts + newScore) / (totalAttempts + 1);

    await FirestoreService.update(COLLECTIONS.QUIZZES, quizId, {
      'stats.averageScore': newAverage,
    });
  }
}
