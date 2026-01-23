import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import AdminPanel from './components/AdminPanel';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/config" element={<AdminPanel />} />
            </Routes>
        </Router>
    );
}

export default App;
