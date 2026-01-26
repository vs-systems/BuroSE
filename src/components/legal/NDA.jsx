import React from 'react';
import LegalLayout from './LegalLayout';

const NDA = ({ theme, setTheme }) => {
    return (
        <LegalLayout title="Acuerdo de Confidencialidad (NDA)" theme={theme} setTheme={setTheme}>
            <div className={`space-y-6 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">1. OBJETO</h4>
                    <p>El presente Acuerdo tiene por objeto proteger la naturaleza confidencial de la información compartida por BuroSE (la "Información Confidencial") a la que el Usuario (la "Parte Receptora") tiene acceso al utilizar la plataforma.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">2. DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL</h4>
                    <p>Se considera Información Confidencial toda información sobre riesgo crediticio, antecedentes de pago, identidades de deudores, reportes de deuda y cualquier dato financiero o comercial al que se acceda a través de la base de datos de BuroSE, ya sea que esté marcada como tal o no.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">3. OBLIGACIONES DE LA PARTE RECEPTORA</h4>
                    <p>El Usuario se obliga a:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Mantener absoluta confidencialidad sobre la información obtenida.</li>
                        <li>Utilizar la información única y exclusivamente para decisiones de crédito internas de su propia organización.</li>
                        <li>No divulgar, publicar, copiar ni distribuir los reportes de riesgo a terceros ajenos a su empresa.</li>
                        <li>Adoptar medidas de seguridad rigurosas para evitar el acceso no autorizado a su cuenta de BuroSE.</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">4. PROHIBICIÓN DE USO PÚBLICO</h4>
                    <p>Queda estrictamente prohibido utilizar la Información Confidencial para realizar "escraches" públicos, publicaciones en redes sociales o foros, o cualquier otro uso que no sea el análisis de riesgo puramente comercial e interno.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">5. DURACIÓN</h4>
                    <p>La obligación de confidencialidad subsistirá mientras el Usuario mantenga su acceso a la plataforma y continuará vigente por un periodo de <strong>cinco (5) años</strong> posteriores a la finalización de su membresía en BuroSE.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">6. INCUMPLIMIENTO</h4>
                    <p>El incumplimiento de este acuerdo facultará a BuroSE a iniciar las acciones legales correspondientes por daños y perjuicios, sin perjuicio de la baja inmediata del servicio.</p>
                </section>
            </div>
        </LegalLayout>
    );
};

export default NDA;
