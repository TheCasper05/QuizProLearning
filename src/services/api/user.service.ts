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

  // Actualizar estadísticas del usuario
  static async updateStats(
    userId: string,
    stats: Partial<User['stats']>
  ): Promise<void> {
    const user = await this.getUser(userId);
    await FirestoreService.update(COLLECTIONS.USERS, userId, {
      stats: { ...user.stats, ...stats },
    });
  }

  // Incrementar quizzes creados
  static async incrementQuizzesCreated(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    await this.updateStats(userId, {
      quizzesCreated: user.stats.quizzesCreated + 1,
    });
  }

  // Incrementar quizzes realizados
  static async incrementQuizzesTaken(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    await this.updateStats(userId, {
      quizzesTaken: user.stats.quizzesTaken + 1,
    });
  }

  // Actualizar puntuación total
  static async updateTotalScore(userId: string, score: number): Promise<void> {
    const user = await this.getUser(userId);
    await this.updateStats(userId, {
      totalScore: user.stats.totalScore + score,
    });
  }
}
