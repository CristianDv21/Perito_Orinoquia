import { useMemo } from 'react';
import { generarInstanciaPdf } from './Pdf';

export default function InformePdf({ peritajeData }) {
  // Generamos el blob URL de forma eficiente y segura con useMemo
  const pdfUrl = useMemo(() => {
    if (!peritajeData) return null;
    const doc = generarInstanciaPdf(peritajeData);
    return doc.output('bloburl');
  }, [peritajeData]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Previsualización del Peritaje</h3>
      </div>

      {/* Visor interactivo integrado */}
      <div className="w-full h-[650px] rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
        {pdfUrl ? (
          <iframe 
            src={pdfUrl} 
            title="Vista Previa PDF" 
            className="w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            Cargando vista previa del documento...
          </div>
        )}
      </div>
    </div>
  );
}