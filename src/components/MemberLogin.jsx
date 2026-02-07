import React, { useState } from 'react';

const MemberLogin = ({ theme, setTheme }) => {
    const [cuit, setCuit] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('api/member_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cuit, password }),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = '/#/risk-dashboard';
            } else {
                setError(data.message || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker' : 'bg-slate-50'}`}>
            <div className={`max-w-md w-full rounded-3xl border shadow-2xl p-10 transition-all duration-500 ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200'}`}>
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-neon rounded-2xl mb-6 shadow-xl shadow-brand-neon/20 transform hover:rotate-3 transition-transform">
                        <svg className="w-10 h-10 text-brand-darker" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.04l.592.813a4.89 4.89 0 003.868 1.917c2.707 0 4.892-2.188 4.892-4.892V11c0-1.31-.413-2.52-1.108-3.517M12 11V3m0 8l4-4m-4 4l-4-4" />
                        </svg>
                    </div>
                    <h1 className={`text-4xl font-black uppercase tracking-tighter mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Acceso Socios</h1>
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-500'}`}>Bienvenido a la red <span className="text-brand-neon">BuroSE</span></p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>CUIT de la Empresa</label>
                        <input
                            type="text"
                            value={cuit}
                            onChange={(e) => setCuit(e.target.value.replace(/\D/g, ''))}
                            placeholder="Ej: 30112223334"
                            className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-brand-neon/20 transition-all font-mono text-lg ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                            required
                        />
                    </div>

                    <div>
                        <label className={`block text-xs font-black uppercase mb-2 tracking-widest ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full border rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-brand-neon/20 transition-all text-lg ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-brand-alert/10 border border-brand-alert/20 text-brand-alert p-4 rounded-xl text-xs font-bold uppercase tracking-tight text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-brand-neon text-brand-darker font-black py-5 rounded-xl transition-all shadow-xl shadow-brand-neon/20 flex items-center justify-center uppercase tracking-widest hover:brightness-110 active:scale-95 ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-brand-darker/30 border-t-brand-darker rounded-full animate-spin"></div>
                        ) : (
                            'Ingresar al Sistema'
                        )}
                    </button>
                </form>

                <div className={`mt-10 pt-8 border-t text-center ${theme === 'dark' ? 'border-brand-secondary' : 'border-slate-100'}`}>
                    <p className={`text-[10px] uppercase font-black tracking-widest leading-relaxed ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        ¿Olvidaste tu contraseña o necesitas una cuenta?<br />
                        <a href="mailto:sistemas@vecinoseguro.com" className={`mt-2 inline-block font-black underline decoration-2 underline-offset-4 ${theme === 'dark' ? 'text-brand-neon' : 'text-blue-600'}`}>Contactar soporte</a>
                    </p>
                    <div className="mt-6">
                        <a href="/#/" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${theme === 'dark' ? 'text-brand-muted hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                            &larr; Regresar al Inicio
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberLogin;
