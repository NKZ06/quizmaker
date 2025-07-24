import React from 'react';
import { Calendar, User, Trophy, Tag } from 'lucide-react';
import { Quiz } from '../types';

interface QuizCardProps {
  quiz: Quiz;
  onTake: () => void;
}

export function QuizCard({ quiz, onTake }: QuizCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {quiz.title}
          </h3>
          <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full">
            <Trophy className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">{quiz.totalPoints} б.</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {quiz.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{quiz.createdBy}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(quiz.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
          
          <button
            onClick={onTake}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Пройти тест
          </button>
        </div>
      </div>
    </div>
  );
}