
import React from 'react';
import { UI_STRINGS_TR } from '../constants';
import { LogoIcon } from './icons';

interface HeaderProps {
  onLogoClick: () => void;
  isHome: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, isHome }) => {
  return (
    <header className={`w-full py-4 px-6 ${isHome ? 'absolute top-0 left-0' : 'bg-white dark:bg-gray-900 shadow-md'}`}>
      <div className="container mx-auto flex items-center justify-center lg:justify-start">
        <button onClick={onLogoClick} className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white transition-transform transform hover:scale-105">
          <LogoIcon className="h-8 w-8 text-indigo-600" />
          <span>{UI_STRINGS_TR.appTitle}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
