import React, { useState } from 'react';
import { Menu, X, ShieldCheck, Sun, Moon } from 'lucide-react';

const Header = ({ theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${theme === 'dark'
                ? 'bg-brand-dark/90 backdrop-blur-md border-brand-card'
                : 'bg-white/90 backdrop-blur-md border-slate-200 shadow-sm'
            }`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="BuroSE Logo"
                            className={`h-12 md:h-14 w-auto object-contain transition-all duration-300 ${theme === 'light' ? 'brightness-90 contrast-125' : ''}`}
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button
                            onClick={() => document.getElementById('problem').scrollIntoView({ behavior: 'smooth' })}
                            className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-brand-muted hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Problemática
                        </button>
                        <button
                            onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                            className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-brand-muted hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Cómo Funciona
                        </button>
                        <a href="/#/risk-dashboard" className="text-sm font-medium text-brand-neon hover:opacity-80 transition-colors">Consultar Riesgo</a>
                        <a href="/#/login" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark'
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white'
                                : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white'
                            }`}>
                            Acceso Socios
                        </a>
                        <button
                            onClick={() => document.getElementById('legal').scrollIntoView({ behavior: 'smooth' })}
                            className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-brand-muted hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            Legal
                        </button>

                        <div className={`h-6 w-px mx-2 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 transition-colors flex items-center justify-center rounded-lg ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            title={theme === 'dark' ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <a href="/#/admin" title="Administración" className={`p-2 transition-colors flex items-center justify-center rounded-lg ${theme === 'dark' ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m13-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h8m6-1l-5-5m0 0l-5 5m5-5V3" />
                            </svg>
                        </a>

                        <button
                            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                            className="px-5 py-2 bg-brand-neon text-brand-darker font-bold rounded-lg hover:brightness-110 hover:scale-105 transition-all shadow-lg shadow-brand-neon/20"
                        >
                            Contacto
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                }`}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className={`${theme === 'dark' ? 'text-brand-text' : 'text-slate-900'} hover:text-brand-neon`}>
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className={`md:hidden py-4 border-t animate-in slide-in-from-top duration-300 rounded-b-2xl shadow-xl ${theme === 'dark' ? 'border-brand-card bg-brand-dark/95 backdrop-blur-xl' : 'border-slate-100 bg-white/95 backdrop-blur-xl'
                        }`}>
                        <div className="flex flex-col space-y-2 px-4">
                            <button onClick={() => { setIsOpen(false); document.getElementById('problem').scrollIntoView({ behavior: 'smooth' }); }} className={`px-4 py-3 text-left rounded-xl transition-colors ${theme === 'dark' ? 'text-brand-muted hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>Problemática</button>
                            <button onClick={() => { setIsOpen(false); document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' }); }} className={`px-4 py-3 text-left rounded-xl transition-colors ${theme === 'dark' ? 'text-brand-muted hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>Cómo Funciona</button>
                            <a href="/#/risk-dashboard" className="px-4 py-3 text-brand-neon font-bold hover:bg-brand-neon/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Consultar Riesgo</a>
                            <a href="/#/login" className="px-4 py-3 text-blue-500 font-bold hover:bg-blue-50 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Acceso Socios</a>
                            <button onClick={() => { setIsOpen(false); document.getElementById('legal').scrollIntoView({ behavior: 'smooth' }); }} className={`px-4 py-3 text-left rounded-xl transition-colors ${theme === 'dark' ? 'text-brand-muted hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>Legal</button>
                            <button onClick={() => { setIsOpen(false); document.getElementById('replica').scrollIntoView({ behavior: 'smooth' }); }} className="px-4 py-3 text-left text-brand-alert hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors">Derecho a Réplica</button>

                            <div className={`pt-4 mt-2 border-t flex flex-col gap-3 ${theme === 'dark' ? 'border-brand-card' : 'border-slate-100'}`}>
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full py-4 bg-brand-neon text-brand-darker font-bold rounded-xl shadow-lg shadow-brand-neon/20 active:scale-95 transition-transform"
                                >
                                    Contacto / Solicitar Acceso
                                </button>
                                <a
                                    href="/#/admin"
                                    onClick={() => setIsOpen(false)}
                                    className={`w-full py-3 text-center text-sm font-medium transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Acceso Administrador
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;
