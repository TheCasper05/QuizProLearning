import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SearchStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

import SearchScreen from '../screens/search/SearchScreen';
import QuizDetailScreen from '../screens/quiz/QuizDetailScreen';
import TakeQuizScreen from '../screens/quiz/TakeQuizScreen';
import QuizResultScreen from '../screens/quiz/QuizResultScreen';

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchNavigator = () => {
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
        name="SearchMain"
        component={SearchScreen}
        options={{ title: 'Buscar Quizzes' }}
      />
      <Stack.Screen
        name="QuizDetail"
        component={QuizDetailScreen}
        options={{ title: 'Detalles del Quiz' }}
      />
      <Stack.Screen
        name="TakeQuiz"
        component={TakeQuizScreen}
        options={{ title: 'Quiz en Progreso' }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ title: 'Resultados' }}
      />
    </Stack.Navigator>
  );
};
