import React from 'react';
import { Lock, AlertCircle, Gavel, ShieldCheck } from 'lucide-react';

const Legal = ({ theme }) => {
    return (
        <section id="legal" className={`py-24 transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker' : 'bg-slate-100'
            }`}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                    <div className="inline-flex items-center space-x-2 bg-brand-neon/10 border border-brand-neon/20 px-4 py-2 rounded-full mb-6">
                        <ShieldCheck className="text-brand-neon" size={20} />
                        <span className="text-brand-neon text-[10px] font-black uppercase tracking-[0.2em]">Compromiso Legal</span>
                    </div>
                    <h2 className={`text-4xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Validación por Expertos Jurídicos</h2>
                    <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-brand-text/70' : 'text-slate-600'}`}>
                        Toda la información publicada en BuroSE es previamente revisada por nuestro equipo de abogados especializados. Este proceso garantiza que cada reporte cumpla con los estándares legales necesarios, protegiendo tanto la integridad del sitio como los derechos de las personas reportadas, minimizando cualquier riesgo legal para el gremio.
                    </p>
                    <p className="mt-6 text-brand-neon font-bold text-sm uppercase tracking-widest">
                        Contacto Legal: <a href="mailto:somos@burose.com.ar" className="hover:underline">somos@burose.com.ar</a>
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Card 1: TyC */}
                    <a
                        href="/#/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-8 rounded-3xl border transition-all group flex flex-col items-center text-center ${theme === 'dark'
                            ? 'bg-brand-card border-brand-secondary hover:border-brand-neon/40 hover:bg-brand-card/80 shadow-lg'
                            : 'bg-white border-slate-200 hover:border-brand-neon hover:shadow-2xl shadow-md'
                            }`}
                    >
                        <Gavel className="text-brand-neon mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <h3 className={`text-xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Términos y Condiciones</h3>
                        <p className={`text-sm mb-6 flex-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            Conozca las cláusulas de indemnidad y veracidad que rigen el uso del sistema y el aporte de datos.
                        </p>
                        <span className="text-brand-neon text-xs font-black uppercase border-b-2 border-brand-neon/20 pb-1 group-hover:border-brand-neon transition-all">Ver Documento</span>
                    </a>

                    {/* Card 2: Privacidad */}
                    <a
                        href="/#/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-8 rounded-3xl border transition-all group flex flex-col items-center text-center ${theme === 'dark'
                            ? 'bg-brand-card border-brand-secondary hover:border-brand-neon/40 hover:bg-brand-card/80 shadow-lg'
                            : 'bg-white border-slate-200 hover:border-brand-neon hover:shadow-2xl shadow-md'
                            }`}
                    >
                        <Lock className="text-brand-neon mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <h3 className={`text-xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Política de Privacidad</h3>
                        <p className={`text-sm mb-6 flex-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            Información sobre el tratamiento de datos según la Ley 25.326 y plazos de conservación.
                        </p>
                        <span className="text-brand-neon text-xs font-black uppercase border-b-2 border-brand-neon/20 pb-1 group-hover:border-brand-neon transition-all">Ver Política</span>
                    </a>

                    {/* Card 3: Réplica */}
                    <a
                        href="/#/replica"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-8 rounded-3xl border transition-all group flex flex-col items-center text-center sm:col-span-2 md:col-span-1 ${theme === 'dark'
                            ? 'bg-brand-card border-brand-secondary hover:border-brand-neon/40 hover:bg-brand-card/80 shadow-lg'
                            : 'bg-white border-slate-200 hover:border-brand-neon hover:shadow-2xl shadow-md'
                            }`}
                    >
                        <AlertCircle className="text-brand-neon mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <h3 className={`text-xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Derecho a Réplica</h3>
                        <p className={`text-sm mb-6 flex-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            Procedimiento formal de Habeas Data para rectificación o supresión de datos erróneos.
                        </p>
                        <span className="text-brand-neon text-xs font-black uppercase border-b-2 border-brand-neon/20 pb-1 group-hover:border-brand-neon transition-all">Ver Procedimiento</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Legal;
