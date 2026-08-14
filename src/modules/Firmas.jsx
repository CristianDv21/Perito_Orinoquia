import { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function ModuloFirma({ peritajeData, onChange }) {
  const safeData = peritajeData || {};
  const padFirma = useRef(null);
  const containerRef = useRef(null);

  const [firmaGuardada, setFirmaGuardada] = useState(() => {
    const imagenes = safeData.imagenes || [];
    const firmaExistente = imagenes.find(img => img.seccion === 'firma_inspector');
    return firmaExistente ? firmaExistente.imagen_base64 : (safeData.firmaInspector || null);
  });

  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 150 });

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

    if (onChange) {
      const imagenesActuales = safeData.imagenes || [];
      const nuevasImagenes = imagenesActuales.filter(img => img.seccion !== 'firma_inspector');
      onChange({ 
        ...safeData,
        firmaInspector: null,
        imagenes: nuevasImagenes 
      });
    }
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
        const imagenesActuales = safeData.imagenes || [];
        const index = imagenesActuales.findIndex(img => img.seccion === 'firma_inspector');
        
        let nuevasImagenes = [...imagenesActuales];
        const objetoFirma = {
          seccion: 'firma_inspector',
          item_id: null,
          imagen_base64: urlImagenFirma,
          nombre_archivo: 'firma_inspector.png'
        };

        if (index >= 0) {
          nuevasImagenes[index] = objetoFirma;
        } else {
          nuevasImagenes.push(objetoFirma);
        }

        onChange({
          ...safeData,
          firmaInspector: urlImagenFirma,
          imagenes: nuevasImagenes
        });
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