import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemChart from './components/ProblemChart';
import HowItWorks from './components/HowItWorks';
import Legal from './components/Legal';
import AccessForm from './components/AccessForm';
import ReplyForm from './components/ReplyForm';
import Footer from './components/Footer';
import RiskDashboard from './components/RiskDashboard';

function App() {
    return (
        <div className="min-h-screen bg-brand-darker text-brand-text font-sans selection:bg-brand-neon selection:text-brand-darker">
            <Header />
            <main>
                <Hero />
                <ProblemChart />
                <HowItWorks />
                <RiskDashboard />
                <Legal />
                <div id="contact" className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12">
                    <AccessForm />
                    <ReplyForm />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;
