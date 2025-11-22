import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Loading } from '../../components/common';
import { theme } from '../../styles/theme';
import { useAuth } from '../../context/AuthContext';
import {
  uploadAllDemoData,
  checkExistingData,
} from '../../../scripts/uploadDemoData';

export const UploadDataScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  useEffect(() => {
    checkData();
  }, []);

  const checkData = async () => {
    try {
      const data = await checkExistingData();
      setExistingData(data);
    } catch (error) {
      console.error('Error checking data:', error);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      Alert.alert('Error', 'Debes estar logueado para subir datos');
      return;
    }

    if (existingData?.hasData) {
      Alert.alert(
        'Advertencia',
        `Ya existen ${existingData.categoriesCount} categorías y ${existingData.quizzesCount} quizzes. ¿Deseas agregar más datos?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Continuar', onPress: () => performUpload() },
        ]
      );
    } else {
      performUpload();
    }
  };

  const performUpload = async () => {
    try {
      setLoading(true);
      setUploadResult(null);

      const result = await uploadAllDemoData(
        user!.id,
        user!.displayName || 'Usuario'
      );

      setUploadResult(result);
      await checkData();

      Alert.alert(
        '¡Éxito!',
        `Se subieron ${result.categories} categorías y ${result.quizzes} quizzes.`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error al subir los datos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullscreen />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🚀 Subir Datos de Demostración</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📊 Estado Actual</Text>

        {existingData ? (
          <>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Categorías:</Text>
              <Text style={styles.statValue}>{existingData.categoriesCount}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Quizzes:</Text>
              <Text style={styles.statValue}>{existingData.quizzesCount}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Estado:</Text>
              <Text
                style={[
                  styles.statValue,
                  existingData.hasData ? styles.hasData : styles.noData,
                ]}
              >
                {existingData.hasData ? 'Con datos' : 'Sin datos'}
              </Text>
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Verificando datos...</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📦 Datos a Subir</Text>
        <Text style={styles.infoText}>• 8 Categorías</Text>
        <Text style={styles.infoText}>• 10 Quizzes variados</Text>
        <Text style={styles.infoText}>• ~50 preguntas en total</Text>
      </View>

      {uploadResult && (
        <View style={[styles.card, styles.successCard]}>
          <Text style={styles.successTitle}>✅ Subida Exitosa</Text>
          <Text style={styles.successText}>
            Categorías: {uploadResult.categories}
          </Text>
          <Text style={styles.successText}>
            Quizzes: {uploadResult.quizzes}
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>⚠️ Importante</Text>
        <Text style={styles.warningText}>
          • Este script solo debe ejecutarse UNA VEZ
        </Text>
        <Text style={styles.warningText}>
          • Los quizzes se asociarán a tu usuario
        </Text>
        <Text style={styles.warningText}>
          • Los datos se subirán a Firebase Firestore
        </Text>
      </View>

      <Button
        title="🚀 Subir Datos de Demostración"
        onPress={handleUpload}
        disabled={loading}
        size="large"
        style={styles.uploadButton}
      />

      <Button
        title="🔄 Verificar Datos Nuevamente"
        onPress={checkData}
        variant="outline"
        size="medium"
        style={styles.checkButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  hasData: {
    color: theme.colors.success,
  },
  noData: {
    color: theme.colors.warning,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.warning,
    marginBottom: 8,
  },
  successCard: {
    backgroundColor: '#F0FFF4',
    borderColor: theme.colors.success,
    borderWidth: 2,
  },
  successTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.success,
    marginBottom: 12,
  },
  successText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    marginBottom: 4,
  },
  uploadButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  checkButton: {
    marginBottom: 12,
  },
});

export default UploadDataScreen;
