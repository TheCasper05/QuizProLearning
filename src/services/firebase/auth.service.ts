import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User } from '../../models/User';
import { UserService } from '../api/user.service';

// Configurar Google Sign In
GoogleSignin.configure({
  webClientId: '533427489714-k3l20va61dl8fbqffkf0cglmccits9nk.apps.googleusercontent.com',
});

export class AuthService {
  // Registro con email y contraseña
  static async registerWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      // Actualizar perfil
      await userCredential.user.updateProfile({ displayName });

      // Crear documento de usuario en Firestore
      const user = await UserService.createUser({
        id: userCredential.user.uid,
        email: userCredential.user.email!,
        displayName,
        photoURL: userCredential.user.photoURL || undefined,
        createdAt: new Date(),
        stats: {
          quizzesCreated: 0,
          quizzesTaken: 0,
          totalScore: 0,
          level: 1,
          achievements: [],
        },
      });

      return user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Login con email y contraseña
  static async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );

      const user = await UserService.getUser(userCredential.user.uid);
      return user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Login con Google
  static async loginWithGoogle(): Promise<User> {
    try {
      // Verificar si el servicio de Google Play está disponible
      await GoogleSignin.hasPlayServices();

      // Obtener el token de ID del usuario
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken;

      if (!idToken) {
        throw new Error('No se pudo obtener el token de Google');
      }

      // Crear credencial de Google
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Iniciar sesión con la credencial
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );

      // Verificar si el usuario ya existe en Firestore
      let user: User;
      try {
        user = await UserService.getUser(userCredential.user.uid);
      } catch {
        // Si no existe, crear nuevo usuario
        user = await UserService.createUser({
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName || 'Usuario',
          photoURL: userCredential.user.photoURL || undefined,
          createdAt: new Date(),
          stats: {
            quizzesCreated: 0,
            quizzesTaken: 0,
            totalScore: 0,
            level: 1,
            achievements: [],
          },
        });
      }

      return user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Recuperar contraseña
  static async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  // Cerrar sesión
  static async logout(): Promise<void> {
    // Intentar cerrar sesión de Google si está conectado
    try {
      await GoogleSignin.signOut();
      console.log('✅ Google SignOut exitoso');
    } catch (googleError) {
      // Si falla el signOut de Google, continuar con Firebase
      console.log('⚠️ Google SignOut error (puede ser normal si no está conectado):', googleError);
    }

    // Cerrar sesión de Firebase
    try {
      await auth().signOut();
      console.log('✅ Firebase SignOut exitoso');
    } catch (firebaseError: any) {
      // Si el error es que no hay usuario, lo ignoramos porque el objetivo ya se cumplió
      if (firebaseError.code === 'auth/no-current-user') {
        console.log('⚠️ No había usuario en Firebase (ya cerrado)');
      } else {
        console.error('❌ Error en Firebase SignOut:', firebaseError);
        throw firebaseError;
      }
    }
  }

  // Obtener usuario actual
  static getCurrentUser(): User | null {
    const firebaseUser = auth().currentUser;
    if (!firebaseUser) return null;

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || 'Usuario',
      photoURL: firebaseUser.photoURL || undefined,
      createdAt: new Date(),
      stats: {
        quizzesCreated: 0,
        quizzesTaken: 0,
        totalScore: 0,
        level: 1,
        achievements: [],
      },
    };
  }

  // Actualizar perfil
  static async updateProfile(
    displayName?: string,
    photoURL?: string | null
  ): Promise<void> {
    const user = auth().currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    try {
      // Determinar valores a actualizar
      const newDisplayName = displayName !== undefined ? displayName : user.displayName;
      const newPhotoURL = photoURL !== undefined ? photoURL : user.photoURL;

      console.log('🔵 Actualizando perfil de Firebase Auth...', {
        displayName: newDisplayName,
        photoURL: newPhotoURL,
      });

      await user.updateProfile({
        displayName: newDisplayName,
        photoURL: newPhotoURL,
      });

      console.log('✅ Firebase Auth actualizado');
      console.log('🔵 Actualizando Firestore...');

      // Construir objeto de actualización
      const firestoreUpdate: any = {
        displayName: newDisplayName || 'Usuario',
      };

      // Manejar photoURL: si es null, eliminarlo; si tiene valor, actualizarlo
      if (newPhotoURL === null) {
        // Eliminar el campo de Firestore
        firestoreUpdate.photoURL = firestore.FieldValue.delete();
      } else if (newPhotoURL) {
        // Actualizar con el nuevo valor
        firestoreUpdate.photoURL = newPhotoURL;
      }
      // Si newPhotoURL es undefined, no se incluye (no se modifica)

      await UserService.updateUser(user.uid, firestoreUpdate);

      console.log('✅ Firestore actualizado');
    } catch (error: any) {
      console.error('❌ Error en updateProfile:', error);
      throw error; // Re-lanzar el error original en lugar de uno genérico
    }
  }

  // Mensajes de error personalizados
  private static getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña es muy débil (mínimo 6 caracteres)',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/invalid-credential': 'Credenciales inválidas',
    };

    return errorMessages[errorCode] || 'Error de autenticación';
  }
}
