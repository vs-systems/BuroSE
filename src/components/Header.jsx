import React, { useState } from 'react';
import { Menu, X, ShieldCheck, Sun, Moon } from 'lucide-react';

const Header = ({ theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <nav className="fixed w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-brand-card">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="BuroSE Logo"
                            className="h-12 md:h-14 w-auto object-contain"
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => document.getElementById('problem').scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-brand-muted hover:text-white transition-colors">Problemática</button>
                        <button onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-brand-muted hover:text-white transition-colors">Cómo Funciona</button>
                        <a href="/#/risk-dashboard" className="text-sm font-medium text-brand-neon hover:text-white transition-colors">Consultar Riesgo</a>
                        <a href="/#/login" className="bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">Acceso Socios</a>
                        <button onClick={() => document.getElementById('legal').scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-brand-muted hover:text-white transition-colors">Legal</button>

                        <div className="h-6 w-px bg-slate-800 mx-2"></div>

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
                            title={theme === 'dark' ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <a href="/#/admin" title="Administración" className="p-2 text-slate-500 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m13-3V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h8m6-1l-5-5m0 0l-5 5m5-5V3" />
                            </svg>
                        </a>

                        <button
                            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                            className="px-5 py-2 bg-brand-neon text-brand-darker font-bold rounded hover:bg-[#00cc7d] transition-colors"
                        >
                            Contacto
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-brand-text hover:text-brand-neon">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-brand-card bg-brand-dark/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
                        <div className="flex flex-col space-y-2 px-4">
                            <button onClick={() => { setIsOpen(false); document.getElementById('problem').scrollIntoView({ behavior: 'smooth' }); }} className="px-4 py-3 text-left text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-colors">Problemática</button>
                            <button onClick={() => { setIsOpen(false); document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' }); }} className="px-4 py-3 text-left text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-colors">Cómo Funciona</button>
                            <a href="/#/risk-dashboard" className="px-4 py-3 text-brand-neon font-bold hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Consultar Riesgo</a>
                            <a href="/#/login" className="px-4 py-3 text-blue-400 font-bold hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Acceso Socios</a>
                            <button onClick={() => { setIsOpen(false); document.getElementById('legal').scrollIntoView({ behavior: 'smooth' }); }} className="px-4 py-3 text-left text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-colors">Legal</button>
                            <button onClick={() => { setIsOpen(false); document.getElementById('replica').scrollIntoView({ behavior: 'smooth' }); }} className="px-4 py-3 text-left text-brand-alert hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors">Derecho a Réplica</button>

                            <div className="pt-4 mt-2 border-t border-brand-card flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="w-full py-4 bg-brand-neon text-brand-darker font-bold rounded-xl shadow-lg shadow-brand-neon/20"
                                >
                                    Contacto / Solicitar Acceso
                                </button>
                                <a
                                    href="/#/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-3 text-center text-slate-500 text-sm font-medium hover:text-white"
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
