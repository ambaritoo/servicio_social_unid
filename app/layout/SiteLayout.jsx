import React from 'react';
import Navbar from '@/components/Navbar/Navbar';


const SiteLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className='m-4'>
          {children}
        </div>
        
      </main>
      
    </div>
  );
};

export default SiteLayout;
