import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LightColors } from '../../styles/colors';
import { QuizResult } from '../../models/Result';
import { ResultService } from '../../services/api/result.service';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const HistoryScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('🔵 Cargando historial del usuario:', user.id);
      const userResults = await ResultService.getUserResults(user.id);
      console.log('✅ Resultados cargados:', userResults.length);
      setResults(userResults);
    } catch (error: any) {
      console.error('❌ Error al cargar historial:', error);

      // Si el error es por falta de índice, mostrar array vacío
      if (error.code === 'firestore/failed-precondition') {
        console.log('⚠️ Índice no encontrado en Firestore, mostrando historial vacío');
        setResults([]);
      } else {
        // Para otros errores, también mostrar vacío pero loggear
        console.error('❌ Error desconocido:', error.message);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleRetakeQuiz = (quizId: string) => {
    // Navegar al quiz para resolverlo nuevamente
    navigation.navigate('Home', {
      screen: 'HomeStack',
      params: {
        screen: 'TakeQuiz',
        params: { quizId },
      },
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return LightColors.success;
    if (score >= 60) return '#FF9500';
    return LightColors.error;
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '🎉';
    if (score >= 80) return '🌟';
    if (score >= 70) return '👍';
    if (score >= 60) return '😊';
    return '📚';
  };

  const formatDate = (date: any) => {
    try {
      // Manejar Firestore Timestamp
      const dateObj = date?.toDate ? date.toDate() : new Date(date);
      return format(dateObj, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
    } catch {
      return 'Fecha no disponible';
    }
  };

  const renderResultCard = ({ item }: { item: QuizResult }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => handleRetakeQuiz(item.quizId)}
      activeOpacity={0.7}
    >
      {/* Header con título y fecha */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.quizTitle} numberOfLines={2}>
            {item.quizTitle}
          </Text>
          <Text style={styles.dateText}>{formatDate(item.completedAt)}</Text>
        </View>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{getScoreEmoji(item.score)}</Text>
        </View>
      </View>

      {/* Score principal */}
      <View style={styles.scoreSection}>
        <Text style={[styles.scoreValue, { color: getScoreColor(item.score) }]}>
          {item.score}%
        </Text>
        <Text style={styles.scoreLabel}>Calificación</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Icon name="check-circle" size={18} color={LightColors.success} />
          <Text style={styles.statText}>{item.correctAnswers} correctas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Icon name="close-circle" size={18} color={LightColors.error} />
          <Text style={styles.statText}>{item.incorrectAnswers} incorrectas</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Icon name="help-circle" size={18} color={LightColors.primary} />
          <Text style={styles.statText}>{item.totalQuestions} total</Text>
        </View>
      </View>

      {/* Botón reintentar */}
      <TouchableOpacity
        style={styles.retakeButton}
        onPress={() => handleRetakeQuiz(item.quizId)}
      >
        <Icon name="refresh" size={18} color={LightColors.primary} />
        <Text style={styles.retakeText}>Reintentar Quiz</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="history" size={80} color={LightColors.textTertiary} />
      <Text style={styles.emptyTitle}>Sin historial</Text>
      <Text style={styles.emptySubtitle}>
        Aún no has completado ningún quiz.{'\n'}
        ¡Empieza a resolver quizzes para ver tu progreso!
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Mi Historial</Text>
      <Text style={styles.headerSubtitle}>
        {results.length} {results.length === 1 ? 'quiz completado' : 'quizzes completados'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={LightColors.primary} />
        <Text style={styles.loadingText}>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderResultCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[
          styles.listContent,
          results.length === 0 && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[LightColors.primary]}
          />
        }
      />
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
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: LightColors.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: LightColors.textSecondary,
  },
  listContent: {
    paddingBottom: 20,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LightColors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: LightColors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  resultCard: {
    backgroundColor: LightColors.white,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: LightColors.text,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: LightColors.textSecondary,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: LightColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: LightColors.border,
    marginVertical: 12,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: LightColors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: LightColors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: LightColors.border,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: LightColors.primary,
    backgroundColor: LightColors.white,
  },
  retakeText: {
    fontSize: 15,
    fontWeight: '600',
    color: LightColors.primary,
  },
});

export default HistoryScreen;
