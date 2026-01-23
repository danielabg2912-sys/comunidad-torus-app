
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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Form */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Trámites COFEPRIS</h2>
                    <p className="text-gray-600 mb-8">
                        Llena este formulario **una sola vez** con cuidado. Generaremos tus documentos oficiales automáticamente.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                                placeholder="Como aparece en tu INE"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                                    placeholder="Con Homoclave"
                                    value={formData.rfc}
                                    onChange={(e) => setFormData({ ...formData, rfc: e.target.value.toUpperCase() })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CURP</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
                                    value={formData.curp}
                                    onChange={(e) => setFormData({ ...formData, curp: e.target.value.toUpperCase() })}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t mt-6 flex gap-4">
                            <Button onClick={downloadPdf} disabled={!pdfUrl || IsEmpty(formData)}>
                                Descargar Documento
                            </Button>
                        </div>

                        {/* Debug Tools */}
                        <div className="mt-8 pt-4 border-t border-dashed">
                            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
                                <input type="checkbox" checked={debugMode} onChange={(e) => setDebugMode(e.target.checked)} />
                                Activar Modo Diseñador (Ajustar Texto)
                            </label>

                            {debugMode && (
                                <div className="mt-4 space-y-2 text-xs bg-gray-100 p-4 rounded">
                                    {Object.entries(config).map(([key, val]) => (
                                        <div key={key} className="flex gap-2 items-center">
                                            <span className="w-16 font-bold">{key}</span>
                                            X: <input type="number" value={val.x} onChange={(e) => handleCoordChange(key as keyof FormConfig, 'x', Number(e.target.value))} className="w-16 p-1" />
                                            Y: <input type="number" value={val.y} onChange={(e) => handleCoordChange(key as keyof FormConfig, 'y', Number(e.target.value))} className="w-16 p-1" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview */}
                <div className="bg-gray-200 rounded-xl overflow-hidden shadow-inner flex flex-col h-[800px]">
                    {pdfUrl ? (
                        <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>Llena el formulario para ver la vista previa</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function IsEmpty(data: any) {
    return !data.name || !data.rfc || !data.curp;
}
