import React from 'react';
import { Shield, CheckCircle, CreditCard, Search, FileText, ArrowRight, Zap, Lock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Manual = ({ theme }) => {
    const steps = [
        {
            title: "Proceso de Registro",
            desc: "Completa el formulario de solicitud con los datos de tu empresa. Nuestro equipo administrativo validará la información en menos de 24hs para asegurar la integridad de la red.",
            icon: <FileText className="text-brand-neon" size={24} />,
            image: "/manual_hero_png_1769455415195.png" // Using the generated hero image
        },
        {
            title: "Carga de Reportes",
            desc: "Sube facturas, cheques o contratos incumplidos. La plataforma consolida la deuda y cruza datos con el BCRA para darte una visión real de la situación del deudor.",
            icon: <Zap className="text-brand-neon" size={24} />,
            image: "/step_registration_png_1769455431135.png" // Using the registration infographic
        },
        {
            title: "Gestión de Cobros",
            desc: "Mantén tu suscripción activa mediante Mercado Pago. El sistema actualiza automáticamente tu acceso cada 30 días, permitiéndote operar sin interrupciones.",
            icon: <CreditCard className="text-brand-neon" size={24} />,
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className={`min-h-screen py-10 px-4 md:px-10 transition-colors ${theme === 'dark' ? 'bg-brand-darker text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-16">
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block p-4 bg-brand-neon/10 rounded-full mb-6">
                        <Lock className="text-brand-neon" size={48} />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 italic">BuroSE <span className="text-brand-neon">Manual</span></h1>
                    <p className={`text-lg md:text-xl font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                        Liderando la Red de Información Crediticia para Argentina
                    </p>
                </header>

                <div className="grid gap-12">
                    <section className={`p-10 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-xl'}`}>
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl font-black uppercase mb-6 flex items-center justify-center">
                                <Shield className="text-brand-neon mr-3" /> Seguridad de Datos
                            </h2>
                            <p className="text-xl leading-relaxed mb-8">
                                BuroSE no es solo una base de datos; es un ecosistema colaborativo. Cada registro subido es verificado y protegido bajo estándares de encriptación de grado bancario.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-6 w-full">
                                {['Validación por CUIT', 'Cumplimiento con Ley de Protección de Datos', 'Auditoría constante'].map((check, i) => (
                                    <div key={i} className="flex items-center justify-center font-bold p-4 bg-white/5 rounded-2xl border border-white/10 uppercase text-[10px] tracking-widest">
                                        <CheckCircle size={14} className="text-brand-neon mr-2" /> {check}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-3 gap-6">
                        {steps.map((step, idx) => (
                            <motion.div key={idx} variants={item} className={`p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary hover:border-brand-neon/40' : 'bg-white border-slate-100 shadow-lg hover:shadow-2xl'}`}>
                                <div className="mb-4">{step.icon}</div>
                                <h3 className="font-black uppercase mb-4 text-xl tracking-tighter">{step.title}</h3>
                                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>{step.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <section className={`p-10 rounded-3xl overflow-hidden relative ${theme === 'dark' ? 'bg-brand-neon/5 border border-brand-neon/20' : 'bg-slate-900 border border-slate-800'}`}>
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto relative z-10">
                            <h2 className="text-3xl font-black uppercase mb-6 tracking-tight italic text-white">
                                Integración con <span className="text-brand-neon">Mercado Pago</span>
                            </h2>
                            <p className="text-lg opacity-80 mb-8 leading-relaxed font-medium text-white">
                                Olvídate de las transferencias manuales. Paga tu abono mensual de forma instantánea y segura. Tu acceso se renueva de forma automática para que nunca pierdas el ritmo de tu negocio.
                            </p>
                            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 w-full">
                                <p className="text-xs font-black uppercase tracking-widest text-brand-neon mb-6">¿Cómo funciona?</p>
                                <div className="grid sm:grid-cols-3 gap-6 text-white">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-brand-neon text-brand-darker flex items-center justify-center font-black mb-3">1</div>
                                        <p className="text-[10px] uppercase font-black tracking-widest">Botón de pago en Dashboard</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-brand-neon text-brand-darker flex items-center justify-center font-black mb-3">2</div>
                                        <p className="text-[10px] uppercase font-black tracking-widest">Selección de medio</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-brand-neon text-brand-darker flex items-center justify-center font-black mb-3">3</div>
                                        <p className="text-[10px] uppercase font-black tracking-widest">Notificación instantánea</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="mt-20 text-center py-10 border-t border-brand-secondary/30">
                    <p className={`font-black uppercase text-xs tracking-[0.3em] ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>© 2026 BuroSE - Advanced Security Systems Network</p>
                </footer>
            </div>
        </div>
    );
};

export default Manual;
