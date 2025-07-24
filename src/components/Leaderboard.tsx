import React from 'react';
import { Trophy, Medal, Award, User } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

export function Leaderboard() {
  const { users, attempts } = useQuiz();

  const leaderboardData = users
    .map(user => {
      const userAttempts = attempts.filter(attempt => attempt.userId === user.id);
      const recentAttempts = userAttempts.slice(-5);
      const averageRecent = recentAttempts.length > 0
        ? Math.round(recentAttempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalPoints) * 100, 0) / recentAttempts.length)
        : 0;

      return {
        ...user,
        recentAverage: averageRecent,
        bestScore: userAttempts.length > 0 
          ? Math.max(...userAttempts.map(attempt => (attempt.score / attempt.totalPoints) * 100))
          : 0
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-yellow-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{index + 1}</div>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-6">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Рейтинг</h2>
              <p className="text-purple-100">Лучшие участники тестов</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {leaderboardData.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Пользователи не найдены</p>
              <p className="text-gray-400">Пройдите несколько тестов, чтобы увидеть рейтинг!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div
                  key={user.id}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md
                    ${index < 3 
                      ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full font-bold
                      ${getRankBadge(index)}
                    `}>
                      {getRankIcon(index)}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Тестов: {user.quizzesCompleted}</span>
                        <span>•</span>
                        <span>Средний: {user.averageScore}%</span>
                        {user.bestScore > 0 && (
                          <>
                            <span>•</span>
                            <span>Лучший: {Math.round(user.bestScore)}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {user.totalPoints}
                    </div>
                    <div className="text-sm text-gray-500">баллов</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Статистика */}
          {leaderboardData.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Общая статистика</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {leaderboardData.reduce((sum, user) => sum + user.quizzesCompleted, 0)}
                  </div>
                  <div className="text-sm text-blue-700">Всего тестов пройдено</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(leaderboardData.reduce((sum, user) => sum + user.averageScore, 0) / leaderboardData.length) || 0}%
                  </div>
                  <div className="text-sm text-green-700">Средний результат</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {leaderboardData[0]?.totalPoints || 0}
                  </div>
                  <div className="text-sm text-purple-700">Максимум баллов</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}