import { useState } from 'react';

interface FaqModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartRegistration: () => void;
}

export default function FaqModal({ isOpen, onClose, onStartRegistration }: FaqModalProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    if (!isOpen) return null;

    const faqs = [
        {
            question: "Trámite y costos",
            answer: "Gratuito: Te acompañamos en todo el proceso, solo necesitas acudir personalmente a tu cita en Cofepris para ingresar los documentos.\n\nCon Gestor: Si no puedes asistir a la cita, un gestor puede hacerlo por ti con una aportación de $250.00, que serán destinados a quien realice el trámite en tu nombre."
        },
        {
            question: "Duración del trámite",
            answer: "El proceso tiene una duración aproximada de 10 a 14 meses. Nosotros nos encargamos de darle seguimiento a tu trámite y te mantendremos informado en cada etapa."
        },
        {
            question: "¿Cómo funciona el trámite?",
            answer: "Te enviaremos vía WhatsApp un formulario para realizar tu escrito libre: Descarga y completa el documento \"Escrito Libre de Cofepris\" para iniciar el proceso.\n\nDocumentación: Reúne tu INE, CURP y RFC con homoclave (lleva dos copias de cada uno)."
        },
        {
            question: "¿Qué significa que mi trámite está \"en revisión\"?",
            answer: "Significa que COFEPRIS está evaluando tu documentación. Esta etapa puede tardar varias semanas, dependiendo de la carga de trabajo del área correspondiente."
        },
        {
            question: "¿Qué es una ratificación?",
            answer: "Una ratificación por parte de COFEPRIS (Comisión Federal para la Protección contra Riesgos Sanitarios) se refiere generalmente a un acto administrativo mediante el cual la autoridad confirma, valida o aprueba oficialmente un trámite o resolución previa, asegurando que cumple con los requisitos legales y normativos."
        },
        {
            question: "¿Qué es una prevención?",
            answer: "Una \"prevención\" es una solicitud formal que COFEPRIS emite durante el proceso de evaluación de tu trámite o autorización. Si recibes una prevención, significa que debes proporcionar información adicional, corregir errores o subsanar omisiones en tu documentación inicial. Es importante atenderla en un plazo de 5 días hábiles para evitar que el trámite sea rechazado o archivado."
        },
        {
            question: "¿Qué es un retiro de cosecha o traspaso?",
            answer: "El \"retiro de cosecha\" en Torus AC se refiere al retiro de flores de cannabis entre asociados con autorización sanitaria y comunidades rurales. Este proceso se lleva a cabo bajo acuerdos de cultivo colectivo, en los que ambas partes contribuyen a distintas etapas de la producción.\n\nEs fundamental destacar que este retiro se realiza con altos estándares de trazabilidad, garantizando la transparencia y el cumplimiento de las regulaciones vigentes."
        },
        {
            question: "¿Qué leyes regulan el cultivo y uso del cannabis en México?",
            answer: "El cultivo y uso del cannabis en México están regulados por:\n\n• Ley General de Salud: establece las normas para el uso medicinal, científico e industrial del cannabis.\n\n• Reglamento de la Ley General de Salud en materia de control sanitario para la producción, investigación y uso medicinal del cannabis y sus derivados farmacológicos (publicado en 2021).\n\n• COFEPRIS: autoridad encargada de otorgar autorizaciones sanitarias y supervisar el cumplimiento de las normativas sanitarias."
        }
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 md:px-8 py-6 rounded-t-3xl z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                                Preguntas Frecuentes
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Todo sobre el trámite
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
                        >
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="px-6 md:px-8 py-6 space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-slate-100"
                            >
                                <h3 className="text-lg font-bold text-slate-900 pr-4">
                                    {faq.question}
                                </h3>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="px-6 pb-5 text-slate-600 leading-relaxed whitespace-pre-line">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Footer CTA */}
                <div className="sticky bottom-0 bg-gradient-to-br from-emerald-600 to-teal-600 px-6 md:px-8 py-6 rounded-b-3xl">
                    <div className="text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                            ¿Listo para comenzar?
                        </h3>
                        <p className="text-emerald-100 mb-4 text-sm">
                            Inicia tu registro y te guiaremos en cada paso del proceso
                        </p>
                        <button
                            onClick={() => {
                                onClose();
                                onStartRegistration();
                            }}
                            className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-lg"
                        >
                            Comenzar Registro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
