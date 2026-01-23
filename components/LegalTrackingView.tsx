import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { User } from '../types';

interface LegalTrackingViewProps {
    currentUser: User;
}

const LegalTrackingView: React.FC<LegalTrackingViewProps> = ({ currentUser }) => {
    const [copied, setCopied] = useState<string | null>(null);

    // Get status from user profile or default to empty/pending
    const cofeprisStatus = currentUser.legalStatus?.find(s => s.processName === 'COFEPRIS');
    const juzgadoStatus = currentUser.legalStatus?.find(s => s.processName === 'Juzgados');

    const cofeprisCode = cofeprisStatus?.caseNumber || "Pendiente";
    const juzgadoFolio = juzgadoStatus?.caseNumber || "Pendiente";

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-text-light mb-6 text-center">Seguimiento de Trámites</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Step 1: COFEPRIS */}
                <Card className="border-l-4 border-accent-green">
                    <div className="flex items-center mb-4">
                        <div className="bg-dark-tertiary p-3 rounded-full mr-4">
                            <span className="text-2xl font-bold text-accent-green">1</span>
                        </div>
                        <h2 className="text-xl font-bold text-text-light">COFEPRIS</h2>
                    </div>

                    <p className="text-text-muted mb-4">
                        Ingreso de escrito libre. Esperando respuesta para proceder a juzgados.
                    </p>

                    <div className="bg-dark-primary p-4 rounded-md mb-4">
                        <p className="text-sm text-gray-400 mb-1">Código de Rastreo:</p>
                        <div className="flex items-center justify-between">
                            <p className="text-lg font-mono text-accent-green select-all truncate mr-2">{cofeprisCode}</p>
                            {cofeprisCode !== "Pendiente" && (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleCopy(cofeprisCode, 'cofepris')}
                                    className="text-xs px-2 py-1 h-auto"
                                >
                                    {copied === 'cofepris' ? <Icon name="check" className="w-4 h-4" /> : <Icon name="copy" className="w-4 h-4" />}
                                </Button>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open('https://tramiteselectronicos02.cofepris.gob.mx/EstadoTramite/Default.aspx', '_blank')}
                    >
                        Verificar en COFEPRIS <Icon name="external-link" className="ml-2 w-4 h-4" />
                    </Button>
                </Card>

                {/* Step 2: Juzgados */}
                <Card className={`border-l-4 ${juzgadoFolio !== 'Pendiente' ? 'border-accent-green' : 'border-gray-600 opacity-75'}`}>
                    <div className="flex items-center mb-4">
                        <div className="bg-dark-tertiary p-3 rounded-full mr-4">
                            <span className={`text-2xl font-bold ${juzgadoFolio !== 'Pendiente' ? 'text-accent-green' : 'text-gray-400'}`}>2</span>
                        </div>
                        <h2 className="text-xl font-bold text-text-light">Juzgados</h2>
                    </div>

                    <p className="text-text-muted mb-4">
                        Denuncia por incumplimiento. Se activa una vez obtenida la respuesta de COFEPRIS.
                    </p>

                    <div className="bg-dark-primary p-4 rounded-md mb-4">
                        <p className="text-sm text-gray-400 mb-1">Folio de Seguimiento:</p>
                        <div className="flex items-center justify-between">
                            <p className={`text-lg font-mono ${juzgadoFolio !== 'Pendiente' ? 'text-accent-green' : 'text-gray-300'} select-all truncate mr-2`}>{juzgadoFolio}</p>
                            {juzgadoFolio !== "Pendiente" && (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleCopy(juzgadoFolio, 'juzgados')}
                                    className="text-xs px-2 py-1 h-auto"
                                >
                                    {copied === 'juzgados' ? <Icon name="check" className="w-4 h-4" /> : <Icon name="copy" className="w-4 h-4" />}
                                </Button>
                            )}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        disabled={juzgadoFolio === 'Pendiente'}
                        onClick={() => window.open('https://www.oaj.gob.mx/micrositios/dggj/paginas/serviciosTramites.htm?pageName=servicios%2Fexpedientes.htm', '_blank')}
                    >
                        Verificar en Juzgados <Icon name="external-link" className="ml-2 w-4 h-4" />
                    </Button>
                </Card>
            </div>

            <Card>
                <h3 className="text-lg font-bold text-text-light mb-2">¿Necesitas ayuda?</h3>
                <p className="text-text-muted">
                    Si tienes dudas sobre el estado de tu trámite, contáctanos directamente por WhatsApp usando el botón en la esquina inferior derecha.
                </p>
            </Card>
        </div>
    );
};

export default LegalTrackingView;
