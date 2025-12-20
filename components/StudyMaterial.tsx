
import React, { useState } from 'react';
import { StudyMaterialData, MCQ, SubjectiveQuestion } from '../types';

interface StudyMaterialProps {
  data: StudyMaterialData;
}

const BoldParser: React.FC<{ text: string }> = ({ text }) => {
  // Regex to match **bold**, *bold*, or even combined cases
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part.slice(1, -1)}</strong>;
        }
        return part;
      })}
    </>
  );
};

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  let inTable = false;
  let tableRows: string[][] = [];

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        let trimmed = line.trim();
        
        // Handle Table Detection (Simple markdown table support)
        if (trimmed.startsWith('|')) {
          inTable = true;
          const cells = trimmed.split('|').filter(c => c.trim() !== '' || trimmed.indexOf('|'+c+'|') !== -1).map(c => c.trim());
          // Skip divider rows like |---|---|
          if (cells.every(c => c.match(/^-+$/))) return null;
          tableRows.push(cells);
          
          // If next line is not a table line, render the collected table
          if (i === lines.length - 1 || !lines[i+1].trim().startsWith('|')) {
            const currentTable = [...tableRows];
            tableRows = [];
            inTable = false;
            return (
              <div key={i} className="my-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white">
                    <tr>
                      {currentTable[0].map((cell, idx) => (
                        <th key={idx} className="px-6 py-4 font-black uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                          <BoldParser text={cell} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentTable.slice(1).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-6 py-4 text-slate-600 dark:text-slate-400">
                            <BoldParser text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return null;
        }

        if (!trimmed) return <div key={i} className="h-2" />;

        // Handle Sub-Headers ###
        if (trimmed.startsWith('###')) {
          const headerText = trimmed.replace(/^###\s*/, '');
          return (
            <h4 key={i} className="text-xl font-black text-slate-800 dark:text-white mt-10 mb-4 border-l-4 border-indigo-200 dark:border-indigo-900 pl-4">
              <BoldParser text={headerText} />
            </h4>
          );
        }
        
        // Handle Main Headers ##
        if (trimmed.startsWith('##')) {
          const headerText = trimmed.replace(/^##\s*/, '');
          return (
            <h3 key={i} className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-14 mb-8 pb-3 border-b-2 border-slate-100 dark:border-slate-800">
              <BoldParser text={headerText} />
            </h3>
          );
        }

        // Handle Blockquotes >
        if (trimmed.startsWith('>')) {
          return (
            <blockquote key={i} className="border-l-4 border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 p-6 rounded-r-3xl italic text-slate-700 dark:text-slate-300 my-8 shadow-sm">
              <BoldParser text={trimmed.replace(/^>\s*/, '')} />
            </blockquote>
          );
        }

        // Handle List Items
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
          const contentWithoutBullet = trimmed.replace(/^[-*]\s*|^\d+\.\s*/, '');
          return (
            <div key={i} className="flex gap-4 pl-4 py-1.5 group">
              <span className="text-indigo-500 font-black mt-1.5 shrink-0 text-lg group-hover:scale-125 transition-transform">●</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-lg">
                <BoldParser text={contentWithoutBullet} />
              </p>
            </div>
          );
        }

        // Handle Code Blocks
        if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
          return (
            <div key={i} className="bg-slate-100 dark:bg-slate-900 font-mono text-sm text-indigo-600 dark:text-indigo-400 p-4 rounded-2xl my-4 border border-slate-200 dark:border-slate-800 overflow-x-auto">
              {trimmed.replace(/`/g, '')}
            </div>
          );
        }

        // Default Paragraph
        return (
          <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-lg mb-4">
            <BoldParser text={trimmed} />
          </p>
        );
      })}
    </div>
  );
};

const StudyMaterial: React.FC<StudyMaterialProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'mcqs' | 'subjective'>('notes');

  return (
    <div className="bg-white dark:bg-[#0b0f1a] shadow-2xl rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 transition-all">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 min-w-[160px] py-7 px-6 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-4 ${
            activeTab === 'notes'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-[#0b0f1a]'
              : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
          }`}
        >
          Professor's Book
        </button>
        {data.mcqs.length > 0 && (
          <button
            onClick={() => setActiveTab('mcqs')}
            className={`flex-1 min-w-[160px] py-7 px-6 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-4 ${
              activeTab === 'mcqs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-[#0b0f1a]'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            Practice Set
          </button>
        )}
        {data.subjectiveQuestions.length > 0 && (
          <button
            onClick={() => setActiveTab('subjective')}
            className={`flex-1 min-w-[160px] py-7 px-6 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-4 ${
              activeTab === 'subjective'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-[#0b0f1a]'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
            }`}
          >
            Exam Q&A
          </button>
        )}
      </div>

      <div className="p-8 md:p-16 max-w-5xl mx-auto">
        {activeTab === 'notes' && (
          <div className="animate-in fade-in duration-1000">
            <div className="mb-16">
              <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">
                Unit-wise <span className="text-indigo-600">Encyclopedic</span> Notes
              </h2>
              <p className="text-slate-500 font-bold text-lg">Comprehensive B.Tech curriculum coverage by Senior Faculty.</p>
            </div>
            
            <div className="space-y-32">
              {data.notes.map((note, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-16 top-0 text-slate-100 dark:text-slate-900 text-[10rem] font-black leading-none select-none pointer-events-none transition-colors">
                    {index + 1}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-12 pl-10 border-l-[12px] border-indigo-600 tracking-tight">
                      {note.topic}
                    </h3>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <MarkdownRenderer content={note.content} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mcqs' && (
          <div className="animate-in fade-in duration-500">
             <div className="mb-12">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Self-Assessment <span className="text-indigo-600">MCQs</span>
              </h2>
              <p className="text-slate-500 font-medium mt-2">Test your conceptual depth before moving to descriptive questions.</p>
            </div>
            <div className="space-y-8">
              {data.mcqs.map((mcq, index) => (
                <MCQItem key={index} mcq={mcq} index={index} />
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'subjective' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-12 tracking-tight">
              University <span className="text-indigo-600">Model Answers</span>
            </h2>
            <div className="space-y-20">
              {data.subjectiveQuestions.map((sq, index) => (
                <SubjectiveQuestionItem key={index} sq={sq} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const MCQItem: React.FC<{ mcq: MCQ, index: number }> = ({ mcq, index }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const isAnswered = selectedOption !== null;

  return (
    <div className="p-10 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] transition-all">
      <p className="text-2xl font-black text-slate-900 dark:text-white mb-10 leading-snug">
        <span className="text-indigo-600 mr-4">Q{index + 1}.</span> {mcq.question}
      </p>
      <div className="grid grid-cols-1 gap-5">
        {mcq.options.map((option, i) => {
          const isCorrect = option === mcq.correctAnswer;
          const isSelected = option === selectedOption;

          let optionClass = 'w-full text-left p-6 rounded-3xl border-2 transition-all font-bold text-base flex items-center gap-6 ';
          
          if (isAnswered) {
            if (isCorrect) {
              optionClass += ' bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-8 ring-emerald-500/5';
            } else if (isSelected && !isCorrect) {
              optionClass += ' bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-800 dark:text-rose-300 ring-8 ring-rose-500/5';
            } else {
              optionClass += ' bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-40 scale-[0.98]';
            }
          } else {
            optionClass += ' bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-600 hover:scale-[1.01] shadow-sm';
          }

          return (
            <button
              key={i}
              onClick={() => !isAnswered && setSelectedOption(option)}
              className={optionClass}
            >
              <span className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm uppercase font-black shrink-0 border border-slate-200 dark:border-slate-700">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 leading-tight">{option}</span>
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <div className="mt-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 text-sm font-bold animate-in slide-in-from-top-2 duration-300">
          Correct Answer: {mcq.correctAnswer}
        </div>
      )}
    </div>
  );
};

const SubjectiveQuestionItem: React.FC<{ sq: SubjectiveQuestion, index: number }> = ({ sq, index }) => {
  return (
    <div className="relative group">
      <div className="absolute -left-10 top-0 bottom-0 w-2 bg-indigo-600 rounded-full group-hover:w-3 transition-all duration-300 shadow-lg shadow-indigo-500/50"></div>
      <p className="text-3xl font-black text-slate-900 dark:text-white mb-10 leading-tight tracking-tight">
        {sq.question}
      </p>
      <div className="bg-slate-50/80 dark:bg-slate-900/40 p-12 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <h4 className="text-[12px] uppercase font-black tracking-[0.4em] text-indigo-600 mb-10 border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-4 inline-block">Comprehensive Exam Script Answer</h4>
        <div className="text-slate-700 dark:text-slate-300">
           <MarkdownRenderer content={sq.modelAnswer} />
        </div>
      </div>
    </div>
  );
};

export default StudyMaterial;
