
import React from 'react';
import { Info, Volume2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative mr-3">
            <img 
              src="/lovable-uploads/db67eac0-b997-44d1-a13d-295aeae19d65.png" 
              alt="Scribe Medic Logo" 
              className="h-10 w-auto" 
            />
          </div>
          <h1 className="text-xl font-medium text-gray-800 font-helvetica">Scribe Medic</h1>
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
