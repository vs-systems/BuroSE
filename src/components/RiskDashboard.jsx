import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, ShieldX, TrendingUp, Landmark, FileText, AlertTriangle } from 'lucide-react';

const RiskDashboard = () => {
    const [cuit, setCuit] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`/api/search.php?cuit=${cuit}`);
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error searching:', error);
            alert('Error al realizar la búsqueda.');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level) => {
        if (level === 'GREEN') return 'text-brand-neon border-brand-neon/20 bg-brand-neon/5';
        if (level === 'YELLOW') return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5';
        return 'text-brand-alert border-brand-alert/20 bg-brand-alert/5';
    };

    const getStatusColor = (situacion) => {
        if (situacion <= 1) return 'bg-brand-neon';
        if (situacion === 2) return 'bg-yellow-400';
        return 'bg-brand-alert';
    };

    return (
        <div id="risk-search" className="min-h-screen bg-brand-darker py-20">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header / Search */}
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tighter">Consulta de Riesgo Gremial</h2>
                    <form onSubmit={handleSearch} className="relative max-w-xl mx-auto group">
                        <input
                            type="text"
                            value={cuit}
                            onChange={(e) => setCuit(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="Ingrese CUIT o DNI sin guiones..."
                            className="w-full bg-brand-card border-2 border-brand-secondary rounded-full py-5 px-8 text-xl text-white focus:border-brand-neon focus:outline-none transition-all shadow-2xl group-hover:border-brand-secondary/80"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-3 bg-brand-neon text-brand-darker p-3 rounded-full hover:scale-105 transition-transform"
                        >
                            <Search size={24} />
                        </button>
                    </form>
                    <p className="mt-4 text-brand-muted text-sm">Pruebe con: 20111111112 (Limpio) o 30222222223 (Deudor)</p>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-brand-neon border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-brand-neon font-bold animate-pulse">Analizando perfiles...</p>
                    </div>
                )}

                {result && !loading && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Summary Score Card */}
                        <div className={`border-2 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between shadow-2xl ${getRiskColor(result.alert_level)}`}>
                            <div className="flex items-center space-x-6 mb-6 md:mb-0">
                                {result.alert_level === 'GREEN' ? <ShieldCheck size={80} strokeWidth={1} /> :
                                    result.alert_level === 'YELLOW' ? <ShieldAlert size={80} strokeWidth={1} /> : <ShieldX size={80} strokeWidth={1} />}
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-70">Resultado Unificado</h3>
                                    <p className="text-4xl font-black">{result.alert_level === 'GREEN' ? 'SIN RIESGO DETECTADO' : 'RIESGO POTENCIAL DETECTADO'}</p>
                                    <p className="text-lg opacity-80 mt-1">Sujeto: {result.cuit}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold uppercase opacity-60">Deuda Total Consolidada</p>
                                <p className="text-5xl font-black leading-tight">$ {parseFloat(result.total_risk_debt).toLocaleString('es-AR')}</p>
                            </div>
                        </div>

                        {/* Split Detail Panels */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Guild Reports (Left) */}
                            <div className="bg-brand-card border border-brand-secondary rounded-3xl p-8 shadow-xl">
                                <div className="flex items-center space-x-3 mb-6">
                                    <TrendingUp className="text-brand-neon" size={24} />
                                    <h4 className="text-xl font-bold text-white">Reportes del Gremio</h4>
                                </div>

                                {result.internal.count > 0 ? (
                                    <div className="space-y-4">
                                        {result.internal.reports.map((report, idx) => (
                                            <div key={idx} className="bg-brand-dark/50 border border-brand-secondary/50 rounded-xl p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="text-brand-neon font-bold">${parseFloat(report.monto).toLocaleString('es-AR')}</p>
                                                        <p className="text-xs text-brand-muted">{new Date(report.fecha_denuncia).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className="bg-brand-alert/20 text-brand-alert text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">Validado</span>
                                                </div>
                                                <p className="text-sm text-brand-text/80 italic">"{report.descripcion}"</p>
                                                <div className="mt-4 flex items-center text-xs text-brand-text/50">
                                                    <FileText size={14} className="mr-1" /> Adjunto: Ver Evidencia
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 border-2 border-dashed border-brand-secondary rounded-2xl">
                                        <p className="text-brand-muted italic">Sin antecedentes reportados por colegas.</p>
                                    </div>
                                )}
                            </div>

                            {/* BCRA Reports (Right) */}
                            <div className="bg-brand-card border border-brand-secondary rounded-3xl p-8 shadow-xl">
                                <div className="flex items-center space-x-3 mb-6">
                                    <Landmark className="text-brand-neon" size={24} />
                                    <h4 className="text-xl font-bold text-white">Situación Oficial (BCRA)</h4>
                                </div>

                                <div className="space-y-4">
                                    {result.bcra.entidades.length > 0 ? (
                                        result.bcra.entidades.map((entidad, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-brand-dark/30 rounded-xl border border-brand-secondary/30">
                                                <div>
                                                    <p className="font-bold text-white uppercase text-sm">{entidad.entidad}</p>
                                                    <p className="text-xs text-brand-muted">Periodo: {entidad.periodo}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className={`px-3 py-1 rounded text-[10px] font-black text-brand-darker mb-1 ${getStatusColor(entidad.situacion)}`}>
                                                        SITUACIÓN {entidad.situacion}
                                                    </div>
                                                    <p className="text-sm font-bold text-brand-text/80">$ {parseFloat(entidad.monto).toLocaleString('es-AR')}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center py-10 opacity-30 grayscale">
                                            <Landmark size={48} />
                                            <p className="ml-4 italic">No se registran deudas bancarias.</p>
                                        </div>
                                    )}

                                    {result.bcra.max_situacion > 2 && (
                                        <div className="mt-6 flex items-start space-x-3 p-4 bg-brand-alert/10 border border-brand-alert/20 rounded-xl">
                                            <AlertTriangle className="text-brand-alert flex-shrink-0" size={20} />
                                            <p className="text-xs text-brand-alert leading-relaxed">
                                                <strong>ALERTA FINANCIERA:</strong> El sujeto presenta una situación crediticia crítica en entidades oficiales. Se recomienda extremar recaudos comerciales.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskDashboard;
