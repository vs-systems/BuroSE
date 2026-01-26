import React, { useEffect, useState } from 'react';

const LogosSlider = ({ theme }) => {
    const [logos, setLogos] = useState([]);

    useEffect(() => {
        fetch('/api/admin_logos.php')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    setLogos(data.data);
                }
            })
            .catch(err => console.error("Error loading logos:", err));
    }, []);

    // Si no hay logos, mostramos placeholders para "vender" la idea
    const displayLogos = logos.length > 0 ? logos : [
        { name: "Seguridad 1", logo_url: "https://via.placeholder.com/150?text=Security+Co" },
        { name: "Informática 2", logo_url: "https://via.placeholder.com/150?text=IT+Services" },
        { name: "Alarma 3", logo_url: "https://via.placeholder.com/150?text=Alarms+Pro" },
        { name: "CCTV 4", logo_url: "https://via.placeholder.com/150?text=CCTV+Global" },
        { name: "Seguridad 5", logo_url: "https://via.placeholder.com/150?text=Shield+Tech" }
    ];

    return (
        <section className="py-12 border-y bg-white border-slate-100">
            <div className="container mx-auto px-4 text-center">
                <h3 className="font-bold mb-8 text-lg md:text-xl text-slate-600">
                    Estas empresas ya estan confiando sus bases de deudores en <span className="text-brand-neon">BuroSE</span>..
                </h3>
                <div className="flex flex-wrap justify-center items-center gap-8 py-4">
                    {displayLogos.map((logo, idx) => (
                        <a
                            key={idx}
                            href={logo.website_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-20 min-w-[180px] px-8 py-4 border rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md group bg-white border-slate-50 hover:border-brand-neon/40 hover:scale-105"
                        >
                            <img
                                src={logo.logo_url}
                                alt={logo.name}
                                title={logo.name}
                                className="max-h-12 w-auto object-contain transition-transform duration-300"
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
        </section>
    );
};

export default LogosSlider;
