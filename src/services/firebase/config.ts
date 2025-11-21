import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

// Configuración de Firebase
// IMPORTANTE: Los archivos google-services.json y GoogleService-Info.plist
// ya contienen la configuración necesaria para React Native Firebase

export const firebaseAuth = auth();
export const firebaseFirestore = firestore();
export const firebaseStorage = storage();

// Referencias a colecciones
export const COLLECTIONS = {
  USERS: 'users',
  QUIZZES: 'quizzes',
  RESULTS: 'results',
  FAVORITES: 'favorites',
  RATINGS: 'ratings',
  PROGRESS: 'progress',
};
