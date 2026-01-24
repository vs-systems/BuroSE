import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

const LegalLayout = ({ children, title, theme, setTheme }) => {
    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-brand-darker text-brand-text' : 'bg-slate-50 text-slate-900'}`}>
            <Header theme={theme} setTheme={setTheme} />
            <main className="container mx-auto px-4 py-32 max-w-4xl">
                <h1 className={`text-4xl font-black mb-12 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
                <div className={`prose prose-sm max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                    {children}
                </div>
            </main>
            <Footer theme={theme} />
        </div>
    );
};

export default LegalLayout;
