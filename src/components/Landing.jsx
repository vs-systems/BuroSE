import React, { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import ProblemChart from './ProblemChart';
import HowItWorks from './HowItWorks';
import RiskDashboard from './RiskDashboard';
import Legal from './Legal';
import AccessForm from './AccessForm';
import ReplyForm from './ReplyForm';
import LogosSlider from './LogosSlider';
import Pricing from './Pricing';
import Manuals from './Manuals';
import Footer from './Footer';

const Landing = ({ theme, setTheme }) => {
    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-brand-darker text-brand-text' : 'bg-slate-50 text-slate-900'}`}>
            <Header theme={theme} setTheme={setTheme} />
            <main>
                <Hero theme={theme} />
                <LogosSlider theme={theme} />
                <ProblemChart theme={theme} />
                <HowItWorks theme={theme} />
                <Pricing theme={theme} />
                <Manuals theme={theme} />
                {/* El buscador público ha sido removido por política de registro obligatorio */}
                <Legal theme={theme} />
                <div id="contact" className={`container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 transition-colors ${theme === 'dark' ? 'bg-transparent' : 'bg-slate-50'}`}>
                    <AccessForm theme={theme} />
                    <ReplyForm theme={theme} />
                </div>
            </main>
            <Footer theme={theme} />
        </div>
    );
};

export default Landing;
