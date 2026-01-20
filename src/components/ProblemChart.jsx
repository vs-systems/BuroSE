import React, { useEffect, useState } from 'react';
import { AlertTriangle, EyeOff } from 'lucide-react';

const ProblemChart = () => {
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
        <section id="problem" className="py-24 bg-brand-darker relative">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            El problema de la <span className="text-brand-alert">Deuda Invisible</span>
                        </h2>
                        <p className="text-brand-muted text-lg mb-8 leading-relaxed">
                            En el día a día, muchas deudas no llegan a instancias formales.
                            No aparecen en BCRA, Nosis o Veraz, pero son pérdidas reales que afectan
                            la rentabilidad del gremio.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 p-4 rounded-lg bg-brand-card border border-brand-secondary">
                                <div className="p-2 bg-brand-alert/10 rounded">
                                    <EyeOff className="text-brand-alert" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Ceguera Comercial</h3>
                                    <p className="text-brand-muted text-sm mt-1">
                                        Vendes a plazo a un cliente nuevo sin saber que ya estafó a tres colegas.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 rounded-lg bg-brand-card border border-brand-secondary">
                                <div className="p-2 bg-brand-neon/10 rounded">
                                    <AlertTriangle className="text-brand-neon" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">BuroSE cubre ese vacío</h3>
                                    <p className="text-brand-muted text-sm mt-1">
                                        Un sistema de alerta temprana alimentado por los propios actores del mercado.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Graphic */}
                    <div className="order-1 lg:order-2 flex flex-col items-center justify-center p-8 bg-brand-card/30 rounded-2xl border border-brand-secondary relative overflow-hidden">

                        {/* Chart Container */}
                        <div className="relative w-full max-w-sm h-80 flex items-end justify-center space-x-12 z-10">

                            {/* Bar 1: Traditional */}
                            <div className="flex flex-col items-center w-24 group">
                                <div className="mb-2 text-center opacity-0 transition-opacity duration-700 delay-1000" style={{ opacity: isVisible ? 1 : 0 }}>
                                    <span className="text-2xl font-bold text-brand-muted">20%</span>
                                </div>
                                <div
                                    className="w-full bg-brand-muted/30 rounded-t-lg relative transition-all duration-1000 ease-out"
                                    style={{ height: isVisible ? '20%' : '0%' }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-muted/50"></div>
                                </div>
                                <p className="mt-4 text-xs text-center font-medium text-brand-muted uppercase tracking-wider">
                                    Visible en<br />BCRA/Nosis
                                </p>
                            </div>

                            {/* Bar 2: BuroSE */}
                            <div className="flex flex-col items-center w-24 group">
                                <div className="mb-2 text-center opacity-0 transition-opacity duration-700 delay-1000" style={{ opacity: isVisible ? 1 : 0 }}>
                                    <span className="text-2xl font-bold text-brand-neon">80%</span>
                                </div>
                                <div
                                    className="w-full bg-gradient-to-t from-brand-neon/20 to-brand-neon rounded-t-lg relative shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all duration-1000 ease-out delay-300"
                                    style={{ height: isVisible ? '80%' : '0%' }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-white/50"></div>
                                </div>
                                <p className="mt-4 text-xs text-center font-bold text-white uppercase tracking-wider">
                                    Deuda Real<br />(BuroSE)
                                </p>
                            </div>

                        </div>

                        <div className="mt-8 text-center max-w-xs z-10">
                            <p className="text-sm font-medium text-white">
                                "Un solo informe puede salvar a tu empresa de caer en la trampa."
                            </p>
                        </div>

                        {/* Background Grid */}
                        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProblemChart;
