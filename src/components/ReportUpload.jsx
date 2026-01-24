import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ReportUpload = ({ theme }) => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        debtor_name: '',
        debtor_cuit: '',
        debt_amount: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'debtor_cuit' ? value.replace(/\D/g, '') : value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatus({ type: 'error', message: 'Por favor, adjunte un archivo de respaldo (Factura/PDF).' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        const data = new FormData();
        data.append('report', file);
        data.append('debtor_name', formData.debtor_name);
        data.append('debtor_cuit', formData.debtor_cuit);
        data.append('debt_amount', formData.debt_amount);
        data.append('description', formData.description);

        try {
            const response = await fetch('/api/upload_report.php', {
                method: 'POST',
                body: data
            });
            const result = await response.json();

            if (result.status === 'success') {
                setStatus({ type: 'success', message: 'Reporte enviado con éxito para validación legal.' });
                setFile(null);
                setFormData({ debtor_name: '', debtor_cuit: '', debt_amount: '', description: '' });
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
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Evidencia (PDF / JPG / PNG)</label>
                        <div className="relative">
                            <input
                                type="file" required onChange={handleFileChange}
                                className={`w-full border rounded-xl px-4 py-2.5 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-brand-neon file:text-brand-darker cursor-pointer ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-brand-muted' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                            />
                        </div>
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

                <p className={`text-[10px] text-center font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Nota: Los reportes son validados por legales antes de ser públicos.
                </p>
            </form>
        </div>
    );
};

export default ReportUpload;
