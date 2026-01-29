import React from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingDown, Users } from 'lucide-react';

const RiskMockup = ({ theme }) => {
    return (
        <section className={`py-24 ${theme === 'dark' ? 'bg-brand-dark' : 'bg-slate-50'}`}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className={`text-3xl md:text-4xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            ¿Cómo es un <span className="brand-gradient-text">Informe BuroSE?</span>
                        </h2>
                        <p className={`text-lg ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>
                            Visualiza el riesgo real de tus clientes antes de otorgar crédito.
                        </p>
                    </div>

                    <div className={`rounded-3xl border-2 overflow-hidden shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200'
                        }`}>
                        {/* Header del Mockup */}
                        <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                            }`}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-brand-neon flex items-center justify-center text-brand-darker font-black">B</div>
                                <div>
                                    <h4 className={`font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>DISTRIBUIDORA ARGENTINA S.A.</h4>
                                    <p className="text-xs font-bold text-brand-muted">CUIT: 30-71234567-8 | Actividad: Mayorista</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-brand-alert/20 text-brand-alert rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    ALTO RIESGO
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                    DOC: 2026-01-29
                                </span>
                            </div>
                        </div>

                        {/* Body del Mockup */}
                        <div className="p-8">
                            <div className="grid md:grid-cols-3 gap-8 mb-10">
                                {/* Score Card */}
                                <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary' : 'bg-slate-50 border-slate-200'
                                    }`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-4">Score BuroSE</span>
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="12" className="text-brand-alert/10" />
                                            <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="364" strokeDashoffset="260" className="text-brand-alert" strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={`text-4xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>28</span>
                                            <span className="text-[8px] font-bold text-brand-muted uppercase">Muy Crítico</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Cards */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className={`p-4 rounded-xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary' : 'bg-slate-50 border-slate-200'
                                        }`}>
                                        <div className="bg-brand-alert/20 p-2 rounded-lg"><AlertTriangle className="text-brand-alert" size={20} /></div>
                                        <div>
                                            <h5 className={`text-sm font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>3 Denuncias Recientes</h5>
                                            <p className="text-xs text-brand-muted font-medium">Deuda acumulada informada por el gremio: $8.450.000</p>
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary' : 'bg-slate-50 border-slate-200'
                                        }`}>
                                        <div className="bg-blue-500/20 p-2 rounded-lg"><TrendingDown className="text-blue-500" size={20} /></div>
                                        <div>
                                            <h5 className={`text-sm font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Tendencia Negativa</h5>
                                            <p className="text-xs text-brand-muted font-medium">Incremento de morosidad en los últimos 90 días.</p>
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary' : 'bg-slate-50 border-slate-200'
                                        }`}>
                                        <div className="bg-brand-neon/20 p-2 rounded-lg"><Users className="text-brand-neon" size={20} /></div>
                                        <div>
                                            <h5 className={`text-sm font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>5 Proveedores Consultando</h5>
                                            <p className="text-xs text-brand-muted font-medium">Otros socios han buscado este CUIT recientemente.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Detalle de Incidentes */}
                            <div className="space-y-4">
                                <h5 className={`text-xs font-black uppercase tracking-widest mb-4 border-b pb-2 ${theme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'}`}>Resumen de Incidencias Colaborativas</h5>
                                {[
                                    { empresa: "Socio #4521", fecha: "20 Jan 2026", monto: "$1.200.000", estado: "Judicializado" },
                                    { empresa: "Socio #8832", fecha: "15 Jan 2026", monto: "$3.450.000", estado: "Sin intención de pago" },
                                    { empresa: "Socio #1029", fecha: "02 Jan 2026", monto: "$3.800.000", estado: "Pendiente" }
                                ].map((inc, i) => (
                                    <div key={i} className={`p-4 rounded-xl flex items-center justify-between text-xs font-bold ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-brand-alert"></div>
                                            <span className={theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}>{inc.empresa} - {inc.fecha}</span>
                                        </div>
                                        <span className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{inc.monto}</span>
                                        <span className="text-brand-alert/80 uppercase tracking-tighter hidden sm:inline">{inc.estado}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer del Mockup */}
                        <div className={`p-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
                            }`}>
                            <div className="flex items-center gap-2 text-brand-muted">
                                <Shield size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Validado por Auditoría Legal BuroSE</span>
                            </div>
                            <p className="text-[10px] font-black text-brand-neon uppercase tracking-widest">Protección de Datos Garantizada</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RiskMockup;
