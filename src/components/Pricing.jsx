import React from 'react';
import { Check, Zap, Cpu, Shield } from 'lucide-react';

const Pricing = ({ theme }) => {
    const plans = [
        {
            name: "Consulta Individual",
            price: "Gratis*",
            desc: "Para personas físicas que deseen consultar su estado básico.",
            features: ["Acceso a Score BuroSE", "Validación de DNI/CUIT", "1 Consulta gratuita semanal"],
            cta: "Consultar Ahora",
            color: "border-slate-200"
        },
        {
            name: "Socio BuroSE",
            price: "$15.000",
            period: "/mes + IVA",
            desc: "Para empresas de seguridad electrónica y tecnología.",
            features: ["Consultas ilimitadas", "Acceso a Reportes de Gremios", "Carga de Deudores Propios", "Soporte Prioritario"],
            cta: "Ser Socio",
            popular: true,
            color: "border-brand-neon"
        },
        {
            name: "Empresa & API",
            price: "$50.000",
            period: "/mes + IVA",
            desc: "Enlaza nuestra base de datos con tu propio sistema.",
            features: ["Acceso por API REST", "Documentación Técnica", "Tokens ilimitados", "Update en tiempo real"],
            cta: "Obtener API Key",
            color: "border-blue-500"
        }
    ];

    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Planes a tu <span className="brand-gradient-text">medida</span>
                    </h2>
                    <p className={`text-lg transition-colors ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                        Desde consultas gratuitas hasta integración total vía API para grandes estructuras.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, idx) => (
                        <div key={idx} className={`relative flex flex-col p-8 rounded-3xl border-2 transition-all hover:scale-105 duration-300 ${plan.popular ? 'bg-brand-neon/5 scale-105' : 'bg-transparent'} ${theme === 'dark' ? plan.color + '/30 bg-white/5' : plan.color + ' bg-white shadow-xl'}`}>
                            {plan.popular && (
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-neon text-brand-darker text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                                    Más Popular
                                </span>
                            )}

                            <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-black">{plan.price}</span>
                                <span className="text-brand-muted text-sm">{plan.period}</span>
                            </div>
                            <p className="text-sm text-brand-muted mb-8 italic">{plan.desc}</p>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feat, fidx) => (
                                    <li key={fidx} className="flex items-center text-sm">
                                        <Check className="text-brand-neon mr-3 shrink-0" size={16} />
                                        <span className={theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-brand-neon text-brand-darker hover:bg-white' : 'bg-white/10 text-brand-text border border-white/20 hover:bg-white/20'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <div className={`mt-20 max-w-4xl mx-auto p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-blue-600/5 border-blue-500/30' : 'bg-blue-50 border-blue-200 shadow-lg'}`}>
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="bg-blue-600/20 p-4 rounded-2xl">
                            <Cpu className="text-blue-400" size={48} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-2xl font-bold mb-2">¿Ya tienes un sistema ERP o CRM?</h4>
                            <p className="text-brand-muted text-sm">
                                Enlaza BuroSE directamente con tu sitio web o facturador. Nuestra API permite verificar el riesgo de tus clientes en milisegundos de forma automática.
                                <span className="block mt-2 font-bold text-blue-400 uppercase tracking-tighter">Ideal para Gremio de Seguridad e Informática.</span>
                            </p>
                        </div>
                        <button onClick={() => window.location.href = 'mailto:burosearg@gmail.com?subject=Interés API BuroSE'} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all whitespace-nowrap">
                            Solicitar API
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
