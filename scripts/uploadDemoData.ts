import firestore from '@react-native-firebase/firestore';
import categoriesData from '../demo-data/categories.json';
import quizzesData from '../demo-data/quizzes.json';

/**
 * Script para subir datos de demostración a Firestore
 *
 * IMPORTANTE: Ejecuta este script desde la app una sola vez
 */

export const uploadCategories = async () => {
  console.log('📦 Subiendo categorías a Firestore...');

  try {
    const batch = firestore().batch();

    categoriesData.forEach((category) => {
      const docRef = firestore().collection('categories').doc(category.categoryId);
      batch.set(docRef, {
        ...category,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log('✅ Categorías subidas exitosamente:', categoriesData.length);
    return { success: true, count: categoriesData.length };
  } catch (error) {
    console.error('❌ Error subiendo categorías:', error);
    throw error;
  }
};

// Función para limpiar valores undefined
const cleanData = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(cleanData);
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      if (value !== undefined) {
        acc[key] = cleanData(value);
      }
      return acc;
    }, {} as any);
  }

  return obj;
};

export const uploadQuizzes = async (userId: string, userName: string) => {
  console.log('📦 Subiendo quizzes a Firestore...');

  try {
    const batch = firestore().batch();

    quizzesData.forEach((quiz) => {
      const docRef = firestore().collection('quizzes').doc(quiz.quizId);

      // Limpiar datos y agregar campos requeridos
      const cleanQuiz = cleanData({
        ...quiz,
        imageUrl: quiz.imageUrl || null,
        createdBy: {
          userId: userId,
          displayName: userName,
          photoURL: null,
        },
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        publishedAt: firestore.FieldValue.serverTimestamp(),
      });

      batch.set(docRef, cleanQuiz);
    });

    await batch.commit();
    console.log('✅ Quizzes subidos exitosamente:', quizzesData.length);
    return { success: true, count: quizzesData.length };
  } catch (error) {
    console.error('❌ Error subiendo quizzes:', error);
    throw error;
  }
};

export const uploadAllDemoData = async (userId: string, userName: string) => {
  console.log('🚀 Iniciando carga de datos de demostración...\n');

  try {
    // Subir categorías
    const categoriesResult = await uploadCategories();
    console.log(`✅ ${categoriesResult.count} categorías subidas\n`);

    // Subir quizzes
    const quizzesResult = await uploadQuizzes(userId, userName);
    console.log(`✅ ${quizzesResult.count} quizzes subidos\n`);

    console.log('🎉 ¡Todos los datos se subieron exitosamente!');
    console.log(`\nResumen:`);
    console.log(`- Categorías: ${categoriesResult.count}`);
    console.log(`- Quizzes: ${quizzesResult.count}`);
    console.log(`- Total: ${categoriesResult.count + quizzesResult.count} documentos`);

    return {
      success: true,
      categories: categoriesResult.count,
      quizzes: quizzesResult.count,
    };
  } catch (error) {
    console.error('❌ Error en la carga de datos:', error);
    throw error;
  }
};

// Función para verificar si ya existen datos
export const checkExistingData = async () => {
  try {
    const categoriesSnapshot = await firestore().collection('categories').get();
    const quizzesSnapshot = await firestore().collection('quizzes').get();

    return {
      categoriesCount: categoriesSnapshot.size,
      quizzesCount: quizzesSnapshot.size,
      hasData: categoriesSnapshot.size > 0 || quizzesSnapshot.size > 0,
    };
  } catch (error) {
    console.error('❌ Error verificando datos existentes:', error);
    throw error;
  }
};
