import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Quiz, Question } from '../types';

interface QuizTakerProps {
  quizId: string;
  onComplete: (score: number, totalPoints: number) => void;
  onBack: () => void;
}

export function QuizTaker({ quizId, onComplete, onBack }: QuizTakerProps) {
  const { quizzes, addAttempt, currentUser } = useQuiz();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const foundQuiz = quizzes.find(q => q.id === quizId);
    setQuiz(foundQuiz || null);
  }, [quizId, quizzes]);

  useEffect(() => {
    if (!isCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, isCompleted]);

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Тест не найден</p>
        <button
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          Назад
        </button>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, answer: string, isMultiple: boolean = false) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(answer)
          ? currentAnswers.filter(a => a !== answer)
          : [...currentAnswers, answer];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: [answer] };
      }
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    quiz.questions.forEach(question => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers = question.correctAnswers;
      
      if (question.type === 'text') {
        const userAnswer = userAnswers[0]?.toLowerCase().trim() || '';
        const isCorrect = correctAnswers.some(correct => 
          correct.toLowerCase().trim() === userAnswer
        );
        if (isCorrect) totalScore += question.points;
      } else {
        const isCorrect = userAnswers.length === correctAnswers.length &&
                         userAnswers.every(answer => correctAnswers.includes(answer));
        if (isCorrect) totalScore += question.points;
      }
    });
    return totalScore;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsCompleted(true);
    
    if (currentUser) {
      addAttempt({
        quizId: quiz.id,
        userId: currentUser.id,
        answers,
        score: finalScore,
        totalPoints: quiz.totalPoints,
        timeSpent: timeElapsed
      });
    }
    
    onComplete(finalScore, quiz.totalPoints);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
    setScore(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    const percentage = Math.round((score / quiz.totalPoints) * 100);
    const passed = percentage >= 60;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className={`px-6 py-4 ${passed ? 'bg-gradient-to-r from-green-500 to-teal-600' : 'bg-gradient-to-r from-orange-500 to-red-600'}`}>
            <h2 className="text-2xl font-bold text-white">Тест завершен!</h2>
          </div>
          
          <div className="p-6 text-center">
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
              <div className="text-4xl font-bold text-gray-800">
                {percentage}%
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {passed ? 'Поздравляем!' : 'Хорошая попытка!'}
            </h3>
            <p className="text-gray-600 mb-6">
              Вы набрали {score} из {quiz.totalPoints} баллов
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700">Время</div>
                <div className="text-lg font-bold text-gray-900">{formatTime(timeElapsed)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium text-gray-700">Вопросов</div>
                <div className="text-lg font-bold text-gray-900">{quiz.questions.length}</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={restartQuiz}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Попробовать снова</span>
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                К списку тестов
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
              <p className="text-blue-100">
                Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="bg-gray-200 h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Содержимое вопроса */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex-1">
                {currentQuestion.question}
              </h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium ml-4">
                {currentQuestion.points} б.
              </span>
            </div>
          </div>

          {/* Варианты ответов */}
          <div className="space-y-3 mb-8">
            {currentQuestion.type === 'text' ? (
              <input
                type="text"
                value={answers[currentQuestion.id]?.[0] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Введите ваш ответ здесь..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            ) : (
              currentQuestion.options?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                >
                  <input
                    type={currentQuestion.type === 'single' ? 'radio' : 'checkbox'}
                    name={`question-${currentQuestion.id}`}
                    checked={answers[currentQuestion.id]?.includes(option) || false}
                    onChange={() => handleAnswerChange(currentQuestion.id, option, currentQuestion.type === 'multiple')}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 flex-1">{option}</span>
                  {answers[currentQuestion.id]?.includes(option) && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </label>
              ))
            )}
          </div>

          {/* Навигация */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Назад
            </button>

            <div className="flex space-x-2">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                    index === currentQuestionIndex
                      ? 'bg-blue-500 text-white'
                      : answers[quiz.questions[index].id]
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                <span>Завершить тест</span>
                <CheckCircle className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
              >
                <span>Далее</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}