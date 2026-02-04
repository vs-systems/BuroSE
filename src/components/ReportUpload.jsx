import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ReportUpload = ({ theme }) => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        debtor_name: '',
        debtor_cuit: '',
        debt_amount: '',
        description: '',
        intencion_pago: false,
        instancia_judicial: false,
        domicilio_particular: '',
        domicilio_comercial: '',
        celular_contacto: '',
        provincia: '',
        localidad: ''
    });
    const [localidades, setLocalidades] = useState([]);
    const [searchingLocalidad, setSearchingLocalidad] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const provincias = [
        "Buenos Aires", "Capital Federal", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
    ];

    const fetchLocalidades = async (query) => {
        if (!formData.provincia || query.length < 3) {
            setLocalidades([]);
            return;
        }
        setSearchingLocalidad(true);
        try {
            const resp = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${formData.provincia}&nombre=${query}&max=5`);
            const data = await resp.json();
            setLocalidades(data.localidades || []);
        } catch (e) { console.error(e); }
        setSearchingLocalidad(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'debtor_cuit' ? value.replace(/\D/g, '') : value }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) {
            setStatus({ type: 'error', message: 'Por favor, adjunte al menos un archivo de respaldo.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        const data = new FormData();
        files.forEach((file, index) => {
            data.append('report[]', file);
        });
        data.append('debtor_name', formData.debtor_name);
        data.append('debtor_cuit', formData.debtor_cuit);
        data.append('debt_amount', formData.debt_amount);
        data.append('description', formData.description);
        data.append('intencion_pago', formData.intencion_pago ? 1 : 0);
        data.append('instancia_judicial', formData.instancia_judicial ? 1 : 0);
        data.append('domicilio_particular', formData.domicilio_particular);
        data.append('domicilio_comercial', formData.domicilio_comercial);
        data.append('celular_contacto', formData.celular_contacto);
        data.append('provincia', formData.provincia);
        data.append('localidad', formData.localidad);

        try {
            const response = await fetch('api/upload_report.php', {
                method: 'POST',
                body: data,
                credentials: 'include'
            });
            const result = await response.json();

            if (result.status === 'success') {
                setStatus({ type: 'success', message: result.message });
                setFiles([]);
                setFormData({
                    debtor_name: '', debtor_cuit: '', debt_amount: '', description: '',
                    intencion_pago: false, instancia_judicial: false,
                    domicilio_particular: '', domicilio_comercial: '', celular_contacto: '',
                    provincia: '', localidad: ''
                });
                e.target.reset();
            } else {
                setStatus({ type: 'error', message: result.message || 'Error al subir el reporte.' });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setStatus({ type: 'error', message: 'Error de conexión con el servidor.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`mt-16 p-8 rounded-3xl border ${theme === 'dark' ? 'bg-brand-card border-brand-secondary shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-brand-neon/10 p-3 rounded-xl">
                    <Upload className="text-brand-neon" size={24} />
                </div>
                <div>
                    <h3 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Reportar Morosidad</h3>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Carga de incidentes con respaldo documental</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Nombre del Deudor</label>
                        <input
                            type="text" name="debtor_name" required value={formData.debtor_name} onChange={handleChange}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                            placeholder="Ej: Distribuidora X"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>CUIT / DNI Deudor</label>
                        <input
                            type="text" name="debtor_cuit" required value={formData.debtor_cuit} onChange={handleChange}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                            placeholder="Ej: 30712345678"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Monto en Pesos ($)</label>
                        <input
                            type="number" name="debt_amount" required value={formData.debt_amount} onChange={handleChange}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Evidencia (Factura, DNI denunciado, etc.)</label>
                        <div className="relative">
                            <input
                                type="file" multiple required onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                className={`w-full border rounded-xl px-4 py-2.5 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-brand-neon file:text-brand-darker cursor-pointer ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-brand-muted' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                            />
                            {files.length > 0 && (
                                <p className="mt-2 text-[10px] font-black uppercase text-brand-neon">{files.length} archivos seleccionados</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 py-4 border-y border-brand-secondary/20">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center ${formData.intencion_pago ? 'bg-brand-neon border-brand-neon' : 'bg-transparent border-slate-400'}`}>
                            {formData.intencion_pago && <CheckCircle size={14} className="text-brand-darker" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.intencion_pago} onChange={e => setFormData({ ...formData, intencion_pago: e.target.checked })} />
                        <div>
                            <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>¿Hubo intención de pago?</span>
                            <p className="text-[10px] text-brand-muted">Marcar si el deudor intentó regularizar sin éxito.</p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center ${formData.instancia_judicial ? 'bg-brand-alert border-brand-alert' : 'bg-transparent border-slate-400'}`}>
                            {formData.instancia_judicial && <CheckCircle size={14} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.instancia_judicial} onChange={e => setFormData({ ...formData, instancia_judicial: e.target.checked })} />
                        <div>
                            <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>¿En instancia judicial?</span>
                            <p className="text-[10px] text-brand-muted">Indicar si ya existe un proceso legal abierto.</p>
                        </div>
                    </label>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Último Domicilio Particular</label>
                        <input
                            type="text" name="domicilio_particular" value={formData.domicilio_particular} onChange={handleChange}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                            placeholder="Calle, Nro, Depto"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Último Domicilio Comercial</label>
                        <input
                            type="text" name="domicilio_comercial" value={formData.domicilio_comercial} onChange={handleChange}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                            placeholder="Empresa o Local"
                        />
                    </div>
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Último Celular Conocido</label>
                        <input
                            type="text" name="celular_contacto" value={formData.celular_contacto} onChange={handleChange}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                            placeholder="Ej: 11 1234 5678"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-brand-secondary/20">
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Provincia</label>
                        <select
                            name="provincia" value={formData.provincia} onChange={handleChange}
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                        >
                            <option value="">Seleccione Provincia</option>
                            {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Localidad (Buscar)</label>
                        <input
                            type="text" placeholder="Escriba para buscar..." autoComplete="off"
                            className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                            onChange={e => {
                                setFormData({ ...formData, localidad: e.target.value });
                                fetchLocalidades(e.target.value);
                            }}
                            value={formData.localidad}
                        />
                        {localidades.length > 0 && (
                            <div className={`absolute z-50 w-full mt-1 border rounded-xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary' : 'bg-white border-slate-200'}`}>
                                {localidades.map(l => (
                                    <button
                                        key={l.id} type="button"
                                        onClick={() => { setFormData({ ...formData, localidad: l.nombre }); setLocalidades([]); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-bold uppercase hover:bg-brand-neon hover:text-brand-darker transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                                    >
                                        {l.nombre}
                                    </button>
                                ))}
                            </div>
                        )}
                        {searchingLocalidad && <div className="absolute right-3 top-10 w-4 h-4 border-2 border-brand-neon border-t-transparent rounded-full animate-spin"></div>}
                    </div>
                </div>

                <div>
                    <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Breve Descripción del Incidente</label>
                    <textarea
                        name="description" rows="3" value={formData.description} onChange={handleChange}
                        className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all resize-none ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                        placeholder="Describa el origen de la deuda (Factura impaga, Cheque rechazado, etc.)"
                    ></textarea>
                </div>

                {status.message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-brand-neon/10 border border-brand-neon/20 text-brand-neon' : 'bg-brand-alert/10 border border-brand-alert/20 text-brand-alert'}`}>
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        <p className="text-xs font-bold uppercase tracking-tight">{status.message}</p>
                    </div>
                )}

                <div className="pt-4">
                    <label className="flex items-start gap-4 cursor-pointer group">
                        <div className={`mt-1 w-6 h-6 rounded border-2 transition-all flex items-center justify-center shrink-0 ${formData.acceptLegal ? 'bg-brand-neon border-brand-neon' : 'bg-transparent border-slate-400'}`}>
                            {formData.acceptLegal && <CheckCircle size={14} className="text-brand-darker" />}
                        </div>
                        <input type="checkbox" className="hidden" required checked={formData.acceptLegal} onChange={e => setFormData({ ...formData, acceptLegal: e.target.checked })} />
                        <div className={`text-xs font-bold leading-relaxed ${theme === 'dark' ? 'text-brand-text/80' : 'text-slate-600'}`}>
                            <strong>Declaración Jurada:</strong> Confirmo que la información cargada es veraz. Entiendo que es <u>indispensable</u> adjuntar copia de la Factura, DNI o Remito impago para respaldar la operación. La documentación falsa implicará la suspensión definitiva de la cuenta. <strong>BuroSE podrá contactarlo para solicitar información adicional si fuera necesario.</strong>
                        </div>
                    </label>
                </div>

                <button
                    type="submit" disabled={loading}
                    className={`w-full bg-brand-neon text-brand-darker font-black py-4 rounded-xl shadow-xl shadow-brand-neon/20 transition-all flex items-center justify-center uppercase tracking-widest hover:brightness-110 active:scale-95 ${loading ? 'opacity-70 grayscale' : ''}`}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-brand-darker/30 border-t-brand-darker rounded-full animate-spin"></div>
                    ) : (
                        <>Subir Reporte <Upload size={18} className="ml-2" /></>
                    )}
                </button>

                <p className={`text-[10px] text-center font-bold uppercase tracking-widest leading-relaxed ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Nota: Los reportes son validados por nuestro equipo legal antes de ser publicados. La carga tiene carácter de declaración jurada bajo apercibimiento de ley.
                </p>
            </form>
        </div>
    );
};

export default ReportUpload;
