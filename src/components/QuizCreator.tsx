import React, { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { Question } from '../types';

export function QuizCreator() {
  const { addQuiz, currentUser } = useQuiz();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const createEmptyQuestion = (): Question => ({
    id: Date.now().toString(),
    type: 'single',
    question: '',
    options: ['', '', '', ''],
    correctAnswers: [],
    points: 10
  });

  const addQuestion = () => {
    setQuestions([...questions, createEmptyQuestion()]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, ...updates } : q));
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0 || !currentUser) return;

    setIsCreating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addQuiz({
        title: title.trim(),
        description: description.trim(),
        tags,
        questions: questions.filter(q => q.question.trim()),
        createdBy: currentUser.name
      });

      // Сброс формы
      setTitle('');
      setDescription('');
      setTags([]);
      setQuestions([]);
      
      alert('Тест успешно создан!');
    } catch (error) {
      alert('Ошибка при создании теста. Попробуйте еще раз.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Создать новый тест</h2>
          <p className="text-blue-100 mt-1">Создайте увлекательный тест для вашей аудитории</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Название теста *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите увлекательное название..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Описание
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Краткое описание теста..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Теги */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Теги
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Добавить тег..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
              >
                Добавить
              </button>
            </div>
          </div>

          {/* Вопросы */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Вопросы</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Добавить вопрос</span>
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(updates) => updateQuestion(index, updates)}
                  onRemove={() => removeQuestion(index)}
                />
              ))}
              
              {questions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Вопросы еще не добавлены. Нажмите "Добавить вопрос" чтобы начать.</p>
                </div>
              )}
            </div>
          </div>

          {/* Отправка */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={!title.trim() || questions.length === 0 || !currentUser || isCreating}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Создание...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Создать тест</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onRemove: () => void;
}

function QuestionEditor({ question, index, onUpdate, onRemove }: QuestionEditorProps) {
  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    onUpdate({ options: newOptions });
  };

  const toggleCorrectAnswer = (answer: string) => {
    if (question.type === 'single') {
      onUpdate({ correctAnswers: [answer] });
    } else {
      const newCorrectAnswers = question.correctAnswers.includes(answer)
        ? question.correctAnswers.filter(a => a !== answer)
        : [...question.correctAnswers, answer];
      onUpdate({ correctAnswers: newCorrectAnswers });
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-medium text-gray-800">Вопрос {index + 1}</h4>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текст вопроса *
            </label>
            <textarea
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              placeholder="Введите ваш вопрос..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              required
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип вопроса
              </label>
              <select
                value={question.type}
                onChange={(e) => onUpdate({ 
                  type: e.target.value as Question['type'],
                  correctAnswers: []
                })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="single">Один ответ</option>
                <option value="multiple">Несколько ответов</option>
                <option value="text">Текстовый ответ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Баллы
              </label>
              <input
                type="number"
                value={question.points}
                onChange={(e) => onUpdate({ points: Math.max(1, parseInt(e.target.value) || 1) })}
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {question.type !== 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Варианты ответов {question.type === 'multiple' ? '(Отметьте все правильные)' : '(Выберите правильный)'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-3">
                  <input
                    type={question.type === 'single' ? 'radio' : 'checkbox'}
                    name={`question-${question.id}`}
                    checked={question.correctAnswers.includes(option)}
                    onChange={() => toggleCorrectAnswer(option)}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(optionIndex, e.target.value)}
                    placeholder={`Вариант ${optionIndex + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Правильный ответ(ы) (разделите несколько ответов запятыми)
            </label>
            <input
              type="text"
              value={question.correctAnswers.join(', ')}
              onChange={(e) => onUpdate({ 
                correctAnswers: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
              })}
              placeholder="Введите правильный ответ(ы)..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        )}
      </div>
    </div>
  );
}