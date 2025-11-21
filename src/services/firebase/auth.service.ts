import auth from '@react-native-firebase/auth';
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
      const { idToken } = await GoogleSignin.signIn();

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
    try {
      // Cerrar sesión de Google si está conectado
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }

      // Cerrar sesión de Firebase
      await auth().signOut();
    } catch (error: any) {
      throw new Error('Error al cerrar sesión');
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
    photoURL?: string
  ): Promise<void> {
    const user = auth().currentUser;
    if (!user) throw new Error('No hay usuario autenticado');

    try {
      await user.updateProfile({
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL,
      });

      // Actualizar en Firestore
      await UserService.updateUser(user.uid, {
        displayName: displayName || user.displayName || 'Usuario',
        photoURL: photoURL || user.photoURL || undefined,
      });
    } catch (error) {
      throw new Error('Error al actualizar perfil');
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
