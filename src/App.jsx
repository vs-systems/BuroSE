import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import AdminPanel from './components/AdminPanel';
import RiskDashboard from './components/RiskDashboard';
import MemberLogin from './components/MemberLogin';

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

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing theme={theme} setTheme={setTheme} />} />
                <Route path="/risk-dashboard" element={<RiskDashboard theme={theme} setTheme={setTheme} />} />
                <Route path="/admin" element={<AdminPanel theme={theme} setTheme={setTheme} />} />
                <Route path="/config" element={<AdminPanel theme={theme} setTheme={setTheme} />} />
                <Route path="/login" element={<MemberLogin theme={theme} setTheme={setTheme} />} />
            </Routes>
        </Router>
    );
}

export default App;
