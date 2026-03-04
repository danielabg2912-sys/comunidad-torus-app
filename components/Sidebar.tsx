
import React from 'react';
import { AppView, User } from '../types';
import { Icon } from './common/Icon';

interface SidebarProps {
    currentView: AppView;
    setCurrentView: (view: AppView) => void;
    onLogout: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    navItems: AppView[];
    currentUser: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout, isOpen, setIsOpen, navItems, currentUser }) => {
    // Mapping of AppView enum to display labels and icons
    const menuConfig: Record<string, { label: string; icon: string }> = {
        'Profile': { label: 'Mi Perfil', icon: 'user' },
        'Booking': { label: 'Reservar', icon: 'calendar' },
        'Menu': { label: 'Catálogo', icon: 'shopping-bag' },
        'Community': { label: 'Comunidad', icon: 'users' },
        'LegalTracking': { label: 'Trámites', icon: 'clipboard' },
        'Admin': { label: 'Panel Admin', icon: 'shield' },
    };

    const menuItems = navItems.map(view => ({
        view,
        ...menuConfig[view as string] || { label: view, icon: 'circle' }
    }));

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-white/90 backdrop-blur-2xl border-r border-slate-200/60 shadow-2xl shadow-slate-200/50 z-50 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="flex flex-col h-full p-6 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />

                    {/* Logo Area */}
                    <div className="flex items-center gap-4 mb-10 px-2 relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white transform hover:scale-105 transition-transform duration-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">TORUS</h1>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">Comunidad</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 relative z-10">
                        <div className="px-2 mb-2">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider pl-2">Menu Principal</p>
                        </div>
                        {menuItems.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => {
                                    setCurrentView(item.view);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${currentView === item.view
                                    ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/25 translate-x-1'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                                    }`}
                            >
                                {/* Active Indicator (Left Border) */}
                                {currentView === item.view && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400" />
                                )}

                                <Icon
                                    name={item.icon}
                                    className={`w-5 h-5 transition-colors relative z-10 ${currentView === item.view ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-500'
                                        }`}
                                />
                                <span className="relative z-10 font-medium tracking-wide">{item.label}</span>

                                {currentView === item.view && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* User / Footer */}
                    <div className="mt-auto pt-6 border-t border-slate-100 relative z-10">
                        {currentUser && (
                            <div className="flex items-center gap-3 px-2 mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md">
                                    {(currentUser?.name || 'U').charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{(currentUser?.name || 'Usuario').split(' ')[0]}</p>
                                    <p className="text-xs text-slate-500 truncate font-medium">{currentUser?.role === 'admin' ? 'Administrador' : 'Miembro'}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all duration-200 text-xs font-bold uppercase tracking-wider group border border-transparent hover:border-red-100"
                        >
                            <Icon name="x" className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
