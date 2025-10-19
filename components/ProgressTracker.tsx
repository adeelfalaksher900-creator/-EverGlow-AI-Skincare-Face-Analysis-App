import React from 'react';

interface ProgressTrackerProps {
  currentStep: number;
}

const steps = ['Upload Photo', 'AI Analysis', 'View Results'];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          return (
            <li
              key={step}
              className={`flex w-full items-center ${
                index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block" : ""
              } ${isCompleted ? 'after:border-rose-500' : 'after:border-gray-700'}`}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-colors duration-300
                ${isCurrent ? 'bg-rose-500 border-2 border-rose-300' : isCompleted ? 'bg-rose-500' : 'bg-gray-700'}"
              >
                <span className={`font-bold text-white`}>{index + 1}</span>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="text-center mt-2 text-lg font-semibold text-gray-200 transition-all duration-300">
        {steps[currentStep]}
      </div>
    </div>
  );
};
