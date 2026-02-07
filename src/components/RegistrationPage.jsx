import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import AccessForm from './AccessForm';
import { ArrowLeft, Gift, ShieldCheck, Zap } from 'lucide-react';

const RegistrationPage = ({ theme, setTheme, settings }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-brand-darker text-brand-text' : 'bg-slate-50 text-slate-900'}`}>
            <Header theme={theme} setTheme={setTheme} openContact={() => { }} />

            <main className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <a href="/#/" className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-brand-muted hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                                <ArrowLeft size={16} /> Volver al Inicio
                            </a>

                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-neon/10 border border-brand-neon/20 text-brand-neon text-[10px] font-black uppercase tracking-widest">
                                    <Gift size={12} /> Beneficio Exclusivo
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
                                    Alta de <span className="text-brand-neon italic">Cliente</span>
                                </h1>
                                <p className={`text-lg font-medium leading-relaxed ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                                    Accede a la inteligencia financiera colaborativa de BuroSE sin costo. Válido para consultas básicas y reportes limitados.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-brand-card/30 border-brand-secondary/50' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="flex gap-4">
                                        <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black uppercase text-xs tracking-widest mb-1">Seguridad Legal</h3>
                                            <p className="text-xs font-bold opacity-60">Tu información y consultas están protegidas por acuerdos de confidencialidad estrictos.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-brand-card/30 border-brand-secondary/50' : 'bg-white border-slate-100 shadow-sm'}`}>
                                    <div className="flex gap-4">
                                        <div className="p-3 rounded-xl bg-brand-neon/10 text-brand-neon">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black uppercase text-xs tracking-widest mb-1">Acceso Inmediato</h3>
                                            <p className="text-xs font-bold opacity-60">Una vez validado tu CUIT por nuestro equipo Compliance, tu acceso será activado.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <AccessForm
                                theme={theme}
                                defaultPlan="free"
                                title="Solicitud Alta Gratuita"
                                subtitle="Completa el formulario para validar tu identidad comercial y activar tu plan Free."
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer theme={theme} settings={settings} />
        </div>
    );
};

export default RegistrationPage;
