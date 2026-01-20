import React from 'react';
import { Scale, Lock, AlertCircle } from 'lucide-react';

const Legal = () => {
    return (
        <section id="legal" className="py-20 bg-brand-darker">
            <div className="container mx-auto px-4">
                <div className="flex items-center space-x-3 mb-10">
                    <Scale className="text-brand-muted" size={32} />
                    <h2 className="text-3xl font-bold text-white">Marco Legal y Transparencia</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-brand-card border border-brand-secondary p-8 rounded-xl hover:border-brand-text/30 transition-colors">
                        <Lock className="text-brand-neon mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-3">Protección de Datos</h3>
                        <p className="text-sm text-brand-muted">
                            Cumplimiento estricto de la <strong>Ley 25.326</strong>. Los datos son tratados con máxima confidencialidad y seguridad, respetando los derechos de los titulares.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-brand-card border border-brand-secondary p-8 rounded-xl hover:border-brand-text/30 transition-colors">
                        <AlertCircle className="text-brand-neon mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-3">Finalidad</h3>
                        <p className="text-sm text-brand-muted">
                            Herramienta de carácter preventivo y comercial. <strong>No reemplaza al BCRA</strong> ni a los burós estatales. Es una red privada de intercambio de antecedentes comerciales del gremio.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-brand-card border border-brand-secondary p-8 rounded-xl hover:border-brand-text/30 transition-colors">
                        <Scale className="text-brand-neon mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-3">Responsabilidad</h3>
                        <p className="text-sm text-brand-muted">
                            Limitación de Responsabilidad: BuroSE no garantiza resultados comerciales ni se responsabiliza por conflictos privados entre las partes. Actúa como medio de información.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Legal;
