import firestore from '@react-native-firebase/firestore';
import { COLLECTIONS } from '../src/services/firebase/config';
import { Quiz, QuizLevel } from '../src/models/Quiz';
import { QuizCategory } from '../src/models/Category';

const userId = 'TzCtJNO95vdFdaDTkLtJN40G9jy1';
const displayName = 'Usuario'; // Ajusta según el nombre que quieras

const sampleQuizzes = [
  {
    title: 'Fútbol Mundial',
    description: 'Pon a prueba tus conocimientos sobre la historia del fútbol mundial y sus grandes momentos.',
    category: 'sports' as QuizCategory,
    level: 'intermediate' as QuizLevel,
    isPublic: true,
    timeLimit: 300,
    questions: [
      {
        id: '1',
        question: '¿Qué país ha ganado más Copas del Mundo de fútbol?',
        options: ['Alemania', 'Brasil', 'Argentina', 'Italia'],
        correctAnswer: 1,
        explanation: 'Brasil ha ganado 5 Copas del Mundo (1958, 1962, 1970, 1994, 2002).',
        points: 10,
      },
      {
        id: '2',
        question: '¿En qué año se celebró el primer Mundial de fútbol?',
        options: ['1926', '1930', '1934', '1938'],
        correctAnswer: 1,
        explanation: 'El primer Mundial de fútbol se celebró en Uruguay en 1930.',
        points: 10,
      },
      {
        id: '3',
        question: '¿Quién es el máximo goleador en la historia de los Mundiales?',
        options: ['Pelé', 'Miroslav Klose', 'Ronaldo', 'Diego Maradona'],
        correctAnswer: 1,
        explanation: 'Miroslav Klose de Alemania marcó 16 goles en Copas del Mundo.',
        points: 10,
      },
      {
        id: '4',
        question: '¿Qué país organizó el Mundial de 2018?',
        options: ['Brasil', 'Rusia', 'Qatar', 'Sudáfrica'],
        correctAnswer: 1,
        explanation: 'Rusia fue el país anfitrión del Mundial de 2018.',
        points: 10,
      },
      {
        id: '5',
        question: '¿Cuántos jugadores hay en cada equipo de fútbol en el campo?',
        options: ['9', '10', '11', '12'],
        correctAnswer: 2,
        explanation: 'Cada equipo tiene 11 jugadores en el campo, incluyendo el portero.',
        points: 10,
      },
    ],
  },
  {
    title: 'Matemáticas Básicas',
    description: 'Repasa conceptos fundamentales de matemáticas con este quiz interactivo.',
    category: 'math' as QuizCategory,
    level: 'beginner' as QuizLevel,
    isPublic: true,
    timeLimit: 240,
    questions: [
      {
        id: '1',
        question: '¿Cuánto es 7 × 8?',
        options: ['54', '56', '58', '64'],
        correctAnswer: 1,
        explanation: '7 multiplicado por 8 es igual a 56.',
        points: 10,
      },
      {
        id: '2',
        question: '¿Cuál es el resultado de 144 ÷ 12?',
        options: ['10', '11', '12', '13'],
        correctAnswer: 2,
        explanation: '144 dividido entre 12 es igual a 12.',
        points: 10,
      },
      {
        id: '3',
        question: '¿Qué número es primo?',
        options: ['15', '21', '23', '27'],
        correctAnswer: 2,
        explanation: '23 es un número primo porque solo es divisible por 1 y por sí mismo.',
        points: 10,
      },
      {
        id: '4',
        question: '¿Cuánto es 25% de 200?',
        options: ['25', '40', '50', '75'],
        correctAnswer: 2,
        explanation: 'El 25% de 200 es 50 (200 × 0.25 = 50).',
        points: 10,
      },
      {
        id: '5',
        question: '¿Cuál es el área de un cuadrado con lado de 6 cm?',
        options: ['24 cm²', '30 cm²', '36 cm²', '42 cm²'],
        correctAnswer: 2,
        explanation: 'El área de un cuadrado es lado × lado: 6 × 6 = 36 cm².',
        points: 10,
      },
    ],
  },
  {
    title: 'Baloncesto NBA',
    description: 'Demuestra cuánto sabes sobre la NBA y sus leyendas.',
    category: 'sports' as QuizCategory,
    level: 'intermediate' as QuizLevel,
    isPublic: true,
    timeLimit: 300,
    questions: [
      {
        id: '1',
        question: '¿Quién tiene el récord de más puntos anotados en un solo partido de NBA?',
        options: ['Michael Jordan', 'Kobe Bryant', 'Wilt Chamberlain', 'LeBron James'],
        correctAnswer: 2,
        explanation: 'Wilt Chamberlain anotó 100 puntos en un partido en 1962.',
        points: 10,
      },
      {
        id: '2',
        question: '¿Cuántos campeonatos ganó Michael Jordan con los Chicago Bulls?',
        options: ['4', '5', '6', '7'],
        correctAnswer: 2,
        explanation: 'Michael Jordan ganó 6 campeonatos de la NBA con los Bulls.',
        points: 10,
      },
      {
        id: '3',
        question: '¿Cuántos jugadores de cada equipo están en la cancha al mismo tiempo?',
        options: ['4', '5', '6', '7'],
        correctAnswer: 1,
        explanation: 'Cada equipo tiene 5 jugadores en la cancha simultáneamente.',
        points: 10,
      },
      {
        id: '4',
        question: '¿Qué equipo ha ganado más campeonatos de la NBA?',
        options: ['Chicago Bulls', 'Los Angeles Lakers', 'Boston Celtics', 'Golden State Warriors'],
        correctAnswer: 2,
        explanation: 'Los Boston Celtics han ganado 17 campeonatos de la NBA.',
        points: 10,
      },
      {
        id: '5',
        question: '¿Cuánto vale un tiro libre en baloncesto?',
        options: ['1 punto', '2 puntos', '3 puntos', 'Depende de la distancia'],
        correctAnswer: 0,
        explanation: 'Un tiro libre siempre vale 1 punto.',
        points: 10,
      },
    ],
  },
  {
    title: 'Álgebra Intermedia',
    description: 'Resuelve problemas de álgebra y ecuaciones de nivel intermedio.',
    category: 'math' as QuizCategory,
    level: 'intermediate' as QuizLevel,
    isPublic: true,
    timeLimit: 360,
    questions: [
      {
        id: '1',
        question: 'Si 2x + 5 = 15, ¿cuál es el valor de x?',
        options: ['3', '5', '7', '10'],
        correctAnswer: 1,
        explanation: '2x + 5 = 15 → 2x = 10 → x = 5',
        points: 10,
      },
      {
        id: '2',
        question: '¿Cuál es el resultado de (x + 3)²?',
        options: ['x² + 6', 'x² + 9', 'x² + 6x + 9', 'x² + 3x + 9'],
        correctAnswer: 2,
        explanation: '(x + 3)² = x² + 2(3)(x) + 9 = x² + 6x + 9',
        points: 10,
      },
      {
        id: '3',
        question: 'Si x² = 64, ¿cuáles son los valores posibles de x?',
        options: ['Solo 8', 'Solo -8', '8 y -8', 'No tiene solución'],
        correctAnswer: 2,
        explanation: 'x² = 64 tiene dos soluciones: x = 8 y x = -8',
        points: 10,
      },
      {
        id: '4',
        question: '¿Cuál es la pendiente de la recta y = 3x - 2?',
        options: ['-2', '2', '3', '-3'],
        correctAnswer: 2,
        explanation: 'En la forma y = mx + b, m es la pendiente. Aquí m = 3.',
        points: 10,
      },
      {
        id: '5',
        question: 'Si 3(x - 4) = 12, ¿cuál es el valor de x?',
        options: ['4', '6', '8', '12'],
        correctAnswer: 2,
        explanation: '3(x - 4) = 12 → x - 4 = 4 → x = 8',
        points: 10,
      },
    ],
  },
  {
    title: 'Historia del Tenis',
    description: 'Conoce más sobre los grandes momentos y figuras del tenis mundial.',
    category: 'sports' as QuizCategory,
    level: 'beginner' as QuizLevel,
    isPublic: true,
    timeLimit: 240,
    questions: [
      {
        id: '1',
        question: '¿Cuántos Grand Slams existen en el tenis profesional?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 2,
        explanation: 'Los 4 Grand Slams son: Australian Open, Roland Garros, Wimbledon y US Open.',
        points: 10,
      },
      {
        id: '2',
        question: '¿En qué superficie se juega Wimbledon?',
        options: ['Arcilla', 'Césped', 'Cemento', 'Tierra batida'],
        correctAnswer: 1,
        explanation: 'Wimbledon se juega en canchas de césped.',
        points: 10,
      },
      {
        id: '3',
        question: '¿Quién tiene el récord de más títulos de Grand Slam en individual masculino?',
        options: ['Roger Federer', 'Rafael Nadal', 'Novak Djokovic', 'Pete Sampras'],
        correctAnswer: 2,
        explanation: 'Novak Djokovic tiene el récord con 24 títulos de Grand Slam.',
        points: 10,
      },
      {
        id: '4',
        question: '¿Cuántos puntos se necesitan para ganar un juego en tenis (sin llegar a deuce)?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
        explanation: 'Se necesitan 4 puntos: 15, 30, 40 y juego.',
        points: 10,
      },
      {
        id: '5',
        question: '¿Qué torneo de Grand Slam se juega en arcilla?',
        options: ['Wimbledon', 'US Open', 'Roland Garros', 'Australian Open'],
        correctAnswer: 2,
        explanation: 'Roland Garros (French Open) se juega en canchas de arcilla.',
        points: 10,
      },
    ],
  },
];

async function createQuizzes() {
  try {
    console.log('🔵 Iniciando creación de quizzes de ejemplo...');

    for (const quizData of sampleQuizzes) {
      const docRef = firestore().collection(COLLECTIONS.QUIZZES).doc();

      const quiz: Quiz = {
        quizId: docRef.id,
        title: quizData.title,
        description: quizData.description,
        category: quizData.category,
        level: quizData.level,
        questions: quizData.questions,
        createdBy: {
          userId,
          displayName,
        },
        isPublic: quizData.isPublic,
        timeLimit: quizData.timeLimit,
        stats: {
          totalAttempts: 0,
          totalCompletions: 0,
          averageScore: 0,
          averageRating: 0,
          totalRatings: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await docRef.set(quiz);
      console.log(`✅ Quiz creado: ${quiz.title} (ID: ${quiz.quizId})`);
    }

    console.log('✅ Todos los quizzes fueron creados exitosamente');
  } catch (error) {
    console.error('❌ Error al crear quizzes:', error);
  }
}

// Ejecutar la función
createQuizzes();
