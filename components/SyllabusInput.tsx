
import React, { useCallback } from 'react';
import { SyllabusData } from '../types';

interface SyllabusInputProps {
  syllabus: SyllabusData;
  setSyllabus: React.Dispatch<React.SetStateAction<SyllabusData>>;
}

const SyllabusInput: React.FC<SyllabusInputProps> = ({ syllabus, setSyllabus }) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSyllabus((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSyllabus((prev) => ({ ...prev, files: [...prev.files, ...Array.from(e.target.files)] }));
    }
  };
  
  const removeFile = useCallback((index: number) => {
    setSyllabus(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  }, [setSyllabus]);


  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">1. Enter Your Syllabus</h2>
      <textarea
        value={syllabus.text}
        onChange={handleTextChange}
        placeholder="e.g., Data Structures: Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Hashing..."
        className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
      />
      
      <div>
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">Optional: Upload Supporting Files</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Upload PDFs, PowerPoints, or images of notes and books.</p>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
             <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            <div className="flex text-sm text-gray-600 dark:text-gray-400">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png"/>
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">PDF, PPT, PNG, JPG up to 10MB</p>
          </div>
        </div>

        {syllabus.files.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">Uploaded files:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {syllabus.files.map((file, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center">
                  <span>{file.name}</span>
                  <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 ml-4 font-bold">
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusInput;
