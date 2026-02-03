import React from 'react';
import { X, ShieldCheck, Scale, FileText, Lock, Eye, UserCheck, Server, FileOutput } from 'lucide-react';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-blue-500/30">
                            <ShieldCheck className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 tracking-tight text-blue-50">Aviso de Privacidad</h2>
                        <p className="text-slate-400 leading-relaxed font-light">
                            Conoce cómo protegemos y tratamos tus datos personales en Torus AC.
                        </p>
                        <div className="mt-12 pt-8 border-t border-slate-800">
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <Scale className="w-4 h-4 text-blue-500" />
                                <span>Agroecología Sostenible Torus, A.C.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="p-8 md:p-12 md:w-2/3 bg-white overflow-y-auto">
                    <div className="space-y-8">

                        <Section
                            title="Responsable"
                            icon={UserCheck}
                        >
                            <span className="font-bold">AGROECOLOGÍA SOSTENIBLE TORUS, A.C.</span>, en lo sucesivo “LA ASOCIACIÓN”, será el responsable del tratamiento, uso y protección de sus datos personales, haciendo de su conocimiento que la información, imágenes y sonidos serán tratados de forma estrictamente confidencial y única y exclusivamente para los fines de la Asociación y sus relaciones con sus asociados.
                        </Section>

                        <Section
                            title="Datos Personales"
                            icon={FileText}
                        >
                            Los Datos Personales que requerimos podrán consistir en: nombre(s), apellidos, fecha y lugar de nacimiento, domicilios, teléfonos, correo electrónico, nacionalidad, género, estado civil, ocupación, RFC, CURP, escolaridad, datos bancarios para donativos, entre otros. Los Datos Personales Sensibles podrán incluir origen racial, estado de salud, creencias, afiliación sindical, u opiniones políticas.
                        </Section>

                        <Section
                            title="Tratamiento y Finalidad"
                            icon={Server}
                        >
                            Sus datos tendrán como finalidades principales: identificación, localización y contacto; registro en bases de datos (visitante, asociado, proveedor, etc.); elaboración de contratos y expedientes; corroboración de información; proveer servicios y productos; envío de correspondencia; fines estadísticos y de investigación; emisión de CFDI; y cumplimiento de leyes como la Ley Antilavado.
                        </Section>

                        <Section
                            title="Transferencia de Datos"
                            icon={FileOutput}
                        >
                            “LA ASOCIACION” podrá transferir sus datos a terceros nacionales o extranjeros para fines relacionados con el objeto de la asociación. El tercero receptor asumirá las mismas obligaciones de protección de datos. La oposición a esta transferencia debe ser expresa.
                        </Section>

                        <Section
                            title="Derechos ARCO"
                            icon={Eye}
                        >
                            Usted puede ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición (ARCO) o revocar su consentimiento contactando a la Gerencia. Deberá presentar un escrito con su identificación, la descripción de su solicitud y documentos probatorios.
                        </Section>

                        <Section
                            title="Plazos y Quejas"
                            icon={Lock}
                        >
                            Responderemos a su solicitud en un plazo máximo de 20 días hábiles. Si considera que su derecho ha sido vulnerado, puede acudir al IFAI (www.inai.org.mx).
                        </Section>

                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={onClose}
                            className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: any }) {
    return (
        <div className="group">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                    {title}
                </h3>
            </div>
            <div className="text-slate-600 leading-relaxed pl-12 text-sm text-justify">
                {children}
            </div>
        </div>
    );
}
