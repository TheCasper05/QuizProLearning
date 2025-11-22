import { FirestoreService } from '../firebase/firestore.service';
import { COLLECTIONS } from '../firebase/config';
import { QuizResult } from '../../models/Result';
import firestore from '@react-native-firebase/firestore';

export class ResultService {
  // Guardar resultado
  static async saveResult(
    result: Omit<QuizResult, 'id'>
  ): Promise<QuizResult> {
    const docRef = firestore().collection(COLLECTIONS.RESULTS).doc();

    // Convertir Date a Timestamp de Firestore
    const resultData = {
      ...result,
      id: docRef.id,
      completedAt: firestore.Timestamp.now(),
    };

    await FirestoreService.create(COLLECTIONS.RESULTS, docRef.id, resultData);

    // Retornar con Date para compatibilidad con el modelo
    return {
      ...resultData,
      completedAt: new Date(),
    } as QuizResult;
  }

  // Obtener resultados de un usuario
  static async getUserResults(userId: string): Promise<QuizResult[]> {
    return FirestoreService.query<QuizResult>(
      COLLECTIONS.RESULTS,
      [{ field: 'userId', operator: '==', value: userId }],
      { field: 'completedAt', direction: 'desc' }
    );
  }

  // Obtener resultados de un quiz específico
  static async getQuizResults(quizId: string): Promise<QuizResult[]> {
    return FirestoreService.query<QuizResult>(
      COLLECTIONS.RESULTS,
      [{ field: 'quizId', operator: '==', value: quizId }],
      { field: 'completedAt', direction: 'desc' }
    );
  }

  // Obtener resultados de un usuario en un quiz específico
  static async getUserQuizResults(
    userId: string,
    quizId: string
  ): Promise<QuizResult[]> {
    return FirestoreService.query<QuizResult>(
      COLLECTIONS.RESULTS,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'quizId', operator: '==', value: quizId },
      ],
      { field: 'completedAt', direction: 'desc' }
    );
  }

  // Obtener mejor resultado de un usuario en un quiz
  static async getBestResult(
    userId: string,
    quizId: string
  ): Promise<QuizResult | null> {
    const results = await this.getUserQuizResults(userId, quizId);
    if (results.length === 0) return null;

    return results.reduce((best, current) =>
      current.score > best.score ? current : best
    );
  }
}
