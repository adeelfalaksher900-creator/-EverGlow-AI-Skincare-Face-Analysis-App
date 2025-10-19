import React from 'react';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';

interface ErrorModalProps {
  title: string;
  message: string;
  onClose: () => void;
  onCheckApiKey?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ title, message, onClose, onCheckApiKey }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 border border-red-700/50 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <AlertTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-300 mb-2">{title}</h2>
        <p className="text-red-400 mb-8">{message}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onClose}
            className="bg-gray-600 text-gray-100 font-semibold py-2 px-6 rounded-lg hover:bg-gray-500 transition-colors w-full sm:w-auto"
          >
            Try Again
          </button>
          {onCheckApiKey && (
            <button
              onClick={onCheckApiKey}
              className="bg-rose-500 text-white font-bold py-2 px-8 rounded-lg hover:bg-rose-600 transition-colors w-full sm:w-auto"
            >
              Check API Key
            </button>
          )}
        </div>
      </div>
    </div>
  );
};