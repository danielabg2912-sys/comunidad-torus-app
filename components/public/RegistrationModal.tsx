import { X, IdCard, PenTool, Copy, FileSignature, ScanEye, FileCheck, FileText, ArrowRight } from 'lucide-react';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export default function RegistrationModal({ isOpen, onClose, onContinue }: RegistrationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[30px] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Header & Intro */}
                <div className="bg-emerald-500 p-8 md:p-12 text-white md:w-1/3 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                            <FileText className="w-8 h-8 text-emerald-100" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Instrucciones de Registro</h2>
                        <p className="text-emerald-100 leading-relaxed opacity-90">
                            Siguiendo estas pautas, garantizaremos una presentación adecuada de tu solicitud ante COFEPRIS.
                        </p>
                        <div className="mt-8 border-t border-white/20 pt-8 hidden md:block">
                            <p className="text-sm text-emerald-100 mb-2 font-medium">¿Dudas?</p>
                            <p className="text-xs text-white/70 leading-relaxed">
                                Si tienes alguna pregunta adicional o necesitas más orientación, no dudes en comunicarte con nosotros.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Grid of Instructions */}
                <div className="p-8 md:p-12 md:w-2/3 bg-slate-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        <InstructionItem
                            icon={IdCard}
                            title="Nombre en INE"
                            text="Es crucial que el nombre que ingreses sea idéntico al que aparece en tu INE."
                        />
                        <InstructionItem
                            icon={PenTool}
                            title="Firma"
                            text="Tu firma debe asemejarse lo más posible a la de tu INE para evitar discrepancias."
                        />
                        <InstructionItem
                            icon={Copy}
                            title="Copias"
                            text="Prepara dos juegos de copias de todos los documentos y firma cada conjunto en original."
                        />
                        <InstructionItem
                            icon={FileSignature}
                            title="Ubicación de firma"
                            text="Firma en el costado derecho de la primera hoja, y al final de la segunda hoja con nombre completo."
                        />
                        <InstructionItem
                            icon={ScanEye}
                            title="Claridad en INE"
                            text="Asegúrate de que las copias de tu INE sean claras y legibles para facilitar la verificación."
                        />
                        <InstructionItem
                            icon={FileCheck}
                            title="CURP y RFC"
                            text="Incluye dos copias impresas de tu CURP y de tu RFC con homoclave."
                        />

                    </div>

                    {/* Disclaimer & Action */}
                    <div className="mt-10 pt-6 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-slate-400 max-w-sm text-center sm:text-left">
                                Asegúrate de seguir cuidadosamente todas las instrucciones para evitar el rechazo del trámite.
                            </p>
                            <button
                                onClick={onContinue}
                                className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap"
                            >
                                Entendido, comenzar
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InstructionItem({ icon: Icon, title, text }: { icon: any, title: string, text: string }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{text}</p>
            </div>
        </div>
    );
}
