import React, { useState } from 'react';
import { Send } from 'lucide-react';

const AccessForm = ({ theme }) => {
    const [formData, setFormData] = useState({
        name: '',
        cuit: '',
        whatsapp: '',
        email: '',
        contactPref: 'whatsapp',
        sector: 'Distribuidor',
        city: ''
    });

    const handleChange = (e) => {
        let value = e.target.value;
        if (e.target.name === 'cuit') {
            value = value.replace(/\D/g, ''); // Solo números
        }
        if (e.target.name === 'whatsapp') {
            // Si el usuario borra todo, dejamos vacío
            if (value === '') {
                setFormData({ ...formData, [e.target.name]: '' });
                return;
            }
            // Asegurar que empiece con +54 9
            let digits = value.replace(/\D/g, '');
            if (digits.startsWith('549')) {
                // Ya tiene el prefijo
            } else {
                digits = '549' + digits;
            }
            value = '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 3) + ' ' + digits.slice(3);
        }
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Antes de enviar, limpiamos guiones y espacios extras por si acaso
        const cleanData = {
            ...formData,
            cuit: formData.cuit.replace(/\D/g, ''),
            whatsapp: formData.whatsapp.replace(/\D/g, ''),
            type: 'contact'
        };

        try {
            const response = await fetch('/api/forms.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanData),
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert('Gracias. Hemos recibido tu solicitud de acceso.');
                setFormData({
                    name: '',
                    cuit: '',
                    whatsapp: '',
                    email: '',
                    contactPref: 'whatsapp',
                    sector: 'Distribuidor',
                    city: ''
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
        <div className={`border rounded-3xl p-8 relative overflow-hidden group transition-all duration-500 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary shadow-lg shadow-brand-neon/5' : 'bg-white border-slate-200 shadow-xl'
            }`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${theme === 'dark' ? 'bg-brand-neon/5' : 'bg-brand-neon/10'
                }`}></div>

            <div className="relative z-10">
                <h3 className={`text-2xl font-black mb-2 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Denunciantes / Acceso</h3>
                <p className={`text-sm mb-8 font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                    Únete a la red colaborativa. Exclusivo para empresas del gremio y denuncias comerciales.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Nombre / Razón Social</label>
                        <input
                            type="text" name="name" required value={formData.name}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white placeholder:text-brand-muted/30' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400'
                                }`}
                            placeholder="Tu Empresa S.R.L."
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>CUIT (Solo números)</label>
                            <input
                                type="text" name="cuit" required
                                value={formData.cuit}
                                className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                    }`}
                                placeholder="Ej: 30123456789"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>WhatsApp (Sin 0 ni 15)</label>
                            <input
                                type="tel" name="whatsapp" required
                                value={formData.whatsapp}
                                className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                    }`}
                                placeholder="+54 9 11..."
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Email Corporativo</label>
                        <input
                            type="email" name="email" required value={formData.email}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                }`}
                            placeholder="info@tuempresa.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Rubro</label>
                            <div className="relative">
                                <select
                                    name="sector" value={formData.sector}
                                    className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all appearance-none cursor-pointer ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                        }`}
                                    onChange={handleChange}
                                >
                                    <option value="Importador">Importador</option>
                                    <option value="Distribuidor">Distribuidor</option>
                                    <option value="Fabricante">Fabricante</option>
                                    <option value="Mayorista">Mayorista</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Localidad</label>
                            <input
                                type="text" name="city" required value={formData.city}
                                className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                    }`}
                                placeholder="CABA"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className={`block text-xs font-black uppercase mb-4 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Preferencia de Contacto</label>
                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input type="radio" name="contactPref" value="whatsapp" checked={formData.contactPref === 'whatsapp'} onChange={handleChange} className="w-4 h-4 text-brand-neon focus:ring-brand-neon bg-transparent border-slate-400 cursor-pointer" />
                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>WhatsApp</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input type="radio" name="contactPref" value="email" checked={formData.contactPref === 'email'} onChange={handleChange} className="w-4 h-4 text-brand-neon focus:ring-brand-neon bg-transparent border-slate-400 cursor-pointer" />
                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>Email</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <input type="radio" name="contactPref" value="telefono" checked={formData.contactPref === 'telefono'} onChange={handleChange} className="w-4 h-4 text-brand-neon focus:ring-brand-neon bg-transparent border-slate-400 cursor-pointer" />
                                <span className={`text-sm font-bold ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>Llamado</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-brand-neon text-brand-darker font-black py-5 rounded-xl hover:brightness-110 shadow-lg shadow-brand-neon/20 transition-all flex items-center justify-center uppercase tracking-widest active:scale-95 transform"
                    >
                        Enviar Solicitud <Send size={18} className="ml-2" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccessForm;
