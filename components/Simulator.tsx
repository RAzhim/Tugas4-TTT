import React, { useState, useEffect, useCallback } from 'react';
import WaveformChart from './WaveformChart';
import CircuitDiagram from './CircuitDiagram';
import { WaveformPoint } from '../types';

const Simulator: React.FC = () => {
    // State for circuit parameters
    const [r1, setR1] = useState(400); // Front Resistor (Ohm)
    const [r2, setR2] = useState(4000); // Tail Resistor (Ohm)
    const [c1, setC1] = useState(50); // Generator Capacitance (nF)
    const [c2, setC2] = useState(0.5); // Load Capacitance (nF)
    const [chargingVoltage] = useState(100); // Charging Voltage (kV), but we'll work with %

    // State for simulation results
    const [waveform, setWaveform] = useState<WaveformPoint[]>([]);
    const [peakVoltage, setPeakVoltage] = useState(0); // in %
    const [frontTime, setFrontTime] = useState(0); // in µs
    const [tailTime, setTailTime] = useState(0); // in µs
    const [efficiency, setEfficiency] = useState(0); // in %

    const runSimulation = useCallback(() => {
        const R1 = r1;
        const R2 = r2;
        const C1 = c1 * 1e-9; // nF to F
        const C2 = c2 * 1e-9; // nF to F

        // Coefficients for the characteristic equation s^2 + as + b = 0
        const a = 1 / (R1 * C2) + 1 / (R2 * C1) + 1 / (R2 * C2);
        const b = 1 / (R1 * R2 * C1 * C2);

        const discriminant = a * a - 4 * b;
        if (discriminant < 0) {
            // Underdamped case, not typical for impulse generators, handle gracefully
            setWaveform([]);
            return;
        }

        const s1 = (-a + Math.sqrt(discriminant)) / 2;
        const s2 = (-a - Math.sqrt(discriminant)) / 2;

        const alpha = -s2;
        const beta = -s1;
        
        const V0_factor = C1 / (C1 + C2); // A close approximation
        const k = (chargingVoltage / (R1 * C2 * (beta - alpha))) * V0_factor;

        const voltageFunc = (t: number) => k * (Math.exp(-alpha * t) - Math.exp(-beta * t));
        
        const timeToPeak = (1 / (beta - alpha)) * Math.log(beta / alpha);
        const vPeak = voltageFunc(timeToPeak);

        const newWaveform: WaveformPoint[] = [];
        const timeEnd = timeToPeak * 20; // Simulate for a sufficiently long time
        const steps = 500;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * timeEnd;
            const v = voltageFunc(t);
            newWaveform.push({
                time: t * 1e6, // s to µs
                voltage: (v / chargingVoltage) * 100 // Normalize to % of charging voltage
            });
        }
        
        let t_tail = 0;
        // Find tail time (time to 50% of peak)
        for(let i = Math.floor(steps * timeToPeak / timeEnd); i < newWaveform.length; i++) {
            if (newWaveform[i].voltage < (vPeak/chargingVoltage*100) * 0.5) {
                t_tail = newWaveform[i].time;
                break;
            }
        }

        setWaveform(newWaveform);
        setPeakVoltage((vPeak / chargingVoltage) * 100);
        setFrontTime(timeToPeak * 1e6); // s to µs
        setTailTime(t_tail);
        setEfficiency((vPeak / chargingVoltage) * 100);

    }, [r1, r2, c1, c2, chargingVoltage]);

    useEffect(() => {
        runSimulation();
    }, [runSimulation]);
    
    const ParameterInput = ({ label, value, onChange, unit, min, max, step }: {label: string, value: number, onChange: (val: number) => void, unit: string, min: string, max: string, step: string}) => (
        <div className="flex flex-col space-y-2">
            <label className="flex justify-between items-center text-gray-300">
                <span>{label} <span className="text-xs text-gray-500">({unit})</span></span>
                <input 
                  type="number"
                  value={value}
                  onChange={e => onChange(parseFloat(e.target.value))}
                  className="w-24 bg-gray-700 text-white text-right rounded-md p-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left side: Parameters & Circuit */}
                <div className="space-y-6 bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">Parameter Rangkaian</h3>
                    <ParameterInput label="Resistor Muka (R1)" value={r1} onChange={setR1} unit="Ω" min="10" max="2000" step="10" />
                    <ParameterInput label="Resistor Ekor (R2)" value={r2} onChange={setR2} unit="Ω" min="500" max="10000" step="50" />
                    <ParameterInput label="Kapasitor Generator (C1)" value={c1} onChange={setC1} unit="nF" min="10" max="200" step="1" />
                    <ParameterInput label="Kapasitor Beban (C2)" value={c2} onChange={setC2} unit="nF" min="0.1" max="5" step="0.1" />
                     <div className="mt-4">
                        <CircuitDiagram />
                    </div>
                </div>

                {/* Right side: Results & Chart */}
                <div className="space-y-4">
                     <h3 className="text-xl font-semibold text-white">Hasil Simulasi</h3>
                     <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Tegangan Puncak</p>
                            <p className="text-2xl font-bold text-teal-400">{peakVoltage.toFixed(2)}<span className="text-lg">%</span></p>
                        </div>
                         <div className="bg-gray-700 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Efisiensi (η)</p>
                            <p className="text-2xl font-bold text-teal-400">{efficiency.toFixed(2)}<span className="text-lg">%</span></p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Waktu Muka (T1)</p>
                            <p className="text-2xl font-bold text-teal-400">{frontTime.toFixed(2)}<span className="text-lg"> µs</span></p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Waktu Ekor (T2)</p>
                            <p className="text-2xl font-bold text-teal-400">{tailTime.toFixed(2)}<span className="text-lg"> µs</span></p>
                        </div>
                    </div>
                    <p className="text-center text-gray-400 text-sm mt-2">Bentuk Gelombang: <strong>{frontTime.toFixed(2)} / {tailTime.toFixed(2)} µs</strong></p>
                     
                    <WaveformChart data={waveform} peakVoltage={peakVoltage} frontTime={frontTime} tailTime={tailTime} />
                </div>
            </div>
        </div>
    );
};

export default Simulator;
