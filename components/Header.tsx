import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { ListPlusIcon } from './icons/ListPlusIcon';
import { BackIcon } from './icons/BackIcon';

interface HeaderProps {
    onNavigate: (view: 'ANALYZER' | 'MY_ROUTINE') => void;
    currentView: 'ANALYZER' | 'MY_ROUTINE';
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="py-4 border-b border-gray-800">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            {currentView === 'MY_ROUTINE' && (
               <button
                  onClick={() => onNavigate('ANALYZER')}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full -ml-1"
                  aria-label="Go back to Analyzer"
              >
                  <BackIcon className="w-6 h-6" />
              </button>
            )}
            <div 
                className="flex items-center cursor-pointer"
                onClick={() => onNavigate('ANALYZER')}
                role="button"
                aria-label="Go to AI Analyzer"
            >
              <SparklesIcon className="w-8 h-8 text-rose-400 mr-3" />
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">
                EverGlow AI
              </h1>
            </div>
        </div>
        <button
            onClick={() => onNavigate('MY_ROUTINE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentView === 'MY_ROUTINE' ? 'bg-rose-500/20 text-rose-300' : 'text-gray-400 hover:bg-gray-800'}`}
            aria-label="Go to My Routine"
        >
            <ListPlusIcon className="w-5 h-5" />
            <span className="font-semibold">My Routine</span>
        </button>
      </div>
    </header>
  );
};
