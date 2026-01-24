import React, { useState } from 'react';
import { Scale, Lock, AlertCircle, Gavel, ShieldCheck } from 'lucide-react';
import LegalModal from './LegalModal';

const Legal = ({ theme }) => {
    const [modalData, setModalData] = useState({ isOpen: false, title: '', content: null });

    const openModal = (title, content) => {
        setModalData({ isOpen: true, title, content });
    };

    const closeModal = () => {
        setModalData({ ...modalData, isOpen: false });
    };

    const docs = {
        tyc: {
            title: "Términos y Condiciones de Uso",
            content: (
                <div className={`space-y-4 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">1. ACEPTACIÓN</h4>
                    <p>El acceso y uso de la plataforma BuroSE implica la aceptación plena y sin reservas de los presentes Términos y Condiciones. El servicio está dirigido exclusivamente a empresas y profesionales del gremio de la Seguridad Electrónica en Argentina.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">2. DECLARACIÓN JURADA DEL USUARIO DENUNCIANTE</h4>
                    <p>Al registrar una deuda o incidente comercial en la plataforma, el Usuario declara bajo juramento que:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>a) La deuda es real, líquida, exigible y de origen comercial lícito.</li>
                        <li>b) Cuenta con documentación respaldatoria (facturas, cheques rechazados, remitos, etc.) que acredita la obligación.</li>
                        <li>c) No utiliza la plataforma con fines de extorsión, competencia desleal o difamación.</li>
                    </ul>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">3. INDEMNIDAD</h4>
                    <p>El Usuario se obliga a mantener indemne a BuroSE, Vecino Seguro Sistemas, sus directivos y empleados, frente a cualquier reclamo, demanda, sanción, multa o juicio (incluyendo honorarios legales y costas) iniciado por terceros o por organismos de control, derivado de la inexactitud, falsedad o falta de actualización de la información cargada por el Usuario. BuroSE no será responsable en ningún caso por lucro cesante, pérdida de chances comerciales o daños indirectos derivados del uso de la información.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">4. OBLIGACIÓN DE ACTUALIZAR</h4>
                    <p>Es obligación exclusiva e intransferible del Usuario Denunciante informar a BuroSE dentro de las <strong>72 horas hábiles</strong> si el deudor ha regularizado su situación de pago, a fin de actualizar el registro a "Deuda Cancelada" o proceder a su baja según corresponda. El incumplimiento de esta obligación hará responsable al Usuario por los daños que la permanencia indebida del registro ocasione al afectado.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">5. USO DE LA INFORMACIÓN</h4>
                    <p>La información obtenida a través de BuroSE es confidencial y para uso exclusivo de evaluación de riesgo crediticio propio. Queda prohibida su reproducción, venta, cesión o divulgación pública en redes sociales o medios masivos.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">6. SUSPENSIÓN DE CUENTA</h4>
                    <p>BuroSE se reserva el derecho de suspender o eliminar unilateralmente la cuenta de cualquier Usuario que cargue información falsa, abuse del sistema o no presente las pruebas requeridas ante un pedido de validación.</p>
                </div>
            )
        },
        privacy: {
            title: "Política de Privacidad",
            content: (
                <div className={`space-y-4 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                    <p>La presente Política de Privacidad describe los tipos de datos de carácter personal que BuroSE y Vecino Seguro Sistemas (en adelante, “BuroSE y Vecino Seguro”) recoge y procesa a través de los sitios web <a href="https://www.burose.com.ar" className="text-brand-neon hover:underline">www.burose.com.ar</a> y <a href="https://www.vecinoseguro.com" className="text-brand-neon hover:underline">www.vecinoseguro.com</a> (en adelante la “Web”).</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">1. RESPONSABLE DEL TRATAMIENTO</h4>
                    <p>BuroSE y Vecino Seguro, con domicilio legal en calle Catamarca 1819, Entre Piso, Ciudad de Mar del Plata, Buenos Aires, Argentina, es el responsable por el tratamiento de los Datos Personales.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">2. NATURALEZA DEL SERVICIO (CLÁUSULA ESPECIAL ART. 26 LEY 25.326)</h4>
                    <p>Se deja expresa constancia de que BuroSE opera bajo la modalidad de "Servicio de Información Crediticia" conforme al Artículo 26 de la Ley 25.326 de Protección de Datos Personales. En consecuencia, además de los datos de los Usuarios registrados, BuroSE trata datos personales de carácter patrimonial y crediticio referidos a la solvencia económica y el cumplimiento de obligaciones comerciales de personas humanas y jurídicas (los "Deudores"), aportados por los Usuarios acreedores bajo declaración jurada. Para este fin específico, y conforme a la normativa vigente, no se requiere el consentimiento previo del titular del dato (Deudor) para el tratamiento de datos obtenidos de fuentes de acceso público o procedentes de informaciones facilitadas por el acreedor vinculado a una obligación comercial.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">3. DATOS RECOLECTADOS Y RESPONSABILIDAD</h4>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Datos de Usuarios (Acreedores):</strong> Nombre, Razón Social, CUIT, Email, Teléfono.</li>
                        <li><strong>Datos de Terceros (Deudores):</strong> CUIT, Razón Social, Monto de deuda, Historial de pagos, Documentación probatoria.</li>
                    </ul>
                    <p className="mt-2 text-sm italic border-l-2 border-brand-neon pl-4"><strong>Limitación de Responsabilidad sobre la Exactitud:</strong> El Usuario (Acreedor/Denunciante) garantiza y responde, en cualquier caso, de la veracidad, exactitud, vigencia y autenticidad de los Datos Personales y patrimoniales facilitados sobre sus deudores. BuroSE actúa como mero intermediario tecnológico de almacenamiento y NO verifica la veracidad de la deuda en origen. El Usuario Denunciante asume la responsabilidad exclusiva civil y penal frente a reclamos por daños y perjuicios derivados de la carga de información falsa, inexacta o desactualizada.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">4. FINALIDAD DEL TRATAMIENTO</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Prestar servicios de información crediticia y prevención de riesgos al gremio de seguridad electrónica.</li>
                        <li>Gestionar la cuenta del usuario y validar su pertenencia al gremio.</li>
                        <li>Cumplir con obligaciones legales y normativas.</li>
                    </ul>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">5. PLAZOS DE CONSERVACIÓN ("DERECHO AL OLVIDO")</h4>
                    <p>En cumplimiento estricto del Art. 26, inc. 4 de la Ley 25.326, se aplicarán los siguientes plazos para la información crediticia negativa:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Deudas Impagas:</strong> Se conservarán por un plazo máximo de 5 (cinco) años.</li>
                        <li><strong>Deudas Canceladas:</strong> Si el deudor regulariza su situación, el registro se mantendrá por un plazo de 2 (dos) años con la leyenda "Deuda Cancelada" (o similar) desde la fecha de pago.</li>
                    </ul>
                    <p>Transcurridos estos plazos, los datos serán suprimidos automáticamente del sistema de consulta pública.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">6. SEGURIDAD DE LOS DATOS</h4>
                    <p>BuroSE implementa medidas técnicas, físicas y administrativas estrictas para proteger los datos contra acceso no autorizado, uso indebido o alteración, cumpliendo con las normativas de la Dirección Nacional de Protección de Datos Personales (DNPDP).</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">7. DERECHOS DEL TITULAR (ACCESO, RECTIFICACIÓN Y SUPRESIÓN)</h4>
                    <p>El titular de los datos (ya sea Usuario o Deudor reportado) tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley Nº 25.326. Asimismo, tiene derecho a solicitar la rectificación o supresión de los datos si estos fueran falsos o erróneos, mediante el procedimiento de "Derecho a Réplica" detallado en nuestra Web.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">8. LEGISLACIÓN Y JURISDICCIÓN</h4>
                    <p>Esta Política se rige por la ley argentina. Toda disputa será sometida a los Tribunales Ordinarios en lo Comercial de la Ciudad de Mar del Plata, renunciando a cualquier otro fuero.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">9. INFORMACIÓN DE CONTACTO</h4>
                    <p>Envío de correo electrónico a: <a href="mailto:legales@burose.com.ar" className="text-brand-neon hover:underline font-bold">legales@burose.com.ar</a></p>
                </div>
            )
        },
        replica: {
            title: "Procedimiento de Derecho a Réplica y Habeas Data",
            content: (
                <div className={`space-y-4 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                    <p>Si usted figura en la base de datos de BuroSE y considera que la información es errónea, falsa, inexacta o se encuentra desactualizada, tiene derecho a solicitar su rectificación, actualización o supresión de forma <strong>GRATUITA</strong>, conforme a la Ley 25.326.</p>

                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm">PASO A PASO PARA EJERCER SU DERECHO:</h4>
                    <ol className="list-decimal pl-5 space-y-4">
                        <li>
                            <strong>Solicitud:</strong> Envíe un correo electrónico a <a href="mailto:legales@burose.com.ar" className="text-brand-neon font-bold hover:underline">legales@burose.com.ar</a> con el asunto "DERECHO A RÉPLICA - CUIT [Número]".
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
                    <p className={`mt-6 text-xs p-4 border rounded italic ${theme === 'dark' ? 'bg-brand-dark border-white/10' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                        BuroSE cumple estrictamente con los plazos legales de 5 días hábiles para actualización y 10 días corridos para informes de acceso, estipulados por la ley vigente.
                    </p>
                </div>
            )
        }
    };

    return (
        <section id="legal" className={`py-24 transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker' : 'bg-slate-100'
            }`}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                    <div className="inline-flex items-center space-x-2 bg-brand-neon/10 border border-brand-neon/20 px-4 py-2 rounded-full mb-6">
                        <ShieldCheck className="text-brand-neon" size={20} />
                        <span className="text-brand-neon text-[10px] font-black uppercase tracking-[0.2em]">Compromiso Legal</span>
                    </div>
                    <h2 className={`text-4xl font-black mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Validación por Expertos Jurídicos</h2>
                    <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-brand-text/70' : 'text-slate-600'}`}>
                        Toda la información publicada en BuroSE es previamente revisada por nuestro equipo de abogados especializados. Este proceso garantiza que cada reporte cumpla con los estándares legales necesarios, protegiendo tanto la integridad del sitio como los derechos de las personas reportadas, minimizando cualquier riesgo legal para el gremio.
                    </p>
                    <p className="mt-6 text-brand-neon font-bold">
                        Contacto Legal: <a href="mailto:legales@burose.com.ar" className="hover:underline">legales@burose.com.ar</a>
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Card 1: TyC */}
                    <div
                        onClick={() => openModal(docs.tyc.title, docs.tyc.content)}
                        className={`p-8 rounded-3xl border transition-all cursor-pointer group flex flex-col items-center text-center ${theme === 'dark'
                            ? 'bg-brand-card border-brand-secondary hover:border-brand-neon/40 hover:bg-brand-card/80 shadow-lg'
                            : 'bg-white border-slate-200 hover:border-brand-neon hover:shadow-2xl shadow-md'
                            }`}
                    >
                        <Gavel className="text-brand-neon mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <h3 className={`text-xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Términos y Condiciones</h3>
                        <p className={`text-sm mb-6 flex-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            Conozca las cláusulas de indemnidad y veracidad que rigen el uso del sistema y el aporte de datos.
                        </p>
                        <span className="text-brand-neon text-xs font-black uppercase border-b-2 border-brand-neon/20 pb-1 group-hover:border-brand-neon transition-all">Ver Documento</span>
                    </div>

                    {/* Card 2: Privacidad */}
                    <div
                        onClick={() => openModal(docs.privacy.title, docs.privacy.content)}
                        className={`p-8 rounded-3xl border transition-all cursor-pointer group flex flex-col items-center text-center ${theme === 'dark'
                            ? 'bg-brand-card border-brand-secondary hover:border-brand-neon/40 hover:bg-brand-card/80 shadow-lg'
                            : 'bg-white border-slate-200 hover:border-brand-neon hover:shadow-2xl shadow-md'
                            }`}
                    >
                        <Lock className="text-brand-neon mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <h3 className={`text-xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Política de Privacidad</h3>
                        <p className={`text-sm mb-6 flex-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            Información sobre el tratamiento de datos según la Ley 25.326 y plazos de conservación.
                        </p>
                        <span className="text-brand-neon text-xs font-black uppercase border-b-2 border-brand-neon/20 pb-1 group-hover:border-brand-neon transition-all">Ver Política</span>
                    </div>

                    {/* Card 3: Réplica */}
                    <div
                        onClick={() => openModal(docs.replica.title, docs.replica.content)}
                        className={`p-8 rounded-3xl border transition-all cursor-pointer group flex flex-col items-center text-center sm:col-span-2 md:col-span-1 ${theme === 'dark'
                            ? 'bg-brand-card border-brand-secondary hover:border-brand-neon/40 hover:bg-brand-card/80 shadow-lg'
                            : 'bg-white border-slate-200 hover:border-brand-neon hover:shadow-2xl shadow-md'
                            }`}
                    >
                        <AlertCircle className="text-brand-neon mb-4 group-hover:scale-110 transition-transform" size={40} />
                        <h3 className={`text-xl font-black mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Derecho a Réplica</h3>
                        <p className={`text-sm mb-6 flex-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                            Procedimiento formal de Habeas Data para rectificación o supresión de datos erróneos.
                        </p>
                        <span className="text-brand-neon text-xs font-black uppercase border-b-2 border-brand-neon/20 pb-1 group-hover:border-brand-neon transition-all">Ver Procedimiento</span>
                    </div>
                </div>
            </div>

            <LegalModal
                isOpen={modalData.isOpen}
                onClose={closeModal}
                title={modalData.title}
                content={modalData.content}
                theme={theme}
            />
        </section>
    );
};

export default Legal;
