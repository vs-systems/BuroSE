import React from 'react';
import { UserCheck, FileText, Database, Shield } from 'lucide-react';

const HowItWorks = ({ theme }) => {
    return (
        <section id="how-it-works" className={`py-24 border-y transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary' : 'bg-white border-slate-100'
            }`}>
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className={`inline-flex items-center justify-center p-3 rounded-full mb-6 ${theme === 'dark' ? 'bg-brand-card' : 'bg-slate-100'
                        }`}>
                        <UserCheck className="text-brand-neon" size={32} />
                    </div>
                    <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                        Validación <span className="text-brand-neon">100% Humana</span>
                    </h2>
                    <p className={`text-lg transition-colors ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'
                        }`}>
                        No usamos bots ni IA para procesar denuncias. Entendemos la delicadeza de la información crediticia.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className={`hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 z-0 ${theme === 'dark' ? 'bg-gradient-to-r from-brand-secondary via-brand-neon/50 to-brand-secondary' : 'bg-slate-100'
                        }`}></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className={`w-24 h-24 rounded-2xl border flex items-center justify-center mb-6 shadow-lg group-hover:border-brand-neon transition-all duration-300 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 hover:shadow-xl'
                            }`}>
                            <FileText className={`${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'} group-hover:text-brand-neon transition-colors`} size={40} />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1. Reporte</h3>
                        <p className={`text-sm leading-relaxed max-w-xs ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                            El suscriptor envía la documentación respaldatoria de la deuda (Facturas, Remitos firmados).
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className={`w-24 h-24 rounded-2xl border flex items-center justify-center mb-6 shadow-lg group-hover:border-brand-neon transition-all duration-300 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 hover:shadow-xl'
                            }`}>
                            <Shield className={`${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'} group-hover:text-brand-neon transition-colors`} size={40} />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>2. Compliance</h3>
                        <p className={`text-sm leading-relaxed max-w-xs ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                            Nuestro equipo revisa manualmente la validez legal de la documentación. <span className="text-brand-neon font-bold">No aceptamos reportes anónimos.</span>
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center group sm:col-span-2 md:col-span-1">
                        <div className={`w-24 h-24 rounded-2xl border flex items-center justify-center mb-6 shadow-lg group-hover:border-brand-neon transition-all duration-300 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 hover:shadow-xl'
                            }`}>
                            <Database className={`${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'} group-hover:text-brand-neon transition-colors`} size={40} />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>3. Publicación</h3>
                        <p className={`text-sm leading-relaxed max-w-xs ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                            La deuda se impacta en el buró y es visible para toda la red de mayoristas e importadores.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
