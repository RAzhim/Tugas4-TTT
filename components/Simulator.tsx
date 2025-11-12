import React, { useState, useMemo } from 'react';
import WaveformChart from './WaveformChart';
import CircuitDiagram from './CircuitDiagram';
import type { WaveformPoint } from '../types';

interface SimulatorParams {
    r1: number; // Front Resistor (Ω)
    r2: number; // Tail Resistor (Ω)
    c1: number; // Generator Capacitance (nF)
    c2: number; // Load Capacitance (pF)
}

const ParameterSlider: React.FC<{label: string, value: number, min: number, max: number, step: number, unit: string, onChange: (value: number) => void}> = ({ label, value, min, max, step, unit, onChange }) => (
    <div className="flex flex-col space-y-2">
        <label className="flex justify-between items-center text-sm font-medium text-gray-300">
            <span>{label}</span>
            <span className="font-mono bg-gray-700 text-teal-300 px-2 py-1 rounded">{value} {unit}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
    </div>
);


const Simulator: React.FC = () => {
    const [params, setParams] = useState<SimulatorParams>({
        r1: 400,
        r2: 2700,
        c1: 10,
        c2: 1000,
    });

    const updateParam = <K extends keyof SimulatorParams,>(key: K, value: SimulatorParams[K]) => {
        setParams(prev => ({ ...prev, [key]: value }));
    };

    const { chartData, peakVoltage, frontTime, tailTime } = useMemo(() => {
        const R1 = params.r1; // Ω
        const R2 = params.r2; // Ω
        const C1 = params.c1 * 1e-9; // F
        const C2 = params.c2 * 1e-12; // F

        if (R1 <= 0 || R2 <= 0 || C1 <= 0 || C2 <= 0) {
            return { chartData: [], peakVoltage: 0, frontTime: 0, tailTime: 0 };
        }
        
        const alpha = 1 / (R2 * (C1 + C2));
        const beta = (C1 + C2) / (R1 * C1 * C2);

        if (alpha >= beta) {
             return { chartData: [], peakVoltage: 0, frontTime: 0, tailTime: 0 };
        }

        const data: WaveformPoint[] = [];
        let maxVoltage = 0;
        let timeToPeak = 0;
        
        const totalTimeMicroseconds = 200;
        const steps = 500;

        for (let i = 0; i <= steps; i++) {
            const t_sec = (i / steps) * totalTimeMicroseconds * 1e-6;
            const voltage = (Math.exp(-alpha * t_sec) - Math.exp(-beta * t_sec));
            if (voltage > maxVoltage) {
                maxVoltage = voltage;
                timeToPeak = t_sec * 1e6;
            }
            data.push({ time: t_sec * 1e6, voltage: voltage });
        }
        
        let timeToHalf = 0;
        const halfPeak = maxVoltage / 2;
        for (let i = 0; i < data.length; i++) {
            if (data[i].time > timeToPeak && data[i].voltage < halfPeak) {
                timeToHalf = data[i].time;
                break;
            }
        }

        const normalizedData = data.map(p => ({
            ...p,
            voltage: maxVoltage > 0 ? (p.voltage / maxVoltage) * 100 : 0,
        }));

        return {
            chartData: normalizedData,
            peakVoltage: maxVoltage > 0 ? 100 : 0,
            frontTime: timeToPeak,
            tailTime: timeToHalf,
        };

    }, [params]);

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Parameter Rangkaian</h4>
                         <div className="space-y-4">
                            <ParameterSlider label="Resistor Depan (R1)" value={params.r1} min={10} max={1000} step={10} unit="Ω" onChange={(v) => updateParam('r1', v)} />
                            <ParameterSlider label="Resistor Ekor (R2)" value={params.r2} min={500} max={5000} step={50} unit="Ω" onChange={(v) => updateParam('r2', v)} />
                            <ParameterSlider label="Kapasitor Generator (C1)" value={params.c1} min={1} max={100} step={1} unit="nF" onChange={(v) => updateParam('c1', v)} />
                            <ParameterSlider label="Kapasitor Beban (C2)" value={params.c2} min={100} max={5000} step={50} unit="pF" onChange={(v) => updateParam('c2', v)} />
                         </div>
                    </div>
                    <CircuitDiagram />
                </div>
                <div>
                     <WaveformChart data={chartData} peakVoltage={peakVoltage} frontTime={frontTime} tailTime={tailTime} />
                     <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-700 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Waktu Hadap (T1)</p>
                            <p className="text-xl font-bold text-teal-300">{frontTime.toFixed(2)} µs</p>
                        </div>
                         <div className="bg-gray-700 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Waktu Ekor (T2)</p>
                            <p className="text-xl font-bold text-teal-300">{tailTime.toFixed(2)} µs</p>
                        </div>
                    </div>
                     <div className="mt-4 text-center bg-gray-700 p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Bentuk Gelombang Standar</p>
                            <p className="text-xl font-bold text-white">{frontTime.toFixed(1)} / {tailTime.toFixed(0)} µs</p>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Simulator;