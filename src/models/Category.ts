export enum QuizCategory {
  MATHEMATICS = 'mathematics',
  SCIENCE = 'science',
  HISTORY = 'history',
  LANGUAGE = 'language',
  PROGRAMMING = 'programming',
  SPORTS = 'sports',
  GENERAL = 'general',
  LANGUAGES = 'languages',
  OTHER = 'other'
}

export const CategoryLabels: Record<QuizCategory, string> = {
  [QuizCategory.MATHEMATICS]: 'Matemáticas',
  [QuizCategory.SCIENCE]: 'Ciencias',
  [QuizCategory.HISTORY]: 'Historia',
  [QuizCategory.LANGUAGE]: 'Lenguaje',
  [QuizCategory.PROGRAMMING]: 'Programación',
  [QuizCategory.SPORTS]: 'Deportes',
  [QuizCategory.GENERAL]: 'Cultura General',
  [QuizCategory.LANGUAGES]: 'Idiomas',
  [QuizCategory.OTHER]: 'Otros'
};

export const CategoryIcons: Record<QuizCategory, string> = {
  [QuizCategory.MATHEMATICS]: 'calculator',
  [QuizCategory.SCIENCE]: 'flask',
  [QuizCategory.HISTORY]: 'book-open',
  [QuizCategory.LANGUAGE]: 'text',
  [QuizCategory.PROGRAMMING]: 'code-tags',
  [QuizCategory.SPORTS]: 'basketball',
  [QuizCategory.GENERAL]: 'lightbulb',
  [QuizCategory.LANGUAGES]: 'translate',
  [QuizCategory.OTHER]: 'dots-horizontal'
};
