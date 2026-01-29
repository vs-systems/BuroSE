import React, { useEffect, useState } from 'react';

const LogosSlider = ({ theme }) => {
    const [logos, setLogos] = useState([]);

    useEffect(() => {
        fetch('api/public_logos.php')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setLogos(data.data);
                }
            })
            .catch(err => console.error("Error loading associates:", err));
    }, []);

    // Placeholder data if no entries in DB
    const associates = logos.length > 0 ? logos : [
        { name: "Seguridad Global", website_url: "#" },
        { name: "IT Solutions AR", website_url: "#" },
        { name: "Alarms & Monitoring", website_url: "#" },
        { name: "CCTV Experts", website_url: "#" },
        { name: "Shield Tech", website_url: "#" }
    ];

    return (
        <section id="associates" className={`py-20 border-t transition-colors duration-500 ${theme === 'dark' ? 'bg-brand-darker border-brand-secondary/30' : 'bg-white border-slate-100'}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Empresas que confían en <span className="text-brand-neon">BuroSE</span>
                    </h3>
                    <p className={`mt-2 text-sm font-bold ${theme === 'dark' ? 'text-brand-muted' : 'text-slate-400'}`}>
                        Nuestra red colaborativa crece día a día para proteger el crédito comercial.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
                    {associates.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.website_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-8 py-5 border-2 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-brand-neon/50 active:scale-95 group ${theme === 'dark'
                                ? 'bg-brand-card/50 border-brand-secondary/50 text-white'
                                : 'bg-white border-slate-100 text-slate-800 shadow-sm'
                                }`}
                        >
                            <span className="text-lg md:text-xl font-black uppercase tracking-tighter transition-colors group-hover:text-brand-neon whitespace-nowrap">
                                {item.name}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LogosSlider;
