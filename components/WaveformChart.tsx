import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import type { WaveformPoint } from '../types';

interface WaveformChartProps {
    data: WaveformPoint[];
    peakVoltage: number;
    frontTime: number;
    tailTime: number;
}

const WaveformChart: React.FC<WaveformChartProps> = ({ data, peakVoltage, frontTime, tailTime }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current || !data) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        
        // Destroy previous chart instance to prevent memory leaks
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const labels = data.map(p => p.time);
        const voltageData = data.map(p => p.voltage);

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Impulse Waveform',
                        data: voltageData,
                        borderColor: '#4FD1C5',
                        backgroundColor: 'rgba(79, 209, 197, 0.1)',
                        borderWidth: 2,
                        pointRadius: 0,
                        tension: 0.1,
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Time (µs)',
                            color: '#A0AEC0',
                        },
                        ticks: {
                            color: '#A0AEC0',
                        },
                        grid: {
                            color: 'rgba(74, 85, 104, 0.5)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Voltage (%)',
                            color: '#A0AEC0',
                        },
                        min: 0,
                        max: 110,
                        ticks: {
                            color: '#A0AEC0',
                        },
                         grid: {
                            color: 'rgba(74, 85, 104, 0.5)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#E2E8F0',
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1A202C',
                        titleColor: '#E2E8F0',
                        bodyColor: '#E2E8F0',
                        borderColor: '#4A5568',
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += `${context.parsed.y.toFixed(2)} %`;
                                }
                                return label;
                            },
                             title: (context) => {
                                if (context.length > 0) {
                                     return `Time: ${context[0].parsed.x.toFixed(2)} µs`;
                                }
                                return '';
                            }
                        }
                    }
                }
            }
        });

        // Cleanup function to destroy chart on component unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };

    }, [data, frontTime, tailTime, peakVoltage]);

    return (
        <div className="w-full h-64 md:h-80 bg-gray-900/50 p-2 rounded-lg">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default WaveformChart;
