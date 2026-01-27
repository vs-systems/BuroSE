import React, { useEffect, useState } from 'react';
import { ShieldAlert, TrendingDown, Users, AlertCircle } from 'lucide-react';

const DebtorRanking = ({ theme }) => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        try {
            const res = await fetch('api/get_ranking.php');
            const data = await res.json();
            if (data.status === 'success') {
                setRanking(data.data);
            }
        } catch (e) {
            console.error("Error fetching ranking:", e);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'GREEN':
                return {
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    text: 'text-green-500',
                    glow: 'shadow-green-500/20',
                    label: 'Compromiso Real'
                };
            case 'YELLOW':
                return {
                    bg: 'bg-yellow-400/10',
                    border: 'border-yellow-400/20',
                    text: 'text-yellow-400',
                    glow: 'shadow-yellow-400/20',
                    label: 'Intención de Pago'
                };
            case 'RED':
            default:
                return {
                    bg: 'bg-brand-alert/10',
                    border: 'border-brand-alert/20',
                    text: 'text-brand-alert',
                    glow: 'shadow-brand-alert/20',
                    label: 'Deudor Peligroso'
                };
        }
    };

    if (loading) return (
        <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-neon border-t-transparent"></div>
        </div>
    );

    return (
        <section className="py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Ranking <span className="text-brand-neon">Top 5 Deudores</span>
                    </h2>
                    <p className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                        Consolidado Nacional BuroSE
                    </p>
                </div>
                <div className={`p-3 rounded-2xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                    <ShieldAlert className="text-brand-neon" size={24} />
                </div>
            </div>

            <div className="grid gap-4">
                {ranking.map((debtor, idx) => {
                    const styles = getStatusStyles(debtor.status);
                    return (
                        <div
                            key={debtor.cuit}
                            className={`relative overflow-hidden border p-5 rounded-3xl transition-all hover:scale-[1.01] flex flex-col md:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'
                                }`}
                        >
                            {/* Ranking Position Badge */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-brand-neon to-transparent opacity-50" />

                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${idx === 0 ? 'bg-brand-neon text-brand-darker shadow-lg shadow-brand-neon/20' :
                                        theme === 'dark' ? 'bg-brand-dark text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    #{idx + 1}
                                </div>
                                <div>
                                    <h3 className={`text-lg font-black uppercase tracking-tight truncate max-w-[200px] md:max-w-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                        }`}>
                                        {debtor.full_name || 'Desconocido'}
                                    </h3>
                                    <p className={`text-xs font-bold font-mono ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                                        CUIT: {debtor.cuit}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col md:items-end w-full md:w-auto gap-2">
                                <p className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    <span className="text-sm mr-1 opacity-50">$</span>
                                    {parseFloat(debtor.amount).toLocaleString('es-AR')}
                                </p>
                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${styles.bg} ${styles.border} ${styles.text} ${styles.glow}`}>
                                    <span className={`w-2 h-2 rounded-full animate-pulse ${styles.text.replace('text', 'bg')}`} />
                                    {styles.label}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {ranking.length === 0 && (
                    <div className={`text-center py-10 border-2 border-dashed rounded-3xl ${theme === 'dark' ? 'border-brand-secondary' : 'border-slate-200'}`}>
                        <p className="italic text-slate-400">No hay deudores en el ranking actualmente.</p>
                    </div>
                )}
            </div>

            <div className={`mt-6 p-4 rounded-2xl border transition-all flex items-center gap-3 ${theme === 'dark' ? 'bg-brand-neon/5 border-brand-neon/20' : 'bg-blue-50 border-blue-100'
                }`}>
                <AlertCircle className="text-brand-neon shrink-0" size={18} />
                <p className="text-[10px] font-bold uppercase tracking-wide text-brand-muted leading-relaxed">
                    Este ranking se actualiza en tiempo real basado en reportes validados y auditoría interna.
                    El estado del semáforo indica la conducta de pago detectada en los últimos 30 días.
                </p>
            </div>
        </section>
    );
};

export default DebtorRanking;
