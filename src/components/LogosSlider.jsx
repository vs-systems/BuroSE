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
        <section className={`py-12 border-y transition-colors ${theme === 'dark' ? 'bg-brand-dark border-brand-secondary' : 'bg-slate-100 border-slate-200'}`}>
            <div className="container mx-auto px-4">


                <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {displayLogos.map((logo, idx) => (
                        <a key={idx} href={logo.website_url || "#"} target="_blank" rel="noopener noreferrer" className="h-12 w-auto flex items-center justify-center">
                            <img src={logo.logo_url} alt={logo.name} title={logo.name} className="max-h-full w-auto object-contain" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LogosSlider;
