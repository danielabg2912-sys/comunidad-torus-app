import React from 'react';
import { AppView } from '../types';
import { Button } from './common/Button';

interface NavbarProps {
  navItems: AppView[];
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ navItems, currentView, setCurrentView, onLogout }) => {
  return (
    <nav className="hidden md:flex items-center space-x-2">
      {navItems.map((item) => (
        <button
          key={item}
          onClick={() => setCurrentView(item)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentView === item
              ? 'bg-accent-green text-white shadow-md'
              : 'text-text-primary hover:bg-bg-tertiary'
            }`}
        >
          {item}
        </button>
      ))}
      <Button variant="danger" size="sm" onClick={onLogout}>
        Cerrar Sesión
      </Button>
    </nav>
  );
};

export default Navbar;