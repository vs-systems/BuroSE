import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Rocket, ShieldCheck, Mail, MapPin, Briefcase } from 'lucide-react';
import { calculateCUITDigit, getDeviceFingerprint } from '../utils/argentinaUtils';

const AccessForm = ({ theme, defaultPlan = 'business', title = 'Denunciantes / Acceso', subtitle = 'Únete a la red colaborativa. Exclusivo para empresas del gremio y denuncias comerciales.' }) => {
    const [formData, setFormData] = useState({
        name: '',
        cuit: '',
        whatsapp: '',
        email: '',
        contactPref: 'whatsapp',
        sector: 'Seguridad',
        city: '',
        acceptTerms: false,
        acceptNDA: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = type === 'checkbox' ? checked : value;

        if (name === 'cuit') {
            finalValue = finalValue.replace(/\D/g, '');
        }
        if (name === 'whatsapp' && type !== 'checkbox') {
            if (finalValue === '') {
                setFormData({ ...formData, [name]: '' });
                return;
            }
            let digits = finalValue.replace(/\D/g, '');
            if (!digits.startsWith('549')) {
                digits = '549' + digits;
            }
            finalValue = '+' + digits.slice(0, 2) + ' ' + digits.slice(2, 3) + ' ' + digits.slice(3);
        }
        setFormData({ ...formData, [name]: finalValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Antes de enviar, limpiamos guiones y espacios extras por si acaso
        const cleanData = {
            ...formData,
            cuit: formData.cuit.replace(/\D/g, ''),
            whatsapp: formData.whatsapp.replace(/\D/g, ''),
            fingerprint: getDeviceFingerprint(),
            plan: defaultPlan,
            type: 'contact'
        };

        // 1. Validación de Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        if (!formData.acceptTerms || !formData.acceptNDA) {
            alert('Debes aceptar los Términos y Condiciones y el Acuerdo de Confidencialidad para continuar.');
            return;
        }

        try {
            const response = await fetch('api/forms.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanData),
            });
            const result = await response.json();
            if (result.status === 'success') {
                if (result.payment_url) {
                    alert('Solicitud procesada. Serás redirigido al pago para completar tu alta.');
                    window.location.href = result.payment_url;
                } else {
                    alert(result.message || 'Gracias. Hemos recibido tu solicitud de acceso.');
                    setFormData({
                        name: '',
                        cuit: '',
                        whatsapp: '',
                        email: '',
                        contactPref: 'whatsapp',
                        sector: 'Seguridad',
                        city: '',
                        acceptTerms: false,
                        acceptNDA: false
                    });
                }
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
                <h3 className={`text-2xl font-black mb-2 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className={`text-sm mb-8 font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                    {subtitle}
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
                            <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Calculadora CUIT (Opcional)</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Ingresa DNI"
                                    maxLength="8"
                                    className={`flex-1 border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                                    onChange={(e) => {
                                        const dni = e.target.value.replace(/\D/g, '');
                                        if (dni.length === 8) {
                                            const base = "20" + dni;
                                            const digit = calculateCUITDigit(base);
                                            setFormData({ ...formData, cuit: base + digit });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>CUIT Final (Solo números)</label>
                            <input
                                type="text" name="cuit" required
                                value={formData.cuit}
                                maxLength="11"
                                className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                    }`}
                                placeholder="20333333334"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>WhatsApp de Contacto</label>
                            <input
                                type="text" name="whatsapp" required value={formData.whatsapp}
                                className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                    }`}
                                placeholder="+54 9"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Gremio / Rubro</label>
                            <div className="relative">
                                <select
                                    name="sector" value={formData.sector}
                                    className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none appearance-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                        }`}
                                    onChange={handleChange}
                                >
                                    <option value="Seguridad">Seguridad</option>
                                    <option value="Informática">Informática</option>
                                    <option value="Electricidad">Electricidad</option>
                                    <option value="Conectividad">Conectividad</option>
                                    <option value="Monitoreo">Monitoreo</option>
                                    <option value="Particular">Particular</option>
                                    <option value="Otro">Otro</option>
                                </select>
                                <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`} size={16} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Email Corporativo</label>
                        <input
                            type="email" name="email" required value={formData.email}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                }`}
                            placeholder="admin@empresa.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-4 pt-4">
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <input
                                type="checkbox" name="acceptTerms" required
                                checked={formData.acceptTerms} onChange={handleChange}
                                className="mt-1 w-5 h-5 rounded border-2 border-brand-secondary bg-transparent checked:bg-brand-neon transition-all"
                            />
                            <span className={`text-[10px] font-bold leading-relaxed ${theme === 'dark' ? 'text-brand-muted group-hover:text-white' : 'text-slate-500'}`}>
                                Acepto los <a href="/#/terms" className="text-brand-neon hover:underline">Términos y Condiciones</a> y la Política de Privacidad de BuroSE.
                            </span>
                        </label>
                        <label className="flex items-start gap-4 cursor-pointer group">
                            <input
                                type="checkbox" name="acceptNDA" required
                                checked={formData.acceptNDA} onChange={handleChange}
                                className="mt-1 w-5 h-5 rounded border-2 border-brand-secondary bg-transparent checked:bg-brand-neon transition-all"
                            />
                            <span className={`text-[10px] font-bold leading-relaxed ${theme === 'dark' ? 'text-brand-muted group-hover:text-white' : 'text-slate-500'}`}>
                                Acepto el <a href="/#/nda" className="text-brand-neon hover:underline">Acuerdo de Confidencialidad (NDA)</a> para el uso de la base de datos colaborativa.
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-neon text-brand-darker font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-neon/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                    >
                        Solicitar Acceso <ArrowRight size={20} />
                    </button>

                    <p className={`text-[9px] text-center font-black uppercase tracking-widest opacity-50 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                        Sujeto a validación comercial • BuroSE Compliance
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AccessForm;
