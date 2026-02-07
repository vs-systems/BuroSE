import React, { useState, useEffect } from 'react';
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
import ContactModal from './ContactModal';
import RiskMockup from './RiskMockup';

const Landing = ({ theme, setTheme, initialSection, settings }) => {
    const [isContactOpen, setIsContactOpen] = useState(false);

    useEffect(() => {
        if (initialSection === 'pricing') {
            setTimeout(() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [initialSection]);

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-brand-darker text-brand-text' : 'bg-slate-50 text-slate-900'}`}>
            <Header theme={theme} setTheme={setTheme} openContact={() => setIsContactOpen(true)} />
            <main>
                <Hero theme={theme} />
                <RiskMockup theme={theme} />
                <ProblemChart theme={theme} />
                <HowItWorks theme={theme} />
                <Pricing theme={theme} openContact={(type) => setIsContactOpen(type || true)} />
                <Manuals theme={theme} settings={settings} />
                <Legal theme={theme} />
                <div id="contact" className={`container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 transition-colors ${theme === 'dark' ? 'bg-transparent' : 'bg-slate-50'}`}>
                    <AccessForm theme={theme} />
                    <ReplyForm theme={theme} />
                </div>
                <LogosSlider theme={theme} />
            </main>
            <Footer theme={theme} openContact={() => setIsContactOpen(true)} settings={settings} />
            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} theme={theme} />
        </div>
    );
};

export default Landing;
