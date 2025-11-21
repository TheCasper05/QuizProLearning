import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/common';
import { theme } from '../../styles/theme';
import firestore from '@react-native-firebase/firestore';
import { Quiz } from '../../models/Quiz';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

// Colores pastel del tema
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

const CATEGORIES = [
  { id: 'all', name: 'Todos', emoji: '✨' },
  { id: 'Ciencias', name: 'Ciencias', emoji: '🔬' },
  { id: 'Matemáticas', name: 'Matemáticas', emoji: '🔢' },
  { id: 'Historia', name: 'Historia', emoji: '📚' },
  { id: 'Arte', name: 'Arte', emoji: '🎨' },
  { id: 'Deportes', name: 'Deportes', emoji: '⚽' },
  { id: 'Tecnología', name: 'Tecnología', emoji: '💻' },
  { id: 'Geografía', name: 'Geografía', emoji: '🌍' },
];

// Helper para obtener emoji de categoría
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

// Helper para obtener color de categoría
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

const MOCK_FRIENDS = [
  { id: '1', name: 'Alex', avatar: '👨', color: PASTEL_COLORS.peach },
  { id: '2', name: 'Maria', avatar: '👩', color: PASTEL_COLORS.yellow },
  { id: '3', name: 'John', avatar: '👨‍🦱', color: PASTEL_COLORS.blue },
  { id: '4', name: 'Sarah', avatar: '👩‍🦰', color: PASTEL_COLORS.pink },
  { id: '5', name: 'Mike', avatar: '👨‍🦲', color: PASTEL_COLORS.lavender },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Calcular nivel y XP del usuario (mock)
  const userLevel = 5;
  const userXP = 323;
  const levelProgress = 65; // Porcentaje de progreso al siguiente nivel

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      // Query simple sin orderBy para evitar necesidad de índice compuesto
      const quizzesSnapshot = await firestore()
        .collection('quizzes')
        .where('isPublic', '==', true)
        .limit(20)
        .get();

      const quizzesData = quizzesSnapshot.docs.map(doc => doc.data() as Quiz);

      // Ordenar en cliente por createdAt
      quizzesData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        const dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      setQuizzes(quizzesData.slice(0, 10)); // Tomar solo los primeros 10
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = selectedCategory === 'all'
    ? quizzes
    : quizzes.filter(q => q.category === selectedCategory);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Avatar y Progress */}
      <View style={styles.headerTop}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>😊</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelLabel}>My Level Progress</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${levelProgress}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.xpBadge}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.xpText}>{userXP} XP</Text>
        </View>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => navigation.navigate('UploadData')}
        >
          <Text style={styles.uploadIcon}>📦</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificationButton}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>
        Hi, {user?.displayName?.split(' ')[0] || 'there'}
      </Text>
      <Text style={styles.title}>Let's continue a quiz!</Text>
    </View>
  );

  const renderContinueQuiz = () => {
    // TODO: Implementar lógica de progreso con Firestore
    // Por ahora mostramos el primer quiz si existe
    if (quizzes.length === 0) return null;

    const continueQuiz = quizzes[0];
    const quizColor = getCategoryColor(continueQuiz.category);
    const quizEmoji = getCategoryEmoji(continueQuiz.category);

    return (
      <TouchableOpacity
        style={[styles.continueCard, { backgroundColor: quizColor }]}
        onPress={() => navigation.navigate('QuizDetail', { quizId: continueQuiz.quizId })}
      >
        <View style={styles.continueContent}>
          <Text style={styles.continueTitle}>{continueQuiz.title}</Text>
          <Text style={styles.continueSubtitle}>{continueQuiz.questions?.length || 0} preguntas</Text>

          {/* Progress - Por ahora sin progreso real */}
          <View style={styles.quizProgressContainer}>
            <View style={[styles.quizProgressBar, { width: '0%' }]} />
          </View>

          <View style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Let's Go!</Text>
          </View>
        </View>

        <View style={styles.continueIllustration}>
          <Text style={styles.illustrationEmoji}>{quizEmoji}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFriends = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Friends</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.friendsList}
      >
        {MOCK_FRIENDS.map((friend) => (
          <TouchableOpacity key={friend.id} style={styles.friendItem}>
            <View style={[styles.friendAvatar, { backgroundColor: friend.color }]}>
              <Text style={styles.friendEmoji}>{friend.avatar}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipSelected,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderQuizItem = ({ item }: { item: Quiz }) => {
    const quizColor = getCategoryColor(item.category);
    const quizEmoji = getCategoryEmoji(item.category);

    return (
      <TouchableOpacity
        style={styles.quizCard}
        onPress={() => navigation.navigate('QuizDetail', { quizId: item.quizId })}
      >
        <View style={[styles.quizIcon, { backgroundColor: quizColor }]}>
          <Text style={styles.quizEmoji}>{quizEmoji}</Text>
        </View>

        <View style={styles.quizInfo}>
          <Text style={styles.quizTitle}>{item.title}</Text>
          <Text style={styles.quizDescription}>{item.description}</Text>
        </View>

        <Text style={styles.arrowIcon}>›</Text>
      </TouchableOpacity>
    );
  };

  const renderLatestQuizzes = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest Quiz</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver Todos</Text>
        </TouchableOpacity>
      </View>

      {filteredQuizzes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay quizzes disponibles</Text>
          <Text style={styles.emptySubtext}>
            {selectedCategory === 'all'
              ? 'Intenta subir datos de demostración'
              : 'Intenta seleccionar otra categoría'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredQuizzes}
          renderItem={renderQuizItem}
          keyExtractor={(item) => item.quizId}
          scrollEnabled={false}
        />
      )}
    </View>
  );

  if (loading) {
    return <Loading fullscreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader()}
      {renderContinueQuiz()}
      {renderFriends()}
      {renderCategories()}
      {renderLatestQuizzes()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PASTEL_COLORS.lavender,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PASTEL_COLORS.peach,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E8E8F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: PASTEL_COLORS.purple,
    borderRadius: 4,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  xpText: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: '#F9A825',
  },
  uploadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PASTEL_COLORS.yellow,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  uploadIcon: {
    fontSize: 20,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  notificationIcon: {
    fontSize: 20,
  },
  greeting: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  continueCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  continueContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  continueTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  continueSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  quizProgressContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginVertical: 16,
  },
  quizProgressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  continueButton: {
    alignSelf: 'flex-start',
    backgroundColor: PASTEL_COLORS.yellow,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  continueIllustration: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  illustrationEmoji: {
    fontSize: 80,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: PASTEL_COLORS.purple,
  },
  friendsList: {
    paddingRight: 20,
  },
  friendItem: {
    marginRight: 16,
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  friendEmoji: {
    fontSize: 32,
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  categoryChipSelected: {
    backgroundColor: PASTEL_COLORS.yellow,
  },
  categoryEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
  },
  categoryTextSelected: {
    fontFamily: theme.fonts.bold,
  },
  quizCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  quizIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quizEmoji: {
    fontSize: 32,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  arrowIcon: {
    fontSize: 32,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
