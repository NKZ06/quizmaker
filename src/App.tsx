import React, { useState } from 'react';
import { QuizProvider } from './context/QuizContext';
import { Header } from './components/Header';
import { QuizList } from './components/QuizList';
import { QuizCreator } from './components/QuizCreator';
import { QuizTaker } from './components/QuizTaker';
import { Leaderboard } from './components/Leaderboard';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const handleTakeQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setCurrentView('take-quiz');
  };

  const handleQuizComplete = (score: number, totalPoints: number) => {
    // Завершение теста обрабатывается компонентом QuizTaker
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedQuizId(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return <QuizCreator />;
      case 'take-quiz':
        return selectedQuizId ? (
          <QuizTaker
            quizId={selectedQuizId}
            onComplete={handleQuizComplete}
            onBack={handleBackToHome}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Тест не выбран</p>
          </div>
        );
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <QuizList onTakeQuiz={handleTakeQuiz} />;
    }
  };

  return (
    <QuizProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderCurrentView()}
        </main>
        
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-gray-500 text-sm">
              <p>© 2025 QuizMaker. Создано с использованием React, TypeScript и Tailwind CSS.</p>
              <p className="mt-1">Создавайте, делитесь и проходите интерактивные тесты с легкостью.</p>
            </div>
          </div>
        </footer>
      </div>
    </QuizProvider>
  );
}