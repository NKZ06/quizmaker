import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from './QuizCard';

interface QuizListProps {
  onTakeQuiz: (quizId: string) => void;
}

export function QuizList({ onTakeQuiz }: QuizListProps) {
  const { quizzes } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    quizzes.forEach(quiz => quiz.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.some(tag => quiz.tags.includes(tag));
      return matchesSearch && matchesTags;
    });
  }, [quizzes, searchTerm, selectedTags]);

  const paginatedQuizzes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredQuizzes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredQuizzes, currentPage]);

  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Поиск и фильтры */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Поиск тестов..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Теги:</span>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            {(searchTerm || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span>Очистить</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Результаты поиска */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Показано {paginatedQuizzes.length} из {filteredQuizzes.length} тестов
        </p>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200"
            >
              Назад
            </button>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
              {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors duration-200"
            >
              Вперед
            </button>
          </div>
        )}
      </div>

      {/* Сетка тестов */}
      {paginatedQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedQuizzes.map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onTake={() => onTakeQuiz(quiz.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Тесты не найдены</div>
          <p className="text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
        </div>
      )}
    </div>
  );
}