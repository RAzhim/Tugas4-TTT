
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 shadow-lg">
            <div className="container mx-auto px-4 py-6 max-w-4xl">
                <h1 className="text-3xl font-bold text-white">Simulasi Pembangkitan Tegangan Tinggi Impuls</h1>
                <p className="text-teal-400 mt-1">Studi dan Analisis Interaktif</p>
            </div>
        </header>
    );
};

export default Header;
