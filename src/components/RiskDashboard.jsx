import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, ShieldCheck, ShieldX, TrendingUp, Landmark, FileText, AlertTriangle, BookOpen, Wallet, CreditCard, Lock } from 'lucide-react';
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
        try {
            const response = await fetch(`api/search.php?cuit=${cuit}`, { credentials: 'include' });
            const data = await response.json();
            setResult(data);
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

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/mp_checkout.php', { credentials: 'include' });
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
                                    <p className={`text-[8px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Estado de Cuenta</p>
                                    <p className={`text-xs font-black uppercase ${theme === 'dark' ? 'text-brand-neon' : 'text-green-600'}`}>Socio Activo</p>
                                </div>
                                <button
                                    onClick={handlePayment}
                                    title="Pagar Abono Mensual"
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
                        Consulta <span className="text-brand-neon">Riesgo</span>
                    </h2>

                    {isAuthenticated ? (
                        <>
                            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
                                <input
                                    type="text"
                                    value={cuit}
                                    onChange={(e) => setCuit(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="Ingrese CUIT o DNI sin guiones..."
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
                                Sugerencia: <span className="text-brand-neon">20333333334</span> (BCRA Oficial $0 | Reporte Biosegur)
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
                                <button
                                    onClick={() => {
                                        if (window.location.hash === '#/risk-dashboard') {
                                            window.location.href = '/#contact';
                                        } else {
                                            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="bg-brand-neon text-brand-darker font-black py-4 px-8 rounded-xl uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg shadow-brand-neon/20"
                                >
                                    Solicitar Acceso (Gratis)
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Espacio entre el área de búsqueda y los resultados */}
                <div className="h-4"></div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-brand-neon border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-brand-neon font-bold animate-pulse">Analizando perfiles...</p>
                    </div>
                )}

                {result && !loading && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Status Card (Always shown) */}
                        <div className={`border-2 rounded-3xl p-10 mb-10 flex flex-col md:flex-row items-center justify-between shadow-2xl transition-all duration-500 ${getRiskColor(result.alert_level)}`}>
                            <div className="flex items-center space-x-8 mb-8 md:mb-0">
                                {result.alert_level === 'GREEN' ? <ShieldCheck size={100} strokeWidth={1} /> :
                                    result.alert_level === 'YELLOW' ? <ShieldAlert size={100} strokeWidth={1} /> : <ShieldX size={100} strokeWidth={1} />}
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Estado del CUIT</h3>
                                    <p className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">
                                        {result.alert_level === 'GREEN' ? 'SIN RIESGO' : 'REPORTA RIESGO'}
                                    </p>
                                    {result.name && (
                                        <p className="text-xl font-bold opacity-80 uppercase leading-none">{result.name}</p>
                                    )}
                                    <p className="text-xs font-black opacity-60 uppercase tracking-widest mt-2 px-3 py-1 bg-white/10 rounded-full inline-block">CUIT: {result.cuit}</p>
                                </div>
                            </div>

                            {/* Info for Authenticated Users */}
                            {result.authenticated ? (
                                <div className="text-center md:text-right">
                                    <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Deuda Total Consolidada</p>
                                    <p className="text-5xl md:text-6xl font-black leading-tight tracking-tighter">
                                        <span className="text-2xl mr-1">$</span>
                                        {parseFloat(result.total_risk_debt).toLocaleString('es-AR')}
                                    </p>
                                </div>
                            ) : (
                                /* CTA for Guests */
                                <div className="bg-white/10 p-6 rounded-2xl max-w-sm border border-white/20 backdrop-blur-sm">
                                    <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-80 leading-relaxed">
                                        Información detallada bloqueada por motivos de seguridad legal.
                                    </p>
                                    <button
                                        onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                                        className="w-full bg-brand-neon text-brand-darker font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-neon/20 transition-all font-sans"
                                    >
                                        Registrarse para ver el Reporte
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Detailed Panels (Only for Authenticated) */}
                        {result.authenticated && (
                            <div className="grid lg:grid-cols-2 gap-10">
                                {/* Guild Reports (Left) */}
                                <div className={`border rounded-3xl p-10 shadow-xl transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100'
                                    }`}>
                                    <div className="flex items-center space-x-4 mb-10">
                                        <div className="p-3 bg-brand-neon/10 rounded-xl">
                                            <TrendingUp className="text-brand-neon" size={28} />
                                        </div>
                                        <h4 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Reportes del Gremio</h4>
                                    </div>

                                    {result.internal.count > 0 ? (
                                        <div className="space-y-6">
                                            {result.internal.reports.map((report, idx) => (
                                                <div key={idx} className={`border rounded-2xl p-6 transition-all ${theme === 'dark' ? 'bg-brand-dark/50 border-brand-secondary/50' : 'bg-slate-50 border-slate-100'
                                                    }`}>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <p className="text-2xl font-black text-brand-neon tracking-tighter">$ {parseFloat(report.monto).toLocaleString('es-AR')}</p>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>{new Date(report.fecha_denuncia).toLocaleDateString()}</p>
                                                        </div>
                                                        <span className="bg-brand-alert/10 text-brand-alert text-[10px] font-black px-3 py-1.5 rounded-full border border-brand-alert/20 uppercase tracking-widest">Validado</span>
                                                    </div>
                                                    <p className={`text-sm leading-relaxed font-medium italic ${theme === 'dark' ? 'text-brand-text/80' : 'text-slate-600'}`}>"{report.descripcion}"</p>
                                                    <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'border-white/5 text-brand-muted' : 'border-slate-200 text-slate-400'}`}>
                                                        <div className="flex items-center">
                                                            <FileText size={14} className="mr-2" /> Reportado por: {report.reporter_name || 'Miembro BuroSE'}
                                                        </div>
                                                        <span className="text-brand-neon">Evidencia Verificada</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={`text-center py-16 border-2 border-dashed rounded-3xl ${theme === 'dark' ? 'border-brand-secondary/50' : 'border-slate-100'}`}>
                                            <p className={`text-sm font-bold italic ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Sin antecedentes reportados por colegas.</p>
                                        </div>
                                    )}
                                </div>

                                {/* BCRA Reports (Right) */}
                                <div className={`border rounded-3xl p-10 shadow-xl transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-100'
                                    }`}>
                                    <div className="flex items-center space-x-4 mb-10">
                                        <div className="p-3 bg-blue-600/10 rounded-xl">
                                            <Landmark className="text-blue-500" size={28} />
                                        </div>
                                        <h4 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Situación Oficial (BCRA)</h4>
                                    </div>

                                    <div className="space-y-4">
                                        {result.bcra.entidades.length > 0 ? (
                                            result.bcra.entidades.map((entidad, idx) => (
                                                <div key={idx} className={`flex items-center justify-between p-6 border rounded-2xl transition-all ${theme === 'dark' ? 'bg-brand-dark/30 border-brand-secondary/30' : 'bg-slate-50 border-slate-100'
                                                    }`}>
                                                    <div>
                                                        <p className={`font-black uppercase text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{entidad.entidad}</p>
                                                        <p className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Periodo: {entidad.periodo}</p>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black text-brand-darker mb-2 uppercase tracking-widest shadow-lg ${getStatusColor(entidad.situacion)} shadow-brand-neon/10`}>
                                                            SIT. {entidad.situacion}
                                                        </div>
                                                        <p className={`text-lg font-black tracking-tighter ${theme === 'dark' ? 'text-brand-text' : 'text-slate-800'}`}>$ {parseFloat(entidad.monto).toLocaleString('es-AR')}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-16 opacity-30 grayscale gap-4">
                                                <Landmark size={64} strokeWidth={1} />
                                                <p className="font-bold italic text-sm">No se registran deudas bancarias oficiales.</p>
                                            </div>
                                        )}

                                        {result.bcra.max_situacion > 2 && (
                                            <div className="mt-8 flex items-start space-x-4 p-5 bg-brand-alert/10 border border-brand-alert/20 rounded-2xl shadow-lg shadow-brand-alert/5">
                                                <AlertTriangle className="text-brand-alert flex-shrink-0" size={24} />
                                                <p className="text-xs text-brand-alert font-bold leading-relaxed uppercase tracking-tight">
                                                    <strong>Alerta Crítica:</strong> El sujeto presenta riesgo financiero real en entidades bancarias. Se recomienda suspender créditos comerciales de inmediato.
                                                </p>
                                            </div>
                                        )}
                                    </div>
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
