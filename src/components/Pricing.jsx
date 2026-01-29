import React from 'react';
import { Check, Cpu } from 'lucide-react';

const Pricing = ({ theme }) => {
    const topupsSocio = [
        { qty: 5, price: 4000 },
        { qty: 10, price: 7000 },
        { qty: 20, price: 12000 },
        { qty: 50, price: 27500 }
    ];
    const topupsFree = [
        { qty: 5, price: 7500 },
        { qty: 10, price: 13000 },
        { qty: 20, price: 24000 },
        { qty: 50, price: 50000 }
    ];

    const plans = [
        {
            name: "Consulta Individual",
            price: "Gratis",
            period: "*",
            promo: "Alta Directa",
            desc: "Ideal para pequeñas empresas y seguimiento puntual.",
            features: [
                "2 Consultas por semana",
                "Carga de Informe aprobado (¡Suma créditos!)",
                "Compra de paquetes adicionales",
                "Sin costo de mantenimiento",
                "Acceso a Score BuroSE"
            ],
            cta: "Empezar Gratis",
            color: "border-slate-200"
        },
        {
            name: "Socio BuroSE",
            price: "$15.000",
            period: "/mes",
            promo: "¡Precio Lanzamiento!",
            desc: "La mejor relación costo-beneficio para tu negocio.",
            features: [
                "25 Consultas Mensuales",
                "Carga de Informe aprobado (¡Suma créditos!)",
                "20% Off en Legales y Recupero",
                "10% Off en Bases Especiales",
                "Soporte por Email incluido",
                "Compra de paquetes adicionales"
            ],
            cta: "Unirse ahora",
            popular: true,
            color: "border-brand-neon"
        },
        {
            name: "Empresa & API",
            price: "$45.000",
            period: "/mes",
            promo: "Alta Escala",
            desc: "Integración total con tus sistemas propios y ERP.",
            features: [
                "Acceso por API REST / Full",
                "Soporte Prioritario WhatsApp",
                "50% Off en Legales y Recupero",
                "Consultas Ilimitadas"
            ],
            cta: "Ver Docs",
            color: "border-blue-500"
        }
    ];

    return (
        <section id="pricing" className={`py-24 relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker' : 'bg-white'
            }`}>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-brand-neon/20 border border-brand-neon/30">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-brand-neon">¡Precio Promocional de Lanzamiento!</span>
                    </div>
                    <h2 className={`text-4xl md:text-5xl font-black mb-4 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Planes a tu <span className="brand-gradient-text">medida</span>
                    </h2>
                    <p className={`text-lg transition-colors ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                        Aprovechá esta tarifa exclusiva por tiempo limitado.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative flex flex-col p-8 rounded-3xl border-2 transition-all hover:shadow-2xl duration-300 ${plan.popular ? 'scale-105 z-10' : 'scale-100'
                            } ${theme === 'dark'
                                ? (plan.popular ? 'bg-brand-neon/5 border-brand-neon' : 'bg-white/5 border-white/10')
                                : (plan.popular ? 'bg-brand-neon/5 border-brand-neon shadow-xl' : 'bg-white border-slate-100 shadow-lg')
                            }`}>
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-neon text-brand-darker text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                                    Más Popular
                                </span>
                            )}

                            <h3 className={`text-xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>

                            <div className="mb-4">
                                <span className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                                <span className={`text-sm ml-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>{plan.period}</span>
                            </div>

                            {plan.promo && (
                                <div className="mb-4 py-1 px-3 bg-brand-neon/10 border border-brand-neon/20 rounded-lg inline-block self-start">
                                    <span className="text-[10px] font-bold text-brand-neon uppercase tracking-tighter">{plan.promo}</span>
                                </div>
                            )}

                            <p className={`text-sm mb-8 italic ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>{plan.desc}</p>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feat, fidx) => (
                                    <li key={fidx} className="flex items-center text-sm">
                                        <Check className="text-brand-neon mr-3 shrink-0" size={16} />
                                        <span className={theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => window.location.hash = '/risk-dashboard'}
                                className={`w-full py-4 rounded-xl font-black transition-all transform active:scale-95 ${plan.popular || plan.name === 'Empresa & API'
                                    ? 'bg-brand-neon text-brand-darker hover:brightness-110 shadow-lg shadow-brand-neon/20'
                                    : (theme === 'dark' ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' : 'bg-slate-100 text-slate-900 hover:bg-slate-200')
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Paquetes de Consultas (Top-ups) */}
                <div className="max-w-6xl mx-auto mb-20">
                    <h3 className={`text-2xl font-black text-center mb-10 uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Paquetes de Consultas Adicionales</h3>
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Socios */}
                        <div className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-slate-50 border-slate-200'}`}>
                            <h4 className="text-brand-neon font-black mb-6 uppercase tracking-widest text-xs">Exclusivo Socios BuroSE</h4>
                            <div className="space-y-4">
                                {topupsSocio.map(t => (
                                    <div key={t.qty} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                                        <span className="font-bold">{t.qty} Consultas</span>
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-xl">${t.price.toLocaleString('es-AR')}</span>
                                            <button
                                                onClick={() => window.location.hash = '/risk-dashboard'}
                                                className="bg-brand-neon text-brand-darker px-4 py-2 rounded-lg text-[10px] font-black uppercase"
                                            >
                                                Comprar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-[10px] text-brand-muted opacity-60">* Vencimiento 60 días corridos.</p>
                        </div>
                        {/* Gratuitos */}
                        <div className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200'}`}>
                            <h4 className="text-slate-400 font-black mb-6 uppercase tracking-widest text-xs">Usuarios Gratuitos</h4>
                            <div className="space-y-4">
                                {topupsFree.map(t => (
                                    <div key={t.qty} className={`flex justify-between items-center p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200/50'}`}>
                                        <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{t.qty} Consultas</span>
                                        <div className="flex items-center gap-4">
                                            <span className={`font-black text-xl ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>${t.price.toLocaleString('es-AR')}</span>
                                            <button
                                                onClick={() => window.location.hash = '/risk-dashboard'}
                                                className={`${theme === 'dark' ? 'bg-brand-neon text-brand-darker' : 'bg-slate-900 text-white'} px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all`}
                                            >
                                                Comprar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-[10px] text-brand-muted opacity-60">* Vencimiento 60 días corridos.</p>
                        </div>
                    </div>
                </div>

                <div className={`mt-20 max-w-4xl mx-auto p-8 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-blue-600/5 border-blue-500/30' : 'bg-blue-50 border-blue-200 shadow-xl'
                    }`}>
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-600/10'}`}>
                            <Cpu className="text-blue-500" size={48} />
                        </div>
                        <div className="flex-1">
                            <h4 className={`text-2xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>¿Ya tienes un sistema ERP o CRM?</h4>
                            <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                                Enlaza BuroSE directamente con tu sitio web o facturador. Nuestra API permite verificar el riesgo de tus clientes en milisegundos de forma automática.
                                <span className={`block mt-2 font-black text-blue-500 uppercase tracking-tighter ${theme === 'dark' ? '' : 'brightness-90'}`}>Acceso a documentación técnica (Con coste adicional).</span>
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.href = 'mailto:somos@burose.com.ar?subject=Interés API BuroSE'}
                            className="w-full md:w-auto px-8 py-5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20 whitespace-nowrap"
                        >
                            Solicitar API
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
