import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { Loader } from './components/Loader';
import { AnalysisResult } from './components/AnalysisResult';
import { ErrorModal } from './components/ErrorModal';
import { ProgressTracker } from './components/ProgressTracker';
import { CustomRoutine } from './components/CustomRoutine';
import { analyzeSkin } from './services/geminiService';
import type { AnalysisResult as AnalysisResultType, RoutineStep } from './types';

type AppState = 'IDLE' | 'ANALYZING' | 'RESULT' | 'ERROR';
type AppView = 'ANALYZER' | 'MY_ROUTINE';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [appView, setAppView] = useState<AppView>('ANALYZER');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<{ title: string; message: string } | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Register the service worker for PWA functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('EverGlow ServiceWorker registered: ', registration);
        }).catch(registrationError => {
          console.log('EverGlow ServiceWorker registration failed: ', registrationError);
        });
      });
    }
  }, []);

  const handleImageSelect = useCallback(async (imageBase64: string) => {
    setUploadedImage(imageBase64);
    setAppState('ANALYZING');
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeSkin(imageBase64);
      setAnalysisResult(result);
      setAppState('RESULT');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError({
        title: 'Analysis Failed',
        message: errorMessage,
      });
      setAppState('ERROR');
    }
  }, []);

  const handleReset = () => {
    setAppState('IDLE');
    setAnalysisResult(null);
    setError(null);
    setUploadedImage(null);
    setAppView('ANALYZER');
  };

  const handleNavigate = (view: AppView) => {
    setAppView(view);
  };
  
  const handleSaveRoutineAndNavigate = (result: AnalysisResultType) => {
    setAnalysisResult(result); // Pass the result to be used in CustomRoutine
    setAppView('MY_ROUTINE');
  };

  const getCurrentStep = () => {
    switch (appState) {
      case 'IDLE':
      case 'ERROR':
        return 0;
      case 'ANALYZING':
        return 1;
      case 'RESULT':
        return 2;
      default:
        return 0;
    }
  };
  
  const aiRoutineProp = analysisResult ? { 
    am: analysisResult.amRoutine, 
    pm: analysisResult.pmRoutine 
  } : undefined;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header onNavigate={handleNavigate} currentView={appView} />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        {appView === 'ANALYZER' ? (
          <>
            <ProgressTracker currentStep={getCurrentStep()} />
            <div className="w-full max-w-2xl bg-black/20 p-8 rounded-2xl border border-gray-700/50 shadow-xl">
              {appState === 'IDLE' && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-100">Get Your Personalized Skincare Routine</h2>
                    <p className="text-gray-400">Upload a selfie and let our AI analyze your skin.</p>
                  </div>
                  <ImageUploader onImageSelect={handleImageSelect} disabled={false} />
                </>
              )}
              {appState === 'ANALYZING' && <Loader />}
              {appState === 'RESULT' && analysisResult && (
                <div>
                  <AnalysisResult result={analysisResult} onSaveRoutine={handleSaveRoutineAndNavigate} />
                  <button
                    onClick={handleReset}
                    className="mt-8 w-full bg-rose-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    Analyze Another Photo
                  </button>
                </div>
              )}
              {appState === 'ERROR' && (
                <div className="animate-fade-in text-center">
                  {uploadedImage && <img src={uploadedImage} alt="User selfie" className="max-w-xs mx-auto rounded-lg mb-4" />}
                  <p className="text-gray-400 mb-4">Something went wrong. Please try again.</p>
                  <button
                    onClick={handleReset}
                    className="w-full bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <CustomRoutine aiGeneratedRoutine={aiRoutineProp} />
        )}
      </main>
      <Footer />
      {appState === 'ERROR' && error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onClose={handleReset}
        />
      )}
    </div>
  );
};

export default App;