
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-20 min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Buscando as melhores opções para si...</p>
    </div>
  );
};

export default LoadingSpinner;
