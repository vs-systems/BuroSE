import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-brand-card border-t border-brand-secondary py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <ShieldCheck className="text-brand-neon" size={24} />
                            <span className="text-xl font-bold text-white">BuroSE</span>
                        </div>
                        <p className="text-sm text-brand-muted leading-relaxed">
                            El primer buró de crédito colaborativo para el gremio de la seguridad electrónica.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Plataforma</h4>
                        <ul className="space-y-2 text-sm text-brand-muted">
                            <li><a href="#" className="hover:text-brand-neon transition-colors">Acceso Clientes</a></li>
                            <li><a href="#" className="hover:text-brand-neon transition-colors">Solicitar Demo</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-brand-muted">
                            <li><a href="#" className="hover:text-brand-neon transition-colors">Términos y Condiciones</a></li>
                            <li><a href="#" className="hover:text-brand-neon transition-colors">Política de Privacidad</a></li>
                            <li><a href="#replica" className="hover:text-brand-neon transition-colors">Derecho a Réplica</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Desarrollo</h4>
                        <p className="text-sm text-brand-muted mb-2">
                            Una iniciativa tecnológica de:
                        </p>
                        <a href="https://vecinoseguro.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">
                            VS Sistemas
                        </a>
                    </div>
                </div>

                <div className="border-t border-brand-secondary pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-muted">
                    <p>&copy; 2026 BuroSE. Todos los derechos reservados.</p>
                    <p className="mt-2 md:mt-0">Hecho en Argentina 🇦🇷 | Última actualización: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
