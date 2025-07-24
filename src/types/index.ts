export interface Question {
  id: string;
  type: 'single' | 'multiple' | 'text';
  question: string;
  options?: string[];
  correctAnswers: string[];
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  tags: string[];
  questions: Question[];
  createdAt: Date;
  createdBy: string;
  totalPoints: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, string[]>;
  score: number;
  totalPoints: number;
  completedAt: Date;
  timeSpent: number;
}

export interface User {
  id: string;
  name: string;
  totalPoints: number;
  quizzesCompleted: number;
  averageScore: number;
}