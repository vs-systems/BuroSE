import React, { useState } from 'react';
import { Send } from 'lucide-react';

const AccessForm = () => {
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
        <div className="bg-brand-card border border-brand-secondary rounded-2xl p-8 relative overflow-hidden group">
            {/* Próximamente Overlay */}
            {/* 
            <div className="absolute inset-0 z-10 bg-brand-darker/70 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                <div className="border border-brand-neon/30 bg-brand-dark/40 p-6 rounded-xl backdrop-blur-md shadow-2xl">
                    <h4 className="text-brand-neon text-3xl font-bold tracking-tighter uppercase mb-2">Próximamente</h4>
                    <p className="text-brand-text/60 text-sm">Nuestro sistema de registro gremial estará disponible en breve.</p>
                </div>
            </div>
            */}

            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="">
                <h3 className="text-2xl font-bold text-white mb-2">Denunciantes / Acceso</h3>
                <p className="text-brand-muted text-sm mb-8">
                    Únete a la red colaborativa. Exclusivo para empresas del gremio y denuncias comerciales.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Nombre / Razón Social</label>
                        <input
                            type="text" name="name" required
                            className="w-full bg-brand-dark border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-neon focus:outline-none transition-colors"
                            placeholder="Tu Empresa S.R.L."
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-1">CUIT (Solo números)</label>
                            <input
                                type="text" name="cuit" required
                                value={formData.cuit}
                                className="w-full bg-brand-dark border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-neon focus:outline-none transition-colors"
                                placeholder="Ej: 30123456789"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-1">WhatsApp (Sin 0 ni 15)</label>
                            <input
                                type="tel" name="whatsapp" required
                                value={formData.whatsapp}
                                className="w-full bg-brand-dark border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-neon focus:outline-none transition-colors"
                                placeholder="+54 9 11..."
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Email Corporativo</label>
                        <input
                            type="email" name="email" required
                            className="w-full bg-brand-dark border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-neon focus:outline-none transition-colors"
                            placeholder="info@tuempresa.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Rubro</label>
                            <select
                                name="sector"
                                className="w-full bg-brand-dark border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-neon focus:outline-none transition-colors appearance-none"
                                onChange={handleChange}
                            >
                                <option value="Importador">Importador</option>
                                <option value="Distribuidor">Distribuidor</option>
                                <option value="Fabricante">Fabricante</option>
                                <option value="Mayorista">Mayorista</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Localidad</label>
                            <input
                                type="text" name="city" required
                                className="w-full bg-brand-dark border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-neon focus:outline-none transition-colors"
                                placeholder="CABA"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Preferencia de Contacto</label>
                        <div className="flex space-x-6">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="contactPref" value="whatsapp" checked={formData.contactPref === 'whatsapp'} onChange={handleChange} className="text-brand-neon focus:ring-brand-neon bg-brand-dark border-brand-secondary" />
                                <span className="text-sm text-brand-text">WhatsApp</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="contactPref" value="email" checked={formData.contactPref === 'email'} onChange={handleChange} className="text-brand-neon focus:ring-brand-neon bg-brand-dark border-brand-secondary" />
                                <span className="text-sm text-brand-text">Email</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" name="contactPref" value="telefono" checked={formData.contactPref === 'telefono'} onChange={handleChange} className="text-brand-neon focus:ring-brand-neon bg-brand-dark border-brand-secondary" />
                                <span className="text-sm text-brand-text">Llamado</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-brand-neon text-brand-darker font-bold py-4 rounded hover:bg-[#00cc7d] transition-colors flex items-center justify-center"
                    >
                        Enviar Solicitud <Send size={18} className="ml-2" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AccessForm;
