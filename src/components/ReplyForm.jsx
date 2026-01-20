import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';

const ReplyForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        id: '', // CUIT/DNI
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Derecho a Réplica Enviado:', formData);
        alert('Solicitud enviada. El área de legales revisará su caso.');
    };

    return (
        <div id="replica" className="bg-brand-dark border border-brand-secondary/50 rounded-2xl p-8">
            <div className="flex items-center space-x-2 mb-2">
                <AlertOctagon className="text-brand-alert" size={24} />
                <h3 className="text-2xl font-bold text-white">Derecho a Réplica</h3>
            </div>

            <p className="text-brand-muted text-sm mb-8">
                Si considera que existe información errónea sobre su perfil comercial, utilice este canal formal.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Nombre Completo</label>
                    <input
                        type="text" name="name" required
                        className="w-full bg-brand-card border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-alert focus:outline-none transition-colors"
                        placeholder="Su Nombre"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">DNI o CUIT</label>
                    <input
                        type="text" name="id" required
                        className="w-full bg-brand-card border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-alert focus:outline-none transition-colors"
                        placeholder="Documento de Identidad"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Email de Contacto</label>
                    <input
                        type="email" name="email" required
                        className="w-full bg-brand-card border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-alert focus:outline-none transition-colors"
                        placeholder="email@ejemplo.com"
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-1">Descargo / Solicitud</label>
                    <textarea
                        name="message" required
                        rows="4"
                        className="w-full bg-brand-card border border-brand-secondary rounded px-4 py-3 text-white focus:border-brand-alert focus:outline-none transition-colors resize-none"
                        placeholder="Detalle aquí su reclamo o solicitud de revisión..."
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="text-[10px] text-brand-muted bg-brand-card p-3 rounded border border-brand-secondary">
                    <strong>Aviso Legal:</strong> BuroSE garantiza este canal formal para ejercer su derecho conforme a la legislación vigente (Ley 25.326). La información proporcionada será analizada por nuestro equipo de compliance.
                </div>

                <button
                    type="submit"
                    className="w-full mt-2 border border-brand-text/20 text-brand-text font-medium py-4 rounded hover:bg-brand-card hover:text-white transition-colors"
                >
                    Enviar Descargo Formal
                </button>
            </form>
        </div>
    );
};

export default ReplyForm;
