import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Card } from '../common';
import { theme } from '../../styles/theme';

interface QuizCardProps {
  quiz: {
    quizId: string;
    title: string;
    description: string;
    category: string;
    level: 'Fácil' | 'Intermedio' | 'Difícil';
    imageUrl?: string;
    stats: {
      totalAttempts: number;
      averageRating: number;
      totalRatings: number;
    };
    questions: any[];
  };
  onPress: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onPress }) => {
  const getLevelColor = () => {
    switch (quiz.level) {
      case 'Fácil':
        return '#50C878';
      case 'Intermedio':
        return '#FFA500';
      case 'Difícil':
        return '#E74C3C';
      default:
        return theme.colors.primary;
    }
  };

  const getCategoryEmoji = () => {
    const categoryEmojis: { [key: string]: string } = {
      'Ciencias': '🔬',
      'Historia': '📚',
      'Matemáticas': '🔢',
      'Arte': '🎨',
      'Deportes': '⚽',
      'Tecnología': '💻',
      'Geografía': '🌍',
      'Cultura General': '🌟',
    };
    return categoryEmojis[quiz.category] || '📝';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

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

  return (
    <Card onPress={onPress} style={styles.card}>
      {/* Image or Placeholder */}
      <View style={styles.imageContainer}>
        {quiz.imageUrl ? (
          <Image source={{ uri: quiz.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: getLevelColor() }]}>
            <Text style={styles.placeholderEmoji}>{getCategoryEmoji()}</Text>
          </View>
        )}
        <View style={[styles.levelBadge, { backgroundColor: getLevelColor() }]}>
          <Text style={styles.levelText}>{quiz.level}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Category */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryEmoji}>{getCategoryEmoji()}</Text>
          <Text style={styles.categoryText}>{quiz.category}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {quiz.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {quiz.description}
        </Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>
              {renderStars(quiz.stats.averageRating)}
            </Text>
            <Text style={styles.statValue}>
              {quiz.stats.averageRating.toFixed(1)} ({quiz.stats.totalRatings})
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={styles.statLabel}>📝</Text>
            <Text style={styles.statValue}>
              {quiz.questions.length} preguntas
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={styles.statLabel}>👥</Text>
            <Text style={styles.statValue}>
              {quiz.stats.totalAttempts} intentos
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.bold,
  },
  content: {
    padding: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 11,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
});
