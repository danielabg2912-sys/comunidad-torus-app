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
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentView === item
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
            : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
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