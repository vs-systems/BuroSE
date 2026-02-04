import React, { useState, useEffect } from 'react';
import { Calendar, LogIn, Users, MessageSquare, LogOut, RefreshCcw, Search, Clock, Plus, Trash2, Globe, Image as ImageIcon, Sun, Moon, ShieldCheck, Trophy, Save, FileText, Download, Landmark, TrendingUp, AlertTriangle, Menu, X, ChevronDown, Monitor, CheckCircle2 } from 'lucide-react';

const getGoogleCalendarUrl = (title, startDate, details) => {
    if (!startDate) return '#';
    const start = new Date(startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(startDate).getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
};

const LogosManager = ({ theme }) => {
    const [logos, setLogos] = useState([]);
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLogos();
    }, []);

    const fetchLogos = async () => {
        try {
            const res = await fetch('api/admin_logos.php');
            const data = await res.json();
            if (data.status === 'success') setLogos(data.data);
        } catch (err) {
            console.error("Error fetching associates:", err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('api/admin_logos.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, website_url: website, logo_url: 'TEXT_ONLY' }) // Usamos un flag para bypass del check de backend viejo
            });
            const data = await res.json();
            if (data.status === 'success') {
                setName('');
                setWebsite('');
                fetchLogos();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Error al conectar con la base de datos");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar este asociado?")) return;
        await fetch(`api/admin_logos.php?id=${id}`, { method: 'DELETE' });
        fetchLogos();
    };

    return (
        <div className={`p-10 rounded-3xl border ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200'}`}>
            <h2 className="text-3xl font-black uppercase mb-8 tracking-tighter">Gestión de <span className="text-brand-neon">Asociados</span></h2>

            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Nombre de la Empresa (ej: Seguridad X)"
                        required
                        className={`px-6 py-4 rounded-xl border-2 focus:border-brand-neon outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100'}`}
                    />
                    <input
                        type="url" value={website} onChange={e => setWebsite(e.target.value)}
                        placeholder="Sitio Web (https://...)"
                        required
                        className={`px-6 py-4 rounded-xl border-2 focus:border-brand-neon outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100'}`}
                    />
                </div>
                <button
                    disabled={loading}
                    className="bg-brand-neon text-brand-darker font-black py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-neon/20 uppercase tracking-widest text-xs"
                >
                    {loading ? 'Procesando...' : '+ Agregar Asociado'}
                </button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {logos.map(logo => (
                    <div key={logo.id} className={`group relative p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary hover:border-brand-neon/50' : 'bg-slate-50 border-slate-100 hover:border-brand-neon/50'}`}>
                        <span className="text-sm font-black uppercase tracking-tighter mb-2 leading-none">{logo.name}</span>
                        <span className="text-[10px] text-brand-muted truncate w-full opacity-50 px-2">{logo.website_url}</span>
                        <button
                            onClick={() => handleDelete(logo.id)}
                            className="absolute -top-3 -right-3 p-2 bg-brand-alert text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-brand-alert/20"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RankingManager = ({ theme }) => {
    const [rankings, setRankings] = useState([]);
    const [newItem, setNewItem] = useState({ cuit: '', full_name: '', amount: '', status: 'RED', is_forced: 1, forced_position: '' });

    useEffect(() => { fetchRankings(); }, []);

    const fetchRankings = async () => {
        try {
            const res = await fetch('api/admin_ranking_action.php?action=list');
            const data = await res.json();
            if (data.status === 'success') setRankings(data.data);
        } catch (e) { console.error(e); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('api/admin_ranking_action.php', {
                method: 'POST',
                body: JSON.stringify({ ...newItem, action: 'save' }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert(data.message);
                setNewItem({ cuit: '', full_name: '', amount: '', status: 'RED', is_forced: 1, forced_position: '' });
                fetchRankings();
            }
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este registro del ranking?')) return;
        try {
            await fetch('api/admin_ranking_action.php', {
                method: 'POST',
                body: JSON.stringify({ id, action: 'delete' }),
                headers: { 'Content-Type': 'application/json' }
            });
            fetchRankings();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSave} className={`border p-8 rounded-3xl grid md:grid-cols-3 lg:grid-cols-6 gap-6 items-end transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-xl'
                }`}>
                <div className="lg:col-span-2">
                    <label className={`block text-[10px] font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Nombre / Razón Social</label>
                    <input type="text" value={newItem.full_name} onChange={e => setNewItem({ ...newItem, full_name: e.target.value })}
                        className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-brand-neon transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200'}`} required />
                </div>
                <div>
                    <label className={`block text-[10px] font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>CUIT (sin guiones)</label>
                    <input type="text" value={newItem.cuit} onChange={e => setNewItem({ ...newItem, cuit: e.target.value })}
                        className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-brand-neon transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200'}`} required />
                </div>
                <div>
                    <label className={`block text-[10px] font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Monto Deuda</label>
                    <input type="number" value={newItem.amount} onChange={e => setNewItem({ ...newItem, amount: e.target.value })}
                        className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-brand-neon transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200'}`} required />
                </div>
                <div>
                    <label className={`block text-[10px] font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Semáforo</label>
                    <select value={newItem.status} onChange={e => setNewItem({ ...newItem, status: e.target.value })}
                        className={`w-full border rounded-xl px-4 py-3 outline-none focus:border-brand-neon transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200'}`}>
                        <option value="RED">Rojo (Peligroso)</option>
                        <option value="YELLOW">Amarillo (Intención)</option>
                        <option value="GREEN">Verde (Compromiso)</option>
                    </select>
                </div>
                <button type="submit" className="bg-brand-neon text-brand-darker font-black py-4 rounded-xl flex items-center justify-center hover:scale-[1.02] transition-transform shadow-lg shadow-brand-neon/20 uppercase text-xs tracking-widest">
                    <Save size={18} className="mr-2" /> Guardar
                </button>
            </form>

            <div className="grid gap-4">
                {rankings.map(r => (
                    <div key={r.id} className={`border p-6 rounded-2xl flex items-center justify-between transition-all ${theme === 'dark' ? 'bg-brand-dark/50 border-brand-secondary/50' : 'bg-white border-slate-100 shadow-md'
                        }`}>
                        <div className="flex items-center gap-6">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${r.status === 'RED' ? 'bg-brand-alert' : r.status === 'YELLOW' ? 'bg-yellow-400' : 'bg-green-500'
                                }`} />
                            <div>
                                <h4 className={`font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{r.full_name}</h4>
                                <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>CUIT: {r.cuit} • ${parseFloat(r.amount).toLocaleString('es-AR')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${r.is_forced ? 'bg-brand-neon/10 text-brand-neon' : 'bg-white/5 text-slate-500'
                                }`}>
                                {r.is_forced ? 'Override Manual' : 'Estado Manual'}
                            </span>
                            <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg text-brand-alert hover:bg-brand-alert/10 transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ManualReportForm = ({ theme, onComplete }) => {
    const [formData, setFormData] = useState({
        cuit_denunciado: '',
        nombre_denunciado: '',
        monto: '',
        descripcion: '',
        reporter_cuit: ''
    });
    const [loading, setLoading] = useState(false);
    const [lookupLoading, setLookupLoading] = useState(false);

    const handleLookup = async (cuit) => {
        if (cuit.length < 11) return;
        setLookupLoading(true);
        try {
            const res = await fetch(`api/search.php?cuit=${cuit}`);
            const data = await res.json();
            if (data.status === 'success' && data.name) {
                setFormData(prev => ({ ...prev, nombre_denunciado: data.name }));
            }
        } catch (err) { console.error("Lookup error", err); }
        finally { setLookupLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('api/admin_create_report.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.status === 'success') {
                alert(data.message);
                setFormData({ cuit_denunciado: '', nombre_denunciado: '', monto: '', descripcion: '', reporter_cuit: '' });
                if (onComplete) onComplete();
            } else {
                alert(data.message);
            }
        } catch (err) { alert("Error de conexión"); }
        finally { setLoading(false); }
    };

    return (
        <form onSubmit={handleSubmit} className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xl font-black uppercase mb-6 tracking-tighter">Carga <span className="text-brand-neon">Directa de Deuda</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <input
                        type="text" placeholder="CUIT Denunciado (solo números)"
                        value={formData.cuit_denunciado}
                        onChange={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            setFormData({ ...formData, cuit_denunciado: val });
                            if (val.length === 11) handleLookup(val);
                        }}
                        className={`w-full px-4 py-3 rounded-xl border-2 outline-none focus:border-brand-neon ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100'}`}
                        required
                    />
                    {lookupLoading && <div className="absolute right-3 top-3 animate-spin border-2 border-brand-neon border-t-transparent rounded-full w-4 h-4"></div>}
                </div>
                <input
                    type="text" placeholder="Nombre/Razón Social Denunciado"
                    value={formData.nombre_denunciado} onChange={e => setFormData({ ...formData, nombre_denunciado: e.target.value })}
                    className={`px-4 py-3 rounded-xl border-2 outline-none focus:border-brand-neon ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100'}`}
                    required
                />
                <input
                    type="number" placeholder="Monto Deuda ($)"
                    value={formData.monto} onChange={e => setFormData({ ...formData, monto: e.target.value })}
                    className={`px-4 py-3 rounded-xl border-2 outline-none focus:border-brand-neon ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100'}`}
                    required
                />
                <input
                    type="text" placeholder="CUIT Reportador (opcional, default Admin)"
                    value={formData.reporter_cuit} onChange={e => setFormData({ ...formData, reporter_cuit: e.target.value.replace(/\D/g, '') })}
                    className={`px-4 py-3 rounded-xl border-2 outline-none focus:border-brand-neon ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100'}`}
                />
                <textarea
                    placeholder="Descripción del incidente..."
                    value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                    className={`md:col-span-2 px-4 py-3 rounded-xl border-2 outline-none focus:border-brand-neon h-32 ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100'}`}
                ></textarea>
                <div className="md:col-span-2 flex justify-end">
                    <button
                        disabled={loading}
                        className="bg-brand-neon text-brand-darker font-black px-8 py-3 rounded-xl uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-neon/20"
                    >
                        {loading ? 'Cargando...' : 'Cargar Informe Validado'}
                    </button>
                </div>
            </div>
        </form>
    );
};

const SocioActionButtons = ({ s, handlePlanChange, handleUserAction, theme }) => (
    <div className="flex flex-wrap gap-2">
        {s.plan === 'free' && (
            <>
                <button
                    onClick={() => handlePlanChange(s.cuit, 'business')}
                    className="bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    Pasar a Socio
                </button>
                <button
                    onClick={() => { if (confirm('¿Hacerlo VIP?')) handleUserAction(s.cuit, 'make_vip'); }}
                    className="bg-brand-neon/10 text-brand-neon hover:bg-brand-neon hover:text-brand-darker px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    Hacer VIP
                </button>
            </>
        )}
        {s.plan !== 'free' && s.is_vip != 1 && (
            <button
                onClick={() => handlePlanChange(s.cuit, 'free')}
                className="bg-slate-500/10 text-slate-500 hover:bg-slate-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
            >
                Pasar a Gratis
            </button>
        )}
        <button
            onClick={() => {
                const newCredits = prompt("Ajustar Créditos Extra (Bonus):", s.creds_package || 0);
                if (newCredits !== null) handleUserAction(s.cuit, 'update_credits', { credits: newCredits, type: 'package' });
            }}
            className={`px-3 py-1.5 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-brand-neon' : 'bg-slate-50 border-slate-200 hover:border-brand-neon'}`}
        >
            Créditos
        </button>
        <button
            onClick={() => handleUserAction(s.cuit, 'block')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${s.estado === 'bloqueado' ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
        >
            {s.estado === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
        </button>
        <button
            onClick={() => handleUserAction(s.cuit, 'delete')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:bg-red-600 hover:text-white' : 'bg-slate-50 text-slate-400 hover:bg-red-600 hover:text-white'}`}
        >
            Borrar
        </button>
    </div>
);

const SocioList = ({ data, filterFn, theme, searchSocio, setSearchSocio, handleUserAction, handlePlanChange, showCreate = false, fetchData }) => (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 w-full">
            <div className="flex flex-1 gap-4 w-full">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted opacity-50" size={16} />
                    <input
                        type="text"
                        placeholder="Buscar por CUIT o Razón Social..."
                        value={searchSocio}
                        onChange={(e) => setSearchSocio(e.target.value)}
                        className={`w-full pl-12 pr-4 py-2.5 rounded-xl border-2 outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white focus:border-brand-neon' : 'bg-white border-slate-100 focus:border-brand-neon'}`}
                    />
                </div>
            </div>
            {showCreate && (
                <button
                    onClick={() => {
                        const razon = prompt("Razón Social:");
                        const cuit = prompt("CUIT (sin guiones):");
                        const email = prompt("Email:");
                        const pass = prompt("Contraseña (o dejar vacío para default):", cuit);
                        const plan = prompt("Plan (free/active/business):", "active");

                        if (razon && cuit && email) {
                            fetch('api/admin_create_socio.php', {
                                method: 'POST',
                                body: JSON.stringify({ razon_social: razon, cuit: cuit.replace(/\D/g, ''), email, pass, plan }),
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include'
                            }).then(r => r.json()).then(res => { alert(res.message); fetchData(); });
                        }
                    }}
                    className="bg-brand-neon text-brand-darker font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                >
                    <Plus size={16} /> Alta Manual
                </button>
            )}
        </div>
        <div className="grid gap-6">
            {data.socios
                .filter(filterFn)
                .filter(s => s.cuit.includes(searchSocio) || (s.razon_social || '').toLowerCase().includes(searchSocio.toLowerCase()))
                .map((s, idx) => (
                    <div key={idx} className={`border p-6 rounded-3xl transition-all ${theme === 'dark'
                        ? 'bg-brand-card border-brand-secondary shadow-lg shadow-black/20'
                        : 'bg-white border-slate-100 shadow-md'
                        } ${s.estado === 'bloqueado' ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${s.is_vip == 1 ? 'bg-brand-neon/10' : 'bg-white/5'}`}>
                                    {s.is_vip == 1 ? <ShieldCheck className="text-brand-neon" size={20} /> : <Users className="text-brand-muted" size={20} />}
                                </div>
                                <div>
                                    <h3 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.razon_social}</h3>
                                    <div className="flex gap-2 items-center mt-1">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${s.is_vip == 1 ? 'bg-brand-neon text-brand-darker' : s.plan === 'free' ? 'bg-slate-500 text-white' : 'bg-blue-600 text-white'}`}>
                                            {s.is_vip == 1 ? 'VIP' : s.plan?.toUpperCase()}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${s.estado === 'bloqueado' ? 'bg-red-500 text-white' : 'bg-green-500/20 text-green-500'}`}>
                                            {s.estado.toUpperCase()}
                                        </span>
                                        {s.gremio && <span className="text-[8px] font-black text-brand-muted uppercase border border-white/10 px-2 py-0.5 rounded">{s.gremio}</span>}
                                    </div>
                                </div>
                            </div>
                            <SocioActionButtons s={s} handlePlanChange={handlePlanChange} handleUserAction={handleUserAction} theme={theme} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-4 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                            <div><p className="opacity-50 mb-1">CUIT</p><p className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{s.cuit}</p></div>
                            <div><p className="opacity-50 mb-1">Email</p><p className={theme === 'dark' ? 'text-white truncate' : 'text-slate-900 truncate'}>{s.email}</p></div>
                            <div>
                                <p className="opacity-50 mb-1">Vencimiento</p>
                                <p className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{s.is_vip == 1 ? 'PERPETUO' : s.expiry_date || 'N/A'}</p>
                                {s.is_vip != 1 && s.expiry_date && (
                                    <a
                                        href={getGoogleCalendarUrl(`VENCIMIENTO: ${s.cuit} - ${s.razon_social}`, s.expiry_date, `Vencimiento de plan BuroSE para ${s.razon_social}`)}
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-brand-neon hover:text-white transition-colors flex items-center gap-1 mt-1 lowercase text-[8px]"
                                    >
                                        <Calendar size={10} /> + Google Calendar
                                    </a>
                                )}
                            </div>
                            <div><p className="opacity-50 mb-1">Créditos (Mes/Extra)</p><p className="text-brand-neon">{s.is_vip == 1 ? '∞' : `${s.creds_monthly} / ${s.creds_package}`}</p></div>
                            <div>
                                <p className="opacity-50 mb-1">Cita ALTA</p>
                                <a
                                    href={getGoogleCalendarUrl(`ALTA: ${s.cuit} - ${s.razon_social}`, s.created_at || new Date().toISOString(), `Alta de cuenta BuroSE para ${s.razon_social}`)}
                                    target="_blank" rel="noopener noreferrer"
                                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-brand-neon text-brand-neon' : 'bg-slate-50 border-slate-200 hover:border-brand-neon text-blue-600'}`}
                                >
                                    <Calendar size={12} /> Google Cal
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            {data.socios.filter(filterFn).length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                    <Users className="mx-auto text-brand-muted opacity-20 mb-4" size={48} />
                    <p className="italic text-brand-muted">No se encontraron resultados en esta categoría.</p>
                </div>
            )}
        </div>
    </div>
);

const LogsView = ({ theme }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('api/admin_fetch_logs.php');
            const data = await res.json();
            if (data.status === 'success') setLogs(data.logs);
        } catch (err) { console.error("Error fetching logs", err); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            <div className={`flex justify-between items-center p-6 rounded-3xl border ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200'}`}>
                <h3 className="text-xl font-black uppercase tracking-tight">Registro de <span className="text-brand-neon">Actividad</span></h3>
                <button onClick={fetchLogs} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="grid gap-4">
                {logs.map((log, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-brand-card/50 border-brand-secondary' : 'bg-white border-slate-100 shadow-sm'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${log.action?.includes('LOGIN') ? 'bg-blue-500/10 text-blue-500' : 'bg-brand-neon/10 text-brand-neon'}`}>
                                <Globe size={16} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest">{log.action}</p>
                                <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                                    {log.user_name} (ID: {log.user_id || 'Admin'}) • IP: {log.ip_address}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col md:items-end">
                            <p className="text-[10px] font-medium opacity-80 mb-1">{log.details}</p>
                            <p className="text-[9px] font-bold opacity-40">{new Date(log.created_at).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
                {!loading && logs.length === 0 && <p className="text-center italic opacity-40 py-10">No hay registros de actividad aún.</p>}
            </div>
        </div>
    );
};

const AdminPanel = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [data, setData] = useState({ contacts: [], replicas: [], socios: [], reports: [], settings: {} });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('contacts');
    const [searchSocio, setSearchSocio] = useState('');
    const [socioFilter, setSocioFilter] = useState('all'); // 'all', 'validado', 'bloqueado'
    const [theme, setTheme] = useState('dark');
    const [isNavOpen, setIsNavOpen] = useState(false);

    const [isSociosOpen, setIsSociosOpen] = useState(true);
    const [editingReport, setEditingReport] = useState(null);

    useEffect(() => {
        checkSession();
    }, []);

    const handlePlanChange = async (cuit, newPlan) => {
        if (!confirm(`¿Cambiar plan a ${newPlan}?`)) return;
        handleUserAction(cuit, 'update_plan', { plan: newPlan });
    };

    const checkSession = async () => {
        try {
            const resp = await fetch('api/check_session.php', { credentials: 'include' });
            const res = await resp.json();
            if (res.authenticated && res.role === 'admin') {
                setIsLogged(true);
                fetchData();
            }
        } catch (e) { console.error(e); }
    };

    const handleUserAction = async (id_or_cuit, action, extraData = {}) => {
        if (!confirm('¿Confirma realizar esta acción?')) return;
        try {
            const resp = await fetch('api/admin_user_action.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cuit: id_or_cuit,
                    id: id_or_cuit,
                    action,
                    ...extraData
                }),
                credentials: 'include'
            });
            const res = await resp.json();
            alert(res.message);
            fetchData();
        } catch (e) { alert('Error de conexión'); }
    };

    const handleApiAction = async (cuit, action) => {
        try {
            const resp = await fetch('api/admin_api_action.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cuit, action }),
                credentials: 'include'
            });
            const res = await resp.json();

            if (res.status === 'success' && res.token) {
                await navigator.clipboard.writeText(res.token);
                alert(`${res.message}\n\nEl token ha sido copiado al portapapeles.`);
            } else {
                alert(res.message);
            }
            fetchData();
        } catch (e) { alert('Error de conexión'); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await fetch('api/admin_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, pass }),
                credentials: 'include'
            });
            const res = await resp.json();
            if (res.status === 'success') {
                setIsLogged(true);
                fetchData();
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (e) { alert('Error de conexión'); }
        setLoading(false);
    };

    const handleEditReport = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await fetch('api/admin_user_action.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_report',
                    cuit: editingReport.id,
                    ...editingReport
                }),
                credentials: 'include'
            });
            const res = await resp.json();
            alert(res.message);
            if (res.status === 'success') {
                setEditingReport(null);
                fetchData();
            }
        } catch (e) { alert('Error de conexión'); }
        setLoading(false);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const resp = await fetch('api/admin_data.php', { credentials: 'include' });
            const res = await resp.json();
            if (res.status === 'success') {
                // Aseguramos que los campos existan
                setData({
                    contacts: res.data.contacts || [],
                    replicas: res.data.replicas || [],
                    socios: res.data.socios || [],
                    reports: res.data.reports || [],
                    settings: res.data.settings || {},
                    stats: res.data.stats || { vip_count: 0, replica_count: 0, total_socios: 0, pending_leads: 0 }
                });
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleLogout = async () => {
        await fetch('api/logout.php');
        setIsLogged(false);
        setData({ contacts: [], replicas: [], socios: [] });
        window.location.href = '/';
    };

    const handleApprove = async (contact, plan = 'active') => {
        const pass = prompt(`Asignar contraseña para ${contact.nombre_social} (CUIT: ${contact.cuit}) [Plan: ${plan}]:`, contact.cuit);
        if (pass === null) return;

        try {
            const resp = await fetch('api/admin_approve.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cuit: contact.cuit,
                    password: pass,
                    name: contact.nombre_social,
                    email: contact.email,
                    whatsapp: contact.whatsapp,
                    rubro: contact.rubro,
                    localidad: contact.localidad,
                    plan: plan
                })
            });
            const res = await resp.json();
            if (res.status === 'success') {
                alert('¡Socio aprobado con éxito!');
                fetchData();
            } else {
                alert('Error: ' + res.message);
            }
        } catch (e) {
            alert('Error al conectar con la API');
        }
    };

    if (!isLogged) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker' : 'bg-slate-50'
                }`}>
                <div className={`border p-8 rounded-3xl w-full max-w-md shadow-2xl transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-xl'
                    }`}>
                    <div className="text-center mb-8">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border transition-colors ${theme === 'dark' ? 'bg-brand-neon/10 border-brand-neon/20' : 'bg-brand-neon/10 border-brand-neon/30'
                            }`}>
                            <LogIn className="text-brand-neon" size={32} />
                        </div>
                        <h2 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>BuroSE Admin</h2>
                        <p className={`text-sm ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Ingrese sus credenciales de administrador</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className={`block text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Usuario</label>
                            <input
                                type="text" value={user} onChange={e => setUser(e.target.value)}
                                className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                    }`}
                                placeholder="Admin ID" required
                            />
                        </div>
                        <div>
                            <label className={`block text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Contraseña</label>
                            <input
                                type="password" value={pass} onChange={e => setPass(e.target.value)}
                                className={`w-full border rounded-xl px-4 py-3 focus:border-brand-neon focus:outline-none transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                    }`}
                                placeholder="••••••••" required
                            />
                        </div>
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-brand-neon text-brand-darker font-black py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center shadow-lg shadow-brand-neon/20 uppercase tracking-widest"
                        >
                            {loading ? 'Validando...' : 'Acceder al Panel'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-400/10 flex justify-center">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className={`flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'
                                }`}
                        >
                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                            <span>{theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker text-brand-text' : 'bg-slate-50 text-slate-900'
            }`}>
            {/* Sidebar Mobile Overlay */}
            {isNavOpen && (
                <div
                    className="fixed inset-0 bg-brand-darker/80 backdrop-blur-sm z-[40] md:hidden"
                    onClick={() => setIsNavOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed md:sticky top-0 h-screen z-[50] transition-all duration-300 border-r flex flex-col ${isNavOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full w-0 md:translate-x-0 md:w-64'
                } ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-xl'
                } overflow-hidden`}>
                <div className={`p-6 border-b flex items-center justify-between ${theme === 'dark' ? 'border-brand-secondary' : 'border-slate-100'}`}>
                    <div>
                        <h1 className={`text-xl font-black tracking-widest uppercase italic bg-gradient-to-r from-brand-neon to-blue-500 bg-clip-text text-transparent`}>BuroSE</h1>
                        <p className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${theme === 'dark' ? 'text-brand-neon' : 'text-blue-600'}`}>Control Hub</p>
                    </div>
                    <button onClick={() => setIsNavOpen(false)} className="md:hidden p-2 text-brand-muted hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button
                        onClick={() => { setActiveTab('contacts'); setIsNavOpen(false); }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contacts'
                            ? 'bg-brand-neon text-brand-darker font-black shadow-lg shadow-brand-neon/20'
                            : (theme === 'dark' ? 'text-brand-muted hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
                            }`}
                    >
                        <Users size={18} />
                        <span className="whitespace-nowrap">Leads/Accesos</span>
                    </button>

                    <div className="space-y-1">
                        <button
                            onClick={() => setIsSociosOpen(!isSociosOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${['socios', 'gratuitos', 'vip', 'blocked'].includes(activeTab)
                                ? 'bg-white/5 text-white font-bold'
                                : (theme === 'dark' ? 'text-brand-muted hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <Users size={18} />
                                <span className="whitespace-nowrap uppercase tracking-widest text-[10px]">Socios</span>
                            </div>
                            <ChevronDown size={14} className={`transition-transform ${isSociosOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSociosOpen && (
                            <div className="pl-4 space-y-1 mt-1 border-l border-white/5 ml-4">
                                {[
                                    { id: 'socios', label: 'Socios Activos' },
                                    { id: 'gratuitos', label: 'Cuentas Gratuitas' },
                                    { id: 'vip', label: 'Socios VIP' },
                                    { id: 'blocked', label: 'Cuentas Bloqueadas' },
                                ].map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => { setActiveTab(sub.id); setIsNavOpen(false); }}
                                        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-xs transition-all ${activeTab === sub.id
                                            ? 'text-brand-neon font-black'
                                            : 'text-slate-500 hover:text-white'
                                            }`}
                                    >
                                        <span className={`w-1 h-1 rounded-full ${activeTab === sub.id ? 'bg-brand-neon' : 'bg-slate-600'}`}></span>
                                        <span>{sub.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {[
                        { id: 'reports', label: 'Informes Deuda', icon: FileText },
                        { id: 'replicas', label: 'Réplicas', icon: MessageSquare },
                        { id: 'stats', label: 'Estadísticas', icon: Landmark },
                        { id: 'logs', label: 'Auditoría Logs', icon: Clock },
                        { id: 'config', label: 'Configuración', icon: Save },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsNavOpen(false); }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                ? 'bg-brand-neon text-brand-darker font-black shadow-lg shadow-brand-neon/20'
                                : (theme === 'dark' ? 'text-brand-muted hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
                                }`}
                        >
                            <tab.icon size={18} />
                            <span className="whitespace-nowrap">{tab.label}</span>
                        </button>
                    ))}
                </nav>
                <div className={`p-4 border-t ${theme === 'dark' ? 'border-brand-secondary' : 'border-slate-100'}`}>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 mb-4 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-slate-100'
                            }`}
                    >
                        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                        <span>Tema: {theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-3 px-4 py-4 rounded-xl text-brand-alert hover:bg-brand-alert/10 transition-all font-black uppercase tracking-widest text-[10px]"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
                <header className={`sticky top-0 z-[30] h-20 border-b flex items-center justify-between px-6 md:px-10 transition-colors ${theme === 'dark' ? 'bg-brand-dark/90 backdrop-blur-md border-brand-secondary' : 'bg-white/90 backdrop-blur-md border-slate-100 shadow-sm'
                    }`}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsNavOpen(true)} className="md:hidden p-2 rounded-lg bg-brand-neon/10 text-brand-neon">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className={`text-xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {activeTab === 'stats' ? 'INFORMES ESTRATÉGICOS' :
                                    activeTab === 'gratuitos' ? 'CUENTAS GRATUITAS' :
                                        activeTab === 'vip' ? 'SOCIOS VIP' :
                                            activeTab === 'socios' ? 'SOCIOS ACTIVOS' :
                                                activeTab === 'blocked' ? 'CUENTAS BLOQUEADAS' :
                                                    activeTab === 'config' ? 'CONFIGURACIÓN DEL SISTEMA' :
                                                        activeTab.toUpperCase()}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-neon animate-pulse"></span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Admin Activo</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={fetchData} disabled={loading}
                        className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'text-brand-neon hover:bg-brand-neon/10' : 'text-blue-600 hover:bg-blue-50'
                            }`}
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </header>

                <main className="p-8 flex-1 overflow-y-auto">
                    {activeTab === 'contacts' ? (
                        <div className="grid gap-6">
                            <div className="flex items-center gap-2 mb-8">
                                <Users className="text-brand-neon" size={20} />
                                <h2 className={`text-xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Leads / Solicitudes Pendientes</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Leads de Contacto */}
                                {data.contacts.map((c, idx) => (
                                    <div key={`contact-${idx}`} className={`group border p-8 rounded-3xl transition-all relative overflow-hidden ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-md'}`}>
                                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-neon"></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`text-lg font-black mb-1 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{c.nombre_social}</h3>
                                                <p className={`text-xs flex items-center font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                                                    <Clock size={12} className="mr-1" /> {new Date(c.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <span className="bg-brand-neon/10 text-brand-neon text-[10px] font-black px-4 py-1.5 rounded-full border border-brand-neon/20 uppercase">Nuevo Lead</span>
                                        </div>
                                        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-xs">
                                            <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>CUIT: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{c.cuit}</span></p>
                                            <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>Email: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{c.email}</span></p>
                                            <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>WhatsApp: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{c.whatsapp}</span></p>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-white/5 flex gap-4">
                                            <button onClick={() => handleApprove(c, 'active')} className="bg-brand-neon text-brand-darker text-[10px] font-black px-6 py-2.5 rounded-xl uppercase">Aprobar Socio</button>
                                            <button onClick={() => handleApprove(c, 'free')} className="bg-blue-500 text-white text-[10px] font-black px-6 py-2.5 rounded-xl uppercase shadow-lg shadow-blue-500/20">Aprobar Gratuito</button>
                                            <button onClick={() => handleUserAction(c.cuit, 'delete_lead')} className="bg-red-500/10 text-red-500 text-[10px] font-black px-6 py-2.5 rounded-xl uppercase border border-red-500/20">Descartar</button>
                                        </div>
                                    </div>
                                ))}

                                {/* Leads de Réplica */}
                                {data.replicas.filter(r => r.estado !== 'aprobado').map((r, idx) => (
                                    <div key={`replica-${idx}`} className={`group border p-8 rounded-3xl transition-all relative overflow-hidden ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-md'}`}>
                                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-alert"></div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`text-lg font-black mb-1 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{r.nombre_sujeto}</h3>
                                                <p className={`text-xs flex items-center font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                                                    <Clock size={12} className="mr-1" /> {new Date(r.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <span className="bg-brand-alert/10 text-brand-alert text-[10px] font-black px-4 py-1.5 rounded-full border border-brand-alert/20 uppercase">Réplica Pendiente</span>
                                        </div>
                                        <p className="mt-4 text-xs italic text-brand-text truncate opacity-70">"{r.descargo}"</p>
                                        <div className="mt-6 pt-6 border-t border-white/5 flex gap-4">
                                            <button onClick={() => setActiveTab('replicas')} className="bg-brand-secondary text-white text-[10px] font-black px-6 py-2.5 rounded-xl uppercase">Ver Detalle</button>
                                        </div>
                                    </div>
                                ))}

                                {data.contacts.length === 0 && data.replicas.filter(r => r.estado !== 'aprobado').length === 0 && (
                                    <p className={`text-center py-20 italic ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>No hay nuevos leads o solicitudes.</p>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'replicas' ? (
                        <div className="grid gap-6">
                            {data.replicas.map((r, idx) => (
                                <div key={idx} className={`border p-8 rounded-3xl border-l-4 transition-all ${theme === 'dark'
                                    ? 'bg-brand-card border-brand-secondary border-l-brand-alert'
                                    : 'bg-white border-slate-100 border-l-red-500 shadow-lg'
                                    }`}>
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className={`text-xl font-black mb-1 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{r.nombre_sujeto}</h3>
                                            <p className={`text-xs font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>CUIT/DNI: {r.cuit_dni}</p>
                                        </div>
                                        <span className="bg-brand-alert/10 text-brand-alert text-[10px] font-black px-4 py-1.5 rounded-full border border-brand-alert/20 uppercase tracking-widest transition-all">Réplica</span>
                                    </div>
                                    <div className={`p-6 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-brand-dark/50 border-brand-secondary/50' : 'bg-red-50/30 border-red-100'
                                        }`}>
                                        <p className={`text-[10px] font-black uppercase mb-3 tracking-[0.2em] ${theme === 'dark' ? 'text-brand-muted' : 'text-red-400'}`}>Mensaje / Descargo</p>
                                        <p className={`text-sm italic leading-relaxed ${theme === 'dark' ? 'text-brand-text' : 'text-slate-700'}`}>"{r.descargo}"</p>
                                    </div>
                                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest">
                                            <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>Email: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{r.email}</span></p>
                                            <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>{new Date(r.created_at).toLocaleString()}</p>
                                            {r.estado === 'aprobado' && <span className="text-green-500 font-black">PROCESADA</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            {r.estado !== 'aprobado' && (
                                                <button onClick={() => handleUserAction(r.id, 'approve_replica')} className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all">Aprobar</button>
                                            )}
                                            <button onClick={() => handleUserAction(r.id, 'delete_replica')} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {data.replicas.length === 0 && <p className={`text-center py-20 italic ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>No hay réplicas pendientes.</p>}
                        </div>
                    ) : activeTab === 'reports' ? (
                        <div className="grid gap-6">
                            {data.reports.map((report, idx) => (
                                <div key={idx} className={`border p-8 rounded-3xl transition-all ${theme === 'dark'
                                    ? 'bg-brand-card border-brand-secondary'
                                    : 'bg-white border-slate-100 shadow-lg'
                                    }`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            {editingReport?.id === report.id ? (
                                                <input
                                                    type="text"
                                                    value={editingReport.nombre_denunciado}
                                                    onChange={e => setEditingReport({ ...editingReport, nombre_denunciado: e.target.value })}
                                                    className={`text-xl font-black mb-1 uppercase tracking-tight w-full p-2 rounded border focus:border-brand-neon outline-none ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200'}`}
                                                />
                                            ) : (
                                                <h3 className={`text-xl font-black mb-1 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{report.nombre_denunciado}</h3>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>CUIT: </p>
                                                {editingReport?.id === report.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingReport.cuit_denunciado}
                                                        onChange={e => setEditingReport({ ...editingReport, cuit_denunciado: e.target.value.replace(/\D/g, '') })}
                                                        className={`text-[10px] font-black uppercase tracking-[0.2em] p-1 rounded border focus:border-brand-neon outline-none ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200'}`}
                                                    />
                                                ) : (
                                                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>{report.cuit_denunciado}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border uppercase tracking-widest ${report.estado === 'validado' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse'
                                            }`}>
                                            {report.estado}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                                        <div>
                                            <p className={`text-[8px] font-black uppercase mb-1 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Monto Deuda</p>
                                            {editingReport?.id === report.id ? (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-brand-neon font-black">$</span>
                                                    <input
                                                        type="number"
                                                        value={editingReport.monto}
                                                        onChange={e => setEditingReport({ ...editingReport, monto: e.target.value })}
                                                        className={`text-2xl font-black text-brand-neon w-full p-2 rounded border focus:border-brand-neon outline-none ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200'}`}
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-2xl font-black text-brand-neon">$ {parseFloat(report.monto).toLocaleString('es-AR')}</p>
                                            )}
                                        </div>
                                        <div>
                                            <p className={`text-[8px] font-black uppercase mb-1 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Reportado por</p>
                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{report.reporter_name}</p>
                                        </div>
                                        <div>
                                            <p className={`text-[8px] font-black uppercase mb-1 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Fecha Carga</p>
                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{new Date(report.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className={`p-5 rounded-2xl border mb-8 ${theme === 'dark' ? 'bg-brand-dark/50 border-brand-secondary/50' : 'bg-slate-50 border-slate-200'}`}>
                                        <p className={`text-[8px] font-black uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Descripción Interna</p>
                                        {editingReport?.id === report.id ? (
                                            <textarea
                                                value={editingReport.descripcion}
                                                onChange={e => setEditingReport({ ...editingReport, descripcion: e.target.value })}
                                                className={`text-xs italic w-full p-3 rounded border focus:border-brand-neon outline-none h-24 resize-none ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200'}`}
                                            />
                                        ) : (
                                            <p className={`text-xs italic ${theme === 'dark' ? 'text-brand-text' : 'text-slate-600'}`}>{report.descripcion || 'Sin descripción'}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-4 items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex flex-wrap gap-4">
                                            {!editingReport && report.evidencia_url && report.evidencia_url.split(',').map((url, i) => (
                                                <a
                                                    key={i}
                                                    href={url.startsWith('http') ? url : `/${url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center space-x-2 bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                                                >
                                                    <Download size={14} />
                                                    <span>Prueba {i + 1}</span>
                                                </a>
                                            ))}
                                        </div>
                                        <div className="flex gap-3">
                                            {editingReport?.id === report.id ? (
                                                <>
                                                    <button
                                                        onClick={handleEditReport}
                                                        className="bg-brand-neon text-brand-darker hover:brightness-110 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-brand-neon/20"
                                                    >
                                                        Guardar Cambios
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingReport(null)}
                                                        className="bg-slate-500/10 text-slate-500 hover:bg-slate-500 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => setEditingReport({ ...report })}
                                                        className="bg-blue-500/10 text-blue-500 hover:bg-blue-600 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                                                    >
                                                        Editar Datos
                                                    </button>
                                                    {report.estado !== 'validado' && (
                                                        <button
                                                            onClick={() => handleUserAction(report.id, 'approve_report')}
                                                            className="bg-brand-neon text-brand-darker hover:brightness-110 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg shadow-brand-neon/20"
                                                        >
                                                            Aprobar Informe
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleUserAction(report.id, 'delete_report')}
                                                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {data.reports.length === 0 && <p className={`text-center py-20 italic ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>No se han cargado informes de morosos.</p>}
                        </div>
                    ) : activeTab === 'socios' ? (
                        <SocioList
                            data={data}
                            filterFn={s => s.plan !== 'free' && s.is_vip != 1 && s.estado !== 'bloqueado'}
                            theme={theme}
                            searchSocio={searchSocio}
                            setSearchSocio={setSearchSocio}
                            handleUserAction={handleUserAction}
                            handlePlanChange={handlePlanChange}
                            showCreate={true}
                            fetchData={fetchData}
                        />
                    ) : activeTab === 'gratuitos' ? (
                        <SocioList
                            data={data}
                            filterFn={s => s.plan === 'free' && s.estado !== 'bloqueado'}
                            theme={theme}
                            searchSocio={searchSocio}
                            setSearchSocio={setSearchSocio}
                            handleUserAction={handleUserAction}
                            handlePlanChange={handlePlanChange}
                            fetchData={fetchData}
                        />
                    ) : activeTab === 'vip' ? (
                        <SocioList
                            data={data}
                            filterFn={s => s.is_vip == 1}
                            theme={theme}
                            searchSocio={searchSocio}
                            setSearchSocio={setSearchSocio}
                            handleUserAction={handleUserAction}
                            handlePlanChange={handlePlanChange}
                            fetchData={fetchData}
                        />
                    ) : activeTab === 'blocked' ? (
                        <SocioList
                            data={data}
                            filterFn={s => s.estado === 'bloqueado'}
                            theme={theme}
                            searchSocio={searchSocio}
                            setSearchSocio={setSearchSocio}
                            handleUserAction={handleUserAction}
                            handlePlanChange={handlePlanChange}
                            fetchData={fetchData}
                        />
                    ) : activeTab === 'logs' ? (
                        <LogsView theme={theme} />
                    ) : activeTab === 'config' ? (
                        <div className="space-y-12 pb-20">
                            <ManualReportForm theme={theme} onComplete={fetchData} />

                            <div className={`p-8 rounded-3xl border mb-12 transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary shadow-lg shadow-brand-neon/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-brand-neon p-2 rounded-lg"><Monitor className="text-brand-darker" size={20} /></div>
                                    <h3 className={`text-xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Apariencia <span className="text-brand-neon">Visual</span></h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                    <div>
                                        <p className={`text-sm font-bold leading-relaxed mb-6 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                                            Elige cómo quieres ver el panel de administración. El modo autómata sincronizará el Brillo con la configuración de tu sistema operativo.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { id: 'light', name: 'Claro', icon: Sun, color: 'text-blue-600', bg: 'bg-blue-600/10' },
                                                { id: 'dark', name: 'Oscuro', icon: Moon, color: 'text-brand-neon', bg: 'bg-brand-neon/10' },
                                                { id: 'system', name: 'Autómata', icon: Monitor, color: 'text-purple-500', bg: 'bg-purple-500/10' }
                                            ].map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setTheme(t.id)}
                                                    className={`px-6 py-4 rounded-2xl flex items-center gap-3 transition-all border-2 ${theme === t.id
                                                        ? (t.id === 'dark' ? 'border-brand-neon bg-brand-neon/5' : t.id === 'light' ? 'border-blue-600 bg-blue-50' : 'border-purple-500 bg-purple-50')
                                                        : (theme === 'dark' ? 'border-brand-secondary bg-brand-dark hover:border-white/20' : 'border-slate-100 bg-slate-50 hover:border-slate-300')
                                                        }`}
                                                >
                                                    <t.icon className={t.color} size={20} />
                                                    <span className={`text-xs font-black uppercase tracking-widest ${theme === t.id ? (theme === 'dark' ? 'text-white' : 'text-slate-900') : 'text-brand-muted'}`}>{t.name}</span>
                                                    {theme === t.id && <CheckCircle2 className="text-green-500" size={16} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center ${theme === 'dark' ? 'border-brand-secondary/30 bg-brand-neon/5' : 'border-slate-200 bg-blue-50/30'}`}>
                                        <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${theme === 'dark' ? 'bg-brand-neon text-brand-darker' : 'bg-blue-600 text-white'}`}>
                                            <ShieldCheck size={24} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Vista Previa del Tema</p>
                                        <p className="text-[9px] font-bold mt-1 max-w-[150px]">Los cambios se guardan localmente en tu dispositivo.</p>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-8 rounded-3xl border ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200'}`}>
                                <h3 className="text-xl font-black uppercase mb-6 tracking-tighter">Ajustes <span className="text-brand-neon">Globales</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-2 text-brand-muted tracking-widest">Fecha Actualización Pie de Página</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={data.settings?.footer_update_date || ''}
                                                onChange={(e) => setData({ ...data, settings: { ...data.settings, footer_update_date: e.target.value } })}
                                                className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none focus:border-brand-neon ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-100'}`}
                                            />
                                            <button
                                                onClick={() => handleUserAction('system', 'system_config', { key: 'footer_update_date', value: data.settings.footer_update_date })}
                                                className="bg-brand-neon text-brand-darker font-black px-6 py-2 rounded-xl uppercase text-[10px]"
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase mb-2 text-brand-muted tracking-widest">Gestión del Sitio</label>
                                        <p className="text-[10px] text-brand-muted italic mt-4">Los módulos de gestión de asociados y ranking de deudores se encuentran habilitados a continuación.</p>
                                    </div>
                                </div>
                            </div>

                            <LogosManager theme={theme} />

                            <div className="space-y-6">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Ranking de <span className="text-brand-alert">Deudores</span></h3>
                                <RankingManager theme={theme} />
                            </div>
                        </div>
                    ) : activeTab === 'stats' ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className={`p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                <p className={`text-xs font-black uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Socios Activos (Pagos)</p>
                                <p className={`text-5xl font-black ${theme === 'dark' ? 'text-brand-neon' : 'text-blue-600'}`}>{data.stats?.active_count || 0}</p>
                            </div>
                            <div className={`p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                <p className={`text-xs font-black uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Cuentas Gratuitas</p>
                                <p className={`text-5xl font-black ${theme === 'dark' ? 'text-brand-alert' : 'text-red-500'}`}>{data.stats?.free_count || 0}</p>
                            </div>
                            <div className={`p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                <p className={`text-xs font-black uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Socios VIP</p>
                                <p className={`text-5xl font-black ${theme === 'dark' ? 'text-brand-neon' : 'text-green-500'}`}>{data.stats?.vip_count || 0}</p>
                            </div>
                            <div className={`p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                <p className={`text-xs font-black uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Réplicas Totales</p>
                                <p className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{data.stats?.replica_count || 0}</p>
                            </div>

                            <div className={`md:col-span-3 p-10 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-xl'}`}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-brand-neon p-2 rounded-lg"><TrendingUp className="text-brand-darker" size={20} /></div>
                                    <h3 className={`text-xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Distribución por Gremio</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    {/* Visual distribution list */}
                                    <div className="space-y-6">
                                        {(data.stats?.gremio_distribution || []).sort((a, b) => b.count - a.count).map((g, i) => {
                                            const total = (data.stats?.gremio_distribution || []).reduce((acc, curr) => acc + parseInt(curr.count), 0);
                                            const percent = Math.round((parseInt(g.count) / total) * 100);
                                            return (
                                                <div key={i} className="group">
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{g.gremio}</span>
                                                        <span className="text-brand-neon font-black text-xs">{percent}% ({g.count})</span>
                                                    </div>
                                                    <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                                                        <div
                                                            className="h-full bg-brand-neon transition-all duration-1000 group-hover:brightness-125"
                                                            style={{ width: `${percent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {(data.stats?.gremio_distribution || []).length === 0 && <p className="italic text-slate-400 text-sm font-medium">No hay datos de gremios disponibles aún.</p>}
                                    </div>
                                    {/* Simple CSS Pie Chart Mockup */}
                                    <div className="hidden lg:flex justify-center">
                                        <div className="relative w-64 h-64 rounded-full border-8 border-brand-neon/20 flex items-center justify-center animate-in zoom-in duration-700">
                                            <div className="absolute inset-0 rounded-full border-t-8 border-brand-neon animate-[spin_3s_linear_infinite]"></div>
                                            <div className="text-center">
                                                <p className="text-4xl font-black text-white">{data.stats?.total_socios || 0}</p>
                                                <p className="text-[10px] font-black uppercase text-brand-neon">Socios Totales</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`md:col-span-3 p-10 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-xl'}`}>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-blue-600 p-2 rounded-lg"><Globe className="text-white" size={20} /></div>
                                    <h3 className={`text-xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Distribución por Provincia</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-6">
                                        {(data.stats?.province_distribution || []).sort((a, b) => b.count - a.count).map((p, i) => {
                                            const total = (data.stats?.province_distribution || []).reduce((acc, curr) => acc + parseInt(curr.count), 0);
                                            const percent = Math.round((parseInt(p.count) / total) * 100);
                                            return (
                                                <div key={i} className="group">
                                                    <div className="flex justify-between items-end mb-2">
                                                        <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{p.provincia}</span>
                                                        <span className="text-blue-500 font-black text-xs">{percent}% ({p.count})</span>
                                                    </div>
                                                    <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                                                        <div
                                                            className="h-full bg-blue-500 transition-all duration-1000 group-hover:brightness-125"
                                                            style={{ width: `${percent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {(data.stats?.province_distribution || []).length === 0 && <p className="italic text-slate-400 text-sm font-medium">No hay datos geográficos disponibles aún.</p>}
                                    </div>
                                    <div className="hidden lg:flex justify-center">
                                        <div className="relative w-64 h-64 rounded-full border-8 border-blue-500/20 flex items-center justify-center">
                                            <div className="text-center">
                                                <p className="text-4xl font-black text-white">{data.reports?.length || 0}</p>
                                                <p className="text-[10px] font-black uppercase text-blue-500">Informes Totales</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`md:col-span-3 p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-xl'}`}>
                                <h3 className={`text-xl font-black uppercase mb-8 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Calendario de Vencimientos</h3>
                                <div className="space-y-4">
                                    {data.socios
                                        .filter(s => s.expiry_date) // Only show socios with an expiry date
                                        .sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date))
                                        .slice(0, 10)
                                        .map((s, idx) => (
                                            <div key={idx} className={`flex justify-between items-center p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                                <div>
                                                    <p className={`font-black uppercase text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{s.razon_social}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">CUIT: {s.cuit}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-xs font-black uppercase ${new Date(s.expiry_date) < new Date() ? 'text-brand-alert' : 'text-brand-neon'}`}>
                                                        {new Date(s.expiry_date) < new Date() ? 'Vencido' : 'Próximo'}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400">{s.expiry_date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    {data.socios.filter(s => s.expiry_date).length === 0 && <p className="italic text-slate-400">No hay datos de vencimientos.</p>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-20">
                            <p className="text-brand-muted italic uppercase tracking-widest text-xs">Seleccione una opción del menú</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
