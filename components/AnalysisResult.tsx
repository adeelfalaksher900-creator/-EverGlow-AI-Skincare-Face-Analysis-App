import React from 'react';
import type { AnalysisResult as AnalysisResultType } from '../types';
import { AnimatedText } from './AnimatedText';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onSaveRoutine: (result: AnalysisResultType) => void;
}

const Card: React.FC<{title: string; children: React.ReactNode; className?: string}> = ({ title, children, className }) => (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 ${className}`}>
        <h3 className="text-xl font-bold text-rose-400 mb-4">{title}</h3>
        {children}
    </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onSaveRoutine }) => {
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-100 mb-2">Your Personalized Skin Analysis</h2>
            <p className="text-gray-400">Here's what EverGlow AI discovered about your skin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Skin Type">
                <p className="text-2xl font-semibold text-gray-200">{result.skinType}</p>
            </Card>
             <Card title="Primary Concerns">
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {result.skinIssues.map((issue, index) => <li key={index}>{issue}</li>)}
                </ul>
            </Card>
        </div>

        <Card title="✨ Your Custom Routine">
            <div className="flex justify-end mb-4">
               <button 
                  onClick={() => onSaveRoutine(result)}
                  className="bg-rose-500/20 text-rose-300 font-semibold py-2 px-4 rounded-lg hover:bg-rose-500/40 transition-colors text-sm"
               >
                  Save to My Routine
               </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-lg text-gray-200 mb-3">☀️ AM Routine</h4>
                    <ol className="relative border-l border-gray-600 space-y-6 pl-6">
                        {result.amRoutine.map((item, index) => (
                            <li key={index} className="text-sm">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-700 rounded-full -left-3 ring-4 ring-gray-800 text-rose-400">{index + 1}</span>
                                <h5 className="font-semibold text-gray-100">{item.step}</h5>
                                <p className="text-gray-400">{item.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg text-gray-200 mb-3">🌙 PM Routine</h4>
                    <ol className="relative border-l border-gray-600 space-y-6 pl-6">
                        {result.pmRoutine.map((item, index) => (
                            <li key={index} className="text-sm">
                                <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-700 rounded-full -left-3 ring-4 ring-gray-800 text-rose-400">{index + 1}</span>
                                <h5 className="font-semibold text-gray-100">{item.step}</h5>
                                <p className="text-gray-400">{item.description}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </Card>

        <Card title="🛍️ Product Recommendations">
            <div className="space-y-4">
            {result.productRecommendations.map((prod, index) => (
                <div key={index} className="p-4 bg-gray-900/70 rounded-lg border border-gray-700">
                    <p className="font-bold text-gray-200">{prod.name} <span className="text-xs font-normal bg-rose-500/20 text-rose-300 px-2 py-1 rounded-full ml-2">{prod.productType}</span></p>
                    <p className="text-gray-400 text-sm mt-1"><AnimatedText text={prod.reason} /></p>
                </div>
            ))}
            </div>
        </Card>

    </div>
  );
};
