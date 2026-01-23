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
            const formData = new FormData();
            formData.append('cuit', cuit);
            formData.append('password', password);

            const response = await fetch('api/member_login.php', {
                method: 'POST',
                body: formData
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
        <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
            <div className={`max-w-md w-full rounded-3xl border shadow-2xl p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-900/20">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-3.04l.592.813a4.89 4.89 0 003.868 1.917c2.707 0 4.892-2.188 4.892-4.892V11c0-1.31-.413-2.52-1.108-3.517M12 11V3m0 8l4-4m-4 4l-4-4" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Acceso Clientes</h1>
                    <p className="text-slate-400">Ingresa a la plataforma BuroSE</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">CUIT de la Empresa</label>
                        <input
                            type="text"
                            value={cuit}
                            onChange={(e) => setCuit(e.target.value.replace(/\D/g, ''))}
                            placeholder="Ej: 30112223334"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Ingresar al Sistema'
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-700 text-center">
                    <p className="text-slate-500 text-sm">
                        ¿Olvidaste tu contraseña o necesitas una cuenta?<br />
                        <a href="mailto:burosearg@gmail.com" className="text-blue-400 hover:underline">Contactar soporte</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MemberLogin;
