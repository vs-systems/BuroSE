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
                        <p className={`text-sm leading-relaxed max-w-xs font-medium ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-50'}`}>
                            El primer buró de crédito colaborativo para Clientes Privados de empresas en Argentina.
                        </p>
                        <div className="mt-6">
                            <a
                                href="https://wa.me/5492235772165"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.481 5.229 3.481 8.404c0 6.556-5.332 11.888-11.888 11.888-2.003 0-3.963-.505-5.704-1.467l-6.29 1.652zm6.541-4.008c1.517.901 3.13 1.353 4.786 1.353 5.093 0 9.237-4.144 9.237-9.237 0-2.469-.961-4.79-2.706-6.535s-4.066-2.707-6.531-2.707c-5.093 0-9.237 4.144-9.237 9.237 0 1.761.503 3.472 1.455 4.965l-1.025 3.743 3.821-1.003zm9.02-6.561c2.253.251 2.253.301 2.253.301.2.051.15.552.1.802-.301 1.556-1.154 2.158-2.258 2.308-.853.151-2.911-.703-3.964-1.255-1.053-.552-3.061-2.761-3.663-3.916-.602-1.155-.301-2.208.652-2.911.351-.301.652-.351.853-.351.2 0 .401.051.552.401.552 1.305 1.053 2.158 1.454 2.61.151.151.251.251.151.451-.051.2-.201.552-1.054 1.506z" />
                                </svg>
                                Contactar Soporte
                            </a>
                        </div>
                    </div>

                    <div className="text-center sm:text-left">
                        <h4 className={`font-black uppercase tracking-widest text-xs mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Plataforma</h4>
                        <ul className={`space-y-4 text-sm font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            <li><a href="/#contact" className="hover:text-brand-neon transition-colors">Solicitar Registro (GRATIS)</a></li>
                            <li><a href="/#/login" className="hover:text-brand-neon transition-colors">Panel de Socios</a></li>
                            <li><a href="/#/pricing" className="hover:text-brand-neon transition-colors">Planes y Precios</a></li>
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
                        <div className="mt-8 pt-4 border-t border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-tighter text-brand-muted">
                                Última Actualización:<br />
                                <span className="text-brand-neon">2026-01-28 20:32</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`border-t pt-10 flex flex-col lg:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'border-brand-secondary text-brand-muted/60' : 'border-slate-100 text-slate-400'
                    }`}>
                    <p className="text-center lg:text-left">&copy; {new Date().getFullYear()} BuroSE. Todos los derechos reservados.</p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <a href="mailto:legales@burose.com.ar" className="hover:text-brand-neon transition-colors flex items-center">
                            Legales: legales@burose.com.ar
                        </a>
                        <a href="mailto:legales@burose.com.ar" className="hover:text-brand-neon transition-colors flex items-center">
                            Soporte: legales@burose.com.ar
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
