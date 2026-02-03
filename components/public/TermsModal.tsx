import React from 'react';
import { X, ShieldCheck, Scale, FileText, Lock, Globe } from 'lucide-react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[30px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-slate-100/50 backdrop-blur-md rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Header */}
                <div className="bg-slate-900 p-8 md:p-12 text-white md:w-1/3 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-emerald-500/30">
                            <Scale className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 tracking-tight text-emerald-50">Términos y Condiciones</h2>
                        <p className="text-slate-400 leading-relaxed font-light">
                            Por favor lee detenidamente nuestros términos de uso antes de utilizar nuestros servicios.
                        </p>
                        <div className="mt-12 pt-8 border-t border-slate-800">
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>Actualizado: 2025</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="p-8 md:p-12 md:w-2/3 bg-white overflow-y-auto">
                    <div className="space-y-8">

                        <Section
                            number="01"
                            title="Los Servicios"
                            icon={FileText}
                        >
                            Los servicios proporcionados por la ASOCIACIÓN se sujetarán a lo establecido en el contrato de asociación y prestación de servicios, así como su uso, detalles y prohibiciones de la asociación, los cuales serán recibidos y firmados autógrafamente por el usuario asociado para la integración de su expediente por lo que el asociado se obliga a observarlos en todo momento.
                        </Section>

                        <Section
                            number="02"
                            title="No Comercialización"
                            icon={Globe}
                        >
                            Dentro de <span className="font-bold text-emerald-700">AGROECOLOGÍA SOSTENIBLE TORUS, A.C.</span>, no existe COMERCIALIZACIÓN o VENTA de productos, solo el traspaso entre el cultivo de los asociados mayores de edad que se integren a nuestra comuna y soliciten la prestación de servicios de asesoría y cuidado hortícola de su cultivo.
                        </Section>

                        <Section
                            number="03"
                            title="N.R.D.A."
                            icon={Lock}
                        >
                            Nos Reservamos el Derecho de Admisión, así como la cancelación de cualquier suscripción de los asociados, sin discriminación. Nos deslindamos de actividades criminales de terceros. Nuestra asociación está constituida plenamente en el ejercicio de los Derechos Humanos y la cultura internacional colectiva alrededor de la planta de Cannabis.
                        </Section>

                        <Section
                            number="04"
                            title="Suscripción"
                            icon={ShieldCheck}
                        >
                            A través de tu suscripción con la asociación, obtienes tu autorización sanitaria de COFEPRIS, capacitaciones de cultivo, adelanto y traspaso de Cannabis y sus derivados dentro del marco legal, de manera sostenible científica, confiable y segura.
                        </Section>

                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            Acepto y Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ number, title, children, icon: Icon }: { number: string, title: string, children: React.ReactNode, icon: any }) {
    return (
        <div className="group">
            <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">{number}</span>
                    <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    {title}
                </h3>
            </div>
            <div className="text-slate-600 leading-relaxed pl-11 text-sm">
                {children}
            </div>
        </div>
    );
}
