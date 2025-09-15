
import React, { useState, useCallback } from 'react';
import { SyllabusData, QuestionConfigData, StudyMaterialData, Difficulty, FileContent } from './types';
import SyllabusInput from './components/SyllabusInput';
import QuestionConfig from './components/QuestionConfig';
import StudyMaterial from './components/StudyMaterial';
import Loader from './components/Loader';
import Header from './components/Header';
import Footer from './components/Footer';
import { generateStudyMaterial } from './services/geminiService';

const App: React.FC = () => {
  const [syllabus, setSyllabus] = useState<SyllabusData>({ text: '', files: [] });
  const [questionConfig, setQuestionConfig] = useState<QuestionConfigData>({
    mcqs: 10,
    subjective: 5,
    difficulty: Difficulty.Medium,
  });
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterialData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const handleGenerate = useCallback(async () => {
    if (!syllabus.text.trim()) {
      setError('Syllabus content cannot be empty.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStudyMaterial(null);

    try {
      const fileContents = await Promise.all(syllabus.files.map(fileToBase64));
      const result = await generateStudyMaterial(syllabus.text, fileContents, questionConfig);
      setStudyMaterial(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate study material. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [syllabus, questionConfig]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8">
            Provide your syllabus and desired question types to generate comprehensive study notes and practice questions.
          </p>

          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 space-y-8">
            <SyllabusInput syllabus={syllabus} setSyllabus={setSyllabus} />
            <QuestionConfig config={questionConfig} setConfig={setQuestionConfig} />

            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !syllabus.text.trim()}
                className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isLoading ? 'Generating...' : 'Generate Study Material'}
              </button>
            </div>
          </div>
          
          {error && <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}

          {isLoading && <Loader />}
          
          {studyMaterial && !isLoading && (
            <div className="mt-12">
              <StudyMaterial data={studyMaterial} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
