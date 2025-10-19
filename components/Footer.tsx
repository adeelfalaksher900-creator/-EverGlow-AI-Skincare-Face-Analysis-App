import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/20 border-t border-gray-700/50">
      <div className="container mx-auto px-4 py-4 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} EverGlow. All rights reserved.</p>
      </div>
    </footer>
  );
};