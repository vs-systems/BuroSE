import React, { useState, useEffect } from 'react';
import { LogIn, Users, MessageSquare, LogOut, RefreshCcw, Search, Clock, Plus, Trash2, Globe, Image as ImageIcon, Sun, Moon, ShieldCheck } from 'lucide-react';

const LogosManager = ({ theme }) => {
    const [logos, setLogos] = useState([]);
    const [newLogo, setNewLogo] = useState({ name: '', logo_url: '', website_url: '' });

    useEffect(() => { fetchLogos(); }, []);

    const fetchLogos = async () => {
        try {
            const res = await fetch('/api/admin_logos.php');
            if (!res.ok) {
                const text = await res.text();
                console.error("Server Error:", text);
                return;
            }
            const data = await res.json();
            if (data.status === 'success') setLogos(data.data);
        } catch (e) {
            console.error("Error fetching logos:", e);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin_logos.php', {
                method: 'POST',
                body: JSON.stringify(newLogo),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                const msg = errorData?.message || "Error desconocido en el servidor";
                const hint = errorData?.hint || "";
                alert(`Error al agregar logo: ${msg}\n${hint}`);
                return;
            }

            setNewLogo({ name: '', logo_url: '', website_url: '' });
            fetchLogos();
        } catch (e) {
            console.error("Add Logo Error:", e);
            alert("Error de conexión al agregar logo");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este logo?')) return;
        await fetch(`/api/admin_logos.php?id=${id}`, { method: 'DELETE' });
        fetchLogos();
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleAdd} className={`border p-6 rounded-2xl grid md:grid-cols-4 gap-4 items-end transition-colors ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Nombre Empresa</label>
                    <input type="text" value={newLogo.name} onChange={e => setNewLogo({ ...newLogo, name: e.target.value })} className={`w-full border rounded-lg px-4 py-2 outline-none focus:border-brand-neon transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`} placeholder="Ej: Seguridad X" required />
                </div>
                <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>URL del Logo</label>
                    <input type="text" value={newLogo.logo_url} onChange={e => setNewLogo({ ...newLogo, logo_url: e.target.value })} className={`w-full border rounded-lg px-4 py-2 outline-none focus:border-brand-neon transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`} placeholder="https://..." required />
                </div>
                <div>
                    <label className={`block text-xs font-bold uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>URL Sitio Web</label>
                    <input type="text" value={newLogo.website_url} onChange={e => setNewLogo({ ...newLogo, website_url: e.target.value })} className={`w-full border rounded-lg px-4 py-2 outline-none focus:border-brand-neon transition-all ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`} placeholder="https://..." />
                </div>
                <button type="submit" className="bg-brand-neon text-brand-darker font-black py-2 rounded-lg flex items-center justify-center hover:scale-[1.02] transition-transform shadow-lg shadow-brand-neon/20 uppercase text-xs">
                    <Plus size={18} className="mr-2" /> Agregar Logo
                </button>
            </form>

            <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6 rounded-2xl ${theme === 'dark' ? 'bg-white' : 'bg-white border border-slate-100'}`}>
                {logos.map(logo => (
                    <div key={logo.id} className="border p-4 rounded-xl relative group overflow-hidden transition-all bg-white border-slate-100 shadow-sm">
                        <img src={logo.logo_url} alt={logo.name} className="h-12 w-full object-contain mb-4" />
                        <h4 className="text-sm font-bold text-center truncate text-slate-900">{logo.name}</h4>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all rounded-xl flex items-center justify-center space-x-4 bg-white/95">
                            <a href={logo.website_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full transition-all bg-slate-100 text-slate-600 hover:bg-brand-neon hover:text-brand-darker"><Globe size={18} /></a>
                            <button onClick={() => handleDelete(logo.id)} className="p-2 rounded-full transition-all bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
                {logos.length === 0 && <p className="col-span-full text-center py-10 italic text-slate-400">No hay logos cargados.</p>}
            </div>
        </div>
    );
};

const AdminPanel = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [data, setData] = useState({ contacts: [], replicas: [], socios: [] });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('contacts');
    const [socioFilter, setSocioFilter] = useState('all'); // 'all', 'validado', 'bloqueado'
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const resp = await fetch('/api/check_session.php', { credentials: 'include' });
            const res = await resp.json();
            if (res.authenticated && res.role === 'admin') {
                setIsLogged(true);
                fetchData();
            }
        } catch (e) { console.error(e); }
    };

    const handleUserAction = async (cuit, action) => {
        const confirmMsg = action === 'delete' ? '¿Eliminar definitivamente?' : '¿Cambiar estado de bloqueo?';
        if (!confirm(confirmMsg)) return;

        try {
            const resp = await fetch('/api/admin_user_action.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cuit, action }),
                credentials: 'include'
            });
            const res = await resp.json();
            if (res.status === 'success') {
                alert(res.message);
                fetchData();
            } else {
                alert('Error: ' + res.message);
            }
        } catch (e) { alert('Error de conexión'); }
    };

    const handleApiAction = async (cuit, action) => {
        try {
            const resp = await fetch('/api/admin_api_action.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cuit, action }),
                credentials: 'include'
            });
            const res = await resp.json();
            alert(res.message);
            fetchData();
        } catch (e) { alert('Error de conexión'); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await fetch('/api/admin_login.php', {
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

    const fetchData = async () => {
        setLoading(true);
        try {
            const resp = await fetch('/api/admin_data.php', { credentials: 'include' });
            const res = await resp.json();
            if (res.status === 'success') {
                // Aseguramos que socios esté definido
                setData({
                    contacts: res.data.contacts || [],
                    replicas: res.data.replicas || [],
                    socios: res.data.socios || []
                });
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleLogout = async () => {
        await fetch('/api/logout.php');
        setIsLogged(false);
        setData({ contacts: [], replicas: [], socios: [] });
    };

    const handleApprove = async (contact) => {
        const pass = prompt(`Asignar contraseña para ${contact.nombre_social} (CUIT: ${contact.cuit}):`, contact.cuit);
        if (pass === null) return;

        try {
            const resp = await fetch('/api/admin_approve.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cuit: contact.cuit,
                    password: pass,
                    name: contact.nombre_social,
                    email: contact.email,
                    whatsapp: contact.whatsapp,
                    rubro: contact.rubro,
                    localidad: contact.localidad
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
            {/* Sidebar */}
            <div className={`w-64 border-r flex flex-col sticky top-0 h-screen transition-colors ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-xl'
                }`}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-brand-secondary' : 'border-slate-100'}`}>
                    <h1 className={`text-xl font-black tracking-widest uppercase italic bg-gradient-to-r from-brand-neon to-blue-500 bg-clip-text text-transparent`}>BuroSE</h1>
                    <p className={`text-[10px] font-bold tracking-widest uppercase mt-1 ${theme === 'dark' ? 'text-brand-neon' : 'text-blue-600'}`}>Control Hub</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contacts'
                            ? 'bg-brand-neon text-brand-darker font-black shadow-lg shadow-brand-neon/20'
                            : (theme === 'dark' ? 'text-brand-muted hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
                            }`}
                    >
                        <Users size={18} />
                        <span>Leads/Accesos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('replicas')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'replicas'
                            ? 'bg-brand-neon text-brand-darker font-black shadow-lg shadow-brand-neon/20'
                            : (theme === 'dark' ? 'text-brand-muted hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
                            }`}
                    >
                        <MessageSquare size={18} />
                        <span>Réplicas</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('logos')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'logos'
                            ? 'bg-brand-neon text-brand-darker font-black shadow-lg shadow-brand-neon/20'
                            : (theme === 'dark' ? 'text-brand-muted hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
                            }`}
                    >
                        <ImageIcon size={18} />
                        <span>Logos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('socios')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'socios'
                            ? 'bg-brand-neon text-brand-darker font-black shadow-lg shadow-brand-neon/20'
                            : (theme === 'dark' ? 'text-brand-muted hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
                            }`}
                    >
                        <Users size={18} />
                        <span>Socios Activos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('vip')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'vip'
                            ? 'bg-brand-neon text-brand-darker font-black shadow-lg shadow-brand-neon/20'
                            : (theme === 'dark' ? 'text-brand-muted hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
                            }`}
                    >
                        <ShieldCheck size={18} />
                        <span>Socios VIP</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'stats'
                            ? 'bg-brand-neon text-brand-darker font-black shadow-lg shadow-brand-neon/20'
                            : (theme === 'dark' ? 'text-brand-muted hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50')
                            }`}
                    >
                        <RefreshCcw size={18} />
                        <span>Estadísticas</span>
                    </button>
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
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest ${theme === 'dark' ? 'text-brand-alert hover:bg-brand-alert/10' : 'text-red-600 hover:bg-red-50 border border-red-100'
                            }`}
                    >
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className={`border-b p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-10 w-full transition-colors ${theme === 'dark' ? 'bg-brand-dark/80 border-brand-secondary' : 'bg-white/80 border-slate-100 shadow-sm'
                    }`}>
                    <h2 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {activeTab === 'contacts' ? 'Leads / Solicitudes' : activeTab === 'replicas' ? 'Solicitudes de Réplica' : activeTab === 'socios' ? 'Gestión de Socios' : activeTab === 'vip' ? 'Socios VIP (Perpetuos)' : activeTab === 'stats' ? 'Panel de Control' : 'Gestión de Logos'}
                    </h2>
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
                            {data.contacts.map((c, idx) => (
                                <div key={idx} className={`border p-6 rounded-3xl transition-all group ${theme === 'dark'
                                    ? 'bg-brand-card border-brand-secondary hover:border-brand-neon/30'
                                    : 'bg-white border-slate-100 shadow-md hover:shadow-xl'
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className={`text-lg font-black mb-1 uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{c.nombre_social}</h3>
                                            <p className={`text-xs flex items-center font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                                                <Clock size={12} className="mr-1" /> {new Date(c.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className="bg-brand-neon/10 text-brand-neon text-[10px] font-black px-4 py-1.5 rounded-full border border-brand-neon/20 uppercase tracking-tighter">Nuevo Lead</span>
                                    </div>
                                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                        <div>
                                            <p className={`text-xs font-black uppercase mb-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>CUIT</p>
                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{c.cuit}</p>
                                        </div>
                                        <div>
                                            <p className={`text-xs font-black uppercase mb-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>WhatsApp</p>
                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{c.whatsapp}</p>
                                        </div>
                                        <div>
                                            <p className={`text-xs font-black uppercase mb-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Email</p>
                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{c.email}</p>
                                        </div>
                                        <div>
                                            <p className={`text-xs font-black uppercase mb-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Localidad</p>
                                            <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{c.localidad}</p>
                                        </div>
                                    </div>
                                    <div className={`mt-6 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${theme === 'dark' ? 'border-brand-secondary/50' : 'border-slate-100'
                                        }`}>
                                        <div className="flex items-center space-x-6">
                                            <p className={`text-[10px] uppercase font-black tracking-widest ${theme === 'dark' ? 'text-brand-text/40' : 'text-slate-400'}`}>{c.rubro}</p>
                                            <button
                                                onClick={() => handleApprove(c)}
                                                className="bg-brand-neon hover:brightness-110 text-brand-darker text-[10px] font-black px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-neon/20 uppercase active:scale-95"
                                            >
                                                Aprobar como Socio
                                            </button>
                                            <button
                                                onClick={() => handleUserAction(c.cuit, 'delete_lead')}
                                                className={`text-[10px] font-black px-4 py-2.5 rounded-xl transition-all uppercase border ${theme === 'dark' ? 'border-brand-alert/30 text-brand-alert hover:bg-brand-alert hover:text-white' : 'border-red-100 text-red-500 hover:bg-red-500 hover:text-white'}`}
                                            >
                                                Borrar Lead
                                            </button>
                                        </div>
                                        <p className="text-[10px] font-bold text-brand-neon opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Preferencia: {c.preferencia_contacto}</p>
                                    </div>
                                </div>
                            ))}
                            {data.contacts.length === 0 && <p className={`text-center py-20 italic ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>No hay registros de contacto todavía.</p>}
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
                                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                                        <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>Email: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{r.email}</span></p>
                                        <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>{new Date(r.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            {data.replicas.length === 0 && <p className={`text-center py-20 italic ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>No hay solicitudes de réplica de momento.</p>}
                        </div>
                    ) : activeTab === 'socios' ? (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                                <div className="flex gap-4">
                                    {['all', 'validado', 'bloqueado'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setSocioFilter(f)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${socioFilter === f
                                                ? 'bg-brand-neon text-brand-darker shadow-lg'
                                                : (theme === 'dark' ? 'bg-brand-secondary text-brand-muted hover:bg-brand-secondary/80' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')
                                                }`}
                                        >
                                            {f === 'all' ? 'Todos' : f === 'validado' ? 'Activos' : 'Bloqueados'}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        const razon = prompt("Razón Social:");
                                        const cuit = prompt("CUIT (sin guiones):");
                                        const email = prompt("Email:");
                                        const pass = prompt("Contraseña (o dejar vacío para default):", cuit);
                                        const days = prompt("Días de membresía (ej: 365 para un año):", "365");

                                        if (razon && cuit && email) {
                                            fetch('/api/admin_create_socio.php', {
                                                method: 'POST',
                                                body: JSON.stringify({ razon_social: razon, cuit, email, pass, expiry_days: days }),
                                                headers: { 'Content-Type': 'application/json' },
                                                credentials: 'include'
                                            }).then(r => r.json()).then(data => {
                                                alert(data.message);
                                                fetchData();
                                            });
                                        }
                                    }}
                                    className="bg-brand-neon text-brand-darker font-black px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <Plus size={16} /> Crear Socio Manual
                                </button>
                            </div>
                            <div className="grid gap-6">
                                {data.socios
                                    .filter(s => s.is_vip != 1 && (socioFilter === 'all' || s.estado === socioFilter))
                                    .map((s, idx) => (
                                        <div key={idx} className={`border p-6 rounded-3xl transition-all ${theme === 'dark'
                                            ? 'bg-brand-card border-brand-secondary'
                                            : 'bg-white border-slate-100 shadow-md'
                                            } ${s.estado === 'bloqueado' ? 'opacity-60 border-brand-alert' : ''}`}>
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.razon_social}</h3>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApiAction(s.cuit, 'generate')}
                                                        className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                                                    >
                                                        {s.api_token ? 'Refresh API' : 'Activar API'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUserAction(s.cuit, 'block')}
                                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${s.estado === 'bloqueado'
                                                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white'
                                                            : 'bg-brand-alert/10 text-brand-alert hover:bg-brand-alert hover:text-white'}`}
                                                    >
                                                        {s.estado === 'bloqueado' ? 'Desbloquear' : 'Bloquear'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleUserAction(s.cuit, 'delete')}
                                                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
                                                <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>CUIT: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{s.cuit}</span></p>
                                                <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>Email: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{s.email}</span></p>
                                                <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>Estado: <span className={s.estado === 'bloqueado' ? 'text-brand-alert' : 'text-green-500'}>{s.estado.toUpperCase()}</span></p>
                                                <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>Vence: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{s.expiry_date || 'N/A'}</span></p>
                                            </div>
                                            {s.api_token && (
                                                <div className="mt-4 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex justify-between items-center">
                                                    <code className="text-[10px] text-blue-500 font-mono">TOKEN API: {s.api_token}</code>
                                                    <button onClick={() => navigator.clipboard.writeText(s.api_token)} className="text-[10px] font-black uppercase text-blue-500">Copiar</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                {data.socios.filter(s => s.is_vip != 1).length === 0 && <p className={`text-center py-20 italic ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>No hay socios registrados.</p>}
                            </div>
                        </div>
                    ) : activeTab === 'vip' ? (
                        <div className="space-y-6">
                            <div className="flex justify-end mb-8">
                                <button
                                    onClick={() => {
                                        const razon = prompt("Razón Social VIP:");
                                        const cuit = prompt("CUIT (sin guiones):");
                                        const email = prompt("Email:");
                                        const pass = prompt("Contraseña (o dejar vacío para default):", cuit);

                                        if (razon && cuit && email) {
                                            fetch('/api/admin_create_socio.php', {
                                                method: 'POST',
                                                body: JSON.stringify({ razon_social: razon, cuit, email, pass, is_vip: 1 }),
                                                headers: { 'Content-Type': 'application/json' },
                                                credentials: 'include'
                                            }).then(r => r.json()).then(data => {
                                                alert(data.message);
                                                fetchData();
                                            });
                                        }
                                    }}
                                    className="bg-brand-neon text-brand-darker font-black px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
                                >
                                    <Plus size={16} /> Alta Socio VIP
                                </button>
                            </div>
                            <div className="grid gap-6">
                                {data.socios
                                    .filter(s => s.is_vip == 1)
                                    .map((s, idx) => (
                                        <div key={idx} className={`border p-6 rounded-3xl transition-all border-l-4 border-l-brand-neon ${theme === 'dark'
                                            ? 'bg-brand-card border-brand-secondary shadow-lg shadow-brand-neon/5'
                                            : 'bg-white border-slate-100 shadow-md'
                                            }`}>
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h3 className={`text-lg font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.razon_social}</h3>
                                                    <span className="text-[8px] font-black uppercase bg-brand-neon/20 text-brand-neon px-2 py-0.5 rounded tracking-widest">Socio Estratégico / VIP</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUserAction(s.cuit, 'delete')} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Eliminar</button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
                                                <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>CUIT: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{s.cuit}</span></p>
                                                <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>Email: <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{s.email}</span></p>
                                                <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>Estado: <span className="text-brand-neon">PERPETUO</span></p>
                                                <p className={theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}>Vence: <span className="text-slate-400 italic">Nunca</span></p>
                                            </div>
                                        </div>
                                    ))}
                                {data.socios.filter(s => s.is_vip == 1).length === 0 && <p className={`text-center py-20 italic ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>No hay socios VIP registrados.</p>}
                            </div>
                        </div>
                    ) : activeTab === 'stats' ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className={`p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                <p className={`text-xs font-black uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Total Socios</p>
                                <p className={`text-5xl font-black ${theme === 'dark' ? 'text-brand-neon' : 'text-blue-600'}`}>{data.socios.length}</p>
                            </div>
                            <div className={`p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                <p className={`text-xs font-black uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Leads Pendientes</p>
                                <p className={`text-5xl font-black ${theme === 'dark' ? 'text-brand-alert' : 'text-red-500'}`}>{data.contacts.length}</p>
                            </div>
                            <div className={`p-8 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                <p className={`text-xs font-black uppercase mb-2 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Socios Bloqueados</p>
                                <p className={`text-5xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{data.socios.filter(s => s.estado === 'bloqueado').length}</p>
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
                        <LogosManager theme={theme} />
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
