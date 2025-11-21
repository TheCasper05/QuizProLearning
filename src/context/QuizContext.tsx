import React, { createContext, useState, useContext, useEffect } from 'react';
import { Quiz, QuizCategory, QuizLevel } from '../models/Quiz';
import { QuizResult } from '../models/Result';
import { QuizService } from '../services/api/quiz.service';
import { ResultService } from '../services/api/result.service';
import { FavoriteService } from '../services/api/favorite.service';
import { RatingService } from '../services/api/rating.service';
import { useAuth } from './AuthContext';

interface QuizContextType {
  quizzes: Quiz[];
  myQuizzes: Quiz[];
  favorites: Quiz[];
  recentResults: QuizResult[];
  loading: boolean;
  error: string | null;

  // Quiz operations
  loadPublicQuizzes: () => Promise<void>;
  loadMyQuizzes: () => Promise<void>;
  loadFavorites: () => Promise<void>;
  loadRecentResults: () => Promise<void>;
  createQuiz: (quiz: Omit<Quiz, 'id'>) => Promise<Quiz>;
  updateQuiz: (quizId: string, data: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;

  // Favorite operations
  addToFavorites: (quizId: string) => Promise<void>;
  removeFromFavorites: (quizId: string) => Promise<void>;
  isFavorite: (quizId: string) => boolean;

  // Rating operations
  rateQuiz: (quizId: string, rating: number, comment?: string) => Promise<void>;

  // Search and filter
  searchQuizzes: (searchTerm: string) => Promise<Quiz[]>;
  filterByCategory: (category: QuizCategory) => Promise<Quiz[]>;
  filterByLevel: (level: QuizLevel) => Promise<Quiz[]>;

  clearError: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
  const [favorites, setFavorites] = useState<Quiz[]>([]);
  const [recentResults, setRecentResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    await Promise.all([
      loadPublicQuizzes(),
      loadMyQuizzes(),
      loadFavorites(),
      loadRecentResults(),
    ]);
  };

  const loadPublicQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuizService.getPublicQuizzes(50);
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMyQuizzes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await QuizService.getQuizzesByCreator(user.id, true);
      setMyQuizzes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const favoriteData = await FavoriteService.getUserFavorites(user.id);
      const favoriteQuizzes = await Promise.all(
        favoriteData.map((fav) => QuizService.getQuiz(fav.quizId))
      );
      setFavorites(favoriteQuizzes);
      setFavoriteIds(new Set(favoriteData.map((fav) => fav.quizId)));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentResults = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await ResultService.getUserResults(user.id);
      setRecentResults(data.slice(0, 10)); // Últimos 10 resultados
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quiz: Omit<Quiz, 'id'>): Promise<Quiz> => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      setLoading(true);
      setError(null);
      const newQuiz = await QuizService.createQuiz(quiz);
      setMyQuizzes((prev) => [newQuiz, ...prev]);
      return newQuiz;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (quizId: string, data: Partial<Quiz>) => {
    try {
      setLoading(true);
      setError(null);
      await QuizService.updateQuiz(quizId, data);

      // Actualizar en la lista local
      setMyQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === quizId ? { ...quiz, ...data } : quiz
        )
      );
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      setError(null);
      await QuizService.deleteQuiz(quizId);

      // Eliminar de las listas locales
      setMyQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
      setFavorites((prev) => prev.filter((quiz) => quiz.id !== quizId));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (quizId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      await FavoriteService.addFavorite(user.id, quizId);
      await loadFavorites();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromFavorites = async (quizId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      await FavoriteService.removeFavorite(user.id, quizId);
      await loadFavorites();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const isFavorite = (quizId: string): boolean => {
    return favoriteIds.has(quizId);
  };

  const rateQuiz = async (quizId: string, rating: number, comment?: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      await RatingService.rateQuiz(user.id, quizId, rating, comment);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const searchQuizzes = async (searchTerm: string): Promise<Quiz[]> => {
    try {
      setLoading(true);
      setError(null);
      return await QuizService.searchQuizzes(searchTerm);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (category: QuizCategory): Promise<Quiz[]> => {
    try {
      setLoading(true);
      setError(null);
      return await QuizService.getQuizzesByCategory(category);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const filterByLevel = async (level: QuizLevel): Promise<Quiz[]> => {
    try {
      setLoading(true);
      setError(null);
      return await QuizService.getQuizzesByLevel(level);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    quizzes,
    myQuizzes,
    favorites,
    recentResults,
    loading,
    error,
    loadPublicQuizzes,
    loadMyQuizzes,
    loadFavorites,
    loadRecentResults,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    rateQuiz,
    searchQuizzes,
    filterByCategory,
    filterByLevel,
    clearError,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
