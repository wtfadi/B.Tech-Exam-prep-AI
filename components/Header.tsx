
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0b0f1a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-slate-800 dark:text-white uppercase leading-none">ExamPrep.AI</h1>
            <p className="text-[9px] font-black text-indigo-500 tracking-[0.2em] uppercase mt-1">B.Tech Intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="hidden sm:inline hover:text-indigo-500 cursor-pointer transition-colors">Semester Hub</span>
          <span className="hidden sm:inline hover:text-indigo-500 cursor-pointer transition-colors">Resources</span>
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
