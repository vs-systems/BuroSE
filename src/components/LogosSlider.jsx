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
            .catch(err => console.error("Error loading logos:", err));
    }, []);

    // Placeholder data if no logos are available in DB
    const baseLogos = logos.length > 0 ? logos : [
        { name: "Seguridad 1", logo_url: "https://via.placeholder.com/150?text=Security+Co" },
        { name: "Informática 2", logo_url: "https://via.placeholder.com/150?text=IT+Services" },
        { name: "Alarma 3", logo_url: "https://via.placeholder.com/150?text=Alarms+Pro" },
        { name: "CCTV 4", logo_url: "https://via.placeholder.com/150?text=CCTV+Global" },
        { name: "Seguridad 5", logo_url: "https://via.placeholder.com/150?text=Shield+Tech" }
    ];

    // Duplicate logos for infinite scroll effect
    const displayLogos = [...baseLogos, ...baseLogos, ...baseLogos];

    return (
        <section className={`py-12 border-y overflow-hidden bg-white border-slate-100`}>
            <div className="container mx-auto px-4 text-center mb-8">
                <h3 className={`font-bold text-lg md:text-xl text-slate-600`}>
                    Estas empresas ya estan confiando sus bases de deudores en <span className="text-brand-neon">BuroSE</span>..
                </h3>
            </div>

            <div className="relative flex overflow-x-hidden group">
                <div className="flex animate-scroll whitespace-nowrap gap-8 items-center py-4">
                    {displayLogos.map((logo, idx) => (
                        <a
                            key={idx}
                            href={logo.website_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`h-20 min-w-[200px] px-8 py-4 border rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-xl group/card ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-brand-neon/40' : 'bg-white border-slate-50 hover:border-brand-neon/40'
                                }`}
                        >
                            <img
                                src={logo.logo_url}
                                alt={logo.name}
                                title={logo.name}
                                className={`max-h-12 w-auto object-contain transition-all duration-300 ${theme === 'dark' ? 'brightness-110 grayscale hover:grayscale-0' : 'grayscale hover:grayscale-0'
                                    }`}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    const span = document.createElement('span');
                                    span.className = "text-xs font-black uppercase tracking-widest text-slate-400";
                                    span.innerText = logo.name;
                                    e.target.parentElement.appendChild(span);
                                }}
                            />
                        </a>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}} />
        </section>
    );
};

export default LogosSlider;
