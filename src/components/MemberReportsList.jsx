import React, { useState, useEffect } from 'react';
import { FileText, Edit2, CheckCircle, XCircle, RefreshCcw, Save, X } from 'lucide-react';

const MemberReportsList = ({ theme }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        cuit_denunciado: '',
        nombre_denunciado: '',
        monto: '',
        descripcion: ''
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await fetch('api/member_reports.php', { credentials: 'include' });
            const data = await res.json();
            if (data.status === 'success') {
                setReports(data.data);
            }
        } catch (err) {
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = (report) => {
        setEditingId(report.id);
        setEditForm({
            cuit_denunciado: report.cuit_denunciado,
            nombre_denunciado: report.nombre_denunciado,
            monto: report.monto,
            descripcion: report.descripcion || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSaveEdit = async (id) => {
        try {
            const res = await fetch('api/member_update_report.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...editForm
                }),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert("Reporte actualizado con éxito");
                setEditingId(null);
                fetchReports();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Error al guardar los cambios");
        }
    };

    if (loading && reports.length === 0) {
        return (
            <div className="flex justify-center py-10">
                <RefreshCcw className="animate-spin text-brand-neon" size={32} />
            </div>
        );
    }

    return (
        <div className={`mt-12 p-8 rounded-3xl border ${theme === 'dark' ? 'bg-brand-card border-brand-secondary shadow-2xl' : 'bg-white border-slate-200 shadow-xl'}`}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-brand-neon/10 p-3 rounded-xl">
                        <FileText className="text-brand-neon" size={24} />
                    </div>
                    <div>
                        <h3 className={`text-2xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Mis Reportes Cargados</h3>
                        <p className={`text-sm font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Historial y estado de tus denuncias</p>
                    </div>
                </div>
                <button
                    onClick={fetchReports}
                    className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${loading ? 'animate-spin' : ''}`}
                >
                    <RefreshCcw size={20} className="text-brand-neon" />
                </button>
            </div>

            <div className="space-y-4">
                {reports.map((report) => (
                    <div
                        key={report.id}
                        className={`p-6 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-brand-dark/50 border-white/5 hover:border-brand-neon/30' : 'bg-slate-50 border-slate-100 hover:border-brand-neon/30'}`}
                    >
                        {editingId === report.id ? (
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-1 block">Nombre del Deudor</label>
                                        <input
                                            type="text"
                                            value={editForm.nombre_denunciado}
                                            onChange={e => setEditForm({ ...editForm, nombre_denunciado: e.target.value })}
                                            className={`w-full p-3 rounded-xl border outline-none focus:border-brand-neon ${theme === 'dark' ? 'bg-brand-dark border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-1 block">CUIT / DNI</label>
                                        <input
                                            type="text"
                                            value={editForm.cuit_denunciado}
                                            onChange={e => setEditForm({ ...editForm, cuit_denunciado: e.target.value.replace(/\D/g, '') })}
                                            className={`w-full p-3 rounded-xl border outline-none focus:border-brand-neon ${theme === 'dark' ? 'bg-brand-dark border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-1 block">Monto ($)</label>
                                        <input
                                            type="number"
                                            value={editForm.monto}
                                            onChange={e => setEditForm({ ...editForm, monto: e.target.value })}
                                            className={`w-full p-3 rounded-xl border outline-none focus:border-brand-neon ${theme === 'dark' ? 'bg-brand-dark border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <button
                                            onClick={() => handleSaveEdit(report.id)}
                                            className="flex-1 bg-brand-neon text-brand-darker font-black py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            <Save size={16} /> Guardar
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex-1 bg-white/5 text-brand-muted font-black py-3 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5"
                                        >
                                            <X size={16} /> Cancelar
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-1 block">Descripción</label>
                                    <textarea
                                        value={editForm.descripcion}
                                        onChange={e => setEditForm({ ...editForm, descripcion: e.target.value })}
                                        className={`w-full p-3 rounded-xl border outline-none focus:border-brand-neon h-20 resize-none ${theme === 'dark' ? 'bg-brand-dark border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className={`font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{report.nombre_denunciado}</h4>
                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${report.estado === 'validado' ? 'bg-brand-neon/10 text-brand-neon border-brand-neon/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                            {report.estado}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-brand-muted uppercase tracking-widest">
                                        <span>CUIT: <span className={theme === 'dark' ? 'text-white' : 'text-slate-700'}>{report.cuit_denunciado}</span></span>
                                        <span>Monto: <span className="text-brand-alert">$ {parseFloat(report.monto).toLocaleString('es-AR')}</span></span>
                                        <span>Fecha: <span className={theme === 'dark' ? 'text-white' : 'text-slate-700'}>{new Date(report.fecha_denuncia).toLocaleDateString()}</span></span>
                                    </div>
                                    {report.descripcion && (
                                        <p className="mt-2 text-[10px] italic opacity-60 line-clamp-1">"{report.descripcion}"</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleStartEdit(report)}
                                        className={`p-3 rounded-xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-brand-neon hover:bg-brand-neon hover:text-brand-darker' : 'bg-slate-100 border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                                        title="Editar Denuncia"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {reports.length === 0 && (
                    <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                        <FileText className="mx-auto text-brand-muted opacity-20 mb-4" size={48} />
                        <p className="italic text-brand-muted">Aún no has cargado ninguna denuncia.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberReportsList;
