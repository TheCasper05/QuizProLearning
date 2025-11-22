import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Quiz, Question } from '../../models/Quiz';
import { QuizResult } from '../../models/Result';
import { ResultService } from '../../services/api/result.service';
import { UserService } from '../../services/api/user.service';
import { Loading } from '../../components/common';
import { theme } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';

// Type alias para FirebaseFirestoreTypes.Timestamp
type FirestoreTimestamp = ReturnType<typeof firestore.Timestamp.now>;

type QuizResultScreenProps = {
  navigation: any;
  route: {
    params: {
      quizId: string;
      userAnswers: { [questionId: string]: number };
    };
  };
};

export const QuizResultScreen: React.FC<QuizResultScreenProps> = ({
  navigation,
  route,
}) => {
  const { quizId, userAnswers } = route.params;
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  // Cargar quiz y calcular resultados
  useEffect(() => {
    const calculateResults = async () => {
      try {
        setLoading(true);

        // Obtener el quiz de Firestore
        const quizDoc = await firestore().collection('quizzes').doc(quizId).get();

        if (!quizDoc.exists) {
          throw new Error('Quiz no encontrado');
        }

        const quizData = quizDoc.data() as Quiz;
        setQuiz(quizData);

        // Calcular resultados
        const questions = quizData.questions || [];
        let correctCount = 0;
        let incorrectCount = 0;

        const userAnswerDetails = questions.map((question: Question) => {
          const userAnswerIndex = userAnswers[question.questionId];
          const isCorrect = userAnswerIndex === question.correctAnswer;

          if (isCorrect) {
            correctCount++;
          } else {
            incorrectCount++;
          }

          return {
            questionId: question.questionId,
            selectedOptionId: userAnswerIndex?.toString() || '',
            isCorrect,
            timeSpent: 0, // Por ahora no medimos tiempo
          };
        });

        const totalQuestions = questions.length;
        const scorePercentage = totalQuestions > 0
          ? Math.round((correctCount / totalQuestions) * 100)
          : 0;

        const calculatedResult: QuizResult = {
          id: '', // Se asignará al guardar
          userId: user?.id || '',
          quizId: quizId,
          quizTitle: quizData.title,
          score: scorePercentage,
          totalQuestions,
          correctAnswers: correctCount,
          incorrectAnswers: incorrectCount,
          timeSpent: 0,
          answers: userAnswerDetails,
          completedAt: new Date(),
        };

        setResult(calculatedResult);

        // Guardar resultado en Firestore automáticamente
        if (user?.id) {
          await saveResultToFirestore(calculatedResult);
        }
      } catch (error) {
        console.error('Error al calcular resultados:', error);
        Alert.alert('Error', 'No se pudieron calcular los resultados.');
      } finally {
        setLoading(false);
      }
    };

    calculateResults();
  }, [quizId, userAnswers, user?.id]);

  const saveResultToFirestore = async (resultData: QuizResult) => {
    try {
      setSaving(true);
      console.log('🔵 Guardando resultado...', {
        userId: user?.id,
        quizId: resultData.quizId,
        score: resultData.score
      });

      // Guardar resultado
      const savedResult = await ResultService.saveResult(resultData);
      console.log('✅ Resultado guardado en Firestore:', savedResult.id);

      // Actualizar estadísticas del usuario
      if (user?.id) {
        console.log('🔵 Actualizando estadísticas del usuario...');
        await UserService.incrementQuizzesTaken(user.id);
        console.log('✅ QuizzesTaken incrementado');

        await UserService.updateTotalScore(user.id, resultData.score);
        console.log('✅ TotalScore actualizado');
      }

      console.log('✅ Guardado completo exitoso');
    } catch (error: any) {
      console.error('❌ Error al guardar resultado:', error);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error message:', error.message);

      // No mostrar alert, solo loggear - el usuario ya ve sus resultados
      // Alert.alert('Advertencia', 'El resultado no se pudo guardar en el servidor.');
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return '#FF9500'; // Naranja
    return theme.colors.error;
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🎉';
    if (score >= 80) return '🌟';
    if (score >= 70) return '👍';
    if (score >= 60) return '😊';
    return '📚';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return '¡Excelente trabajo!';
    if (score >= 80) return '¡Muy bien hecho!';
    if (score >= 70) return '¡Buen trabajo!';
    if (score >= 60) return 'Aprobado, ¡sigue practicando!';
    return '¡No te rindas! Inténtalo de nuevo';
  };

  const handleRetakeQuiz = () => {
    navigation.replace('TakeQuiz', { quizId });
  };

  const handleGoHome = () => {
    // Navegar hacia atrás hasta el inicio del stack
    navigation.popToTop();
  };

  if (loading || !result || !quiz) {
    return <Loading fullscreen />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header - Score */}
      <View style={styles.scoreSection}>
        <Text style={styles.emoji}>{getScoreEmoji(result.score)}</Text>
        <Text style={styles.scoreTitle}>Tu Puntuación</Text>
        <Text style={[styles.scoreValue, { color: getScoreColor(result.score) }]}>
          {result.score}%
        </Text>
        <Text style={styles.scoreMessage}>{getScoreMessage(result.score)}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{result.correctAnswers}</Text>
          <Text style={styles.statLabel}>Correctas</Text>
          <View style={[styles.statIndicator, { backgroundColor: theme.colors.success }]} />
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{result.incorrectAnswers}</Text>
          <Text style={styles.statLabel}>Incorrectas</Text>
          <View style={[styles.statIndicator, { backgroundColor: theme.colors.error }]} />
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{result.totalQuestions}</Text>
          <Text style={styles.statLabel}>Total</Text>
          <View style={[styles.statIndicator, { backgroundColor: theme.colors.primary }]} />
        </View>
      </View>

      {/* Quiz Info */}
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <Text style={styles.quizCategory}>
          {quiz.category} • {quiz.level}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${result.score}%`,
                backgroundColor: getScoreColor(result.score),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {result.correctAnswers} de {result.totalQuestions} preguntas correctas
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Botón Ver Respuestas - Deshabilitado por ahora */}
        {/* <TouchableOpacity style={styles.secondaryButton} onPress={handleViewAnswers}>
          <Text style={styles.secondaryButtonText}>📋 Ver Respuestas</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.secondaryButton} onPress={handleRetakeQuiz}>
          <Text style={styles.secondaryButtonText}>🔄 Reintentar Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
          <Text style={styles.primaryButtonText}>🏠 Volver al Inicio</Text>
        </TouchableOpacity>
      </View>

      {/* Saving indicator */}
      {saving && (
        <Text style={styles.savingText}>Guardando resultado...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scoreMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  statIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  quizInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  quizCategory: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E8E8E8',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  savingText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default QuizResultScreen;
