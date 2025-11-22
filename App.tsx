import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Providers
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { QuizProvider } from './src/context/QuizContext';

// Navigation
import { AppNavigator } from './src/navigation/AppNavigator';

// Utils
import { checkFirebaseConnection } from './src/utils/firebaseCheck';

// Ignorar advertencias específicas (opcional)
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App = () => {
  useEffect(() => {
    console.log('🚀 App: Iniciando aplicación QuizPro Learning');

    // Verificar conexión de Firebase al iniciar
    checkFirebaseConnection()
      .then(result => {
        if (!result.success) {
          console.error('⚠️ Problemas detectados con Firebase:', result.errors);
        }
      })
      .catch(error => {
        console.error('❌ Error al verificar Firebase:', error);
      });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <QuizProvider>
              <StatusBar barStyle="dark-content" />
              <AppNavigator />
            </QuizProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
