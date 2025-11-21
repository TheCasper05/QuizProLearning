export interface Rating {
  id: string;
  userId: string;
  quizId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}
