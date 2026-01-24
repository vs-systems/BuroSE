import React from 'react';
import LegalLayout from './LegalLayout';

const Replica = ({ theme, setTheme }) => {
    return (
        <LegalLayout title="Derecho a Réplica y Habeas Data" theme={theme} setTheme={setTheme}>
            <div className={`space-y-6 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                <p>Si usted figura en la base de datos de BuroSE y considera que la información es errónea, falsa, inexacta o se encuentra desactualizada, tiene derecho a solicitar su rectificación, actualización o supresión de forma <strong>GRATUITA</strong>, conforme a la Ley 25.326.</p>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-4">PASO A PASO PARA EJERCER SU DERECHO:</h4>
                    <ol className="list-decimal pl-5 space-y-4">
                        <li>
                            <strong>Solicitud:</strong> Envíe un correo electrónico a <a href="mailto:somos@burose.com.ar" className="text-brand-neon font-bold hover:underline">somos@burose.com.ar</a> con el asunto "DERECHO A RÉPLICA - CUIT [Número]".
                        </li>
                        <li>
                            <strong>Documentación Requerida:</strong>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Copia de DNI o Poder (en caso de representar a una empresa).</li>
                                <li>CUIT / Razón Social cuestionada.</li>
                                <li>Documentación probatoria que fundamente su reclamo (Ej: Libre deuda firmado por el acreedor, comprobante de transferencia bancaria, sentencia judicial, carta documento de desconocimiento).</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Proceso de Validación:</strong>
                            <p className="mt-2 text-sm leading-relaxed">Una vez recibido el reclamo, BuroSE dará traslado inmediato al Usuario Denunciante (Acreedor) para que en un plazo de 5 (cinco) días hábiles ratifique o rectifique la información presentando contra-pruebas. Durante este período, el registro podrá visualizarse con una etiqueta de "EN PROCESO DE REVISIÓN".</p>
                        </li>
                        <li>
                            <strong>Resolución:</strong>
                            <p className="mt-2 text-sm leading-relaxed">Si el Acreedor confirma el error o no responde en el plazo estipulado: BuroSE procederá a la SUPRESIÓN o RECTIFICACIÓN inmediata del registro. Si el Acreedor ratifica la deuda con pruebas válidas: Se mantendrá el registro, garantizando al afectado la posibilidad de agregar un breve descargo visible junto al informe.</p>
                        </li>
                    </ol>
                </section>

                <p className={`mt-8 text-xs p-6 border rounded-xl italic ${theme === 'dark' ? 'bg-brand-dark border-white/10' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    BuroSE cumple estrictamente con los plazos legales de 5 días hábiles para actualización y 10 días corridos para informes de acceso, estipulados por la ley vigente.
                </p>
            </div>
        </LegalLayout>
    );
};

export default Replica;
