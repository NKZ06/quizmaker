import React, { createContext, useContext, useEffect, useState } from 'react';
import { Quiz, QuizAttempt, User } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface QuizContextType {
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'totalPoints'>) => void;
  attempts: QuizAttempt[];
  addAttempt: (attempt: Omit<QuizAttempt, 'id' | 'completedAt'>) => void;
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  updateUserStats: (userId: string, points: number) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [quizzes, setQuizzes] = useLocalStorage<Quiz[]>('quizzes', []);
  const [attempts, setAttempts] = useLocalStorage<QuizAttempt[]>('attempts', []);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Инициализация с примерами данных
  useEffect(() => {
    if (quizzes.length === 0) {
      const sampleQuizzes: Quiz[] = [
        {
          id: '1',
          title: 'Основы JavaScript',
          description: 'Проверьте свои знания основ JavaScript',
          tags: ['javascript', 'программирование', 'начинающий'],
          createdAt: new Date(),
          createdBy: 'Система',
          totalPoints: 30,
          questions: [
            {
              id: '1',
              type: 'single',
              question: 'Как правильно объявить переменную в JavaScript?',
              options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
              correctAnswers: ['var x = 5;'],
              points: 10
            },
            {
              id: '2',
              type: 'multiple',
              question: 'Какие из следующих являются типами данных JavaScript?',
              options: ['String', 'Number', 'Boolean', 'Float'],
              correctAnswers: ['String', 'Number', 'Boolean'],
              points: 15
            },
            {
              id: '3',
              type: 'text',
              question: 'Что означает аббревиатура "DOM"?',
              correctAnswers: ['Document Object Model', 'Объектная модель документа'],
              points: 5
            }
          ]
        },
        {
          id: '2',
          title: 'Основы React',
          description: 'Изучите основы разработки на React',
          tags: ['react', 'frontend', 'средний'],
          createdAt: new Date(),
          createdBy: 'Система',
          totalPoints: 25,
          questions: [
            {
              id: '1',
              type: 'single',
              question: 'Что такое JSX?',
              options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
              correctAnswers: ['JavaScript XML'],
              points: 10
            },
            {
              id: '2',
              type: 'multiple',
              question: 'Какие из следующих являются React хуками?',
              options: ['useState', 'useEffect', 'useCallback', 'useClass'],
              correctAnswers: ['useState', 'useEffect', 'useCallback'],
              points: 15
            }
          ]
        },
        {
          id: '3',
          title: 'Математика 5 класс',
          description: 'Тест по математике для учеников 5 класса',
          tags: ['математика', 'школа', '5класс'],
          createdAt: new Date(),
          createdBy: 'Система',
          totalPoints: 40,
          questions: [
            {
              id: '1',
              type: 'single',
              question: 'Сколько будет 15 + 27?',
              options: ['42', '41', '43', '40'],
              correctAnswers: ['42'],
              points: 10
            },
            {
              id: '2',
              type: 'single',
              question: 'Какое число является простым?',
              options: ['15', '21', '17', '25'],
              correctAnswers: ['17'],
              points: 15
            },
            {
              id: '3',
              type: 'text',
              question: 'Сколько сантиметров в одном метре?',
              correctAnswers: ['100', 'сто'],
              points: 15
            }
          ]
        }
      ];
      setQuizzes(sampleQuizzes);
    }

    if (users.length === 0) {
      const sampleUsers: User[] = [
        { id: '1', name: 'Анна Иванова', totalPoints: 145, quizzesCompleted: 6, averageScore: 85 },
        { id: '2', name: 'Петр Сидоров', totalPoints: 98, quizzesCompleted: 4, averageScore: 78 },
        { id: '3', name: 'Мария Петрова', totalPoints: 167, quizzesCompleted: 7, averageScore: 89 },
        { id: '4', name: 'Алексей Козлов', totalPoints: 76, quizzesCompleted: 3, averageScore: 72 },
        { id: '5', name: 'Елена Смирнова', totalPoints: 203, quizzesCompleted: 9, averageScore: 92 }
      ];
      setUsers(sampleUsers);
    }
  }, [quizzes.length, users.length, setQuizzes, setUsers]);

  const addQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt' | 'totalPoints'>) => {
    const totalPoints = quizData.questions.reduce((sum, q) => sum + q.points, 0);
    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalPoints
    };
    setQuizzes(prev => [...prev, newQuiz]);
  };

  const addAttempt = (attemptData: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: Date.now().toString(),
      completedAt: new Date()
    };
    setAttempts(prev => [...prev, newAttempt]);
    updateUserStats(attemptData.userId, attemptData.score);
  };

  const updateUserStats = (userId: string, points: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? {
            ...user,
            totalPoints: user.totalPoints + points,
            quizzesCompleted: user.quizzesCompleted + 1,
            averageScore: Math.round((user.totalPoints + points) / (user.quizzesCompleted + 1))
          }
        : user
    ));
  };

  return (
    <QuizContext.Provider value={{
      quizzes,
      addQuiz,
      attempts,
      addAttempt,
      users,
      currentUser,
      setCurrentUser,
      updateUserStats
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz должен использоваться внутри QuizProvider');
  }
  return context;
}