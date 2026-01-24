import React from 'react';
import LegalLayout from './LegalLayout';

const Privacy = ({ theme, setTheme }) => {
    return (
        <LegalLayout title="Política de Privacidad" theme={theme} setTheme={setTheme}>
            <div className={`space-y-6 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                <p>La presente Política de Privacidad describe los tipos de datos de carácter personal que BuroSE y Vecino Seguro Sistemas (en adelante, “BuroSE y Vecino Seguro”) recoge y procesa a través de los sitios web <a href="https://www.burose.com.ar" className="text-brand-neon hover:underline">www.burose.com.ar</a> y <a href="https://www.vecinoseguro.com" className="text-brand-neon hover:underline">www.vecinoseguro.com</a> (en adelante la “Web”).</p>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">1. RESPONSABLE DEL TRATAMIENTO</h4>
                    <p>BuroSE y Vecino Seguro, con domicilio legal en calle Catamarca 1819, Entre Piso, Ciudad de Mar del Plata, Buenos Aires, Argentina, es el responsable por el tratamiento de los Datos Personales.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">2. NATURALEZA DEL SERVICIO (CLÁUSULA ESPECIAL ART. 26 LEY 25.326)</h4>
                    <p>Se deja expresa constancia de que BuroSE opera bajo la modalidad de "Servicio de Información Crediticia" conforme al Artículo 26 de la Ley 25.326 de Protección de Datos Personales. En consecuencia, además de los datos de los Usuarios registrados, BuroSE trata datos personales de carácter patrimonial y crediticio referidos a la solvencia económica y el cumplimiento de obligaciones comerciales de personas humanas y jurídicas (los "Deudores"), aportados por los Usuarios acreedores bajo declaración jurada. Para este fin específico, y conforme a la normativa vigente, no se requiere el consentimiento previo del titular del dato (Deudor) para el tratamiento de datos obtenidos de fuentes de acceso público o procedentes de informaciones facilitadas por el acreedor vinculado a una obligación comercial.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">3. DATOS RECOLECTADOS Y RESPONSABILIDAD</h4>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Datos de Usuarios (Acreedores):</strong> Nombre, Razón Social, CUIT, Email, Teléfono.</li>
                        <li><strong>Datos de Terceros (Deudores):</strong> CUIT, Razón Social, Monto de deuda, Historial de pagos, Documentación probatoria.</li>
                    </ul>
                    <p className="mt-2 text-sm italic border-l-2 border-brand-neon pl-4"><strong>Limitación de Responsabilidad sobre la Exactitud:</strong> El Usuario (Acreedor/Denunciante) garantiza y responde, en cualquier caso, de la veracidad, exactitud, vigencia y autenticidad de los Datos Personales y patrimoniales facilitados sobre sus deudores. BuroSE actúa como mero intermediario tecnológico de almacenamiento y NO verifica la veracidad de la deuda en origen. El Usuario Denunciante asume la responsabilidad exclusiva civil y penal frente a reclamos por daños y perjuicios derivados de la carga de información falsa, inexacta o desactualizada.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">4. FINALIDAD DEL TRATAMIENTO</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Prestar servicios de información crediticia y prevención de riesgos al gremio de seguridad electrónica.</li>
                        <li>Gestionar la cuenta del usuario y validar su pertenencia al gremio.</li>
                        <li>Cumplir con obligaciones legales y normativas.</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">5. PLAZOS DE CONSERVACIÓN ("DERECHO AL OLVIDO")</h4>
                    <p>En cumplimiento estricto del Art. 26, inc. 4 de la Ley 25.326, se aplicarán los siguientes plazos para la información crediticia negativa:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Deudas Impagas:</strong> Se conservarán por un plazo máximo de 5 (cinco) años.</li>
                        <li><strong>Deudas Canceladas:</strong> Si el deudor regulariza su situación, el registro se mantendrá por un plazo de 2 (dos) años con la leyenda "Deuda Cancelada" (o similar) desde la fecha de pago.</li>
                    </ul>
                    <p>Transcurridos estos plazos, los datos serán suprimidos automáticamente del sistema de consulta pública.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">6. SEGURIDAD DE LOS DATOS</h4>
                    <p>BuroSE implementa medidas técnicas, físicas y administrativas estrictas para proteger los datos contra acceso no autorizado, uso indebido o alteración, cumpliendo con las normativas de la Dirección Nacional de Protección de Datos Personales (DNPDP).</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">7. DERECHOS DEL TITULAR (ACCESO, RECTIFICACIÓN Y SUPRESIÓN)</h4>
                    <p>El titular de los datos (ya sea Usuario o Deudor reportado) tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326. Asimismo, tiene derecho a solicitar la rectificación o supresión de los datos si estos fueran falsos o erróneos, mediante el procedimiento de "Derecho a Réplica" detallado en nuestra Web.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">8. LEGISLACIÓN Y JURISDICCIÓN</h4>
                    <p>Esta Política se rige por la ley argentina. Toda disputa será sometida a los Tribunales Ordinarios en lo Comercial de la Ciudad de Mar del Plata, renunciando a cualquier otro fuero.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">9. INFORMACIÓN DE CONTACTO</h4>
                    <p>Envío de correo electrónico a: <a href="mailto:somos@burose.com.ar" className="text-brand-neon hover:underline font-bold">somos@burose.com.ar</a></p>
                </section>
            </div>
        </LegalLayout>
    );
};

export default Privacy;
