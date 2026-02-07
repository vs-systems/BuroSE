import React, { useEffect, useState } from 'react';
import { AlertTriangle, EyeOff } from 'lucide-react';

const ProblemChart = ({ theme }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 } // Trigger when 20% visible
        );

        const section = document.getElementById('problem');
        if (section) observer.observe(section);

        return () => {
            if (section) observer.unobserve(section);
        };
    }, []);

    return (
        <section id="problem" className={`py-24 relative transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker' : 'bg-slate-50'
            }`}>
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                            El problema de la <span className="text-brand-alert">Deuda Invisible</span>
                        </h2>
                        <p className={`text-lg mb-8 leading-relaxed transition-colors ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'
                            }`}>
                            En el día a día, muchas deudas no llegan a instancias formales.
                            No aparecen en BCRA, Nosis o Veraz, pero son pérdidas reales que afectan
                            la rentabilidad del gremio.
                        </p>

                        <div className="space-y-6">
                            <div className={`flex items-start space-x-4 p-5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-sm'
                                }`}>
                                <div className="p-2 bg-brand-alert/10 rounded-lg">
                                    <EyeOff className="text-brand-alert" size={24} />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Ceguera Comercial</h3>
                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                                        Vendes a plazo a un cliente nuevo sin saber que ya estafó a tres colegas.
                                    </p>
                                </div>
                            </div>

                            <div className={`flex items-start space-x-4 p-5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-sm'
                                }`}>
                                <div className="p-2 bg-brand-neon/10 rounded-lg">
                                    <AlertTriangle className="text-brand-neon" size={24} />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>BuroSE cubre ese vacío</h3>
                                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                                        Un sistema de alerta temprana alimentado por los propios actores del mercado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Graphic */}
                    <div className={`order-1 lg:order-2 flex flex-col items-center justify-center p-8 rounded-3xl border relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-brand-card/30 border-brand-secondary' : 'bg-white border-slate-200 shadow-xl'
                        }`}>

                        {/* Chart Container */}
                        <div className="relative w-full max-w-sm h-80 flex items-end justify-center space-x-12 z-10">

                            {/* Bar 1: Traditional */}
                            <div className="flex flex-col items-center w-24 group">
                                <div className="mb-2 text-center transition-opacity duration-700 delay-1000" style={{ opacity: isVisible ? 1 : 0 }}>
                                    <span className={`text-2xl font-black ${theme === 'dark' ? 'text-red-500' : 'text-red-600'}`}>20%</span>
                                </div>
                                <div
                                    className={`w-full rounded-t-xl relative transition-all duration-1000 ease-out ${theme === 'dark' ? 'bg-red-600/30' : 'bg-red-100'
                                        }`}
                                    style={{ height: isVisible ? '20%' : '0%' }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-400/20"></div>
                                </div>
                                <p className={`mt-4 text-[10px] text-center font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                                    Visible en<br />BCRA / Nosis
                                </p>
                            </div>

                            {/* Bar 2: BuroSE */}
                            <div className="flex flex-col items-center w-24 group">
                                <div className="mb-2 text-center transition-opacity duration-700 delay-1000" style={{ opacity: isVisible ? 1 : 0 }}>
                                    <span className="text-2xl font-black text-green-500">80%</span>
                                </div>
                                <div
                                    className="w-full bg-gradient-to-t from-green-500/20 to-green-500 rounded-t-xl relative shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all duration-1000 ease-out delay-300"
                                    style={{ height: isVisible ? '80%' : '0%' }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-white/50"></div>
                                </div>
                                <p className={`mt-4 text-[10px] text-center font-black uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    Deuda Real<br />(BuroSE)
                                </p>
                            </div>

                        </div>

                        <div className="mt-8 text-center max-w-xs z-10">
                            <p className={`text-sm font-bold italic ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                "Un solo informe puede salvar a tu empresa de caer en la trampa."
                            </p>
                        </div>

                        {/* Background Grid */}
                        <div className={`absolute inset-0 z-0 opacity-30 ${theme === 'dark'
                            ? 'bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]'
                            : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)]'
                            } bg-[size:40px_40px]`}></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProblemChart;
