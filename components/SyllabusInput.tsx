
import React from 'react';
import { SyllabusData } from '../types';

interface SyllabusInputProps {
  syllabus: SyllabusData;
  setSyllabus: React.Dispatch<React.SetStateAction<SyllabusData>>;
  mode: 'syllabus' | 'reference';
  stepNumber: number;
  title: string;
  description?: string;
}

const SyllabusInput: React.FC<SyllabusInputProps> = ({ 
  syllabus, 
  setSyllabus, 
  mode, 
  stepNumber,
  title,
  description 
}) => {
  const isSyllabus = mode === 'syllabus';

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isSyllabus) {
      setSyllabus((prev) => ({ ...prev, text: e.target.value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSyllabus((prev) => ({
        ...prev,
        [isSyllabus ? 'files' : 'referenceFiles']: [...prev[isSyllabus ? 'files' : 'referenceFiles'], ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setSyllabus((prev) => ({
      ...prev,
      [isSyllabus ? 'files' : 'referenceFiles']: prev[isSyllabus ? 'files' : 'referenceFiles'].filter((_, i) => i !== index)
    }));
  };

  const currentFiles = isSyllabus ? syllabus.files : syllabus.referenceFiles;

  return (
    <div className="space-y-5 h-full flex flex-col">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
          {stepNumber}
        </span>
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{title}</h3>
      </div>
      
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{description}</p>}

      {isSyllabus && (
        <textarea
          value={syllabus.text}
          onChange={handleTextChange}
          placeholder="Paste text syllabus here..."
          className="w-full min-h-[120px] p-4 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
        />
      )}

      <div className="relative group border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-xl p-6 transition-all cursor-pointer">
        <input 
          type="file" 
          multiple 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={handleFileChange}
          accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
        />
        <div className="text-center space-y-1">
          <svg className="w-8 h-8 mx-auto text-slate-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Add {isSyllabus ? 'Syllabus' : 'Notes'} Files</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto max-h-[150px] space-y-2 pr-1">
        {currentFiles.map((file, idx) => (
          <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg group">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
              <span className="text-[10px] font-bold truncate max-w-[140px]">{file.name}</span>
            </div>
            <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-rose-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusInput;
