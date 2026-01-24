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
            title: "Términos y Condiciones",
            content: (
                <div className={`space-y-4 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                    <p className="font-bold underline mb-2">CLÁUSULA DE INDEMNIDAD Y VERACIDAD DE LA INFORMACIÓN:</p>
                    <p>BuroSE actúa exclusivamente como una plataforma tecnológica de intermediación y almacenamiento de datos aportados por terceros. BuroSE <strong>NO genera, no audita, ni certifica</strong> la veracidad de la información crediticia cargada por los Usuarios.</p>
                    <p>El Usuario Denunciante declara bajo juramento que toda información suministrada es veraz, verificable y responde a una deuda comercial real, líquida y exigible. El Usuario asume la responsabilidad civil y penal exclusiva por cualquier daño, perjuicio, lucro cesante o daño moral que pudiera ocasionar la publicación de información falsa, errónea o desactualizada.</p>
                    <p>El Usuario se obliga a mantener indemne a BuroSE, a VS Sistemas y a sus administradores frente a cualquier reclamo judicial o extrajudicial derivado de los reportes por él generados.</p>
                </div>
            )
        },
        privacy: {
            title: "Política de Privacidad",
            content: (
                <div className={`space-y-4 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                    <p className="font-bold underline mb-2">CUMPLIMIENTO LEY 25.326:</p>
                    <p><strong>FINALIDAD Y TRATAMIENTO DE DATOS:</strong> En cumplimiento de la Ley de Protección de Datos Personales, se informa que los datos recabados forman parte de una base de datos con fines de "Prestación de Servicios de Información Crediticia" (Art. 26).</p>
                    <p><strong>Fuente de los datos:</strong> Los datos de cumplimiento comercial son aportados por acreedores miembros del gremio de seguridad electrónica bajo declaración jurada.</p>
                    <p className="font-bold mt-4">Plazos de conservación (Derecho al Olvido):</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Deudas impagas:</strong> Se conservarán por un plazo máximo de 5 (cinco) años.</li>
                        <li><strong>Deudas canceladas:</strong> Si el deudor regulariza su situación, el registro se mantendrá por 2 (dos) años con la leyenda "Deuda Cancelada", conforme al Art. 26 Inc. 4 de la Ley.</li>
                    </ul>
                    <p className="mt-4"><strong>Seguridad:</strong> BuroSE implementa medidas técnicas de seguridad para evitar la adulteración, pérdida o acceso no autorizado a los datos, conforme a la normativa vigente.</p>
                </div>
            )
        },
        replica: {
            title: "Derecho a Réplica (Habeas Data)",
            content: (
                <div className={`space-y-4 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                    <p className="font-bold underline mb-2">ACCESO, RECTIFICACIÓN Y SUPRESIÓN DE DATOS:</p>
                    <p>Si usted figura en nuestra base de datos y considera que la información es errónea, falsa o está desactualizada, tiene derecho a ejercer su Derecho de Rectificación de forma gratuita.</p>
                    <p className="font-bold mt-4">Procedimiento:</p>
                    <ol className="list-decimal pl-5 space-y-3">
                        <li>Complete el formulario de "Derecho a Réplica" disponible en nuestra web.</li>
                        <li>Adjunte la documentación que acredite el pago o el error (ej: Libre Deuda, Recibo Oficial, Sentencia Judicial).</li>
                    </ol>
                    <p className="mt-4"><strong>Plazo de resolución:</strong> BuroSE procederá a verificar la información con el denunciante. En caso de no recibir validación en 5 días hábiles, o ante prueba fehaciente de error, se procederá al bloqueo preventivo o eliminación del registro cuestionado, cumpliendo con el plazo legal de 5 días hábiles establecido por la Ley 25.326 para rectificación.</p>
                    <p className={`mt-6 text-xs p-4 border rounded italic ${theme === 'dark' ? 'bg-brand-dark border-white/10' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                        Todo este proceso es coordinado por nuestro equipo de compliance legal para asegurar la transparencia de la plataforma.
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
                        Contacto Legal: <a href="mailto:legales@vecinoseguro.com.ar" className="hover:underline">legales@vecinoseguro.com.ar</a>
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
