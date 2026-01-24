import React from 'react';
import LegalLayout from './LegalLayout';

const Terms = ({ theme, setTheme }) => {
    return (
        <LegalLayout title="Términos y Condiciones de Uso" theme={theme} setTheme={setTheme}>
            <div className={`space-y-6 ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>
                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">1. ACEPTACIÓN</h4>
                    <p>El acceso y uso de la plataforma BuroSE implica la aceptación plena y sin reservas de los presentes Términos y Condiciones. El servicio está dirigido exclusivamente a empresas y profesionales del gremio de la Seguridad Electrónica en Argentina.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">2. DECLARACIÓN JURADA DEL USUARIO DENUNCIANTE</h4>
                    <p>Al registrar una deuda o incidente comercial en la plataforma, el Usuario declara bajo juramento que:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>a) La deuda es real, líquida, exigible y de origen comercial lícito.</li>
                        <li>b) Cuenta con documentación respaldatoria (facturas, cheques rechazados, remitos, etc.) que acredita la obligación.</li>
                        <li>c) No utiliza la plataforma con fines de extorsión, competencia desleal o difamación.</li>
                    </ul>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">3. INDEMNIDAD</h4>
                    <p>El Usuario se obliga a mantener indemne a BuroSE, Vecino Seguro Sistemas, sus directivos y empleados, frente a cualquier reclamo, demanda, sanción, multa o juicio (incluyendo honorarios legales y costas) iniciado por terceros o por organismos de control, derivado de la inexactitud, falsedad o falta de actualización de la información cargada por el Usuario. BuroSE no será responsable en ningún caso por lucro cesante, pérdida de chances comerciales o daños indirectos derivados del uso de la información.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">4. OBLIGACIÓN DE ACTUALIZAR</h4>
                    <p>Es obligación exclusiva e intransferible del Usuario Denunciante informar a BuroSE dentro de las <strong>72 horas hábiles</strong> si el deudor ha regularizado su situación de pago, a fin de actualizar el registro a "Deuda Cancelada" o proceder a su baja según corresponda. El incumplimiento de esta obligación hará responsable al Usuario por los daños que la permanencia indebida del registro ocasione al afectado.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">5. USO DE LA INFORMACIÓN</h4>
                    <p>La información obtenida a través de BuroSE es confidencial y para uso exclusivo de evaluación de riesgo crediticio propio. Queda prohibida su reproducción, venta, cesión o divulgación pública en redes sociales o medios masivos.</p>
                </section>

                <section>
                    <h4 className="font-black text-brand-neon uppercase tracking-widest text-sm mb-2">6. SUSPENSIÓN DE CUENTA</h4>
                    <p>BuroSE se reserva el derecho de suspender o eliminar unilateralmente la cuenta de cualquier Usuario que cargue información falsa, abuse del sistema o no presente las pruebas requeridas ante un pedido de validación.</p>
                </section>
            </div>
        </LegalLayout>
    );
};

export default Terms;
