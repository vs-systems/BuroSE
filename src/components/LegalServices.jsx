import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ShieldAlert, Gavel, Scale, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const LegalServices = ({ theme, setTheme, settings }) => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const openContact = () => {
        document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker text-brand-text' : 'bg-slate-50 text-slate-900'}`}>
            <Header theme={theme} setTheme={setTheme} openContact={openContact} />

            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-4">

                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border mb-6 animate-pulse bg-red-600/10 border-red-600/20 text-red-500 font-black uppercase tracking-widest text-xs">
                            <ShieldAlert size={14} className="mr-2" />
                            Unidad de Legales y Recupero
                        </div>
                        <h1 className={`text-4xl md:text-6xl font-black mb-6 uppercase tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            BuroSE no solo te avisa quién no paga,<br />
                            <span className="text-brand-neon">te ayudamos a cobrarle.</span>
                        </h1>
                        <p className={`text-xl font-medium max-w-2xl mx-auto ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                            Soluciones legales integradas con mediación oficial. Dejá la gestión de cobranza en manos de expertos y enfocate en tu negocio.
                        </p>
                    </div>

                    {/* Servicios Grid */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">

                        {/* Servicio 1: Informe + Intimación */}
                        <div className={`p-8 rounded-3xl border-2 transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-brand-card border-brand-secondary hover:border-brand-neon/50' : 'bg-white border-slate-200 shadow-xl'}`}>
                            <div className="bg-brand-neon/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                <Mail className="text-brand-neon" size={32} />
                            </div>
                            <h3 className={`text-2xl font-black uppercase mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Informe + Intimación</h3>
                            <p className={`mb-8 h-24 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                                Gestión prejudicial rápida. Enviamos una Carta Documento o Intimación formal certificada al deudor, informando el reporte en BuroSE y sus consecuencias.
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Honorarios</p>
                                    <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Consultar</p>
                                </div>
                                <button onClick={() => openContact('legal_intimacion')}
                                    className="px-6 py-3 bg-brand-neon text-brand-darker font-black rounded-xl uppercase text-xs tracking-widest hover:brightness-110 shadow-lg shadow-brand-neon/20 flex items-center">
                                    Solicitar Intimación <ArrowRight size={16} className="ml-2" />
                                </button>
                            </div>
                        </div>

                        {/* Servicio 2: Mediación Oficial */}
                        <div className={`p-8 rounded-3xl border-2 transition-all hover:scale-[1.02] ${theme === 'dark' ? 'bg-brand-card border-brand-secondary hover:border-blue-500/50' : 'bg-white border-slate-200 shadow-xl'}`}>
                            <div className="bg-blue-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                <Scale className="text-blue-500" size={32} />
                            </div>
                            <h3 className={`text-2xl font-black uppercase mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Mediación Oficial (Prejudicial)</h3>
                            <p className={`mb-8 h-24 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                                Para deudas mayores y obligatorio antes de juicio. Instancia formal con mediador matriculado para lograr un acuerdo de pago con fuerza legal ejecutiva.
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Modelo de Cobro</p>
                                    <p className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>% A Convenir</p>
                                    <p className="text-[10px] opacity-60">Sobre lo recuperado</p>
                                </div>
                                <button onClick={() => openContact('legal_mediacion')}
                                    className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl uppercase text-xs tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center">
                                    Consultar Caso <Gavel size={16} className="ml-2" />
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Back Link */}
                    <div className="text-center">
                        <a href="/#/" className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:underline ${theme === 'dark' ? 'text-brand-muted hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                            <ArrowLeft size={16} /> Volver al Inicio
                        </a>
                    </div>

                </div>
            </main>

            <Footer theme={theme} openContact={openContact} settings={settings} />
        </div>
    );
};

export default LegalServices;
