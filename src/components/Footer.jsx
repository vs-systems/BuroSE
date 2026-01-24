import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = ({ theme, openModal, legalDocs }) => {
    return (
        <footer className={`transition-colors duration-500 py-16 border-t ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]'
            }`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <div className="flex items-center space-x-2 mb-6">
                            <ShieldCheck className="text-brand-neon" size={28} />
                            <span className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>BuroSE</span>
                        </div>
                        <p className={`text-sm leading-relaxed max-w-xs font-medium ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            El primer buró de crédito colaborativo para el gremio de la seguridad electrónica en Argentina.
                        </p>
                    </div>

                    <div className="text-center sm:text-left">
                        <h4 className={`font-black uppercase tracking-widest text-xs mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Plataforma</h4>
                        <ul className={`space-y-4 text-sm font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            <li><a href="#contact" className="hover:text-brand-neon transition-colors">Solicitar Registro</a></li>
                            <li><a href="/#/risk-dashboard" className="hover:text-brand-neon transition-colors">Consulta de Riesgo</a></li>
                            <li><a href="/#/login" className="hover:text-brand-neon transition-colors">Panel de Socios</a></li>
                        </ul>
                    </div>

                    <div className="text-center sm:text-left">
                        <h4 className={`font-black uppercase tracking-widest text-xs mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Marco Legal</h4>
                        <ul className={`space-y-4 text-sm font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            <li><a href="/#/terms" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon transition-colors uppercase tracking-tight">Términos y Condiciones</a></li>
                            <li><a href="/#/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon transition-colors uppercase tracking-tight">Política de Privacidad</a></li>
                            <li><a href="/#/replica" target="_blank" rel="noopener noreferrer" className="hover:text-brand-neon transition-colors uppercase tracking-tight">Derecho a Réplica</a></li>
                        </ul>
                    </div>

                    <div className="text-center sm:text-left">
                        <h4 className={`font-black uppercase tracking-widest text-xs mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Desarrollo</h4>
                        <p className={`text-xs uppercase tracking-widest font-black mb-3 ${theme === 'dark' ? 'text-brand-muted/50' : 'text-slate-400'}`}>
                            Una iniciativa de:
                        </p>
                        <a href="https://vecinoseguro.com" target="_blank" rel="noopener noreferrer" className="inline-block group">
                            <span className={`text-lg font-black italic transition-colors ${theme === 'dark' ? 'text-brand-primary group-hover:text-brand-neon' : 'text-blue-600 group-hover:text-blue-800'}`}>
                                VS Sistemas
                            </span>
                        </a>
                    </div>
                </div>

                <div className={`border-t pt-10 flex flex-col lg:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'border-brand-secondary text-brand-muted/60' : 'border-slate-100 text-slate-400'
                    }`}>
                    <p className="text-center lg:text-left">&copy; {new Date().getFullYear()} BuroSE. Todos los derechos reservados.</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <a href="mailto:legales@burose.com.ar" className="hover:text-brand-neon transition-colors flex items-center">
                            Legales: legales@burose.com.ar
                        </a>
                        <a href="mailto:somos@burose.com.ar" className="hover:text-brand-neon transition-colors flex items-center">
                            Soporte: somos@burose.com.ar
                        </a>
                    </div>
                    <p className="flex items-center">
                        Hecho en Argentina <span className="ml-2 text-base">🇦🇷</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
