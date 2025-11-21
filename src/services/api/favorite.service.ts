import { FirestoreService } from '../firebase/firestore.service';
import { COLLECTIONS } from '../firebase/config';
import { Favorite } from '../../models/Favorite';

export class FavoriteService {
  // Agregar a favoritos
  static async addFavorite(userId: string, quizId: string): Promise<void> {
    const favoriteId = `${userId}_${quizId}`;
    const favorite: Favorite = {
      id: favoriteId,
      userId,
      quizId,
      addedAt: new Date(),
    };

    await FirestoreService.create(COLLECTIONS.FAVORITES, favoriteId, favorite);
  }

  // Eliminar de favoritos
  static async removeFavorite(userId: string, quizId: string): Promise<void> {
    const favoriteId = `${userId}_${quizId}`;
    await FirestoreService.delete(COLLECTIONS.FAVORITES, favoriteId);
  }

  // Verificar si está en favoritos
  static async isFavorite(userId: string, quizId: string): Promise<boolean> {
    const favoriteId = `${userId}_${quizId}`;
    const favorite = await FirestoreService.get(
      COLLECTIONS.FAVORITES,
      favoriteId
    );
    return favorite !== null;
  }

  // Obtener favoritos de un usuario
  static async getUserFavorites(userId: string): Promise<Favorite[]> {
    return FirestoreService.query<Favorite>(
      COLLECTIONS.FAVORITES,
      [{ field: 'userId', operator: '==', value: userId }],
      { field: 'addedAt', direction: 'desc' }
    );
  }
}
