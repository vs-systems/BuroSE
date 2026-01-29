import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import AdminPanel from './components/AdminPanel';
import RiskDashboard from './components/RiskDashboard';
import MemberLogin from './components/MemberLogin';
import Terms from './components/legal/Terms';
import Privacy from './components/legal/Privacy';
import NDA from './components/legal/NDA';
import Replica from './components/legal/Replica';
import Manual from './components/Manual';
import LegalRecovery from './components/legal/LegalRecovery';
import LegalServices from './components/LegalServices';
import RegistrationPage from './components/RegistrationPage';

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        const applyTheme = (themeMode) => {
            let actualTheme = themeMode;
            if (themeMode === 'system') {
                actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            if (actualTheme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.style.backgroundColor = '#0a0b10';
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.backgroundColor = '#f8fafc';
            }
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);

        // Listener for system theme changes if set to 'system'
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') applyTheme('system');
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    // Protección de código (Deterrentes)
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            // Deshabilitar F12, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
            if (
                e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
                (e.ctrlKey && e.keyCode === 85)
            ) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing theme={theme} setTheme={setTheme} />} />
                <Route path="/risk-dashboard" element={<RiskDashboard theme={theme} setTheme={setTheme} />} />
                <Route path="/registro-gratis" element={<RegistrationPage theme={theme} setTheme={setTheme} />} />
                <Route path="/admin" element={<AdminPanel theme={theme} setTheme={setTheme} />} />
                <Route path="/config" element={<AdminPanel theme={theme} setTheme={setTheme} />} />
                <Route path="/login" element={<MemberLogin theme={theme} setTheme={setTheme} />} />
                <Route path="/terms" element={<Terms theme={theme} setTheme={setTheme} />} />
                <Route path="/privacy" element={<Privacy theme={theme} setTheme={setTheme} />} />
                <Route path="/nda" element={<NDA theme={theme} setTheme={setTheme} />} />
                <Route path="/replica" element={<Replica theme={theme} setTheme={setTheme} />} />
                <Route path="/manual" element={<Manual theme={theme} setTheme={setTheme} />} />
                <Route path="/legal-recovery" element={<LegalRecovery theme={theme} setTheme={setTheme} />} />
                <Route path="/legal-services" element={<LegalServices theme={theme} setTheme={setTheme} />} />
                <Route path="/pricing" element={<Landing theme={theme} setTheme={setTheme} initialSection="pricing" />} />
            </Routes>
        </Router>
    );
}

export default App;
