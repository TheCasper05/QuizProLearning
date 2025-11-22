import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from './types';

import { AuthNavigator } from './AuthNavigator';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { user, loading, error } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    console.log('🔵 AppNavigator: Estado actual', {
      loading,
      hasUser: !!user,
      hasError: !!error
    });
  }, [loading, user, error]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Cargando QuizPro Learning...
        </Text>
        {__DEV__ && (
          <Text style={[styles.debugText, { color: theme.colors.textSecondary }]}>
            Modo desarrollo: Verificando autenticación
          </Text>
        )}
      </View>
    );
  }

  if (error) {
    console.error('❌ AppNavigator: Error detectado:', error);
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="App" component={BottomTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  debugText: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
});
