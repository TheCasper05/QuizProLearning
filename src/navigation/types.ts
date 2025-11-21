import { Quiz } from '../models/Quiz';
import { QuizResult } from '../models/Result';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Search: undefined;
  MyQuizzes: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  QuizDetail: { quizId: string };
  TakeQuiz: { quiz: Quiz };
  QuizResult: { result: QuizResult; quiz: Quiz };
  UploadData: undefined;
};

export type SearchStackParamList = {
  SearchMain: undefined;
  QuizDetail: { quizId: string };
  TakeQuiz: { quiz: Quiz };
  QuizResult: { result: QuizResult; quiz: Quiz };
};

export type MyQuizzesStackParamList = {
  MyQuizzesMain: undefined;
  CreateQuiz: undefined;
  EditQuiz: { quizId: string };
  QuizStatistics: { quizId: string };
  QuizDetail: { quizId: string };
  TakeQuiz: { quiz: Quiz };
  QuizResult: { result: QuizResult; quiz: Quiz };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  EditProfile: undefined;
  Statistics: undefined;
};
