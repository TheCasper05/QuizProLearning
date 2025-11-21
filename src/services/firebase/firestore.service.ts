import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS } from './config';

export class FirestoreService {
  // Crear documento
  static async create<T>(
    collection: string,
    id: string,
    data: T
  ): Promise<void> {
    await firestore().collection(collection).doc(id).set(data);
  }

  // Obtener documento
  static async get<T>(collection: string, id: string): Promise<T | null> {
    const doc = await firestore().collection(collection).doc(id).get();

    if (!doc.exists) return null;

    return { id: doc.id, ...doc.data() } as T;
  }

  // Actualizar documento
  static async update<T>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    await firestore().collection(collection).doc(id).update(data);
  }

  // Eliminar documento
  static async delete(collection: string, id: string): Promise<void> {
    await firestore().collection(collection).doc(id).delete();
  }

  // Obtener todos los documentos de una colección
  static async getAll<T>(collection: string): Promise<T[]> {
    const snapshot = await firestore().collection(collection).get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  // Query con filtros
  static async query<T>(
    collection: string,
    filters: Array<{
      field: string;
      operator: firestore.WhereFilterOp;
      value: any;
    }>,
    orderBy?: { field: string; direction: 'asc' | 'desc' },
    limit?: number
  ): Promise<T[]> {
    let query: firestore.Query = firestore().collection(collection);

    // Aplicar filtros
    filters.forEach((filter) => {
      query = query.where(filter.field, filter.operator, filter.value);
    });

    // Aplicar ordenamiento
    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.direction);
    }

    // Aplicar límite
    if (limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  // Escuchar cambios en tiempo real
  static listenToDocument<T>(
    collection: string,
    id: string,
    callback: (data: T | null) => void
  ): () => void {
    return firestore()
      .collection(collection)
      .doc(id)
      .onSnapshot((doc) => {
        if (doc.exists) {
          callback({ id: doc.id, ...doc.data() } as T);
        } else {
          callback(null);
        }
      });
  }

  // Escuchar cambios en colección
  static listenToCollection<T>(
    collection: string,
    callback: (data: T[]) => void
  ): () => void {
    return firestore()
      .collection(collection)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        callback(data);
      });
  }

  // Transacción
  static async runTransaction<T>(
    updateFunction: (transaction: firestore.Transaction) => Promise<T>
  ): Promise<T> {
    return firestore().runTransaction(updateFunction);
  }

  // Batch write
  static createBatch(): firestore.WriteBatch {
    return firestore().batch();
  }
}
