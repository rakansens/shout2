import React from 'react';
import ParticleBackground from '../Background/ParticleBackground';

interface MainLayoutProps {
  children: React.ReactNode;
  fullscreen?: boolean;
}

// This becomes a simple layout with just the background
const MainLayout: React.FC<MainLayoutProps> = ({ children, fullscreen = false }) => {
  return (
    <main id="mainLayout" className={`flex flex-col min-h-screen justify-between relative bg-[url(https://c.animaapp.com/sVl5C9mT/img/home.png)] bg-cover bg-[50%_50%] bg-fixed w-full ${fullscreen ? 'h-screen' : ''}`}>
      <ParticleBackground />
      <div className="w-full flex-1 flex flex-col">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;
