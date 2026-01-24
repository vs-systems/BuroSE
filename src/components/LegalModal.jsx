import React from 'react';
import { X } from 'lucide-react';

const LegalModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300 ${theme === 'dark' ? 'bg-brand-darker/90' : 'bg-slate-900/40'
            }`}>
            <div className={`w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border transform transition-all ${theme === 'dark' ? 'bg-brand-card border-brand-secondary' : 'bg-white border-slate-200 shadow-[0_0_50px_rgba(0,0,0,0.1)]'
                }`}>
                {/* Header */}
                <div className={`p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-brand-secondary bg-brand-dark/50' : 'border-slate-100 bg-slate-50/50'
                    }`}>
                    <h3 className="text-xl font-black text-brand-neon uppercase tracking-wider">{title}</h3>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10 text-brand-muted hover:text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-slate-900'
                            }`}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className={`p-8 overflow-y-auto leading-relaxed text-sm space-y-4 ${theme === 'dark' ? 'text-brand-text/80' : 'text-slate-700'
                    }`}>
                    {content}
                </div>

                {/* Footer */}
                <div className={`p-6 border-t text-center ${theme === 'dark' ? 'border-brand-secondary bg-brand-dark/30' : 'border-slate-100 bg-slate-50'
                    }`}>
                    <button
                        onClick={onClose}
                        className="bg-brand-neon text-brand-darker px-10 py-3 rounded-xl font-black hover:scale-105 transition-transform shadow-lg shadow-brand-neon/20 active:scale-95"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
