import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import { Quiz, Question } from '../../models/Quiz';
import { Loading } from '../../components/common';
import { theme } from '../../styles/theme';
import { QuizStackParamList } from '../../navigation/types';

// Tipos para las props de navegación
type TakeQuizScreenProps = NativeStackScreenProps<QuizStackParamList, 'TakeQuiz'>;
// Tipo para almacenar las respuestas del usuario
type UserAnswers = {
  [questionId: string]: number; // { questionId: selectedOptionIndex }
};

export const TakeQuizScreen: React.FC<TakeQuizScreenProps> = ({ navigation, route }) => {
  const { quizId } = route.params;

  // Estados para manejar la lógica del quiz
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  // Efecto para cargar las preguntas del quiz desde Firestore
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const quizDoc = await firestore().collection('quizzes').doc(quizId).get();

        if (!quizDoc.exists) {
          throw new Error('Quiz no encontrado.');
        }

        const quizData = quizDoc.data() as Quiz;
        setQuiz(quizData);
        setQuestions(quizData.questions || []);
      } catch (error) {
        console.error("Error al cargar el quiz:", error);
        Alert.alert('Error', 'No se pudo cargar el quiz. Por favor, intenta de nuevo.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, navigation]);

  // Memoizamos la pregunta actual para evitar recálculos innecesarios
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  // --- Handlers ---

  const handleSelectAnswer = (questionId: string, selectedOptionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedOptionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinishQuiz = () => {
    // Confirmación antes de finalizar
    Alert.alert(
      "Finalizar Quiz",
      "¿Estás seguro de que quieres terminar y ver tus resultados?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Finalizar",
          onPress: () => {
            // Navegar a la pantalla de resultados pasando los datos necesarios
            navigation.replace('QuizResult', {
              quizId: quizId,
              userAnswers: userAnswers,
            });
          },
          style: "destructive"
        },
      ]
    );
  };


  // --- Renderizado ---

  if (loading || !quiz) {
    return <Loading fullscreen />;
  }

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Este quiz no tiene preguntas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header: Progreso y Título */}
      <View style={styles.header}>
        <Text style={styles.progressText}>
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </Text>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
      </View>

      {/* Cuerpo: Tarjeta de la pregunta y opciones */}
      <View style={styles.body}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              userAnswers[currentQuestion.questionId] === index && styles.optionSelected
            ]}
            onPress={() => handleSelectAnswer(currentQuestion.questionId, index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer: Botones de navegación */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <Text style={styles.navButtonText}>Anterior</Text>
        </TouchableOpacity>

        {currentQuestionIndex === questions.length - 1 ? (
          <TouchableOpacity style={[styles.navButton, styles.finishButton]} onPress={handleFinishQuiz}>
            <Text style={styles.finishButtonText}>Finalizar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.navButton} onPress={handleNextQuestion}>
            <Text style={styles.navButtonText}>Siguiente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  questionCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
    minHeight: 150,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '500',
    color: theme.colors.text,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  optionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#E9E7FD',
  },
  optionText: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  navButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    minWidth: 120,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
  },
  finishButton: {
    backgroundColor: '#10B981', // Verde brillante
    paddingVertical: 18,
    paddingHorizontal: 35,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: theme.colors.error,
  },
});

export default TakeQuizScreen;
