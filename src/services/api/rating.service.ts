import { FirestoreService } from '../firebase/firestore.service';
import { COLLECTIONS } from '../firebase/config';
import { Rating } from '../../models/Rating';
import { QuizService } from './quiz.service';

export class RatingService {
  // Calificar quiz
  static async rateQuiz(
    userId: string,
    quizId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    const ratingId = `${userId}_${quizId}`;
    const ratingData: Rating = {
      id: ratingId,
      userId,
      quizId,
      rating,
      comment,
      createdAt: new Date(),
    };

    // Guardar o actualizar calificación
    await FirestoreService.create(COLLECTIONS.RATINGS, ratingId, ratingData);

    // Actualizar estadísticas del quiz
    await this.updateQuizRating(quizId);
  }

  // Obtener calificación de un usuario
  static async getUserRating(
    userId: string,
    quizId: string
  ): Promise<Rating | null> {
    const ratingId = `${userId}_${quizId}`;
    return FirestoreService.get<Rating>(COLLECTIONS.RATINGS, ratingId);
  }

  // Obtener todas las calificaciones de un quiz
  static async getQuizRatings(quizId: string): Promise<Rating[]> {
    return FirestoreService.query<Rating>(COLLECTIONS.RATINGS, [
      { field: 'quizId', operator: '==', value: quizId },
    ]);
  }

  // Actualizar rating promedio del quiz
  private static async updateQuizRating(quizId: string): Promise<void> {
    const ratings = await this.getQuizRatings(quizId);
    const totalRatings = ratings.length;
    const averageRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    await FirestoreService.update(COLLECTIONS.QUIZZES, quizId, {
      'stats.ratings': totalRatings,
      'stats.averageRating': averageRating,
    });
  }
}
