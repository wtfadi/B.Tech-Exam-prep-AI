import React, { useState } from 'react';
import { StudyMaterialData, MCQ, SubjectiveQuestion } from '../types';

interface StudyMaterialProps {
  data: StudyMaterialData;
}

const StudyMaterial: React.FC<StudyMaterialProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white border-b-2 border-indigo-500 pb-2 mb-6">
          Study Notes
        </h2>
        <div className="space-y-6 prose prose-lg dark:prose-invert max-w-none">
          {data.notes.map((note, index) => (
            <div key={index}>
              <h3 className="font-semibold text-xl text-indigo-600 dark:text-indigo-400">{note.topic}</h3>
              <p className="whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      </div>

      {data.mcqs.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white border-b-2 border-indigo-500 pb-2 mb-6">
            Multiple Choice Questions
          </h2>
          <div className="space-y-6">
            {data.mcqs.map((mcq, index) => (
              <MCQItem key={index} mcq={mcq} index={index} />
            ))}
          </div>
        </div>
      )}
      
      {data.subjectiveQuestions.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white border-b-2 border-indigo-500 pb-2 mb-6">
            Subjective Questions
          </h2>
          <div className="space-y-8">
            {data.subjectiveQuestions.map((sq, index) => (
              <SubjectiveQuestionItem key={index} sq={sq} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const MCQItem: React.FC<{ mcq: MCQ, index: number }> = ({ mcq, index }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const isAnswered = selectedOption !== null;

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <p className="font-semibold mb-3">{index + 1}. {mcq.question}</p>
      <div className="space-y-2">
        {mcq.options.map((option, i) => {
          const isCorrect = option === mcq.correctAnswer;
          const isSelected = option === selectedOption;

          let optionClass = 'w-full text-left p-3 rounded-lg border transition-all duration-300 disabled:cursor-not-allowed';
          
          if (isAnswered) {
            if (isCorrect) {
              optionClass += ' bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-100 font-semibold';
            } else if (isSelected && !isCorrect) {
              optionClass += ' bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-100 line-through';
            } else {
              optionClass += ' bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60';
            }
          } else {
            optionClass += ' bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:border-indigo-500 cursor-pointer';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
              className={optionClass}
              aria-pressed={isSelected}
            >
              {option}
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div className="mt-4 p-3 rounded-lg text-sm font-medium">
          {selectedOption === mcq.correctAnswer ? (
            <p className="text-green-700 dark:text-green-300">✅ Correct! Well done.</p>
          ) : (
            <p className="text-red-700 dark:text-red-300">
              ❌ Incorrect. The correct answer is highlighted above.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const SubjectiveQuestionItem: React.FC<{ sq: SubjectiveQuestion, index: number }> = ({ sq, index }) => {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <p className="font-semibold mb-3">{index + 1}. {sq.question}</p>
      <details className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md cursor-pointer">
        <summary className="font-medium text-indigo-600 dark:text-indigo-400">View Model Answer</summary>
        <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{sq.modelAnswer}</p>
      </details>
    </div>
  );
};


export default StudyMaterial;