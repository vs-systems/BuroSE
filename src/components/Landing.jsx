import React from 'react';
import Header from './Header';
import Hero from './Hero';
import ProblemChart from './ProblemChart';
import HowItWorks from './HowItWorks';
import RiskDashboard from './RiskDashboard';
import Legal from './Legal';
import AccessForm from './AccessForm';
import ReplyForm from './ReplyForm';
import Footer from './Footer';

const Landing = () => {
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
};

export default Landing;
