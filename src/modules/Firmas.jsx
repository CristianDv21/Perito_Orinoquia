import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function ModuloFirma() {
  const padFirma = useRef({});
  const [firmaGuardada, setFirmaGuardada] = useState(null);

  // Función para limpiar el recuadro y volver a firmar
  const limpiarFirma = () => {
    padFirma.current.clear();
    setFirmaGuardada(null);
  };

  // Función para guardar el trazo como imagen
  const guardarFirma = () => {
    if (padFirma.current.isEmpty()) {
      alert("Por favor, inserte una firma primero.");
      return;
    }
    // Convierte el dibujo en una URL de imagen base64
    const urlImagenFirma = padFirma.current.getTrimmedCanvas().toDataURL('image/png');
    setFirmaGuardada(urlImagenFirma);
  };

  return (
    <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#fff' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
        🖋️ Registro de Firma Digital del Perito
      </h3>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '15px' }}>
        Dibuje su firma dentro del recuadro usando el mouse o la pantalla táctil de su dispositivo.
      </p>

      {/* Contenedor del lienzo de dibujo */}
      <div style={{ border: '2px dashed #000', borderRadius: '4px', width: '100%', maxWidth: '500px', backgroundColor: '#fafafa' }}>
        <SignatureCanvas 
          ref={padFirma}
          penColor='black'
          canvasProps={{
            width: 500, 
            height: 150, 
            className: 'sigCanvas',
            style: { width: '100%', height: '150px' }
          }}
        />
      </div>

      {/* Botones de acción del módulo ajustados a tu diseño */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
        <button 
          type="button"
          onClick={limpiarFirma}
          style={{ 
            padding: '8px 20px', 
            backgroundColor: '#ffffff', 
            color: '#ef4444', 
            border: '1px solid #fca5a5', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: '700',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s'
          }}
        >
          ♻️ Volver a Intentar
        </button>
        
        <button 
          type="button"
          onClick={guardarFirma}
          style={{ 
            padding: '8px 20px', 
            backgroundColor: '#00c789', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: '700',
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s'
          }}
        >
          💾 Confirmar Firma
        </button>
      </div>

      {/* Vista previa de la firma procesada */}
      {firmaGuardada && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
          <p style={{ fontSize: '13px', color: '#2e7d32', fontWeight: 'bold', margin: '0 0 5px 0' }}>
            ✓ Firma digitalizada con éxito para el reporte técnico:
          </p>
          <img 
            src={firmaGuardada} 
            alt="Firma del perito" 
            style={{ border: '1px solid #aaa', backgroundColor: '#fff', maxHeight: '80px' }} 
          />
        </div>
      )}
    </div>
  );
}