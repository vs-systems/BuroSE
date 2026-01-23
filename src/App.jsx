import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import AdminPanel from './components/AdminPanel';
import RiskDashboard from './components/RiskDashboard';
import MemberLogin from './components/MemberLogin';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/risk-dashboard" element={<RiskDashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/config" element={<AdminPanel />} />
                <Route path="/login" element={<MemberLogin />} />
            </Routes>
        </Router>
    );
}

export default App;
```
