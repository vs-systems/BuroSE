import React, { useState, useEffect } from 'react';
import { LogIn, Users, MessageSquare, LogOut, RefreshCcw, Search, Clock, Plus, Trash2, Globe, Image as ImageIcon } from 'lucide-react';

const LogosManager = () => {
    const [logos, setLogos] = useState([]);
    const [newLogo, setNewLogo] = useState({ name: '', logo_url: '', website_url: '' });

    useEffect(() => { fetchLogos(); }, []);

    const fetchLogos = async () => {
        const res = await fetch('/api/admin_logos.php');
        const data = await res.json();
        if (data.status === 'success') setLogos(data.data);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/admin_logos.php', {
            method: 'POST',
            body: JSON.stringify(newLogo),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.ok) {
            setNewLogo({ name: '', logo_url: '', website_url: '' });
            fetchLogos();
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este logo?')) return;
        await fetch(`/api/admin_logos.php?id=${id}`, { method: 'DELETE' });
        fetchLogos();
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleAdd} className="bg-brand-card border border-brand-secondary p-6 rounded-2xl grid md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Nombre Empresa</label>
                    <input type="text" value={newLogo.name} onChange={e => setNewLogo({ ...newLogo, name: e.target.value })} className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 text-white" placeholder="Ej: Seguridad X" required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-2">URL del Logo</label>
                    <input type="text" value={newLogo.logo_url} onChange={e => setNewLogo({ ...newLogo, logo_url: e.target.value })} className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 text-white" placeholder="https://..." required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-brand-muted uppercase mb-2">URL Sitio Web</label>
                    <input type="text" value={newLogo.website_url} onChange={e => setNewLogo({ ...newLogo, website_url: e.target.value })} className="w-full bg-brand-dark border border-brand-secondary rounded-lg px-4 py-2 text-white" placeholder="https://..." />
                </div>
                <button type="submit" className="bg-brand-neon text-brand-darker font-bold py-2 rounded-lg flex items-center justify-center">
                    <Plus size={18} className="mr-2" /> Agregar Logo
                </button>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {logos.map(logo => (
                    <div key={logo.id} className="bg-brand-card border border-brand-secondary p-4 rounded-xl relative group">
                        <img src={logo.logo_url} alt={logo.name} className="h-12 w-full object-contain mb-4" />
                        <h4 className="text-sm font-bold text-white text-center truncate">{logo.name}</h4>
                        <div className="absolute inset-0 bg-brand-dark/90 opacity-0 group-hover:opacity-100 transition-all rounded-xl flex items-center justify-center space-x-4">
                            <a href={logo.website_url} target="_blank" className="p-2 bg-white/10 rounded-full text-white hover:bg-brand-neon hover:text-brand-darker transition-all"><Globe size={18} /></a>
                            <button onClick={() => handleDelete(logo.id)} className="p-2 bg-brand-alert/20 rounded-full text-brand-alert hover:bg-brand-alert hover:text-white transition-all"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

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

    const handleApprove = async (contact) => {
        const pass = prompt(`Asignar contraseña para ${contact.nombre_social} (CUIT: ${contact.cuit}):`, contact.cuit);
        if (pass === null) return; // Cancelado

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
                    <button
                        onClick={() => setActiveTab('logos')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'logos' ? 'bg-brand-neon text-brand-darker font-bold' : 'text-brand-muted hover:bg-white/5'}`}
                    >
                        <RefreshCcw size={18} />
                        <span>Gestión de Logos</span>
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
                        {activeTab === 'contacts' ? 'Empresas Interesadas / Denunciantes' : activeTab === 'replicas' ? 'Solicitudes de Réplica' : 'Gestión de Logos de Confianza'}
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
                                        <div className="flex items-center space-x-4">
                                            <p className="text-xs text-brand-text/50 uppercase font-black tracking-widest">{c.rubro}</p>
                                            <button
                                                onClick={() => handleApprove(c)}
                                                className="bg-brand-neon hover:bg-[#00cc7d] text-brand-darker text-[10px] font-black px-4 py-2 rounded-lg transition-all shadow-lg shadow-brand-neon/20 uppercase"
                                            >
                                                Aprobar como Socio
                                            </button>
                                        </div>
                                        <p className="text-xs text-brand-neon opacity-0 group-hover:opacity-100 transition-opacity">Preferencia: {c.preferencia_contacto}</p>
                                    </div>
                                </div>
                            ))}
                            {data.contacts.length === 0 && <p className="text-center py-20 text-brand-muted italic">No hay registros de contacto todavía.</p>}
                        </div>
                             {data.replicas.length === 0 && <p className="text-center py-20 text-brand-muted italic">No hay solicitudes de réplica de momento.</p>}
            </div>
            ) : (
            <LogosManager />
                    )}
        </main>
            </div >
        </div >
    );
};

export default AdminPanel;
