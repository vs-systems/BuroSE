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

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.style.backgroundColor = '#0a0b10'; // brand-darker
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.backgroundColor = '#f8fafc'; // slate-50
        }
        localStorage.setItem('theme', theme);
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
                <Route path="/admin" element={<AdminPanel theme={theme} setTheme={setTheme} />} />
                <Route path="/config" element={<AdminPanel theme={theme} setTheme={setTheme} />} />
                <Route path="/login" element={<MemberLogin theme={theme} setTheme={setTheme} />} />
                <Route path="/terms" element={<Terms theme={theme} setTheme={setTheme} />} />
                <Route path="/privacy" element={<Privacy theme={theme} setTheme={setTheme} />} />
                <Route path="/nda" element={<NDA theme={theme} setTheme={setTheme} />} />
                <Route path="/replica" element={<Replica theme={theme} setTheme={setTheme} />} />
                <Route path="/manual" element={<Manual theme={theme} setTheme={setTheme} />} />
            </Routes>
        </Router>
    );
}

export default App;
