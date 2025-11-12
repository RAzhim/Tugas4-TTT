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
        if (!canvasRef.current || !data || data.length === 0) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const labels = data.map(p => p.time);
        const voltageData = data.map(p => p.voltage);

        const annotationPlugin = {
            id: 'waveformAnnotations',
            afterDraw: (chart: Chart) => {
                const { ctx, chartArea: { top, bottom, left, right }, scales: { x, y } } = chart;
                ctx.save();
                
                // --- Peak Voltage Annotation ---
                const peakY = y.getPixelForValue(peakVoltage);
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.moveTo(left, peakY);
                ctx.lineTo(right, peakY);
                ctx.stroke();
                ctx.setLineDash([]);
                
                // --- Front Time (T1) Annotation ---
                const frontTimeX = x.getPixelForValue(frontTime);
                if(frontTimeX >= left && frontTimeX <= right) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#F6E05E'; // yellow
                    ctx.lineWidth = 1;
                    ctx.moveTo(frontTimeX, top);
                    ctx.lineTo(frontTimeX, bottom);
                    ctx.stroke();

                    ctx.fillStyle = '#F6E05E';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(`T1: ${frontTime.toFixed(2)}µs`, frontTimeX, top + 10);
                }

                // --- Tail Time (T2) Annotation ---
                const halfPeakY = y.getPixelForValue(peakVoltage / 2);
                const tailTimeX = x.getPixelForValue(tailTime);

                if (tailTimeX >= left && tailTimeX <= right) {
                     // 50% line
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([2, 3]);
                    ctx.moveTo(left, halfPeakY);
                    ctx.lineTo(tailTimeX, halfPeakY);
                    ctx.stroke();

                    // T2 line
                    ctx.beginPath();
                    ctx.strokeStyle = '#68D391'; // green
                    ctx.lineWidth = 1;
                    ctx.setLineDash([]);
                    ctx.moveTo(tailTimeX, top);
                    ctx.lineTo(tailTimeX, bottom);
                    ctx.stroke();

                    ctx.fillStyle = '#68D391';
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText(`T2: ${tailTime.toFixed(2)}µs`, tailTimeX, top + 25);
                }

                ctx.restore();
            }
        };

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
            plugins: [annotationPlugin],
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
                        max: Math.max(110, peakVoltage * 1.1),
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