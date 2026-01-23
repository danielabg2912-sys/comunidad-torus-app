import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../../services/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

interface InventoryRow {
    'Código': string;
    'Nombre Producto': string;
    'Categoría': string;
    'Almacén': string;
    'Stock Actual': number;
}

import { Product } from '../../types';

interface InventoryUploaderProps {
    onSuccess?: (products: Product[]) => void;
}

export const InventoryUploader: React.FC<InventoryUploaderProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setLog([]);
        }
    };

    const processFile = async () => {
        if (!file) return;
        setLoading(true);
        setLog(['Iniciando procesamiento...', 'Leyendo archivo...']);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json<InventoryRow>(sheet);

            setLog(prev => [...prev, `Archivo leído. ${jsonData.length} filas encontradas.`, 'Obteniendo productos de la base de datos...']);

            // Fetch all products first to minimize reads and allow flexible matching
            const productsRef = collection(db, 'products');
            const snapshot = await getDocs(productsRef);
            const productsMap = new Map();

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                // Normalize keys for matching: Remove spaces, lowercase
                const normalizedId = doc.id.replace(/\s+/g, '').toLowerCase();
                productsMap.set(normalizedId, { ref: doc.ref, data: data, id: doc.id });

                // Also map by name if needed as fallback (optional, but good for robustness)
                const normalizedName = (data.name || '').replace(/\s+/g, '').toLowerCase();
                if (normalizedName) {
                    productsMap.set(`NAME:${normalizedName}`, { ref: doc.ref, data: data, id: doc.id });
                }
            });

            setLog(prev => [...prev, `Productos en BD: ${snapshot.size}`, 'Iniciando actualización...']);

            let updatedCount = 0;
            let notFoundCount = 0;

            setLog(prev => [...prev, `Productos en BD: ${snapshot.size}`, 'Iniciando cálculo de nuevo stock...']);

            // 1. Prepare a map of all products with DEFAULT 0 availability.
            // This ensures that if a product is NOT in the Excel, its stock becomes 0.
            const productUpdates = new Map<string, { ref: any, availability: { 'Del Valle': number, 'Coyoacán': number } }>();

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                productUpdates.set(doc.id, {
                    ref: doc.ref,
                    // Reset to 0 by default. If excel has data, it will overwrite this.
                    availability: { 'Del Valle': 0, 'Coyoacán': 0 }
                });
            });

            // 2. Process Excel Data and update the local map
            for (const row of jsonData) {
                const code = row['Código'];
                // Only process rows with valid code/name
                if (!code && !row['Nombre Producto']) continue;

                const branchName = row['Almacén'] || '';
                const stock = typeof row['Stock Actual'] === 'number' ? row['Stock Actual'] : 0;

                const normalizedCode = code ? String(code).replace(/\s+/g, '').toLowerCase() : '';
                let productId = '';

                // Try to find product by code
                if (normalizedCode && productsMap.has(normalizedCode)) {
                    productId = productsMap.get(normalizedCode).id;
                }
                // Fallback: Try by name
                else if (row['Nombre Producto']) {
                    const normalizedName = String(row['Nombre Producto']).replace(/\s+/g, '').toLowerCase();
                    const key = `NAME:${normalizedName}`;
                    if (productsMap.has(key)) {
                        productId = productsMap.get(key).id;
                    }
                }

                if (productId && productUpdates.has(productId)) {
                    let targetBranch: 'Del Valle' | 'Coyoacán' | '' = '';
                    if (branchName.toLowerCase().includes('valle')) targetBranch = 'Del Valle';
                    else if (branchName.toLowerCase().includes('coyoac')) targetBranch = 'Coyoacán';

                    if (targetBranch) {
                        const currentUpdate = productUpdates.get(productId)!;
                        currentUpdate.availability[targetBranch] = stock;
                    }
                } else {
                    notFoundCount++;
                }
            }

            setLog(prev => [...prev, 'Aplicando actualizaciones en BD...']);

            // 3. Batch Write Logic
            const CHUNK_SIZE = 450;
            let operationsCount = 0;
            let currentBatch = writeBatch(db);

            for (const [id, update] of productUpdates) {
                currentBatch.update(update.ref, {
                    availability: update.availability
                });
                operationsCount++;
                updatedCount++;

                if (operationsCount >= CHUNK_SIZE) {
                    await currentBatch.commit();
                    currentBatch = writeBatch(db);
                    operationsCount = 0;
                }
            }

            if (operationsCount > 0) {
                await currentBatch.commit();
            }

            setLog(prev => [...prev, `Proceso completado.`, `Actualizados: ${updatedCount} registros.`, `No encontrados: ${notFoundCount} productos.`]);

            // Refresh data to update UI immediately
            if (onSuccess) {
                setLog(prev => [...prev, 'Actualizando vista...']);
                const newSnapshot = await getDocs(collection(db, 'products'));
                const newProducts = newSnapshot.docs.map(doc => doc.data() as Product);
                onSuccess(newProducts);
                setLog(prev => [...prev, 'Vista actualizada.']);
            }

        } catch (error) {
            console.error('Error processing inventory:', error);
            setLog(prev => [...prev, `Error: ${(error as Error).message}`]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-dark-secondary p-6 rounded-lg shadow-lg border border-dark-tertiary">
            <h3 className="text-xl font-bold text-accent-gold mb-4 flex items-center">
                <Icon name="edit" className="mr-2" /> Actualizar Inventario Masivo
            </h3>

            <div className="mb-4">
                <p className="text-gray-300 text-sm mb-2">
                    Sube el archivo Excel <code>Reporte de Stock Actual.xlsx</code>.
                    <br />
                    Se actualizarán las existencias para <strong>Del Valle</strong> y <strong>Coyoacán</strong>.
                </p>

                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-accent-green file:text-white
            hover:file:bg-green-600
            mb-4"
                />

                <Button
                    onClick={processFile}
                    disabled={!file || loading}
                    className="w-full"
                >
                    {loading ? 'Procesando...' : 'Cargar y Actualizar'}
                </Button>
            </div>

            {log.length > 0 && (
                <div className="mt-4 p-3 bg-dark-primary rounded border border-dark-tertiary max-h-40 overflow-y-auto text-xs font-mono">
                    {log.map((entry, i) => (
                        <div key={i} className="text-gray-400 border-b border-dark-tertiary last:border-0 py-1">
                            &gt; {entry}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
