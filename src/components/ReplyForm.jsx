import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';

const ReplyForm = ({ theme }) => {
    const [formData, setFormData] = useState({
        name: '',
        id: '', // CUIT/DNI
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 1. Validación básica de Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Correo electrónico no válido.');
            return;
        }

        try {
            const response = await fetch('api/forms.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    cuit: formData.id,
                    email: formData.email,
                    descargo: formData.message,
                    type: 'replica',
                    website_url: formData.website_url || ''
                }),
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert('Solicitud enviada. El área de legales revisará su caso.');
                setFormData({
                    name: '',
                    id: '',
                    email: '',
                    message: ''
                });
            } else {
                alert('Hubo un error: ' + result.message);
            }
        } catch (error) {
            console.error('Error al enviar:', error);
            alert('Error al conectar con el servidor.');
        }
    };

    return (
        <div id="replica" className={`border transition-all duration-500 rounded-3xl p-8 relative overflow-hidden group ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary/50' : 'bg-white border-slate-200 shadow-xl'
            }`}>
            <div className="">
                <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-brand-alert/10' : 'bg-red-50'}`}>
                        <AlertOctagon className="text-brand-alert" size={24} />
                    </div>
                    <h3 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Derecho a Réplica</h3>
                </div>

                <p className={`text-sm mb-8 font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                    Si considera que existe información errónea sobre su perfil comercial, utilice este canal formal.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Nombre Completo</label>
                        <input
                            type="text" name="name" required value={formData.name}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-alert focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                }`}
                            placeholder="Su Nombre"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>DNI o CUIT (Solo números)</label>
                        <input
                            type="text" name="id" required
                            value={formData.id}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-alert focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                }`}
                            placeholder="Ej: 20123456789"
                            onChange={(e) => setFormData({ ...formData, id: e.target.value.replace(/\D/g, '') })}
                        />
                    </div>

                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Email de Contacto</label>
                        <input
                            type="email" name="email" required value={formData.email}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-alert focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                }`}
                            placeholder="email@ejemplo.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Descargo / Solicitud</label>
                        <textarea
                            name="message" required value={formData.message}
                            rows="4"
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-alert focus:outline-none transition-all resize-none ${theme === 'dark' ? 'bg-brand-card border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                }`}
                            placeholder="Detalle aquí su reclamo o solicitud de revisión..."
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className={`text-[10px] font-bold p-4 rounded-xl border transition-colors ${theme === 'dark' ? 'text-brand-muted bg-brand-card border-brand-secondary' : 'text-slate-500 bg-slate-50 border-slate-200'
                        }`}>
                        <strong className={theme === 'dark' ? 'text-brand-neon' : 'text-blue-600'}>Aviso Legal:</strong> BuroSE garantiza este canal formal para ejercer su derecho conforme a la legislación vigente (Ley 25.326). La información proporcionada será analizada por nuestro equipo de compliance.
                    </div>

                    {/* Honeypot field (hidden from humans) */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                        <input
                            type="text"
                            name="website_url"
                            value={formData.website_url || ''}
                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                            tabIndex="-1"
                            autoComplete="off"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full mt-2 border border-brand-alert text-brand-alert font-black py-4 rounded-xl hover:bg-brand-alert hover:text-white transition-all uppercase tracking-widest active:scale-95 transform`}
                    >
                        Enviar Descargo Formal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReplyForm;
