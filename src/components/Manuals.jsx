import React, { useState } from 'react';
import { BookOpen, ShieldCheck, User, Scale, ArrowRight, Download } from 'lucide-react';

const Manuals = ({ theme }) => {
    const [activeManual, setActiveManual] = useState('free');

    const manuals = {
        free: {
            title: "Manual del Visitante (Gratuita)",
            icon: <User className="text-blue-400" />,
            content: [
                { h: "Acceso Básico", p: "Cualquier persona puede consultar el Score BuroSE introduciendo un DNI o CUIT válido." },
                { h: "Alcance", p: "La consulta gratuita muestra el nivel de riesgo unificado (Verde, Amarillo, Rojo) basado en datos del BCRA." },
                { h: "Limitaciones", p: "No es posible visualizar deudas internas de empresas asociadas ni detalles de acreedores sin una cuenta de Socio." }
            ]
        },
        socio: {
            title: "Manual del Socio (Empresas)",
            icon: <ShieldCheck className="text-brand-neon" />,
            content: [
                { h: "Buscador Avanzado", p: "Acceso total a la base de datos de deudores de empresas y proveedores asociados en Argentina." },
                { h: "Carga de Informes", p: "Los socios pueden reportar deudores subiendo documentación probatoria (PDF/Imagen). Esta información es confidencial." },
                { h: "Privacidad", p: "BuroSE garantiza que la documentación subida solo se utiliza como respaldo legal y no se muestra a terceros." },
                { h: "Responsabilidad", p: "El socio es responsable por la veracidad de los datos cargados conforme a la Ley 25.326." }
            ]
        },
        legal: {
            title: "Derecho a Réplica y Marco Legal",
            icon: <Scale className="text-brand-alert" />,
            content: [
                { h: "Nuestra Función", p: "BuroSE es una empresa tecnológica que terceriza y unifica información. No somos una entidad policial ni judicial." },
                { h: "Proceso de Descargo", p: "Si figuras en nuestra base, tienes derecho a presentar tu descargo formal mediante el formulario oficial." },
                { h: "Documentación Requerida", p: "Para rectificar información, deberás adjuntar comprobantes de pago o acuerdos de cancelación certificados." },
                { h: "Tiempos Legales", p: "Las solicitudes se procesan en un plazo de 48 a 72 horas hábiles tras la verificación de la prueba." }
            ]
        }
    };

    return (
        <section id="manuals" className={`py-24 relative transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker' : 'bg-slate-50'
            }`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className={`text-4xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Centro de <span className="brand-gradient-text">Ayuda y Manuales</span></h2>
                    <p className={`text-lg transition-colors ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}`}>Todo lo que necesitas saber sobre el uso de la plataforma y el marco legal de BuroSE.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Selector de Manuales */}
                    <div className="md:w-1/3 grid sm:grid-cols-3 md:grid-cols-1 gap-4">
                        {Object.entries(manuals).map(([key, man]) => (
                            <button
                                key={key}
                                onClick={() => setActiveManual(key)}
                                className={`w-full flex items-center p-6 rounded-2xl border-2 transition-all text-left ${activeManual === key
                                    ? 'border-brand-neon bg-brand-neon/5 scale-105'
                                    : (theme === 'dark' ? 'border-transparent bg-brand-card/30 hover:bg-brand-card' : 'border-transparent bg-white hover:bg-slate-100 shadow-sm')
                                    }`}
                            >
                                <div className={`p-4 rounded-xl mr-4 ${theme === 'dark' ? 'bg-brand-dark' : 'bg-slate-50 shadow-inner'}`}>{man.icon}</div>
                                <div>
                                    <h4 className={`font-black uppercase tracking-tight text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{man.title}</h4>
                                    <span className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Guía de usuario</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Contenido del Manual */}
                    <div className={`md:w-2/3 p-10 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-xl'
                        }`}>
                        <div className="flex justify-between items-center mb-10">
                            <h3 className={`text-3xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{manuals[activeManual].title}</h3>
                            <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                <BookOpen className="text-brand-neon" size={32} />
                            </div>
                        </div>

                        <div className="grid gap-10">
                            {manuals[activeManual].content.map((item, idx) => (
                                <div key={idx} className="relative pl-10">
                                    <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-brand-neon shadow-[0_0_10px_rgba(0,255,157,0.5)]"></div>
                                    <h5 className={`font-black mb-2 uppercase text-xs tracking-widest ${theme === 'dark' ? 'text-brand-neon' : 'text-blue-600'}`}>{item.h}</h5>
                                    <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>{item.p}</p>
                                </div>
                            ))}
                        </div>

                        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-6 ${theme === 'dark' ? 'border-brand-secondary/50' : 'border-slate-100'
                            }`}>
                            <p className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>BuroSE | Framework de Riesgo 2.2</p>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => {
                                        const text = encodeURIComponent(`*Manual BuroSE: ${manuals[activeManual].title}*\n\n` + manuals[activeManual].content.map(c => `*${c.h}:* ${c.p}`).join('\n\n'));
                                        window.open(`https://wa.me/?text=${text}`, '_blank');
                                    }}
                                    className={`flex items-center text-xs font-black uppercase tracking-widest transition-all hover:scale-105 ${theme === 'dark' ? 'text-brand-muted hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    WhatsApp
                                </button>
                                <button
                                    onClick={() => {
                                        const subject = encodeURIComponent(`Manual BuroSE: ${manuals[activeManual].title}`);
                                        const body = encodeURIComponent(`Detalle del ${manuals[activeManual].title}:\n\n` + manuals[activeManual].content.map(c => `${c.h}: ${c.p}`).join('\n\n'));
                                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
                                    }}
                                    className={`flex items-center text-xs font-black uppercase tracking-widest transition-all hover:scale-105 ${theme === 'dark' ? 'text-brand-muted hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Email
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className={`flex items-center text-xs font-black uppercase tracking-widest transition-all hover:scale-105 ${theme === 'dark' ? 'text-brand-neon' : 'text-blue-600'}`}
                                >
                                    Descargar PDF <Download size={14} className="ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Manuals;
