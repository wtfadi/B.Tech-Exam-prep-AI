
import React from 'react';
import { QuestionConfigData, Difficulty } from '../types';
import { DIFFICULTY_LEVELS } from '../constants';

interface QuestionConfigProps {
  config: QuestionConfigData;
  setConfig: React.Dispatch<React.SetStateAction<QuestionConfigData>>;
}

const QuestionConfig: React.FC<QuestionConfigProps> = ({ config, setConfig }) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'mcqs' | 'subjective') => {
    setConfig((prev) => ({ ...prev, [type]: parseInt(e.target.value, 10) || 0 }));
  };

  const handleDifficultyChange = (level: Difficulty) => {
    setConfig((prev) => ({ ...prev, difficulty: level }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">2. Configure Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="mcqs" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of MCQs</label>
          <input
            type="number"
            id="mcqs"
            value={config.mcqs}
            onChange={(e) => handleNumberChange(e, 'mcqs')}
            min="0"
            max="50"
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="subjective" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Subjective Questions</label>
          <input
            type="number"
            id="subjective"
            value={config.subjective}
            onChange={(e) => handleNumberChange(e, 'subjective')}
            min="0"
            max="20"
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty Level</label>
        <div className="flex space-x-2">
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => handleDifficultyChange(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                config.difficulty === level
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionConfig;
