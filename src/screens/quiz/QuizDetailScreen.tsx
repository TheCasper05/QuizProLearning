import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { QuizStackParamList } from '../../navigation/types';
import { Button, Loading, Card } from '../../components/common';
import { theme } from '../../styles/theme';
import firestore from '@react-native-firebase/firestore';
import { Quiz } from '../../models/Quiz';

type QuizDetailScreenProps = NativeStackScreenProps<QuizStackParamList, 'QuizDetail'>;

// Colores pastel
const PASTEL_COLORS = {
  purple: '#9B9BE8',
  yellow: '#FFD666',
  blue: '#A8D5FF',
  pink: '#FFB6C1',
  green: '#B8E6B8',
  peach: '#FFDAB9',
  lavender: '#E6E6FA',
  mint: '#C7F0DB',
};

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Ciencias': PASTEL_COLORS.green,
    'Matemáticas': PASTEL_COLORS.blue,
    'Historia': PASTEL_COLORS.peach,
    'Arte': PASTEL_COLORS.pink,
    'Deportes': PASTEL_COLORS.mint,
    'Tecnología': PASTEL_COLORS.purple,
    'Geografía': PASTEL_COLORS.lavender,
    'Cultura General': PASTEL_COLORS.yellow,
  };
  return colors[category] || PASTEL_COLORS.purple;
};

const getCategoryEmoji = (category: string) => {
  const emojis: { [key: string]: string } = {
    'Ciencias': '🔬',
    'Matemáticas': '🔢',
    'Historia': '📚',
    'Arte': '🎨',
    'Deportes': '⚽',
    'Tecnología': '💻',
    'Geografía': '🌍',
    'Cultura General': '🌟',
  };
  return emojis[category] || '📝';
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Fácil':
      return PASTEL_COLORS.green;
    case 'Intermedio':
      return PASTEL_COLORS.yellow;
    case 'Difícil':
      return '#FFB6B6';
    default:
      return PASTEL_COLORS.blue;
  }
};

export const QuizDetailScreen: React.FC<QuizDetailScreenProps> = ({ route, navigation }) => {
  const { quizId } = route.params;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadQuizDetails();
  }, [quizId]);

  const loadQuizDetails = async () => {
    try {
      setLoading(true);
      const quizDoc = await firestore().collection('quizzes').doc(quizId).get();

      if (quizDoc.exists) {
        const quizData = quizDoc.data() as Quiz;
        setQuiz(quizData);
      } else {
        Alert.alert('Error', 'Quiz no encontrado');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      Alert.alert('Error', 'No se pudo cargar el quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    if (quiz) {
      navigation.navigate('TakeQuiz', { quizId: quiz.quizId });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implementar guardado en Firestore
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('⭐');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }

    return stars.join('');
  };

  if (loading) {
    return <Loading fullscreen />;
  }

  if (!quiz) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Quiz no encontrado</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const categoryColor = getCategoryColor(quiz.category);
  const categoryEmoji = getCategoryEmoji(quiz.category);
  const levelColor = getLevelColor(quiz.level);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={[styles.hero, { backgroundColor: categoryColor }]}>
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        <Text style={styles.heroEmoji}>{categoryEmoji}</Text>
        <Text style={styles.heroTitle}>{quiz.title}</Text>

        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={styles.levelText}>{quiz.level}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Category Tag */}
        <View style={[styles.categoryTag, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
          <Text style={styles.categoryText}>{quiz.category}</Text>
        </View>

        {/* Description */}
        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{quiz.description}</Text>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>📝</Text>
            <Text style={styles.statValue}>{quiz.questions?.length || 0}</Text>
            <Text style={styles.statLabel}>Preguntas</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={styles.statValue}>{quiz.stats?.totalAttempts || 0}</Text>
            <Text style={styles.statLabel}>Intentos</Text>
          </Card>

          <Card style={styles.statCard}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={styles.statValue}>{(quiz.stats?.averageScore || 0).toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Promedio</Text>
          </Card>
        </View>

        {/* Rating */}
        <Card style={styles.ratingCard}>
          <View style={styles.ratingHeader}>
            <Text style={styles.sectionTitle}>Calificación</Text>
            <Text style={styles.ratingValue}>
              {(quiz.stats?.averageRating || 0).toFixed(1)} / 5.0
            </Text>
          </View>
          <Text style={styles.stars}>
            {renderStars(quiz.stats?.averageRating || 0)}
          </Text>
          <Text style={styles.ratingsCount}>
            {quiz.stats?.totalRatings || 0} calificaciones
          </Text>
        </Card>

        {/* Quiz Info */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Información del Quiz</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏱️ Tiempo límite:</Text>
            <Text style={styles.infoValue}>
              {quiz.settings?.timeLimit ? `${quiz.settings.timeLimit / 60} min` : 'Sin límite'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🔀 Preguntas aleatorias:</Text>
            <Text style={styles.infoValue}>
              {quiz.settings?.shuffleQuestions ? 'Sí' : 'No'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>✅ Ver respuestas:</Text>
            <Text style={styles.infoValue}>
              {quiz.settings?.showCorrectAnswers ? 'Sí' : 'No'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🔄 Reintentar:</Text>
            <Text style={styles.infoValue}>
              {quiz.settings?.allowRetake ? 'Permitido' : 'No permitido'}
            </Text>
          </View>
        </Card>

        {/* Creator Info */}
        {quiz.createdBy && (
          <Card style={styles.creatorCard}>
            <Text style={styles.sectionTitle}>Creado por</Text>
            <View style={styles.creatorInfo}>
              <View style={styles.creatorAvatar}>
                <Text style={styles.creatorEmoji}>👤</Text>
              </View>
              <View style={styles.creatorDetails}>
                <Text style={styles.creatorName}>{quiz.createdBy.displayName}</Text>
                <Text style={styles.creatorDate}>
                  {quiz.createdAt && 'toDate' in quiz.createdAt ? new Date(quiz.createdAt.toDate()).toLocaleDateString('es-ES') : 'Fecha desconocida'}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Start Button */}
        <Button
          title="🚀 Comenzar Quiz"
          onPress={handleStartQuiz}
          size="large"
          style={styles.startButton}
        />

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PASTEL_COLORS.lavender,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.error,
    marginBottom: 20,
  },
  hero: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  levelBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  content: {
    padding: 20,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 16,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  ratingCard: {
    marginBottom: 16,
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingValue: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: PASTEL_COLORS.yellow,
  },
  stars: {
    fontSize: 24,
    marginBottom: 8,
  },
  ratingsCount: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  creatorCard: {
    marginBottom: 24,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: PASTEL_COLORS.peach,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creatorEmoji: {
    fontSize: 24,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  creatorDate: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  startButton: {
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default QuizDetailScreen;
