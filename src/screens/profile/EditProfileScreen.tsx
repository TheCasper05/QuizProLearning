import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LightColors } from '../../styles/colors';
import { useAuth } from '../../context/AuthContext';

const EditProfileScreen = ({ navigation }: any) => {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const nameChanged = displayName !== user.displayName;
      const photoChanged = photoURL !== (user.photoURL || '');
      setHasChanges(nameChanged || photoChanged);
    }
  }, [displayName, photoURL, user]);

  const handleSaveChanges = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'No hay usuario autenticado');
      return;
    }

    try {
      setLoading(true);
      console.log('🔵 Actualizando perfil...');

      // Actualizar usando el método del contexto (actualiza Auth, Firestore y estado local)
      // Si photoURL está vacío, enviar null para eliminarlo
      await updateProfile(
        displayName.trim(),
        photoURL.trim() || null
      );

      console.log('✅ Perfil actualizado');

      navigation.goBack();
      Alert.alert('¡Éxito!', 'Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('❌ Error al actualizar perfil:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    Alert.alert(
      'Eliminar Foto',
      '¿Estás seguro de que deseas eliminar tu foto de perfil?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => setPhotoURL(''),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <Text style={styles.headerSubtitle}>
            Actualiza tu información personal
          </Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icon name="account" size={60} color={LightColors.primary} />
              </View>
            )}
          </View>

          <View style={styles.avatarActions}>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => {
                Alert.alert(
                  'Cambiar Foto',
                  'La funcionalidad de cargar fotos estará disponible pronto.\n\nPor ahora puedes pegar la URL de una imagen:'
                );
              }}
            >
              <Icon name="camera" size={20} color={LightColors.primary} />
              <Text style={styles.avatarButtonText}>Cambiar foto</Text>
            </TouchableOpacity>

            {photoURL && (
              <TouchableOpacity
                style={[styles.avatarButton, styles.avatarButtonDanger]}
                onPress={handleRemovePhoto}
              >
                <Icon name="delete" size={20} color={LightColors.error} />
                <Text style={[styles.avatarButtonText, styles.avatarButtonTextDanger]}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          {/* Display Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre completo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Juan Pérez"
              placeholderTextColor={LightColors.textTertiary}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>

          {/* Email (Read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <View style={styles.inputReadOnly}>
              <Text style={styles.inputReadOnlyText}>{user?.email}</Text>
              <Icon name="lock" size={20} color={LightColors.textTertiary} />
            </View>
            <Text style={styles.helpText}>
              El correo no se puede cambiar
            </Text>
          </View>

          {/* Photo URL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL de foto (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://ejemplo.com/foto.jpg"
              placeholderTextColor={LightColors.textTertiary}
              value={photoURL}
              onChangeText={setPhotoURL}
              autoCapitalize="none"
              keyboardType="url"
            />
            <Text style={styles.helpText}>
              Pega la URL de tu foto de perfil
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoBox}>
          <Icon name="information" size={24} color={LightColors.info} />
          <Text style={styles.infoText}>
            Los cambios se aplicarán en toda la aplicación. Tu nombre se mostrará
            en los quizzes que crees y en tu perfil público.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (loading || !hasChanges) && styles.saveButtonDisabled,
          ]}
          onPress={handleSaveChanges}
          disabled={loading || !hasChanges}
        >
          {loading ? (
            <ActivityIndicator color={LightColors.white} />
          ) : (
            <>
              <Icon name="check" size={20} color={LightColors.white} />
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LightColors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: LightColors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: LightColors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: LightColors.white,
    opacity: 0.9,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: LightColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: LightColors.border,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: LightColors.primary,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: LightColors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: LightColors.primary,
  },
  avatarActions: {
    flexDirection: 'row',
    gap: 12,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LightColors.background,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: LightColors.primary,
  },
  avatarButtonDanger: {
    borderColor: LightColors.error,
  },
  avatarButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: LightColors.primary,
  },
  avatarButtonTextDanger: {
    color: LightColors.error,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: LightColors.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: LightColors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: LightColors.surface,
    borderWidth: 1,
    borderColor: LightColors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: LightColors.text,
  },
  inputReadOnly: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: LightColors.backgroundSecondary,
    borderWidth: 1,
    borderColor: LightColors.border,
    borderRadius: 8,
    padding: 12,
  },
  inputReadOnlyText: {
    fontSize: 16,
    color: LightColors.textSecondary,
  },
  helpText: {
    fontSize: 12,
    color: LightColors.textSecondary,
    marginTop: 6,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: LightColors.info + '15',
    borderLeftWidth: 4,
    borderLeftColor: LightColors.info,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: LightColors.text,
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: LightColors.surface,
    borderTopWidth: 1,
    borderTopColor: LightColors.border,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: LightColors.backgroundSecondary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: LightColors.text,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: LightColors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: LightColors.white,
  },
});

export default EditProfileScreen;
