import { FirestoreService } from '../firebase/firestore.service';
import { COLLECTIONS } from '../firebase/config';
import { Quiz, QuizLevel } from '../../models/Quiz';
import { QuizCategory } from '../../models/Category';
import firestore from '@react-native-firebase/firestore';

export class QuizService {
  // Helper para remover campos undefined
  private static removeUndefinedFields(obj: any): any {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          cleaned[key] = this.removeUndefinedFields(obj[key]);
        } else if (Array.isArray(obj[key])) {
          cleaned[key] = obj[key].map((item: any) =>
            typeof item === 'object' && item !== null ? this.removeUndefinedFields(item) : item
          );
        } else {
          cleaned[key] = obj[key];
        }
      }
    });
    return cleaned;
  }

  // Crear quiz
  static async createQuiz(quiz: Omit<Quiz, 'quizId'>): Promise<Quiz> {
    const docRef = firestore().collection(COLLECTIONS.QUIZZES).doc();

    // Crear objeto sin campos undefined
    const cleanQuiz = this.removeUndefinedFields({
      ...quiz,
      quizId: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      stats: {
        totalAttempts: 0,
        totalCompletions: 0,
        averageScore: 0,
        averageRating: 0,
        totalRatings: 0,
      },
    });

    await FirestoreService.create(COLLECTIONS.QUIZZES, docRef.id, cleanQuiz);

    return cleanQuiz as Quiz;
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
    // Limpiar campos undefined antes de actualizar
    const cleanData = this.removeUndefinedFields({
      ...data,
      updatedAt: new Date(),
    });

    await FirestoreService.update(COLLECTIONS.QUIZZES, quizId, cleanData);
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
    try {
      // Intentar con índice compuesto (requiere índice en Firestore)
      const filters = [{ field: 'createdBy.userId', operator: '==', value: creatorId }];

      if (!includePrivate) {
        filters.push({ field: 'isPublic', operator: '==', value: true });
      }

      return await FirestoreService.query<Quiz>(
        COLLECTIONS.QUIZZES,
        filters as any,
        { field: 'createdAt', direction: 'desc' }
      );
    } catch (error: any) {
      // Si falla por falta de índice, usar consulta simple y ordenar localmente
      if (error.code === 'firestore/failed-precondition') {
        console.log('⚠️ Índice no encontrado, usando consulta simple y ordenando localmente');

        // Consulta simple (no requiere índice compuesto)
        const allUserQuizzes = await FirestoreService.query<Quiz>(
          COLLECTIONS.QUIZZES,
          [{ field: 'createdBy.userId', operator: '==', value: creatorId }]
          // Sin orderBy para evitar necesitar índice
        );

        // Filtrar privados si es necesario
        let filtered = allUserQuizzes;
        if (!includePrivate) {
          filtered = filtered.filter(q => q.isPublic);
        }

        // Ordenar por fecha localmente (más reciente primero)
        return filtered.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
      }

      // Si es otro error, lanzarlo
      throw error;
    }
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
