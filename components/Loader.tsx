import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const analysisSteps = [
    "Analyzing skin texture & pores...",
    "Identifying potential concerns...",
    "Assessing skin tone evenness...",
    "Formulating personalized routine...",
    "Selecting product recommendations...",
    "Finalizing your glow-up plan..."
];

export const Loader: React.FC = () => {
    const [currentStep, setCurrentStep] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % analysisSteps.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <SparklesIcon className="w-16 h-16 text-rose-400 animate-pulse-slow mb-6" />
            <h2 className="text-2xl font-bold text-gray-100 mb-2">EverGlow AI is analyzing...</h2>
            <p className="text-gray-400 transition-opacity duration-500 ease-in-out">
                {analysisSteps[currentStep]}
            </p>
        </div>
    );
};
