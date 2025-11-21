import storage from '@react-native-firebase/storage';

export class StorageService {
  // Subir imagen
  static async uploadImage(
    uri: string,
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const reference = storage().ref(path);
    const task = reference.putFile(uri);

    // Monitorear progreso
    if (onProgress) {
      task.on('state_changed', (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      });
    }

    await task;

    // Obtener URL de descarga
    const downloadURL = await reference.getDownloadURL();
    return downloadURL;
  }

  // Eliminar archivo
  static async deleteFile(path: string): Promise<void> {
    const reference = storage().ref(path);
    await reference.delete();
  }

  // Obtener URL de descarga
  static async getDownloadURL(path: string): Promise<string> {
    const reference = storage().ref(path);
    return reference.getDownloadURL();
  }
}
