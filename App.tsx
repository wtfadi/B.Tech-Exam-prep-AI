
import React, { useState, useCallback } from 'react';
import { SyllabusData, QuestionConfigData, StudyMaterialData, Difficulty, FileContent, UnitSummary } from './types';
import SyllabusInput from './components/SyllabusInput';
import QuestionConfig from './components/QuestionConfig';
import StudyMaterial from './components/StudyMaterial';
import Loader from './components/Loader';
import Header from './components/Header';
import Footer from './components/Footer';
import { extractUnits, generateStudyMaterialForUnit } from './services/geminiService';

const App: React.FC = () => {
  const [syllabus, setSyllabus] = useState<SyllabusData>({ 
    text: '', 
    files: [],
    referenceFiles: [] 
  });
  const [questionConfig, setQuestionConfig] = useState<QuestionConfigData>({
    mcqs: 5,
    subjective: 3,
    difficulty: Difficulty.Medium,
    targetUnits: '',
  });
  
  const [units, setUnits] = useState<UnitSummary[]>([]);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [unitContent, setUnitContent] = useState<Record<string, StudyMaterialData>>({});
  const [unitLoading, setUnitLoading] = useState<Record<string, boolean>>({});

  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<FileContent> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({ mimeType: file.type, data: base64String, name: file.name });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleStartAnalysis = useCallback(async () => {
    const hasSyllabus = syllabus.text.trim() || syllabus.files.length > 0;
    if (!hasSyllabus) {
      setError('Please provide at least a syllabus to start.');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setUnits([]);
    setUnitContent({});
    setActiveUnitId(null);

    try {
      const syllabusFiles = await Promise.all(syllabus.files.map(fileToBase64));
      const extracted = await extractUnits(syllabus.text, syllabusFiles);
      setUnits(extracted);
      if (extracted.length > 0) {
        // Don't auto-load, let user choose
      }
    } catch (e) {
      console.error(e);
      setError('Analysis failed. Check your syllabus files.');
    } finally {
      setIsExtracting(false);
    }
  }, [syllabus]);

  const loadUnitContent = async (unit: UnitSummary) => {
    if (unitContent[unit.id]) {
      setActiveUnitId(unit.id);
      return;
    }

    setActiveUnitId(unit.id);
    setUnitLoading(prev => ({ ...prev, [unit.id]: true }));

    try {
      const syllabusFiles = await Promise.all(syllabus.files.map(fileToBase64));
      const refFiles = await Promise.all(syllabus.referenceFiles.map(fileToBase64));
      
      const result = await generateStudyMaterialForUnit(
        unit,
        syllabus.text,
        syllabusFiles,
        refFiles,
        questionConfig
      );
      
      setUnitContent(prev => ({ ...prev, [unit.id]: result }));
    } catch (e) {
      console.error(e);
      setError(`Failed to generate content for ${unit.title}.`);
    } finally {
      setUnitLoading(prev => ({ ...prev, [unit.id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f1a] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {units.length === 0 && !isExtracting && (
          <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white">
                B.Tech <span className="text-indigo-600">Smart Textbook</span>
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium text-lg">Upload your syllabus and let the Professor generate an exhaustive guide Unit-by-Unit.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl">
                <SyllabusInput 
                  syllabus={syllabus} 
                  setSyllabus={setSyllabus} 
                  mode="syllabus" 
                  stepNumber={1}
                  title="Official Syllabus"
                />
              </div>

              <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl">
                <SyllabusInput 
                  syllabus={syllabus} 
                  setSyllabus={setSyllabus} 
                  mode="reference" 
                  stepNumber={2}
                  title="Class Notes"
                  description="Upload slides/handwritten notes to specialize the content."
                />
              </div>

              <div className="bg-white dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col">
                <QuestionConfig config={questionConfig} setConfig={setQuestionConfig} stepNumber={3} />
                
                <div className="mt-auto pt-8">
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-6 rounded-[1.5rem] transition-all transform active:scale-[0.98] shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 text-lg"
                  >
                    🔍 Analyze & Build Book
                  </button>
                  {error && <p className="mt-4 text-sm text-rose-500 text-center font-bold px-4 py-2 bg-rose-50 dark:bg-rose-900/20 rounded-xl">{error}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {isExtracting && <Loader message="Analyzing syllabus structure and extracting units..." />}
        
        {units.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Unit Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1 space-y-4 h-fit sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Chapters Identified</h4>
                  <button 
                    onClick={() => { setUnits([]); setActiveUnitId(null); setUnitContent({}); }}
                    className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:underline"
                  >
                    Reset
                  </button>
                </div>
                {units.map((unit) => (
                  <button
                    key={unit.id}
                    onClick={() => loadUnitContent(unit)}
                    className={`w-full text-left p-6 rounded-[1.8rem] border-2 transition-all flex flex-col gap-2 relative overflow-hidden group ${
                      activeUnitId === unit.id
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-widest ${activeUnitId === unit.id ? 'text-indigo-200' : 'text-indigo-500'}`}>
                      {unitLoading[unit.id] ? 'Generating...' : unitContent[unit.id] ? 'Completed' : 'Click to Load'}
                    </span>
                    <h5 className="font-black text-sm leading-tight">{unit.title}</h5>
                    <p className={`text-[10px] line-clamp-2 ${activeUnitId === unit.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {unit.description}
                    </p>
                    {unitLoading[unit.id] && (
                      <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-progress w-full"></div>
                    )}
                  </button>
                ))}
              </aside>

              <div className="lg:col-span-3">
                {!activeUnitId ? (
                  <div className="bg-white dark:bg-slate-800/40 p-16 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center opacity-60">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Ready to Study?</h3>
                    <p className="max-w-xs font-medium text-slate-500">Select a unit from the sidebar to generate exhaustive, professor-grade notes instantly.</p>
                  </div>
                ) : unitLoading[activeUnitId] ? (
                  <div className="animate-in fade-in duration-500">
                    <Loader message={`Professor is writing exhaustive notes for "${units.find(u => u.id === activeUnitId)?.title}"... This may take up to 30 seconds.`} />
                  </div>
                ) : unitContent[activeUnitId] ? (
                  <StudyMaterial data={unitContent[activeUnitId]} />
                ) : null}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
