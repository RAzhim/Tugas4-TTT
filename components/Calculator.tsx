import React, { useState, useEffect } from 'react';

const Calculator: React.FC = () => {
    // Inputs
    const [r1, setR1] = useState(400); // Ohm
    const [r2, setR2] = useState(4000); // Ohm
    const [c1, setC1] = useState(50); // nF
    const [c2, setC2] = useState(0.5); // nF

    // Outputs
    const [t1, setT1] = useState(0); // µs
    const [t2, setT2] = useState(0); // µs

    useEffect(() => {
        const R1 = r1;
        const R2 = r2;
        const C1 = c1 * 1e-9; // to Farad
        const C2 = c2 * 1e-9; // to Farad

        if (R1 > 0 && R2 > 0 && C1 > 0 && C2 > 0) {
            // Approximate formulas
            const calculatedT1 = R1 * ((C1 * C2) / (C1 + C2));
            const calculatedT2 = 0.7 * (R1 + R2) * (C1 + C2);

            setT1(calculatedT1 * 1e6); // to µs
            setT2(calculatedT2 * 1e6); // to µs
        } else {
            setT1(0);
            setT2(0);
        }

    }, [r1, r2, c1, c2]);
    
    const InputField = ({ label, value, onChange, unit }: {label: string, value: number, onChange: (val: number) => void, unit: string}) => (
        <div>
            <label htmlFor={label} className="block text-sm font-medium text-gray-300">
                {label} <span className="text-xs text-gray-500">({unit})</span>
            </label>
            <div className="mt-1">
                <input
                    type="number"
                    id={label}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm p-2"
                />
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Kalkulator Aproksimasi T1 & T2</h3>
             <p className="text-gray-400 mb-6 text-sm">
                Gunakan kalkulator ini untuk mendapatkan perkiraan kasar waktu muka (T1) dan waktu ekor (T2) berdasarkan nilai komponen rangkaian. Ini menggunakan formula aproksimasi yang umum digunakan. Untuk hasil yang lebih akurat, gunakan simulator interaktif di atas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Input Komponen</h4>
                    <InputField label="Resistor Muka (R1)" value={r1} onChange={setR1} unit="Ω" />
                    <InputField label="Resistor Ekor (R2)" value={r2} onChange={setR2} unit="Ω" />
                    <InputField label="Kapasitor Generator (C1)" value={c1} onChange={setC1} unit="nF" />
                    <InputField label="Kapasitor Beban (C2)" value={c2} onChange={setC2} unit="nF" />
                </div>
                {/* Output Section */}
                <div className="space-y-4">
                     <h4 className="text-lg font-medium text-white">Hasil Perhitungan (Aproksimasi)</h4>
                     <div className="flex flex-col space-y-4">
                        <div className="bg-gray-700 p-4 rounded-lg text-center">
                            <p className="text-sm text-gray-400">Waktu Muka (T1)</p>
                            <p className="text-3xl font-bold text-teal-400 mt-1">{t1.toFixed(2)}<span className="text-xl ml-1">µs</span></p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg text-center">
                             <p className="text-sm text-gray-400">Waktu Ekor (T2)</p>
                            <p className="text-3xl font-bold text-teal-400 mt-1">{t2.toFixed(2)}<span className="text-xl ml-1">µs</span></p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
