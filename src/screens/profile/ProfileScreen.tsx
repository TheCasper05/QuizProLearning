import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LightColors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';
import { UserService } from '../../services/api/user.service';
import { AuthService } from '../../services/firebase/auth.service';
import { StatCard } from '../../components/profile/StatCard';
import { User } from '../../models/User';

const ProfileScreen = ({ navigation }: any) => {
  const { user: authUser, logout } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar datos del usuario
  const loadUserData = useCallback(async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      console.log('🔵 Cargando datos del perfil:', authUser.id);
      const data = await UserService.getUser(authUser.id);
      setUserData(data);
      console.log('✅ Datos del perfil cargados');
    } catch (error: any) {
      console.error('❌ Error al cargar perfil:', error);
      // Si el usuario no existe en Firestore, usar datos de autenticación
      if (authUser) {
        setUserData({
          id: authUser.id,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          createdAt: new Date(),
          stats: {
            quizzesCreated: 0,
            quizzesTaken: 0,
            totalScore: 0,
            level: 1,
            achievements: [],
          },
        });
      }
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  // Cargar al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              if (logout) {
                logout();
              }
            } catch (error: any) {
              console.error('❌ Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={LightColors.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="account-off" size={80} color={LightColors.textTertiary} />
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
      </View>
    );
  }

  const stats = userData.stats || {
    quizzesCreated: 0,
    quizzesTaken: 0,
    totalScore: 0,
    level: 1,
    achievements: [],
  };

  const averageScore = stats.quizzesTaken > 0
    ? Math.round(stats.totalScore / stats.quizzesTaken)
    : 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[LightColors.primary]}
        />
      }
    >
      {/* Header con información del usuario */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {userData.photoURL ? (
              <Image source={{ uri: userData.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="account" size={60} color={LightColors.primary} />
              </View>
            )}
            {/* Badge de nivel */}
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Nv. {stats.level}</Text>
            </View>
          </View>

          {/* Información */}
          <View style={styles.userInfo}>
            <Text style={styles.displayName}>{userData.displayName}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleEditProfile}
          >
            <Icon name="pencil" size={20} color={LightColors.primary} />
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSettings}
          >
            <Icon name="cog" size={20} color={LightColors.primary} />
            <Text style={styles.actionButtonText}>Ajustes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Resumen rápido */}
      <View style={styles.quickStats}>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatValue}>{stats.quizzesCreated}</Text>
          <Text style={styles.quickStatLabel}>Creados</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatValue}>{stats.quizzesTaken}</Text>
          <Text style={styles.quickStatLabel}>Realizados</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatValue}>{stats.achievements.length}</Text>
          <Text style={styles.quickStatLabel}>Logros</Text>
        </View>
      </View>

      {/* Estadísticas detalladas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estadísticas</Text>

        <StatCard
          icon="clipboard-text"
          iconColor={LightColors.primary}
          label="Quizzes Creados"
          value={stats.quizzesCreated}
          subtitle="Quizzes que has publicado"
        />

        <StatCard
          icon="book-open-variant"
          iconColor={LightColors.success}
          label="Quizzes Realizados"
          value={stats.quizzesTaken}
          subtitle="Quizzes que has completado"
        />

        <StatCard
          icon="chart-line"
          iconColor={LightColors.warning}
          label="Puntuación Total"
          value={stats.totalScore}
          subtitle={`Promedio: ${averageScore} puntos por quiz`}
        />

        <StatCard
          icon="trophy"
          iconColor="#FFD700"
          label="Nivel"
          value={stats.level}
          subtitle="Sigue completando quizzes para subir de nivel"
        />
      </View>

      {/* Logros */}
      {stats.achievements && stats.achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logros</Text>
          <View style={styles.achievementsContainer}>
            {stats.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementBadge}>
                <Icon name="medal" size={32} color="#FFD700" />
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Botón de cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Icon name="logout" size={20} color={LightColors.error} />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Espacio inferior */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  content: {
    paddingBottom: 40,
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
  errorText: {
    marginTop: 15,
    fontSize: 16,
    color: LightColors.textSecondary,
  },
  header: {
    backgroundColor: LightColors.primary,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: LightColors.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: LightColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: LightColors.white,
  },
  levelBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: LightColors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: LightColors.white,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: LightColors.white,
  },
  userInfo: {
    alignItems: 'center',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LightColors.white,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: LightColors.white,
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightColors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: LightColors.primary,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: LightColors.surface,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    shadowColor: LightColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: LightColors.primary,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: LightColors.textSecondary,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: LightColors.border,
    marginHorizontal: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: LightColors.text,
    marginBottom: 16,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementBadge: {
    backgroundColor: LightColors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: LightColors.border,
  },
  achievementText: {
    fontSize: 12,
    color: LightColors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LightColors.surface,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: LightColors.error + '40',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: LightColors.error,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default ProfileScreen;
