import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

/**
 * Verifica que Firebase esté correctamente configurado
 */
export const checkFirebaseConnection = async (): Promise<{
  success: boolean;
  details: {
    auth: boolean;
    firestore: boolean;
  };
  errors: string[];
}> => {
  const errors: string[] = [];
  const details = {
    auth: false,
    firestore: false,
  };

  try {
    // Verificar Auth
    console.log('🔵 Verificando Firebase Auth...');
    const authInstance = auth();
    details.auth = !!authInstance;
    console.log('✅ Firebase Auth inicializado correctamente');
  } catch (error: any) {
    console.error('❌ Error en Firebase Auth:', error.message);
    errors.push(`Auth: ${error.message}`);
  }

  try {
    // Verificar Firestore
    console.log('🔵 Verificando Firebase Firestore...');
    const firestoreInstance = firestore();
    details.firestore = !!firestoreInstance;
    console.log('✅ Firebase Firestore inicializado correctamente');
  } catch (error: any) {
    console.error('❌ Error en Firebase Firestore:', error.message);
    errors.push(`Firestore: ${error.message}`);
  }

  const success = details.auth && details.firestore && errors.length === 0;

  console.log('📊 Resultado de verificación Firebase:', {
    success,
    details,
    errors,
  });

  return { success, details, errors };
};
