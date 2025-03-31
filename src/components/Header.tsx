
import React from 'react';
import { Stethoscope } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Stethoscope className="h-6 w-6 text-medical-primary mr-2" />
          <h1 className="text-xl font-bold text-medical-dark">Daisy Scribe</h1>
        </div>
        <div className="text-sm font-medium text-medical-primary">
          Medical AI Assistant
        </div>
      </div>
    </header>
  );
};

export default Header;
