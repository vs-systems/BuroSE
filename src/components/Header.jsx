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
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#problem" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
                            Problemática
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
                            Cómo Funciona
                        </a>
                        <a href="/#/risk-dashboard" className="text-gray-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors">Consultar Riesgo</a>
                        <a href="/#/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-900/40 transition-all">Acceso Socios</a>
                        <a href="#legal" className="text-sm font-medium text-brand-muted hover:text-white transition-colors">
                            Legal
                        </a>

                        <div className="flex items-center space-x-4 ml-6">
                            <a href="#replica" className="text-sm font-medium text-brand-alert hover:text-red-400 transition-colors">
                                Derecho a Réplica
                            </a>
                            <button
                                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                                className="px-5 py-2 bg-brand-neon text-brand-darker font-bold rounded hover:bg-[#00cc7d] transition-colors"
                            >
                                Contacto
                            </button>
                            <button className="px-5 py-2 border border-brand-card bg-brand-card text-brand-muted rounded hover:bg-brand-secondary transition-colors cursor-not-allowed opacity-75">
                                Acceso Clientes
                            </button>
                        </div>
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
                    <div className="md:hidden py-4 border-t border-brand-card bg-brand-dark">
                        <div className="flex flex-col space-y-4">
                            <a href="#problem" className="px-4 py-2 text-brand-muted hover:text-white hover:bg-brand-card" onClick={() => setIsOpen(false)}>Problemática</a>
                            <a href="#how-it-works" className="px-4 py-2 text-brand-muted hover:text-white hover:bg-brand-card" onClick={() => setIsOpen(false)}>Cómo Funciona</a>
                            <a href="#risk-search" className="px-4 py-2 text-brand-neon font-bold hover:bg-brand-card" onClick={() => setIsOpen(false)}>Consultar Riesgo</a>
                            <a href="#legal" className="px-4 py-2 text-brand-muted hover:text-white hover:bg-brand-card" onClick={() => setIsOpen(false)}>Legal</a>
                            <a href="#replica" className="px-4 py-2 text-brand-alert hover:text-red-400 hover:bg-brand-card" onClick={() => setIsOpen(false)}>Derecho a Réplica</a>
                            <a href="#contact" className="px-4 py-2 text-brand-neon font-bold hover:bg-brand-card" onClick={() => setIsOpen(false)}>Solicitar Acceso</a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;
