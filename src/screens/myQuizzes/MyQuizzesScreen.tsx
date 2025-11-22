import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LightColors } from '../../styles/colors';
import { Quiz, LevelLabels } from '../../models/Quiz';
import { QuizService } from '../../services/api/quiz.service';
import { UserService } from '../../services/api/user.service';
import { useAuth } from '../../context/AuthContext';
import { QuizCard } from '../../components/quiz/QuizCard';

const MyQuizzesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadQuizzes = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('🔵 Cargando quizzes del usuario:', user.id);
      const userQuizzes = await QuizService.getQuizzesByCreator(user.id, true);
      console.log('✅ Quizzes cargados:', userQuizzes.length);
      setQuizzes(userQuizzes);
    } catch (error: any) {
      console.error('❌ Error al cargar quizzes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Recargar cuando la pantalla enfoca (ej: al volver de CreateQuiz)
  useFocusEffect(
    useCallback(() => {
      loadQuizzes();
    }, [loadQuizzes])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadQuizzes();
    setRefreshing(false);
  };

  const handleQuizPress = (quizId: string) => {
    navigation.navigate('QuizDetail', { quizId });
  };

  const handleCreateQuiz = () => {
    navigation.navigate('CreateQuiz');
  };

  const handleEditQuiz = (quizId: string) => {
    navigation.navigate('EditQuiz', { quizId });
  };

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    Alert.alert(
      'Eliminar Quiz',
      `¿Estás seguro de que deseas eliminar "${quizTitle}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔵 Eliminando quiz:', quizId);

              // Eliminar quiz de Firestore
              await QuizService.deleteQuiz(quizId);
              console.log('✅ Quiz eliminado de Firestore');

              // Actualizar estadísticas del usuario
              if (user) {
                await UserService.decrementQuizzesCreated(user.id);
                console.log('✅ Estadísticas actualizadas');
              }

              // Recargar lista
              await loadQuizzes();

              Alert.alert('¡Éxito!', 'Quiz eliminado correctamente');
            } catch (error: any) {
              console.error('❌ Error al eliminar quiz:', error);
              Alert.alert('Error', error.message || 'No se pudo eliminar el quiz');
            }
          },
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="clipboard-text-outline" size={80} color={LightColors.textTertiary} />
      <Text style={styles.emptyTitle}>No tienes quizzes</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primer quiz presionando el botón +
      </Text>
    </View>
  );

  const renderQuizCard = ({ item }: { item: Quiz }) => {
    // Adapt quiz data to QuizCard props
    const adaptedQuiz = {
      quizId: item.quizId,
      title: item.title,
      description: item.description,
      category: item.category,
      level: LevelLabels[item.level as keyof typeof LevelLabels] || item.level,
      imageUrl: item.imageUrl,
      stats: {
        totalAttempts: item.stats.totalAttempts,
        averageRating: item.stats.averageRating,
        totalRatings: item.stats.totalRatings,
      },
      questions: item.questions,
    };

    return (
      <View style={styles.quizCardContainer}>
        <QuizCard
          quiz={adaptedQuiz as any}
          onPress={() => handleQuizPress(item.quizId)}
        />
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditQuiz(item.quizId)}
          >
            <Icon name="pencil" size={22} color={LightColors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteQuiz(item.quizId, item.title)}
          >
            <Icon name="delete" size={22} color={LightColors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Mis Quizzes</Text>
        <Text style={styles.headerSubtitle}>
          {quizzes.length} {quizzes.length === 1 ? 'quiz creado' : 'quizzes creados'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={LightColors.primary} />
        <Text style={styles.loadingText}>Cargando tus quizzes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={quizzes}
        renderItem={renderQuizCard}
        keyExtractor={(item) => item.quizId}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          quizzes.length === 0 && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[LightColors.primary]}
          />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateQuiz}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={28} color={LightColors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: LightColors.background,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: LightColors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: LightColors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: LightColors.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: LightColors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for FAB
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  quizCardContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  actionButtons: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  editButton: {
    backgroundColor: LightColors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: LightColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButton: {
    backgroundColor: LightColors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: LightColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: LightColors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: LightColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: LightColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: LightColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default MyQuizzesScreen;
