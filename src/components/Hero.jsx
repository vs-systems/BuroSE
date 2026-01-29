import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = ({ theme }) => {
    return (
        <section className={`relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden transition-colors duration-500`}>
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
                <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${theme === 'dark' ? 'bg-brand-neon/10' : 'bg-brand-neon/20'}`}></div>
                <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${theme === 'dark' ? 'bg-brand-alert/5' : 'bg-brand-alert/10'}`}></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full border backdrop-blur-sm mb-8 animate-fade-in-up transition-colors duration-300 ${theme === 'dark' ? 'border-brand-card bg-brand-card/50' : 'border-slate-200 bg-white/80 shadow-sm'
                    }`}>
                    <span className="w-2 h-2 rounded-full bg-brand-neon mr-3 animate-pulse"></span>
                    <span className={`text-xs font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                        Plataforma Segura & Colaborativa
                    </span>
                </div>

                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-5xl mx-auto transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                    Cuando compartir información deja de ser opcional y pasa a ser <span className="brand-gradient-text">una forma de cuidarnos entre todos.</span>
                </h1>

                <p className={`text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed transition-colors duration-500 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'
                    }`}>
                    El buró colaborativo para Clientes Privados de empresas en Argentina.
                    Un apoyo estratégico único, fuera de las bases de datos convencionales.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                        className="w-full sm:w-auto group relative px-8 py-5 bg-brand-neon text-brand-darker font-black rounded-xl overflow-hidden shadow-xl shadow-brand-neon/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            Solicitar Acceso Anticipado
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>

                    <button
                        onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                        className={`w-full sm:w-auto px-8 py-5 font-bold rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${theme === 'dark'
                            ? 'bg-transparent border-brand-card text-brand-text hover:bg-brand-card'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-800'
                            }`}
                    >
                        Ver cómo funciona
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
