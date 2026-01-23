import React from 'react';
import { X } from 'lucide-react';

const LegalModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-darker/90 backdrop-blur-sm">
            <div className="bg-brand-card border border-brand-secondary w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-brand-secondary flex justify-between items-center bg-brand-dark/50">
                    <h3 className="text-xl font-bold text-brand-neon uppercase tracking-wider">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-brand-muted hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto text-brand-text/80 leading-relaxed text-sm space-y-4">
                    {content}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-brand-secondary bg-brand-dark/30 text-center">
                    <button
                        onClick={onClose}
                        className="bg-brand-neon text-brand-darker px-8 py-2 rounded font-bold hover:scale-105 transition-transform"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalModal;
