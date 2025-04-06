
import React from 'react';
import { List, FileText, Mic, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ScribeMedicIcon = () => (
  <svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-8 w-8"
  >
    {/* Book base */}
    <path d="M6 9.5h12c.3 0 .5.2.5.5v8c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5v-8c0-.3.2-.5.5-.5z" stroke="white" strokeWidth="1.5" />
    <path d="M18 9.5l-3-4.5H9L6 9.5M9 5v4.5m6-4.5v4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Feather pen */}
    <path d="M19 4l-3 3m0 0l3 3m-3-3h3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Medical heart */}
    <path d="M9 15.5a2 2 0 012-2h2a2 2 0 012 2v.5a2 2 0 01-2 2h-2a2 2 0 01-2-2v-.5z" stroke="white" strokeWidth="1.5" />
    <path d="M12 4.5c-.4 0-.7.3-.7.7s.3.7.7.7.7-.3.7-.7-.3-.7-.7-.7z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 15.5l1-6.5m8 6.5l-1-6.5m-3 .5V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BottomNavbar = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        <Link to="/list" className={`flex flex-col items-center justify-center w-full py-1 ${location.pathname === '/list' ? 'text-black' : 'text-gray-500'}`}>
          <List size={24} className={location.pathname === '/list' ? 'text-black' : 'text-gray-500'} />
          <span className="text-xs mt-1 font-helvetica">List</span>
        </Link>
        
        <Link to="/template" className={`flex flex-col items-center justify-center w-full py-1 ${location.pathname === '/template' ? 'text-black' : 'text-gray-500'}`}>
          <FileText size={24} className={location.pathname === '/template' ? 'text-black' : 'text-gray-500'} />
          <span className="text-xs mt-1 font-helvetica">Template</span>
        </Link>
        
        <div className="relative w-full flex justify-center items-center">
          <div className="absolute -top-8 bg-black p-4 rounded-full shadow-md">
            <ScribeMedicIcon />
          </div>
          <span className="text-xs mt-10 text-gray-500 font-helvetica">Scribe</span>
        </div>
        
        <Link to="/voice" className={`flex flex-col items-center justify-center w-full py-1 ${location.pathname === '/voice' ? 'text-black' : 'text-gray-500'}`}>
          <Mic size={24} className={location.pathname === '/voice' ? 'text-black' : 'text-gray-500'} />
          <span className="text-xs mt-1 font-helvetica">Voice</span>
        </Link>
        
        <Link to="/profile" className={`flex flex-col items-center justify-center w-full py-1 ${location.pathname === '/profile' ? 'text-black' : 'text-gray-500'}`}>
          <User size={24} className={location.pathname === '/profile' ? 'text-black' : 'text-gray-500'} />
          <span className="text-xs mt-1 font-helvetica">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavbar;
