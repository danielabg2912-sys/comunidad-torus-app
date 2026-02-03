
import { useState, useEffect } from 'react';
import { fillPdf, FormConfig } from '../../services/pdfService';
import { Button } from '../common/Button';

// Initial coordinates - likely need adjustment
const DEFAULT_CONFIG: FormConfig = {
    name: { x: 100, y: 600, size: 12, page: 0 },
    rfc: { x: 100, y: 550, size: 12, page: 0 },
    curp: { x: 100, y: 500, size: 12, page: 0 },
    date: { x: 400, y: 700, size: 12, page: 0 },
};

export default function PaperworkView() {
    const [formData, setFormData] = useState({ name: '', rfc: '', curp: '' });
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [debugMode, setDebugMode] = useState(false);
    const [config, setConfig] = useState<FormConfig>(DEFAULT_CONFIG);

    const TEMPLATE_URL = '/templates/CONTRATO TORUS.pdf';
    // const TEMPLATE_URL = '/templates/ESCRITO LIBRE 2025.pdf';

    const generatePreview = async () => {
        setLoading(true);
        try {
            const pdfBytes = await fillPdf(TEMPLATE_URL, formData, config);
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('Error cargando el template PDF.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (formData.name || debugMode) {
            // Debounce auto-preview in debug mode? 
            // For now just manual or on mount if there's data
            const timeout = setTimeout(generatePreview, 500);
            return () => clearTimeout(timeout);
        }
    }, [formData, config, debugMode]);

    const downloadPdf = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `Tramite_${formData.name || 'Socio'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleCoordChange = (field: keyof FormConfig, coord: 'x' | 'y', value: number) => {
        setConfig(prev => ({
            ...prev,
            [field]: { ...prev[field], [coord]: value }
        }));
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-800 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900 relative">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Navbar - Simplified for App View */}
            <nav className="relative z-50 bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="cursor-pointer" onClick={() => window.location.href = '/'}>
                        <img
                            src="/images/torus-logo-black.png"
                            alt="Torus AC"
                            className="h-12 w-auto object-contain hover:opacity-80 transition-opacity"
                        />
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

                {/* Header Section */}
                <div className="text-center mb-12 space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold tracking-wider uppercase border border-emerald-200">
                        Registro Oficial
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Trámites <span className="text-emerald-600">COFEPRIS</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
                        Llena este formulario con cuidado. Generaremos tus documentos oficiales automáticamente para tu expediente.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left Column: Form */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[30px] shadow-2xl p-8 border border-white/50 space-y-8 animate-in slide-in-from-left duration-700">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 border-b border-emerald-100 pb-6">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Datos Personales</h2>
                                <p className="text-sm text-slate-500">Información requerida para el trámite</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm outline-none"
                                    placeholder="Como aparece en tu INE"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">RFC</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm outline-none uppercase"
                                        placeholder="Con Homoclave"
                                        value={formData.rfc}
                                        onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">CURP</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm outline-none uppercase"
                                        placeholder="CLAVE ÚNICA"
                                        value={formData.curp}
                                        onChange={(e) => setFormData({ ...formData, curp: e.target.value.toUpperCase() })}
                                    />
                                </div>
                            </div>

                            <div className="pt-8 flex gap-4">
                                <Button
                                    onClick={downloadPdf}
                                    disabled={!pdfUrl || IsEmpty(formData)}
                                    className="w-full py-4 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 rounded-xl transition-all hover:scale-[1.02]"
                                >
                                    Descargar Documento
                                </Button>
                            </div>

                            {/* Debug Tools */}
                            <div className="mt-8 pt-6 border-t border-dashed border-slate-300">
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-400 cursor-pointer select-none hover:text-emerald-600 transition-colors">
                                    <input type="checkbox" className="rounded text-emerald-500 focus:ring-emerald-500" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} />
                                    Activar Modo Diseñador (Ajustar Texto)
                                </label>

                                {debugMode && (
                                    <div className="mt-4 space-y-2 text-xs bg-slate-100 p-4 rounded-xl border border-slate-200">
                                        {Object.entries(config).map(([key, val]) => (
                                            <div key={key} className="flex gap-2 items-center">
                                                <span className="w-16 font-mono font-bold text-slate-600">{key}</span>
                                                X: <input type="number" value={val.x} onChange={(e) => handleCoordChange(key as keyof FormConfig, 'x', Number(e.target.value))} className="w-16 p-1 rounded border border-slate-300" />
                                                Y: <input type="number" value={val.y} onChange={(e) => handleCoordChange(key as keyof FormConfig, 'y', Number(e.target.value))} className="w-16 p-1 rounded border border-slate-300" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Preview */}
                    <div className="bg-slate-800 rounded-[30px] overflow-hidden shadow-2xl flex flex-col h-[800px] border-4 border-slate-900 animate-in slide-in-from-right duration-700">
                        {pdfUrl ? (
                            <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4 p-8 text-center">
                                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium">Vista Previa del Documento</p>
                                <p className="text-sm opacity-60 max-w-xs">
                                    Completa los campos requeridos a la izquierda para generar una vista previa automática.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

function IsEmpty(data: any) {
    return !data.name || !data.rfc || !data.curp;
}
