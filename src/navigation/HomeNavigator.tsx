import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/home/HomeScreen';
import QuizDetailScreen from '../screens/quiz/QuizDetailScreen';
import TakeQuizScreen from '../screens/quiz/TakeQuizScreen';
import QuizResultScreen from '../screens/quiz/QuizResultScreen';
import UploadDataScreen from '../screens/admin/UploadDataScreen';

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'QuizPro Learning' }}
      />
      <Stack.Screen
        name="QuizDetail"
        component={QuizDetailScreen}
        options={{ title: 'Detalles del Quiz' }}
      />
      <Stack.Screen
        name="TakeQuiz"
        component={TakeQuizScreen}
        options={{
          title: 'Quiz en Progreso',
          headerLeft: () => null, // Evitar volver atrás durante el quiz
        }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{
          title: 'Resultados',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="UploadData"
        component={UploadDataScreen}
        options={{
          title: 'Subir Datos Demo',
        }}
      />
    </Stack.Navigator>
  );
};
