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
  TakeQuiz: { quizId: string };
  QuizResult: { quizId: string; userAnswers: { [questionId: string]: number } };
  UploadData: undefined;
};

export type SearchStackParamList = {
  SearchMain: undefined;
  QuizDetail: { quizId: string };
  TakeQuiz: { quizId: string };
  QuizResult: { quizId: string; userAnswers: { [questionId: string]: number } };
};

export type MyQuizzesStackParamList = {
  MyQuizzesMain: undefined;
  CreateQuiz: undefined;
  EditQuiz: { quizId: string };
  QuizStatistics: { quizId: string };
  QuizDetail: { quizId: string };
  TakeQuiz: { quizId: string };
  QuizResult: { quizId: string; userAnswers: { [questionId: string]: number } };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  EditProfile: undefined;
  History: undefined;
  Statistics: undefined;
};
