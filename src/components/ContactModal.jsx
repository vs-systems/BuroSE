import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

const ContactModal = ({ isOpen, onClose, theme }) => {
    const [formData, setFormData] = useState({
        name: '',
        celular: '',
        razon_social: '',
        cuit: '',
        sistema_erp: '',
        conoce_implementacion: 'No',
        motivo: 'Consulta Comercial',
        consulta: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const resp = await fetch('api/forms.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: isOpen }) // isOpen now contains the form type
            });
            const res = await resp.json();
            if (res.status === 'success') {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setFormData({ name: '', celular: '', razon_social: '', cuit: '', sistema_erp: '', conoce_implementacion: 'No', motivo: 'Consulta Comercial', consulta: '' });
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-darker/80 backdrop-blur-sm">
            <div className={`relative w-full max-w-lg p-8 rounded-3xl border animate-in zoom-in duration-300 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary shadow-2xl' : 'bg-white border-slate-200 shadow-2xl'
                }`}>
                <button
                    onClick={onClose}
                    className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-brand-muted' : 'hover:bg-slate-100 text-slate-400'
                        }`}
                >
                    <X size={20} />
                </button>

                {status === 'success' ? (
                    <div className="py-12 text-center space-y-4">
                        <div className="flex justify-center text-brand-neon anim-bounce">
                            <CheckCircle2 size={64} />
                        </div>
                        <h3 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>¡Mensaje Enviado!</h3>
                        <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-600'}>Nos contactaremos con usted a la brevedad.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h3 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {isOpen === 'api_interest' ? 'Solicitar BuroSE API' : (isOpen.startsWith('legal_') ? 'Solicitud Legal y Recupero' : 'Contactar a BuroSE')}
                            </h3>
                            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                                {isOpen === 'api_interest' ? 'Complete los datos técnicos para integrar nuestra API en su sistema.' : 'Complete el formulario y un asesor se comunicará con usted.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Nombre y Apellido</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                        }`}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Celular / WhatsApp</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="11..."
                                        value={formData.celular}
                                        onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Motivo / Servicio</label>
                                    <select
                                        disabled={isOpen !== true}
                                        value={isOpen === 'api_interest' ? 'API Integration' : (isOpen === 'legal_intimacion' ? 'Informe + Intimación' : (isOpen === 'legal_mediacion' ? 'Mediación Oficial' : formData.motivo))}
                                        onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none appearance-none ${theme === 'dark' ? 'bg-brand-card border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                            }`}
                                    >
                                        <option>Consulta Comercial</option>
                                        <option>Soporte Técnico</option>
                                        <option>Facturación</option>
                                        <option>API Integration</option>
                                        <option>Informe + Intimación</option>
                                        <option>Mediación Oficial</option>
                                        <option>Otros</option>
                                    </select>
                                </div>
                            </div>

                            {isOpen === 'api_interest' && (
                                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Razón Social</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.razon_social}
                                                onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>CUIT</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.cuit}
                                                onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Sistema ERP/CRM que utiliza</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Ej: Tango, SAP, Salesforce..."
                                                value={formData.sistema_erp}
                                                onChange={(e) => setFormData({ ...formData, sistema_erp: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                                    }`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>¿Tiene conocimiento técnico?</label>
                                            <select
                                                value={formData.conoce_implementacion}
                                                onChange={(e) => setFormData({ ...formData, conoce_implementacion: e.target.value })}
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none appearance-none ${theme === 'dark' ? 'bg-brand-card border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                                    }`}
                                            >
                                                <option value="Si">Sí, cuento con equipo de IT</option>
                                                <option value="No">No, necesito asesoramiento</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                                    {isOpen === 'api_interest' ? 'Requerimientos de API / Observaciones' : 'Detalle de la Consulta'}
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.consulta}
                                    onChange={(e) => setFormData({ ...formData, consulta: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none resize-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                        }`}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={`w-full py-4 mt-4 rounded-xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : 'bg-brand-neon text-brand-darker hover:brightness-110 shadow-lg shadow-brand-neon/20 active:scale-95'
                                    }`}
                            >
                                {status === 'loading' ? 'Enviando...' : <><Send size={18} /> Enviar Consulta</>}

                            </button>
                            {status === 'error' && <p className="text-center text-xs font-bold text-brand-alert uppercase tracking-widest mt-2">Error al enviar. Intente nuevamente.</p>}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactModal;
