import React from 'react';

const CircuitDiagram: React.FC = () => {
    return (
        <div>
            <h4 className="text-lg font-semibold text-white mb-2">Diagram Rangkaian Ekuivalen</h4>
            <svg viewBox="0 0 300 150" className="w-full bg-gray-700 rounded-lg p-2">
                {/* styles */}
                <defs>
                    <style>
                        {`
                        .line { stroke: #A0AEC0; stroke-width: 1.5; fill: none; }
                        .text { font-family: monospace; font-size: 12px; fill: #E2E8F0; }
                        .label { font-family: sans-serif; font-size: 10px; fill: #CBD5E0; }
                        `}
                    </style>
                </defs>

                {/* C1 - Generator Capacitor */}
                <path d="M 30 50 L 50 50 M 50 40 L 50 60 M 55 40 L 55 60 M 55 50 L 70 50" className="line" />
                <text x="40" y="35" className="text">C1</text>

                {/* R1 - Front Resistor */}
                <path d="M 70 50 L 80 50 L 85 45 L 95 55 L 105 45 L 115 55 L 120 50 L 130 50" className="line" />
                <text x="95" y="35" className="text">R1</text>

                {/* Top wire */}
                <path d="M 130 50 L 220 50" className="line" />

                {/* Output terminal */}
                <circle cx="220" cy="50" r="3" fill="#4FD1C5" />
                <text x="225" y="55" className="label">Vout</text>

                {/* Connection point */}
                <circle cx="130" cy="50" r="2" fill="#A0AEC0" />

                {/* R2 - Tail Resistor */}
                <path d="M 130 50 L 130 70 L 125 75 L 135 85 L 125 95 L 135 105 L 130 110 L 130 120" className="line" />
                <text x="140" y="95" className="text">R2</text>

                {/* C2 - Load Capacitor */}
                <path d="M 180 50 L 180 75 M 175 75 L 185 75 M 175 80 L 185 80 M 180 80 L 180 120" className="line" />
                <text x="190" y="95" className="text">C2</text>

                {/* Bottom ground line */}
                <path d="M 30 120 L 220 120" className="line" />
                <path d="M 125 120 L 125 125 M 122 125 L 128 125 M 123.5 128 L 126.5 128 M 124.5 131 L 125.5 131" className="line" />

                {/* Wires to ground */}
                <path d="M 30 50 L 30 120" className="line" />
                <path d="M 220 50 L 220 120" className="line" />
            </svg>
        </div>
    );
};

export default CircuitDiagram;
