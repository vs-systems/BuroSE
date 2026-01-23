import React from 'react';
import { Upload } from 'lucide-react';

const ReportUpload = ({ theme }) => {
    return (
        <div className={`mt-12 p-8 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex flex-col items-center justify-center text-center">
                <div className={`p-4 rounded-full mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <Upload className={`w-8 h-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Carga de Reportes
                </h3>
                <p className={`max-w-md mx-auto mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Esta funcionalidad estará disponible próximamente para socios verificados.
                </p>
                <button
                    disabled
                    className={`px-6 py-2 rounded-xl font-medium transition-colors ${theme === 'dark'
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    Próximamente
                </button>
            </div>
        </div>
    );
};

export default ReportUpload;
