import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function ModuloFirma({ peritajeData, onChange }) {
  const safeData = peritajeData || {};
  const padFirma = useRef(null);
  const containerRef = useRef(null);
  
  // Inicializamos el estado directamente con la prop para evitar el useEffect sincrónico
  const [firmaGuardada, setFirmaGuardada] = useState(safeData.firmaInspector || null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 150 });

  // Solo dejamos el efecto para manejar el redimensionamiento responsivo de la ventana
  useEffect(() => {
    const actualizarAncho = () => {
      if (containerRef.current) {
        const anchoContenedor = containerRef.current.offsetWidth;
        setCanvasSize({ width: anchoContenedor > 0 ? anchoContenedor : 500, height: 150 });
      }
    };

    actualizarAncho();
    window.addEventListener('resize', actualizarAncho);
    return () => window.removeEventListener('resize', actualizarAncho);
  }, []);

  const limpiarFirma = () => {
    if (padFirma.current) {
      padFirma.current.clear();
    }
    setFirmaGuardada(null);
    if (onChange) onChange({ firmaInspector: null });
  };

  const guardarFirma = () => {
    if (!padFirma.current || padFirma.current.isEmpty()) {
      alert("Por favor, inserte una firma primero.");
      return;
    }

    try {
      const canvasElement = padFirma.current.getCanvas();
      const urlImagenFirma = canvasElement.toDataURL('image/png');

      setFirmaGuardada(urlImagenFirma);

      if (onChange) {
        onChange({ firmaInspector: urlImagenFirma });
      }
    } catch (error) {
      console.error("Error al procesar la firma:", error);
      alert("Ocurrió un error al guardar la firma. Intente nuevamente.");
    }
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          🖋️ Registro de Firma Digital del Perito
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Dibuje su firma dentro del recuadro usando el mouse o la pantalla táctil de su dispositivo.
        </p>
      </div>

      <div 
        ref={containerRef}
        className="border-2 border-dashed border-slate-300 rounded-xl w-full max-w-md bg-slate-50 overflow-hidden touch-none"
      >
        <SignatureCanvas 
          ref={padFirma}
          penColor='black'
          canvasProps={{
            width: canvasSize.width,
            height: canvasSize.height,
            className: 'sigCanvas w-full h-[150px] cursor-crosshair block'
          }}
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button 
          type="button"
          onClick={limpiarFirma}
          className="px-5 py-2.5 bg-white text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition font-bold text-xs uppercase tracking-wider shadow-sm"
        >
          ♻️ Volver a Intentar
        </button>
        
        <button 
          type="button"
          onClick={guardarFirma}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition font-bold text-xs uppercase tracking-wider shadow-sm"
        >
          💾 Confirmar Firma
        </button>
      </div>

      {firmaGuardada && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
          <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
            ✓ Firma digitalizada con éxito para el reporte técnico:
          </p>
          <img 
            src={firmaGuardada} 
            alt="Firma del perito" 
            className="border border-emerald-300 bg-white rounded-lg max-h-20 shadow-inner p-1 object-contain" 
          />
        </div>
      )}
    </div>
  );
}