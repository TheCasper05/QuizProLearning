import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MyQuizzesStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';

import MyQuizzesScreen from '../screens/myQuizzes/MyQuizzesScreen';
import CreateQuizScreen from '../screens/myQuizzes/CreateQuizScreen';
import EditQuizScreen from '../screens/myQuizzes/EditQuizScreen';
import QuizStatisticsScreen from '../screens/myQuizzes/QuizStatisticsScreen';
import QuizDetailScreen from '../screens/quiz/QuizDetailScreen';
import TakeQuizScreen from '../screens/quiz/TakeQuizScreen';
import QuizResultScreen from '../screens/quiz/QuizResultScreen';

const Stack = createStackNavigator<MyQuizzesStackParamList>();

export const MyQuizzesNavigator = () => {
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
        name="MyQuizzesMain"
        component={MyQuizzesScreen}
        options={{ title: 'Mis Quizzes' }}
      />
      <Stack.Screen
        name="CreateQuiz"
        component={CreateQuizScreen}
        options={{ title: 'Crear Quiz' }}
      />
      <Stack.Screen
        name="EditQuiz"
        component={EditQuizScreen}
        options={{ title: 'Editar Quiz' }}
      />
      <Stack.Screen
        name="QuizStatistics"
        component={QuizStatisticsScreen}
        options={{ title: 'Estadísticas' }}
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
