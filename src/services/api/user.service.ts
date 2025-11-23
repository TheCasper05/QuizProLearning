import { FirestoreService } from '../firebase/firestore.service';
import { COLLECTIONS } from '../firebase/config';
import { User } from '../../models/User';

export class UserService {
  // Crear usuario
  static async createUser(user: User): Promise<User> {
    try {
      console.log('🔵 UserService.createUser - Iniciando creación:', user.id);

      const userData = {
        ...user,
        createdAt: new Date(),
      };

      await FirestoreService.create(COLLECTIONS.USERS, user.id, userData);
      console.log('✅ UserService.createUser - Usuario creado exitosamente');

      return user;
    } catch (error: any) {
      console.error('❌ UserService.createUser - Error:', error);
      throw error;
    }
  }

  // Obtener usuario
  static async getUser(userId: string): Promise<User> {
    try {
      console.log('🔵 UserService.getUser - Obteniendo usuario:', userId);

      const user = await FirestoreService.get<User>(COLLECTIONS.USERS, userId);

      if (!user) {
        console.error('❌ UserService.getUser - Usuario no encontrado:', userId);
        throw new Error('Usuario no encontrado');
      }

      console.log('✅ UserService.getUser - Usuario obtenido:', user.displayName);
      return user;
    } catch (error: any) {
      console.error('❌ UserService.getUser - Error:', error);
      throw error;
    }
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
