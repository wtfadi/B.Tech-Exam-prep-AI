
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">AI is working its magic... Please wait.</p>
    </div>
  );
};

export default Loader;
