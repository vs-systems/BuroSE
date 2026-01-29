import React from 'react';
import LegalLayout from './LegalLayout';

const LegalRecovery = ({ theme, setTheme }) => {
    return (
        <LegalLayout title="Términos y Condiciones del Servicio de Recupero Legal" theme={theme} setTheme={setTheme}>
            <div className="space-y-6">
                <section>
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1. Objeto del Servicio</h3>
                    <p className="mb-4">
                        El departamento de <strong>Legales y Recupero de BuroSE</strong> pone a disposición de sus socios activos un servicio especializado de gestión de cobranzas extrajudiciales y prejudiciales. El objetivo es facilitar la regularización de deudas comerciales reportadas en la plataforma, actuando como mediador profesional.
                    </p>
                </section>

                <section>
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>2. Obligación de Medios</h3>
                    <p className="mb-4">
                        El servicio prestado por BuroSE se constituye legalmente como una <strong>obligación de medios y no de resultados</strong>. Esto implica que nuestro equipo profesional empleará toda su diligencia, pericia y herramientas legales disponibles para lograr el recupero de la deuda, sin que esto garantice el éxito final de la gestión, el cual depende de la solvencia y voluntad de pago del deudor.
                    </p>
                </section>

                <section>
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>3. Canal de Comunicación Oficial</h3>
                    <p className="mb-4">
                        Para garantizar la trazabilidad, transparencia y validez legal de las actuaciones, <strong>toda comunicación formal</strong> relacionada con expedientes de recupero debe centralizarse exclusivamente a través del canal oficial:
                        <br />
                        <a href="mailto:legales@burose.com.ar" className="text-brand-neon font-bold ml-1">legales@burose.com.ar</a>
                    </p>
                    <p className="mb-4">
                        Cualquier acuerdo, promesa de pago o negociación realizada por fuera de este canal sin la validación de BuroSE puede no ser reconocida en el proceso de saneamiento del historial crediticio del deudor.
                    </p>
                </section>

                <section>
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>4. Privacidad y Datos</h3>
                    <p className="mb-4">
                        BuroSE garantiza la <strong>privacidad absoluta</strong> y confidencialidad de la documentación e información remitida para la gestión del recupero (facturas, remitos, correos electrónicos, etc.). Estos datos serán utilizados única y exclusivamente con fines de gestión de cobranza y defensa de los intereses del socio acreedor, bajo estricto secreto profesional y cumplimiento de la Ley de Protección de Datos Personales.
                    </p>
                </section>

                <section>
                    <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>5. Honorarios y Costos</h3>
                    <p className="mb-4">
                        Las condiciones económicas, porcentajes de éxito y costos administrativos (si los hubiere) serán detallados en la propuesta de servicios particular para cada caso o convenio marco firmado con el socio. En el servicio de Mediación Oficial, los honorarios se pactarán como un porcentaje sobre el monto efectivamente recuperado, a convenir entre las partes.
                    </p>
                </section>
            </div>
        </LegalLayout>
    );
};

export default LegalRecovery;
