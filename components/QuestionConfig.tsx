
import React from 'react';
import { QuestionConfigData, Difficulty } from '../types';
import { DIFFICULTY_LEVELS } from '../constants';

interface QuestionConfigProps {
  config: QuestionConfigData;
  setConfig: React.Dispatch<React.SetStateAction<QuestionConfigData>>;
  stepNumber: number;
}

const QuestionConfig: React.FC<QuestionConfigProps> = ({ config, setConfig, stepNumber }) => {
  const handleChange = (field: keyof QuestionConfigData, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
          {stepNumber}
        </span>
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Customization</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-2">Focus Area</label>
          <input 
            type="text" 
            placeholder="e.g. Unit 3, 4 and Chapter 7"
            value={config.targetUnits}
            onChange={(e) => handleChange('targetUnits', e.target.value)}
            className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-2">MCQs</label>
            <input 
              type="number" 
              min="0" 
              max="50"
              value={config.mcqs}
              onChange={(e) => handleChange('mcqs', parseInt(e.target.value) || 0)}
              className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-2">Subjective</label>
            <input 
              type="number" 
              min="0" 
              max="20"
              value={config.subjective}
              onChange={(e) => handleChange('subjective', parseInt(e.target.value) || 0)}
              className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-2">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => handleChange('difficulty', level)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${
                  config.difficulty === level
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionConfig;
