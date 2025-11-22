import { FirestoreService } from '../firebase/firestore.service';
import { COLLECTIONS } from '../firebase/config';
import { User } from '../../models/User';

export class UserService {
  // Crear usuario
  static async createUser(user: User): Promise<User> {
    await FirestoreService.create(COLLECTIONS.USERS, user.id, {
      ...user,
      createdAt: new Date(),
    });
    return user;
  }

  // Obtener usuario
  static async getUser(userId: string): Promise<User> {
    const user = await FirestoreService.get<User>(COLLECTIONS.USERS, userId);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  }

  // Actualizar usuario
  static async updateUser(
    userId: string,
    data: Partial<User>
  ): Promise<void> {
    await FirestoreService.update(COLLECTIONS.USERS, userId, data);
  }

  // Obtener o crear stats por defecto
  private static getDefaultStats(): User['stats'] {
    return {
      quizzesCreated: 0,
      quizzesTaken: 0,
      totalScore: 0,
      level: 1,
      achievements: [],
    };
  }

  // Actualizar estadísticas del usuario
  static async updateStats(
    userId: string,
    stats: Partial<User['stats']>
  ): Promise<void> {
    const user = await this.getUser(userId);

    // Asegurar que stats existe, si no, usar valores por defecto
    const currentStats = user.stats || this.getDefaultStats();

    await FirestoreService.update(COLLECTIONS.USERS, userId, {
      stats: { ...currentStats, ...stats },
    });
  }

  // Incrementar quizzes creados
  static async incrementQuizzesCreated(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    const currentStats = user.stats || this.getDefaultStats();

    await this.updateStats(userId, {
      quizzesCreated: currentStats.quizzesCreated + 1,
    });
  }

  // Decrementar quizzes creados (cuando se elimina un quiz)
  static async decrementQuizzesCreated(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    const currentStats = user.stats || this.getDefaultStats();

    // Asegurar que no sea negativo
    const newCount = Math.max(0, currentStats.quizzesCreated - 1);

    await this.updateStats(userId, {
      quizzesCreated: newCount,
    });
  }

  // Incrementar quizzes realizados
  static async incrementQuizzesTaken(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    const currentStats = user.stats || this.getDefaultStats();

    await this.updateStats(userId, {
      quizzesTaken: currentStats.quizzesTaken + 1,
    });
  }

  // Actualizar puntuación total
  static async updateTotalScore(userId: string, score: number): Promise<void> {
    const user = await this.getUser(userId);
    const currentStats = user.stats || this.getDefaultStats();

    await this.updateStats(userId, {
      totalScore: currentStats.totalScore + score,
    });
  }
}
