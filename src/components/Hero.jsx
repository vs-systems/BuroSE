import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-brand-neon/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-alert/5 rounded-full blur-3xl opacity-20"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-brand-card bg-brand-card/50 backdrop-blur-sm mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-brand-neon mr-3 animate-pulse"></span>
                    <span className="text-xs font-medium tracking-wide text-brand-muted uppercase">
                        Plataforma Segura & Colaborativa
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight max-w-5xl mx-auto">
                    Cuando compartir información deja de ser opcional y pasa a ser <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-neon to-[#00cc7d]">una forma de cuidarnos entre todos.</span>
                </h1>

                <p className="text-lg md:text-xl text-brand-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                    El primer buró colaborativo 100% dedicado a la seguridad electrónica en Argentina.
                    Detectamos deudas que no figuran en los sistemas tradicionales.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                        className="group relative px-8 py-4 bg-brand-neon text-brand-darker font-bold rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center">
                            Solicitar Acceso Anticipado
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-[#00cc7d] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>

                    <button
                        onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                        className="px-8 py-4 bg-transparent border border-brand-card text-brand-text font-medium rounded-lg hover:bg-brand-card transition-colors"
                    >
                        Ver cómo funciona
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
