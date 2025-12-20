
import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center my-24 animate-in fade-in zoom-in duration-500">
      <div className="relative">
        <div className="w-24 h-24 border-8 border-slate-100 dark:border-slate-800 rounded-full"></div>
        <div className="absolute top-0 w-24 h-24 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
           <svg className="w-8 h-8 text-indigo-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
             <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
           </svg>
        </div>
      </div>
      <div className="mt-12 text-center max-w-sm">
        <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">AI Professor is Thinking</p>
        <p className="mt-2 text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {message || "Extracting formulas, topics, and generating practice sets..."}
        </p>
      </div>
    </div>
  );
};

export default Loader;
