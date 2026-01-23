import React from 'react';
import { UserCheck, FileText, Database, Shield } from 'lucide-react';

const HowItWorks = ({ theme }) => {
    return (
        <section id="how-it-works" className="py-24 bg-brand-dark border-y border-brand-secondary">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center justify-center p-3 bg-brand-card rounded-full mb-6">
                        <UserCheck className="text-brand-neon" size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Validación <span className="text-brand-neon">100% Humana</span>
                    </h2>
                    <p className="text-brand-muted text-lg">
                        No usamos bots ni IA para procesar denuncias. Entendemos la delicadeza de la información crediticia.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brand-secondary via-brand-neon/50 to-brand-secondary z-0"></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-24 h-24 rounded-2xl bg-brand-card border border-brand-secondary flex items-center justify-center mb-6 shadow-lg group-hover:border-brand-neon transition-colors duration-300">
                            <FileText className="text-brand-muted group-hover:text-brand-neon transition-colors" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">1. Reporte</h3>
                        <p className="text-sm text-brand-muted leading-relaxed max-w-xs">
                            El suscriptor envía la documentación respaldatoria de la deuda (Facturas, Remitos firmados).
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-24 h-24 rounded-2xl bg-brand-card border border-brand-secondary flex items-center justify-center mb-6 shadow-lg group-hover:border-brand-neon transition-colors duration-300">
                            <Shield className="text-brand-muted group-hover:text-brand-neon transition-colors" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">2. Compliance</h3>
                        <p className="text-sm text-brand-muted leading-relaxed max-w-xs">
                            Nuestro equipo revisa manualmente la validez legal de la documentación. <span className="text-brand-neon">No aceptamos reportes anónimos.</span>
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-24 h-24 rounded-2xl bg-brand-card border border-brand-secondary flex items-center justify-center mb-6 shadow-lg group-hover:border-brand-neon transition-colors duration-300">
                            <Database className="text-brand-muted group-hover:text-brand-neon transition-colors" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">3. Publicación</h3>
                        <p className="text-sm text-brand-muted leading-relaxed max-w-xs">
                            La deuda se impacta en el buró y es visible para toda la red de mayoristas e importadores.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
