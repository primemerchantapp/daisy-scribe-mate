
import React from 'react';
import { List, FileText, Mic, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavbar = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-16">
        <Link to="/list" className="flex flex-col items-center justify-center w-full py-1">
          <List size={24} className="text-gray-700" />
          <span className="text-xs mt-1 text-gray-700 font-helvetica">List</span>
        </Link>
        
        <Link to="/template" className="flex flex-col items-center justify-center w-full py-1">
          <FileText size={24} className="text-gray-700" />
          <span className="text-xs mt-1 text-gray-700 font-helvetica">Template</span>
        </Link>
        
        <div className="relative w-full flex justify-center items-center">
          <div className="absolute -top-8 bg-blue-600 p-4 rounded-full shadow-lg">
            <img 
              src="/lovable-uploads/f8df9682-fe24-49d0-93e0-6d9187655ac9.png" 
              alt="Daisy Logo" 
              className="h-8 w-8 text-white" 
            />
          </div>
          <span className="text-xs mt-10 text-gray-700 font-helvetica">Daisy</span>
        </div>
        
        <Link to="/voice" className="flex flex-col items-center justify-center w-full py-1">
          <Mic size={24} className="text-gray-700" />
          <span className="text-xs mt-1 text-gray-700 font-helvetica">Voice</span>
        </Link>
        
        <Link to="/profile" className="flex flex-col items-center justify-center w-full py-1">
          <User size={24} className="text-gray-700" />
          <span className="text-xs mt-1 text-gray-700 font-helvetica">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavbar;
