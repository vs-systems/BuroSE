import React, { useState, useEffect } from 'react';
import { LogIn, Users, MessageSquare, LogOut, RefreshCcw, Search, Clock } from 'lucide-react';

const AdminPanel = () => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [data, setData] = useState({ contacts: [], replicas: [] });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('contacts');

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const resp = await fetch('/api/admin_login.php');
            const res = await resp.json();
            if (res.logged) {
                setIsLogged(true);
                fetchData();
            }
        } catch (e) { console.error(e); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const resp = await fetch('/api/admin_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, pass })
            });
            if (resp.ok) {
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
            const resp = await fetch('/api/admin_data.php');
            const res = await resp.json();
            if (res.status === 'success') {
                setData(res.data);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleLogout = async () => {
        await fetch('/api/logout.php');
        setIsLogged(false);
        setData({ contacts: [], replicas: [] });
    };

    if (!isLogged) {
        return (
            <div className="min-h-screen bg-brand-darker flex items-center justify-center p-6">
                <div className="bg-brand-card border border-brand-secondary p-8 rounded-3xl w-full max-w-md shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="bg-brand-neon/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-neon/20">
                            <LogIn className="text-brand-neon" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">BuroSE Admin</h2>
                        <p className="text-brand-muted text-sm">Ingrese sus credenciales para continuar</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Usuario</label>
                            <input
                                type="text" value={user} onChange={e => setUser(e.target.value)}
                                className="w-full bg-brand-dark border border-brand-secondary rounded-xl px-4 py-3 text-white focus:border-brand-neon focus:outline-none transition-all"
                                placeholder="Usuario" required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Contraseña</label>
                            <input
                                type="password" value={pass} onChange={e => setPass(e.target.value)}
                                className="w-full bg-brand-dark border border-brand-secondary rounded-xl px-4 py-3 text-white focus:border-brand-neon focus:outline-none transition-all"
                                placeholder="••••••••" required
                            />
                        </div>
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-brand-neon text-brand-darker font-black py-4 rounded-xl hover:scale-[1.02] transition-transform flex items-center justify-center"
                        >
                            {loading ? 'Ingresando...' : 'Acceder al Panel'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-darker text-brand-text flex">
            {/* Sidebar */}
            <div className="w-64 bg-brand-card border-r border-brand-secondary flex flex-col">
                <div className="p-6 border-b border-brand-secondary">
                    <h1 className="text-xl font-black text-white tracking-widest uppercase italic">BuroSE</h1>
                    <p className="text-[10px] text-brand-neon font-bold tracking-tighter uppercase mt-1">Control Hub</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => setActiveTab('contacts')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'contacts' ? 'bg-brand-neon text-brand-darker font-bold' : 'text-brand-muted hover:bg-white/5'}`}
                    >
                        <Users size={18} />
                        <span>Denunciantes / Acceso</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('replicas')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'replicas' ? 'bg-brand-neon text-brand-darker font-bold' : 'text-brand-muted hover:bg-white/5'}`}
                    >
                        <MessageSquare size={18} />
                        <span>Derecho a Réplica</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-brand-secondary">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-brand-alert hover:bg-brand-alert/10 rounded-xl transition-all font-bold"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <header className="bg-brand-card/50 border-b border-brand-secondary p-6 flex justify-between items-center backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">
                        {activeTab === 'contacts' ? 'Empresas Interesadas / Denunciantes' : 'Solicitudes de Réplica'}
                    </h2>
                    <button
                        onClick={fetchData} disabled={loading}
                        className="p-2 text-brand-neon hover:bg-brand-neon/10 rounded-full transition-all"
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </header>

                <main className="p-8">
                    {activeTab === 'contacts' ? (
                        <div className="grid gap-4">
                            {data.contacts.map((c, idx) => (
                                <div key={idx} className="bg-brand-card border border-brand-secondary p-6 rounded-2xl hover:border-brand-neon/30 transition-all group">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{c.nombre_social}</h3>
                                            <p className="text-sm text-brand-muted flex items-center">
                                                <Clock size={12} className="mr-1" /> {new Date(c.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className="bg-brand-neon/10 text-brand-neon text-[10px] font-bold px-3 py-1 rounded-full border border-brand-neon/20 uppercase tracking-tighter">Nuevo Lead</span>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                                        <div>
                                            <p className="text-xs font-bold text-brand-muted uppercase mb-1">CUIT</p>
                                            <p className="text-white font-medium">{c.cuit}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-brand-muted uppercase mb-1">WhatsApp / Cel</p>
                                            <p className="text-white font-medium">{c.whatsapp}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-brand-muted uppercase mb-1">Email</p>
                                            <p className="text-white font-medium">{c.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-brand-muted uppercase mb-1">Localidad</p>
                                            <p className="text-white font-medium">{c.localidad}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-brand-secondary/50 flex justify-between items-center">
                                        <p className="text-xs text-brand-text/50 uppercase font-black tracking-widest">{c.rubro}</p>
                                        <p className="text-xs text-brand-neon opacity-0 group-hover:opacity-100 transition-opacity">Preferencia: {c.preferencia_contacto}</p>
                                    </div>
                                </div>
                            ))}
                            {data.contacts.length === 0 && <p className="text-center py-20 text-brand-muted italic">No hay registros de contacto todavía.</p>}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {data.replicas.map((r, idx) => (
                                <div key={idx} className="bg-brand-card border border-brand-secondary p-6 rounded-2xl border-l-4 border-l-brand-alert">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{r.nombre_sujeto}</h3>
                                            <p className="text-sm text-brand-muted">CUIT/DNI: {r.cuit_dni}</p>
                                        </div>
                                        <span className="bg-brand-alert/10 text-brand-alert text-[10px] font-bold px-3 py-1 rounded-full border border-brand-alert/20 uppercase">Urgente</span>
                                    </div>
                                    <div className="bg-brand-dark/50 p-4 rounded-xl border border-brand-secondary/50">
                                        <p className="text-xs font-bold text-brand-muted uppercase mb-2">Mensaje / Descargo</p>
                                        <p className="text-sm text-brand-text italic leading-relaxed">"{r.descargo}"</p>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center text-xs">
                                        <p className="text-brand-muted">Email: <span className="text-white">{r.email}</span></p>
                                        <p className="text-brand-muted">{new Date(r.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            {data.replicas.length === 0 && <p className="text-center py-20 text-brand-muted italic">No hay solicitudes de réplica de momento.</p>}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
