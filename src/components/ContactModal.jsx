import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

const ContactModal = ({ isOpen, onClose, theme }) => {
    const [formData, setFormData] = useState({
        name: '',
        celular: '',
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
                body: JSON.stringify({ ...formData, type: 'general_contact' })
            });
            const res = await resp.json();
            if (res.status === 'success') {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setFormData({ name: '', celular: '', motivo: 'Consulta Comercial', consulta: '' });
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
                            <h3 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Contactar a <span className="text-brand-neon">BuroSE</span></h3>
                            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Complete el formulario y un asesor se comunicará con usted.</p>
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
                                        placeholder="2235..."
                                        value={formData.celular}
                                        onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Motivo</label>
                                    <select
                                        value={formData.motivo}
                                        onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none appearance-none ${theme === 'dark' ? 'bg-brand-card border-white/10 text-white focus:border-brand-neon' : 'bg-slate-50 border-slate-200 focus:border-brand-neon'
                                            }`}
                                    >
                                        <option>Consulta Comercial</option>
                                        <option>Soporte Técnico</option>
                                        <option>Facturación</option>
                                        <option>Otros</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={`block text-[10px] font-black uppercase tracking-widest mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Consulta</label>
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
