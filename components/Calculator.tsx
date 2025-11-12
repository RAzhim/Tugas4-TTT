import React, { useState, useMemo } from 'react';

const InputField: React.FC<{ label: string; value: number; unit: string; onChange: (value: number) => void; step?: number }> = ({ label, value, unit, onChange, step = 1 }) => {
    const inputId = `input-${label.replace(/\s+/g, '-')}`;
    return (
    <div>
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
        <div className="flex items-center bg-gray-700 rounded-md">
            <input
                id={inputId}
                type="number"
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-transparent p-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-md"
                step={step}
            />
            <span className="text-gray-400 pr-3">{unit}</span>
        </div>
    </div>
)};

const Calculator: React.FC = () => {
    const [targetT1, setTargetT1] = useState(1.2); // µs
    const [targetT2, setTargetT2] = useState(50); // µs
    const [knownC1, setKnownC1] = useState(10); // nF
    const [knownC2, setKnownC2] = useState(1000); // pF

    const { calculatedR1, calculatedR2 } = useMemo(() => {
        const T1_s = targetT1 * 1e-6;
        const T2_s = targetT2 * 1e-6;
        const C1_F = knownC1 * 1e-9;
        const C2_F = knownC2 * 1e-12;

        if (T1_s <= 0 || T2_s <= 0 || C1_F <= 0 || C2_F <= 0) {
            return { calculatedR1: 0, calculatedR2: 0 };
        }

        // T2 ≈ R2 * (C1 + C2)  => R2 = T2 / (C1 + C2)
        const R2 = T2_s / (C1_F + C2_F);

        // T1 ≈ R1 * (C1 * C2) / (C1 + C2) => R1 = T1 * (C1 + C2) / (C1 * C2)
        const R1 = T1_s * (C1_F + C2_F) / (C1_F * C2_F);

        return {
            calculatedR1: R1,
            calculatedR2: R2,
        };

    }, [targetT1, targetT2, knownC1, knownC2]);

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Parameter Input</h4>
                    <InputField label="Target Waktu Hadap (T1)" value={targetT1} unit="µs" onChange={setTargetT1} step={0.1} />
                    <InputField label="Target Waktu Ekor (T2)" value={targetT2} unit="µs" onChange={setTargetT2} />
                    <InputField label="Kapasitor Generator (C1)" value={knownC1} unit="nF" onChange={setKnownC1} />
                    <InputField label="Kapasitor Beban (C2)" value={knownC2} unit="pF" onChange={setKnownC2} step={50} />
                </div>
                <div className="flex flex-col justify-center items-center space-y-4">
                     <h4 className="text-lg font-semibold text-white">Hasil Perhitungan</h4>
                     <div className="w-full text-center bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Resistor Depan (R1) yang Disarankan</p>
                        <p className="text-2xl font-bold text-teal-300">{calculatedR1.toFixed(2)} Ω</p>
                    </div>
                     <div className="w-full text-center bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Resistor Ekor (R2) yang Disarankan</p>
                        <p className="text-2xl font-bold text-teal-300">{calculatedR2.toFixed(2)} Ω</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;