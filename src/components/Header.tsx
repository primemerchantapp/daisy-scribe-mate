
import React from 'react';
import { Info, Volume2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/f8df9682-fe24-49d0-93e0-6d9187655ac9.png" 
            alt="Daisy Logo" 
            className="h-8 w-8 mr-3" 
          />
          <h1 className="text-xl font-medium text-gray-800 font-helvetica">Daisy | Medical Scribe AI</h1>
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-700 p-1 rounded-full hover:bg-gray-100">
            <Info size={24} />
          </button>
          <button className="text-gray-700 p-1 rounded-full hover:bg-gray-100">
            <Volume2 size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
