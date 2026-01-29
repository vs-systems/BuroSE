import React, { useState, useEffect } from 'react';
import { Calendar, Search, ShieldAlert, ShieldCheck, ShieldX, TrendingUp, Landmark, FileText, AlertTriangle, BookOpen, Wallet, CreditCard, Lock, Users, Sun, Moon, Monitor } from 'lucide-react';

const getGoogleCalendarUrl = (title, startDate, details) => {
    if (!startDate) return '#';
    const start = new Date(startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(startDate).getTime() + 3600000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
};
import ReportUpload from './ReportUpload';
import DebtorRanking from './DebtorRanking';

const RiskDashboard = ({ theme, setTheme }) => {
    const [cuit, setCuit] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);
    const [showingSecurity, setShowingSecurity] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', new: '' });
    const [showPurchase, setShowPurchase] = useState(false);
    const [cuitPrefix, setCuitPrefix] = useState('20');
    const [dniInput, setDniInput] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('api/check_session.php', { credentials: 'include' });
            const data = await response.json();
            setIsAuthenticated(data.authenticated);
            setUser(data.user);
        } catch (err) {
            console.error('Error checking auth:', err);
            setIsAuthenticated(false);
        }
    };

    if (isAuthenticated === null) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker' : 'bg-slate-50'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-neon border-t-transparent"></div>
            </div>
        );
    }

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null); // Limpiar resultado previo antes de nueva búsqueda
        try {
            const fingerprint = typeof window !== 'undefined' ? await import('../utils/argentinaUtils').then(u => u.getDeviceFingerprint()) : '';
            const response = await fetch(`api/search.php?cuit=${cuit}&fingerprint=${fingerprint}`, { credentials: 'include' });
            const data = await response.json();

            if (data.status === 'error') {
                setError(data.message);
                if (data.err_code === 'OUT_OF_CREDITS') {
                    // Abrir precios en nueva pestaña tras breve delay para que lean el mensaje
                    setTimeout(() => {
                        window.open('/#/pricing', '_blank');
                    }, 1500);
                }
            } else {
                setResult(data);
                // Refrescar auth para ver créditos actualizados
                checkAuth();
            }
        } catch (error) {
            console.error('Error searching:', error);
            setError('Error de conexión con el servidor.');
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

    const handleLogout = async () => {
        try {
            await fetch('api/logout.php');
            window.location.href = '/';
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch('/api/member_change_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_pass: passwords.current, new_pass: passwords.new }),
                credentials: 'include'
            });
            const data = await resp.json();
            alert(data.message);
            if (data.status === 'success') {
                setShowingSecurity(false);
                setPasswords({ current: '', new: '' });
            }
        } catch (err) {
            alert("Error al conectar con el servidor.");
        }
    };

    const handlePayment = async (type = 'subscription') => {
        setLoading(true);
        try {
            const response = await fetch(`api/mp_checkout.php?type=${type}`, { credentials: 'include' });
            const data = await response.json();
            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                alert("Error al generar el link de pago. Intente más tarde.");
            }
        } catch (err) {
            console.error("Payment error:", err);
            alert("Error de conexión con Mercado Pago.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="risk-search" className={`min-h-screen transition-colors duration-500 selection:bg-brand-neon/30 ${theme === 'dark' ? 'bg-brand-darker text-brand-text' : 'bg-slate-50 text-slate-900'
            }`}>
            {/* Dashboard Header - Mobile Responsive */}
            <header className={`border-b transition-colors duration-500 backdrop-blur-xl sticky top-0 z-20 ${theme === 'dark' ? 'bg-brand-darker/80 border-white/10' : 'bg-white/80 border-slate-200 shadow-sm'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-neon p-2 rounded-lg shadow-lg shadow-brand-neon/20">
                            <ShieldCheck className="w-6 h-6 text-brand-darker" />
                        </div>
                        <div>
                            <h1 className={`text-xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                BuroSE <span className="text-brand-neon text-xs font-black">Premium</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className={`flex items-center gap-1 p-1 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                title="Modo Claro"
                            >
                                <Sun size={14} />
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-brand-neon text-brand-darker shadow-sm' : 'text-slate-400 hover:text-white'}`}
                                title="Modo Oscuro"
                            >
                                <Moon size={14} />
                            </button>
                            <button
                                onClick={() => setTheme('system')}
                                className={`p-1.5 rounded-lg transition-all ${theme === 'system' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="Modo Sistema"
                            >
                                <Monitor size={14} />
                            </button>
                        </div>
                        <button
                            onClick={() => setShowingSecurity(!showingSecurity)}
                            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'}`}
                            title="Seguridad de Cuenta"
                        >
                            <Lock size={20} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-2 transition-colors text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg border ${theme === 'dark' ? 'text-slate-400 border-transparent hover:text-white hover:bg-white/5' : 'text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Modal de Seguridad */}
            {showingSecurity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-darker/60 backdrop-blur-sm">
                    <div className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200'}`}>
                        <h3 className={`text-2xl font-black uppercase mb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Seguridad de Cuenta</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted block mb-2">Contraseña Actual</label>
                                <input
                                    type="password" required
                                    value={passwords.current}
                                    onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                    className={`w-full p-4 rounded-xl border outline-none focus:border-brand-neon transition-all ${theme === 'dark' ? 'bg-brand-dark border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted block mb-2">Nueva Contraseña</label>
                                <input
                                    type="password" required
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    className={`w-full p-4 rounded-xl border outline-none focus:border-brand-neon transition-all ${theme === 'dark' ? 'bg-brand-dark border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowingSecurity(false)} className={`flex-1 py-4 rounded-xl font-black uppercase text-xs tracking-widest ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>Cancelar</button>
                                <button type="submit" className="flex-1 bg-brand-neon text-brand-darker font-black py-4 rounded-xl shadow-lg shadow-brand-neon/20 uppercase text-xs tracking-widest hover:brightness-110">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Compra de Créditos */}
            {showPurchase && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-darker/60 backdrop-blur-sm">
                    <div className={`w-full max-w-2xl p-8 rounded-3xl border shadow-2xl animate-in zoom-in-95 duration-200 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className={`text-2xl font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Comprar <span className="text-brand-neon">Créditos</span></h3>
                            <button onClick={() => setShowPurchase(false)} className="text-brand-muted hover:text-white transition-colors">✕</button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { id: 'subscription', name: 'Abono Mensual', price: 15000, desc: 'Activa 25 consultas/mes', icon: Landmark },
                                { id: 'topup5', name: 'Pack 5', price: (user?.plan === 'free' ? 7500 : 4000), desc: '5 consultas adicionales', icon: Wallet },
                                { id: 'topup10', name: 'Pack 10', price: (user?.plan === 'free' ? 13000 : 7000), desc: '10 consultas adicionales', icon: Wallet },
                                { id: 'topup50', name: 'Pack 50', price: (user?.plan === 'free' ? 50000 : 27500), desc: '50 consultas adicionales', icon: Wallet }
                            ].map(pkg => (
                                <button
                                    key={pkg.id}
                                    onClick={() => handlePayment(pkg.id)}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-brand-neon group ${theme === 'dark' ? 'bg-brand-dark border-white/5' : 'bg-slate-50 border-slate-100'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-brand-neon/10 rounded-lg group-hover:bg-brand-neon transition-colors">
                                            <pkg.icon className="text-brand-neon group-hover:text-brand-darker" size={20} />
                                        </div>
                                        <span className="text-xl font-black text-white">${pkg.price.toLocaleString('es-AR')}</span>
                                    </div>
                                    <h4 className="font-black uppercase text-sm mb-1">{pkg.name}</h4>
                                    <p className="text-[10px] font-bold text-brand-muted">{pkg.desc}</p>
                                </button>
                            ))}
                        </div>
                        <p className="mt-8 text-[10px] text-brand-muted text-center italic">* Los créditos adicionales no vencen con el abono mensual y se consumen tras agotar los mensuales.</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Banner de Bienvenida para Socios */}
                {isAuthenticated && (
                    <div className="mb-12 p-6 rounded-3xl bg-brand-neon/5 border border-brand-neon/20 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-brand-neon p-3 rounded-2xl">
                                <ShieldCheck className="text-brand-darker" size={24} />
                            </div>
                            <div>
                                <h3 className={`text-xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    Bienvenido, {user?.name}
                                </h3>
                                <p className={`text-xs font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                                    SESIÓN DE SOCIO ACTIVA • CUIT {user?.cuit}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black tracking-widest text-brand-neon uppercase">Vencimiento: {user?.is_vip == 1 ? 'PERPETUO' : (user?.expiry_date || 'N/A')}</span>
                                    {user?.is_vip != 1 && user?.expiry_date && (
                                        <a
                                            href={getGoogleCalendarUrl(`VENCIMIENTO PLAN BuroSE`, user.expiry_date, `Tu plan de BuroSE vence hoy. Recuerda renovar para no perder tus beneficios.`)}
                                            target="_blank" rel="noopener noreferrer"
                                            className="text-brand-neon hover:text-white transition-colors"
                                            title="Agendar vencimiento en Google Calendar"
                                        >
                                            <Calendar size={12} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="/#/manual"
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${theme === 'dark' ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                            >
                                <BookOpen size={16} /> Ver Manual de Uso
                            </a>
                            <div className={`flex items-center gap-4 px-6 py-3 rounded-xl border ${theme === 'dark' ? 'bg-brand-dark/40 border-brand-neon/20' : 'bg-white border-slate-200'}`}>
                                <div className="text-right">
                                    <p className={`text-[8px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Créditos Disponibles</p>
                                    <p className={`text-xs font-black uppercase text-brand-neon`}>
                                        {user?.is_vip == 1 ? '∞' : (parseInt(user?.creds_monthly || 0) + parseInt(user?.creds_package || 0))}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowPurchase(true)}
                                    title="Comprar Créditos"
                                    className="bg-brand-neon text-brand-darker p-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
                                >
                                    <CreditCard size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Feedback de Pago */}
                {window.location.hash.includes('payment=success') && (
                    <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl text-center font-bold animate-pulse">
                        ¡Pago procesado con éxito! Su suscripción ha sido extendida.
                    </div>
                )}

                {/* Header / Search Area */}
                <div className="mb-16 text-center">
                    <h2 className={`text-3xl md:text-4xl font-black mb-8 uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Consulta Riesgo <span className="text-brand-neon">Proveedores + BCRA</span>
                    </h2>

                    {isAuthenticated ? (
                        <>
                            <div className={`max-w-2xl mx-auto mb-4 flex flex-col md:flex-row justify-center gap-4`}>
                                <div className={`flex border p-1 rounded-xl transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-sm'}`}>
                                    <select
                                        value={cuitPrefix}
                                        onChange={(e) => {
                                            const newPrefix = e.target.value;
                                            setCuitPrefix(newPrefix);
                                            if (dniInput.length === 8) {
                                                import('../utils/argentinaUtils').then(u => {
                                                    const base = newPrefix + dniInput;
                                                    const digit = u.calculateCUITDigit(base);
                                                    setCuit(base + digit);
                                                });
                                            }
                                        }}
                                        className={`px-3 py-2 text-[10px] font-black uppercase outline-none ${theme === 'dark' ? 'bg-brand-card text-white' : 'bg-white text-slate-900'} border-r border-brand-secondary/30 custom-select`}
                                    >
                                        <option value="20" className={theme === 'dark' ? 'bg-brand-card text-white' : 'bg-white text-slate-900'}>Masc (20)</option>
                                        <option value="27" className={theme === 'dark' ? 'bg-brand-card text-white' : 'bg-white text-slate-900'}>Fem (27)</option>
                                        <option value="30" className={theme === 'dark' ? 'bg-brand-card text-white' : 'bg-white text-slate-900'}>Emp (30)</option>
                                        <option value="23" className={theme === 'dark' ? 'bg-brand-card text-white' : 'bg-white text-slate-900'}>Var (23)</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="DNI p/ Calcular"
                                        maxLength="8"
                                        value={dniInput}
                                        className={`bg-transparent px-4 py-2 text-xs font-black uppercase outline-none w-32 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
                                        onChange={(e) => {
                                            const dni = e.target.value.replace(/\D/g, '');
                                            setDniInput(dni);
                                            if (dni.length === 8) {
                                                import('../utils/argentinaUtils').then(u => {
                                                    const base = cuitPrefix + dni;
                                                    const digit = u.calculateCUITDigit(base);
                                                    setCuit(base + digit);
                                                });
                                            }
                                        }}
                                    />
                                    <div className="bg-brand-neon/10 px-3 py-2 rounded-lg text-[10px] font-black text-brand-neon uppercase flex items-center">Calc CUIT</div>
                                </div>
                            </div>

                            {/* Mensaje de Error */}
                            {error && (
                                <div className="max-w-2xl mx-auto mb-6 animate-in fade-in zoom-in duration-300">
                                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 text-left">
                                        <div className="bg-red-500 p-2 rounded-lg shrink-0">
                                            <ShieldX className="text-white" size={20} />
                                        </div>
                                        <p className="text-xs font-bold text-red-500 leading-relaxed">
                                            {error}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
                                <input
                                    type="text"
                                    value={cuit}
                                    onChange={(e) => setCuit(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="Ingrese CUIT (Solo Números)..."
                                    className={`w-full border-2 rounded-full py-6 px-10 text-xl transition-all shadow-2xl focus:outline-none focus:border-brand-neon ${theme === 'dark' ? 'bg-brand-card border-brand-secondary text-white placeholder:text-brand-muted/50' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                                        }`}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-4 top-4 bg-brand-neon text-brand-darker p-4 rounded-full hover:scale-105 transition-transform shadow-lg shadow-brand-neon/20"
                                >
                                    <Search size={24} />
                                </button>
                            </form>
                            <p className={`mt-6 text-xs font-bold uppercase tracking-widest transition-opacity ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                                Sugerencia: <span className="text-brand-neon">20333333334</span> (CONSULTA EXCLUSIVA POR CUIT)
                            </p>

                            {/* Debtor Ranking Section (Sólo para Socios) */}
                            {!loading && !result && (
                                <div className="max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <DebtorRanking theme={theme} />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={`max-w-2xl mx-auto p-12 rounded-3xl border-2 border-dashed animate-in fade-in zoom-in duration-500 ${theme === 'dark' ? 'bg-brand-card/50 border-brand-secondary/50' : 'bg-white border-slate-200'}`}>
                            <div className="bg-brand-alert/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock className="text-brand-alert" size={40} />
                            </div>
                            <h3 className={`text-2xl font-black uppercase mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Acceso Restringido</h3>
                            <p className={`text-sm font-medium mb-8 leading-relaxed ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>
                                Por políticas de seguridad legal y protección de datos, el buscador de riesgo financiero es exclusivo para miembros registrados.
                                <br /><span className="text-brand-neon font-black italic">El registro es gratuito.</span>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="/#/login" className="bg-blue-600 text-white font-black py-4 px-8 rounded-xl uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg shadow-blue-600/20">Iniciar Sesión</a>
                                <a
                                    href="/#/registro-gratis"
                                    className="bg-brand-neon text-brand-darker font-black py-4 px-8 rounded-xl uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg shadow-brand-neon/20 inline-block text-center"
                                >
                                    Solicitar Acceso (Gratis)
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Espacio entre el área de búsqueda y los resultados */}
                <div className="h-4"></div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                        <div className="w-16 h-16 border-4 border-brand-neon border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-brand-neon font-black uppercase tracking-widest text-sm animate-pulse">Analizando perfiles en Redes y BCRA...</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Por favor espere un momento</p>
                    </div>
                )}

                {result && !loading && (
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                        {/* Premium Report Header */}
                        <div className={`p-8 rounded-3xl mb-8 border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-xl'}`}>
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl ${theme === 'dark' ? 'bg-brand-neon text-brand-darker' : 'bg-blue-600 text-white'}`}>
                                        {(result.name || 'B').charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{result.name || 'Empresa No Identificada'}</h3>
                                        <a
                                            href={getGoogleCalendarUrl(`CONSULTA: ${result.cuit} - ${result.name}`, new Date().toISOString(), `Consulta de riesgo BuroSE.\nCUIT: ${result.cuit}\nEstado: ${result.risk_level}\nScore: ${result.score}`)}
                                            target="_blank" rel="noopener noreferrer"
                                            className="text-brand-neon hover:text-white transition-colors flex items-center gap-2 mt-1 lowercase text-[10px] font-bold"
                                        >
                                            <Calendar size={12} /> Marcar consulta en mi Google Calendar
                                        </a>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>CUIT: {result.cuit}</span>
                                            <span className="w-1 h-1 rounded-full bg-brand-muted opacity-30"></span>
                                            <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Actividad: {result.internal?.count > 0 ? 'Comercial' : 'No Registrada'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full lg:w-auto">
                                    <div className={`px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-[0.2em] border ${result.alert_level === 'RED' ? 'bg-brand-alert/10 text-brand-alert border-brand-alert/30' :
                                        result.alert_level === 'YELLOW' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                                            'bg-brand-neon/10 text-brand-neon border-brand-neon/30'
                                        }`}>
                                        {result.alert_level === 'RED' ? 'ALTO RIESGO' : result.alert_level === 'YELLOW' ? 'RIESGO MEDIO' : 'RIESGO BAJO'}
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-brand-muted' : 'bg-slate-100 text-slate-400'}`}>
                                        DOC: {new Date().toISOString().split('T')[0]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Premium Score and Insights Grid */}
                        <div className="grid lg:grid-cols-3 gap-8 mb-12">
                            {/* Score Gauge Card */}
                            <div className={`lg:col-span-1 p-10 rounded-[2.5rem] border flex flex-col items-center justify-center text-center transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-xl'}`}>
                                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-10 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Score BuroSE</h4>
                                <div className="relative w-48 h-48 flex items-center justify-center">
                                    {/* Circular Gauge Background */}
                                    <svg className="absolute w-full h-full -rotate-90">
                                        <circle
                                            cx="96" cy="96" r="80"
                                            stroke="currentColor" strokeWidth="12" fill="transparent"
                                            className={`${theme === 'dark' ? 'text-white/5' : 'text-slate-100'}`}
                                        />
                                        <circle
                                            cx="96" cy="96" r="80"
                                            stroke="currentColor" strokeWidth="12" fill="transparent"
                                            strokeDasharray={2 * Math.PI * 80}
                                            strokeDashoffset={2 * Math.PI * 80 * (1 - (
                                                result.alert_level === 'GREEN' ? 0.95 :
                                                    result.alert_level === 'YELLOW' ? 0.65 :
                                                        (result.total_risk_debt > 0 ? Math.max(0.1, 0.4 - (result.internal?.count * 0.1)) : 0.2)
                                            ))}
                                            strokeLinecap="round"
                                            className={`transition-all duration-1000 ease-out ${result.alert_level === 'RED' ? 'text-brand-alert' : result.alert_level === 'YELLOW' ? 'text-yellow-500' : 'text-brand-neon'
                                                }`}
                                        />
                                    </svg>
                                    <div className="relative flex flex-col items-center">
                                        <span className={`text-6xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            {result.alert_level === 'GREEN' ? '98' :
                                                result.alert_level === 'YELLOW' ? '65' :
                                                    (result.total_risk_debt > 1000000 ? '12' : '28')}
                                        </span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${result.alert_level === 'RED' ? 'text-brand-alert' : 'text-brand-neon'}`}>
                                            {result.alert_level === 'RED' ? 'MUY CRÍTICO' : 'SALUDABLE'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Insight Cards (Right Side) */}
                            <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
                                {/* Denuncias Card */}
                                <div className={`p-6 rounded-3xl border flex items-center gap-6 transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                    <div className="bg-brand-alert/10 p-4 rounded-2xl flex-shrink-0">
                                        <ShieldAlert className="text-brand-alert" size={24} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            {result.internal?.count || 0} DENUNCIAS RECIENTES
                                        </h4>
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">
                                            Deuda acumulada informada por el gremio: <span className="text-brand-alert">$ {parseFloat(result.internal?.total_debt || 0).toLocaleString('es-AR')}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Trend Card */}
                                <div className={`p-6 rounded-3xl border flex items-center gap-6 transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                    <div className="bg-blue-500/10 p-4 rounded-2xl flex-shrink-0">
                                        <TrendingUp className="text-blue-500" size={24} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            TENDENCIA {result.alert_level === 'GREEN' ? 'POSITIVA' : 'NEGATIVA'}
                                        </h4>
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">
                                            {result.alert_level === 'GREEN' ? 'Comportamiento de pago estable en los últimos 90 días.' : 'Incremento de morosidad detectado en el sistema colaborativo.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Consultants Card */}
                                <div className={`p-6 rounded-3xl border flex items-center gap-6 transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100 shadow-lg'}`}>
                                    <div className="bg-brand-neon/10 p-4 rounded-2xl flex-shrink-0">
                                        <Users className="text-brand-neon" size={24} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                            {result.recent_consultants || 1} PROVEEDORES CONSULTANDO
                                        </h4>
                                        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-1">
                                            Otros socios del sistema han buscado este CUIT recientemente.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary of Collaborative Incidents */}
                        <div className="mb-12">
                            <h4 className={`text-xs font-black uppercase tracking-[0.3em] mb-6 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>RESUMEN DE INCIDENCIAS COLABORATIVAS</h4>
                            {result.authenticated ? (
                                <div className="space-y-3">
                                    {result.internal?.reports.length > 0 ? (
                                        result.internal.reports.map((report, idx) => (
                                            <div key={idx} className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${theme === 'dark' ? 'bg-brand-card/50 border-brand-secondary/30' : 'bg-white border-slate-100'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2 h-2 rounded-full bg-brand-alert animate-pulse"></div>
                                                    <p className={`text-xs font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                                                        {report.reporter_name} - {new Date(report.fecha_denuncia).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                </div>
                                                <div className="flex-1 text-center md:text-right px-10">
                                                    <p className="text-xl font-black tracking-tighter text-white">
                                                        $ {parseFloat(report.monto).toLocaleString('es-AR')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="px-5 py-1.5 rounded-full bg-brand-alert/10 text-brand-alert text-[8px] font-black uppercase tracking-widest border border-brand-alert/20">
                                                        INCUMPLIMIENTO
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={`p-10 rounded-2xl border-2 border-dashed text-center ${theme === 'dark' ? 'bg-brand-card/20 border-brand-secondary/30' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className="text-xs font-bold italic opacity-40">No se registran antecedentes de morosidad comercial internos.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-12 rounded-3xl bg-brand-dark/40 border border-white/5 backdrop-blur-sm text-center">
                                    <Lock size={32} className="mx-auto mb-4 text-brand-alert" />
                                    <p className="text-xs font-black uppercase tracking-widest mb-6 opacity-60">DETALLE DE INCIDENCIAS BLOQUEADO</p>
                                    <a href="/#/registro-gratis" className="bg-brand-neon text-brand-darker font-black py-4 px-10 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-brand-neon/10 inline-block">Registrarse para ver detalles</a>
                                </div>
                            )}
                        </div>

                        {/* BCRA Section */}
                        {result.authenticated && (
                            <div className="mb-20">
                                <h4 className={`text-xs font-black uppercase tracking-[0.3em] mb-6 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>SITUACIÓN OFICIAL (BCRA)</h4>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {result.bcra?.entidades?.length > 0 ? (
                                        result.bcra.entidades.map((entidad, idx) => (
                                            <div key={idx} className={`p-6 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100'}`}>
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-2 bg-blue-600/10 rounded-lg">
                                                        <Landmark className="text-blue-500" size={20} />
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusColor(entidad.situacion)} text-white shadow-lg`}>
                                                        Situación {entidad.situacion}
                                                    </div>
                                                </div>
                                                <h5 className={`font-black uppercase text-xs truncate mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{entidad.entidad}</h5>
                                                <p className="text-[10px] font-bold text-brand-muted opacity-60 mb-4 tracking-widest">PERIODO: {entidad.periodo}</p>
                                                <p className="text-2xl font-black tracking-tighter text-brand-neon">$ {parseFloat(entidad.monto).toLocaleString('es-AR')}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-16 text-center opacity-30">
                                            <Landmark size={48} className="mx-auto mb-4" strokeWidth={1} />
                                            <p className="font-bold italic text-xs">No se registran deudas en el sistema financiero oficial.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Secciones adicionales para socios */}
                {isAuthenticated && (
                    <>
                        <ReportUpload theme={theme} />
                        <div className="mt-12 text-center">
                            <p className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                                Historial de Reportes disponible próximamente
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RiskDashboard;
