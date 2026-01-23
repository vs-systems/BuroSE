import React, { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                        <a href="#problem" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">Problemática</a>
                        <a href="#how-it-works" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">Cómo Funciona</a>
                        <a href="/#/risk-dashboard" className="text-sm font-medium text-brand-neon hover:text-white transition-colors">Consultar Riesgo</a>
                        <a href="/#/login" className="bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">Acceso Socios</a>
                        <a href="#legal" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">Legal</a>

                        <div className="h-6 w-px bg-slate-800 mx-2"></div>

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
                            <a href="#problem" className="px-4 py-3 text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Problemática</a>
                            <a href="#how-it-works" className="px-4 py-3 text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Cómo Funciona</a>
                            <a href="/#/risk-dashboard" className="px-4 py-3 text-brand-neon font-bold hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Consultar Riesgo</a>
                            <a href="/#/login" className="px-4 py-3 text-blue-400 font-bold hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Acceso Socios</a>
                            <a href="#legal" className="px-4 py-3 text-brand-muted hover:text-white hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Legal</a>
                            <a href="#replica" className="px-4 py-3 text-brand-alert hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors" onClick={() => setIsOpen(false)}>Derecho a Réplica</a>

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
