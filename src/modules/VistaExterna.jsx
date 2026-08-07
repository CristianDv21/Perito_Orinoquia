import { useState } from 'react';

export default function VistaExterna({ peritajeData: data, onChange }) {
  const safeData = data || {};
  const tipoVehiculo = safeData.tipoVehiculo || 'carro'; // Heredado globalmente

  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null);
  
  const [formDano, setFormDano] = useState({
    tipo: 'Ninguno',
    micras: '',
    comentario: '',
    foto: null,
    fotoNombre: ''
  });

  // Catálogo de piezas adaptado por tipo de vehículo
  const piezasPorModelo = {
    carro: [
      { id: 'capo', name: 'Capó / Motor' },
      { id: 'techo', name: 'Techo' },
      { id: 'baul', name: 'Baúl / Compuerta' },
      { id: 'bomper_del', name: 'Bómper Delantero' },
      { id: 'bomper_tras', name: 'Bómper Trasero' },
      { id: 'puerta_del_izq', name: 'Puerta Delantera Izquierda' },
      { id: 'puerta_tras_izq', name: 'Puerta Trasera Izquierda' },
      { id: 'puerta_del_der', name: 'Puerta Delantera Derecha' },
      { id: 'puerta_tras_der', name: 'Puerta Trasera Derecha' },
      { id: 'guardabarro_del_izq', name: 'Guardabarro Delantero Izquierdo' },
      { id: 'guardabarro_tras_izq', name: 'Guardabarro Trasero Izquierdo' },
      { id: 'guardabarro_del_der', name: 'Guardabarro Delantero Derecho' },
      { id: 'guardabarro_tras_der', name: 'Guardabarro Trasero Derecho' },
    ],
    moto: [
      { id: 'carenaje_frontal', name: 'Carenaje / Máscara Frontal' },
      { id: 'guardafango_del', name: 'Guardafango Delantero' },
      { id: 'tanque_gasolina', name: 'Tanque de Gasolina' },
      { id: 'sillon_asiento', name: 'Asiento / Sillín' },
      { id: 'tapa_lateral_izq', name: 'Tapa Lateral Izquierda (Cacha)' },
      { id: 'tapa_lateral_der', name: 'Tapa Lateral Derecha (Cacha)' },
      { id: 'chasis_cuna', name: 'Chasis / Cuna de Dirección' },
      { id: 'tubo_escape', name: 'Tubo de Escape / Mofle' },
      { id: 'guardafango_tras', name: 'Guardafango Trasero' },
    ],
    pesado: [
      { id: 'bomper_pesado', name: 'Bómper y Defensa Frontal' },
      { id: 'parabrisas_pesado', name: 'Parabrisas y Vidrios Cabina' },
      { id: 'capo_motor_pesado', name: 'Capó / Tapa Motor' },
      { id: 'puerta_izq_pesado', name: 'Puerta Conductor' },
      { id: 'puerta_der_pesado', name: 'Puerta Pasajero' },
      { id: 'tanque_combustible_pesado', name: 'Tanques de Combustible' },
      { id: 'furgon_carroceria', name: 'Carrocería / Furgón / Estacas' },
      { id: 'carpa_lona', name: 'Carpa / Lona de Cobertura' },
      { id: 'compuerta_trasera_pesado', name: 'Compuerta / Puertas Traseras' },
    ],
    motocarro: [
      { id: 'carenaje_mcarro', name: 'Carenaje / Frente Motocarro' },
      { id: 'guardafango_del_mcarro', name: 'Guardafango Delantero' },
      { id: 'cabina_mcarro', name: 'Estructura Cabina / Techo' },
      { id: 'puerta_izq_mcarro', name: 'Puerta / Protección Izquierda' },
      { id: 'puerta_der_mcarro', name: 'Puerta / Protección Derecha' },
      { id: 'platoh_carga', name: 'Platón / Bodega de Carga' },
      { id: 'carpa_mcarro', name: 'Carpa Protectora' },
    ]
  };

  const piezasCarroceria = piezasPorModelo[tipoVehiculo] || piezasPorModelo.carro;
  const esVehiculoLivianoPesado = tipoVehiculo === 'carro' || tipoVehiculo === 'pesado';

  const handleSelectPieza = (piezaId) => {
    setPiezaSeleccionada(piezaId);
    if (safeData.danosExternos && safeData.danosExternos[piezaId]) {
      setFormDano({
        tipo: 'Ninguno',
        micras: '',
        comentario: '',
        foto: null,
        fotoNombre: '',
        ...safeData.danosExternos[piezaId]
      });
    } else {
      setFormDano({ tipo: 'Ninguno', micras: '', comentario: '', foto: null, fotoNombre: '' });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormDano(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      const archivo = files[0];
      const lector = new FileReader();
      lector.onload = (evento) => {
        setFormDano(prev => ({ 
          ...prev, 
          foto: evento.target.result, 
          fotoNombre: archivo.name 
        }));
      };
      lector.readAsDataURL(archivo);
    }
  };

  const handleGuardarDano = () => {
    const nuevosDanos = { ...(safeData.danosExternos || {}) };
    
    if (formDano.tipo === 'Ninguno' && !formDano.micras && !formDano.comentario && !formDano.foto) {
      delete nuevosDanos[piezaSeleccionada];
    } else {
      nuevosDanos[piezaSeleccionada] = { ...formDano };
    }

    // Se propaga el estado completo conservando toda la información previa y las imágenes
    if (onChange) {
      onChange({
        ...safeData,
        danosExternos: nuevosDanos
      });
    }
    setPiezaSeleccionada(null);
  };

  const getPiezaColorClass = (piezaId) => {
    const dano = safeData.danosExternos?.[piezaId];
    if (!dano || dano.tipo === 'Ninguno') return 'bg-slate-100 hover:bg-blue-100 border-slate-300 text-slate-700';
    if (dano.tipo === 'Golpe' || dano.tipo === 'Abolladura') return 'bg-red-500 text-white border-red-600 hover:bg-red-600';
    if (dano.tipo === 'Rayón') return 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600';
    if (dano.tipo === 'Repintado') return 'bg-purple-500 text-white border-purple-600 hover:bg-purple-600';
    return 'bg-slate-100';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          💡 <strong>Instrucciones:</strong> Selecciona una pieza en el plano esquemático para registrar rayones, abolladuras y el espesor de pintura en micras.
        </p>
        <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex-shrink-0 ml-2">
          Clase: {tipoVehiculo}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: ESQUEMAS DINÁMICOS */}
        <div className="lg:col-span-7 bg-white p-6 border border-slate-200 rounded-xl space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Plano Esquemático de Inspección ({tipoVehiculo.toUpperCase()})
            </h3>
            
            {/* ESQUEMA DE CARRO */}
            {tipoVehiculo === 'carro' && (
              <div className="w-full max-w-md mx-auto space-y-2 font-mono text-[11px] font-bold">
                <div className="flex justify-center">
                  <button type="button" onClick={() => handleSelectPieza('bomper_del')} className={`w-40 py-3 border rounded-t-2xl transition shadow-sm text-center ${getPiezaColorClass('bomper_del')} ${piezaSeleccionada === 'bomper_del' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Bómper Delantero
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('guardabarro_del_izq')} className={`py-6 border rounded-l-xl transition shadow-sm text-center ${getPiezaColorClass('guardabarro_del_izq')} ${piezaSeleccionada === 'guardabarro_del_izq' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    G. Barro <br/> Del. Izq
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('capo')} className={`py-6 border transition shadow-sm text-center ${getPiezaColorClass('capo')} ${piezaSeleccionada === 'capo' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Capó
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('guardabarro_del_der')} className={`py-6 border rounded-r-xl transition shadow-sm text-center ${getPiezaColorClass('guardabarro_del_der')} ${piezaSeleccionada === 'guardabarro_del_der' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    G. Barro <br/> Del. Der
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('puerta_del_izq')} className={`py-8 border rounded-l-md transition shadow-sm text-center ${getPiezaColorClass('puerta_del_izq')} ${piezaSeleccionada === 'puerta_del_izq' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Puerta Del. Izq
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('techo')} className={`py-8 border h-full transition shadow-sm flex items-center justify-center ${getPiezaColorClass('techo')} ${piezaSeleccionada === 'techo' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Techo
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('puerta_del_der')} className={`py-8 border rounded-r-md transition shadow-sm text-center ${getPiezaColorClass('puerta_del_der')} ${piezaSeleccionada === 'puerta_del_der' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Puerta Del. Der
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('puerta_tras_izq')} className={`py-8 border rounded-l-md transition shadow-sm text-center ${getPiezaColorClass('puerta_tras_izq')} ${piezaSeleccionada === 'puerta_tras_izq' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Puerta Tras. Izq
                  </button>
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded flex items-center justify-center text-slate-300 text-[10px]">Cabina</div>
                  <button type="button" onClick={() => handleSelectPieza('puerta_tras_der')} className={`py-8 border rounded-r-md transition shadow-sm text-center ${getPiezaColorClass('puerta_tras_der')} ${piezaSeleccionada === 'puerta_tras_der' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Puerta Tras. Der
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('guardabarro_tras_izq')} className={`py-6 border rounded-l-xl transition shadow-sm text-center ${getPiezaColorClass('guardabarro_tras_izq')} ${piezaSeleccionada === 'guardabarro_tras_izq' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    G. Barro <br/> Tras. Izq
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('baul')} className={`py-6 border transition shadow-sm text-center ${getPiezaColorClass('baul')} ${piezaSeleccionada === 'baul' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Baúl
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('guardabarro_tras_der')} className={`py-6 border rounded-r-xl transition shadow-sm text-center ${getPiezaColorClass('guardabarro_tras_der')} ${piezaSeleccionada === 'guardabarro_tras_der' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    G. Barro <br/> Tras. Der
                  </button>
                </div>

                <div className="flex justify-center">
                  <button type="button" onClick={() => handleSelectPieza('bomper_tras')} className={`w-40 py-3 border rounded-b-2xl transition shadow-sm text-center ${getPiezaColorClass('bomper_tras')} ${piezaSeleccionada === 'bomper_tras' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Bómper Trasero
                  </button>
                </div>
              </div>
            )}

            {/* ESQUEMA DE MOTO */}
            {tipoVehiculo === 'moto' && (
              <div className="w-full max-w-sm mx-auto space-y-3 font-mono text-[11px] font-bold">
                <div className="flex justify-center">
                  <button type="button" onClick={() => handleSelectPieza('carenaje_frontal')} className={`w-36 py-3 border rounded-t-xl transition shadow-sm text-center ${getPiezaColorClass('carenaje_frontal')} ${piezaSeleccionada === 'carenaje_frontal' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Carenaje Frontal
                  </button>
                </div>
                <div className="flex justify-center">
                  <button type="button" onClick={() => handleSelectPieza('guardafango_del')} className={`w-32 py-2 border rounded transition shadow-sm text-center ${getPiezaColorClass('guardafango_del')} ${piezaSeleccionada === 'guardafango_del' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Guardafango Del.
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('tapa_lateral_izq')} className={`py-6 border rounded-l-xl transition shadow-sm text-center ${getPiezaColorClass('tapa_lateral_izq')} ${piezaSeleccionada === 'tapa_lateral_izq' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Tapa Izq.
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('tanque_gasolina')} className={`py-6 border transition shadow-sm text-center ${getPiezaColorClass('tanque_gasolina')} ${piezaSeleccionada === 'tanque_gasolina' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Tanque
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('tapa_lateral_der')} className={`py-6 border rounded-r-xl transition shadow-sm text-center ${getPiezaColorClass('tapa_lateral_der')} ${piezaSeleccionada === 'tapa_lateral_der' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Tapa Der.
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('sillon_asiento')} className={`py-4 border rounded transition shadow-sm text-center ${getPiezaColorClass('sillon_asiento')} ${piezaSeleccionada === 'sillon_asiento' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Asiento / Sillín
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('chasis_cuna')} className={`py-4 border rounded transition shadow-sm text-center ${getPiezaColorClass('chasis_cuna')} ${piezaSeleccionada === 'chasis_cuna' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Chasis / Cuna
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('tubo_escape')} className={`py-4 border rounded transition shadow-sm text-center ${getPiezaColorClass('tubo_escape')} ${piezaSeleccionada === 'tubo_escape' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Tubo de Escape
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('guardafango_tras')} className={`py-4 border rounded transition shadow-sm text-center ${getPiezaColorClass('guardafango_tras')} ${piezaSeleccionada === 'guardafango_tras' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Guardafango Tras.
                  </button>
                </div>
              </div>
            )}

            {/* ESQUEMA DE PESADO */}
            {tipoVehiculo === 'pesado' && (
              <div className="w-full max-w-md mx-auto space-y-2 font-mono text-[11px] font-bold">
                <div className="flex justify-center">
                  <button type="button" onClick={() => handleSelectPieza('bomper_pesado')} className={`w-48 py-3 border rounded-t-xl transition shadow-sm text-center ${getPiezaColorClass('bomper_pesado')} ${piezaSeleccionada === 'bomper_pesado' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Bómper y Defensa
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('puerta_izq_pesado')} className={`py-6 border rounded-l-xl transition shadow-sm text-center ${getPiezaColorClass('puerta_izq_pesado')} ${piezaSeleccionada === 'puerta_izq_pesado' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Puerta Izq.
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('capo_motor_pesado')} className={`py-6 border transition shadow-sm text-center ${getPiezaColorClass('capo_motor_pesado')} ${piezaSeleccionada === 'capo_motor_pesado' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Capó / Motor
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('puerta_der_pesado')} className={`py-6 border rounded-r-xl transition shadow-sm text-center ${getPiezaColorClass('puerta_der_pesado')} ${piezaSeleccionada === 'puerta_der_pesado' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Puerta Der.
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('parabrisas_pesado')} className={`py-4 border rounded transition shadow-sm text-center ${getPiezaColorClass('parabrisas_pesado')} ${piezaSeleccionada === 'parabrisas_pesado' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Parabrisas / Vidrios
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('tanque_combustible_pesado')} className={`py-4 border rounded transition shadow-sm text-center ${getPiezaColorClass('tanque_combustible_pesado')} ${piezaSeleccionada === 'tanque_combustible_pesado' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Tanques Combustible
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('furgon_carroceria')} className={`py-8 border rounded transition shadow-sm text-center ${getPiezaColorClass('furgon_carroceria')} ${piezaSeleccionada === 'furgon_carroceria' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Furgón / Carrocería
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('carpa_lona')} className={`py-8 border rounded transition shadow-sm text-center ${getPiezaColorClass('carpa_lona')} ${piezaSeleccionada === 'carpa_lona' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Carpa / Lona
                  </button>
                </div>
                <div className="flex justify-center">
                  <button type="button" onClick={() => handleSelectPieza('compuerta_trasera_pesado')} className={`w-48 py-3 border rounded-b-xl transition shadow-sm text-center ${getPiezaColorClass('compuerta_trasera_pesado')} ${piezaSeleccionada === 'compuerta_trasera_pesado' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Compuerta Trasera
                  </button>
                </div>
              </div>
            )}

            {/* ESQUEMA DE MOTOCARRO */}
            {tipoVehiculo === 'motocarro' && (
              <div className="w-full max-w-sm mx-auto space-y-3 font-mono text-[11px] font-bold">
                <div className="flex justify-center">
                  <button type="button" onClick={() => handleSelectPieza('carenaje_mcarro')} className={`w-36 py-3 border rounded-t-xl transition shadow-sm text-center ${getPiezaColorClass('carenaje_mcarro')} ${piezaSeleccionada === 'carenaje_mcarro' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Frente Motocarro
                  </button>
                </div>
                <div className="flex justify-center">
                  <button type="button" onClick={() => handleSelectPieza('guardafango_del_mcarro')} className={`w-32 py-2 border rounded transition shadow-sm text-center ${getPiezaColorClass('guardafango_del_mcarro')} ${piezaSeleccionada === 'guardafango_del_mcarro' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Guardafango Del.
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('puerta_izq_mcarro')} className={`py-6 border rounded-l-xl transition shadow-sm text-center ${getPiezaColorClass('puerta_izq_mcarro')} ${piezaSeleccionada === 'puerta_izq_mcarro' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Protección Izq.
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('puerta_der_mcarro')} className={`py-6 border rounded-r-xl transition shadow-sm text-center ${getPiezaColorClass('puerta_der_mcarro')} ${piezaSeleccionada === 'puerta_der_mcarro' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Protección Der.
                  </button>
                </div>
                <div className="flex justify-center">
                  <button type="button" onClick={() => handleSelectPieza('cabina_mcarro')} className={`w-full py-4 border rounded transition shadow-sm text-center ${getPiezaColorClass('cabina_mcarro')} ${piezaSeleccionada === 'cabina_mcarro' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Estructura Cabina / Techo
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => handleSelectPieza('platoh_carga')} className={`py-6 border rounded transition shadow-sm text-center ${getPiezaColorClass('platoh_carga')} ${piezaSeleccionada === 'platoh_carga' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Platón de Carga
                  </button>
                  <button type="button" onClick={() => handleSelectPieza('carpa_mcarro')} className={`py-6 border rounded transition shadow-sm text-center ${getPiezaColorClass('carpa_mcarro')} ${piezaSeleccionada === 'carpa_mcarro' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                    Carpa Protectora
                  </button>
                </div>
              </div>
            )}

          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-slate-100 text-xs font-semibold">
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-slate-100 border border-slate-300 rounded"></span><span className="text-slate-500">Sin Daños</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-amber-500 rounded"></span><span className="text-slate-500">Rayón</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-red-500 rounded"></span><span className="text-slate-500">Golpe/Abolladura</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-purple-500 rounded"></span><span className="text-slate-500">Repintado</span></div>
          </div>
        </div>

        {/* COLUMNA DERECHA: PANEL DE EDICIÓN DE DAÑO */}
        <div className="lg:col-span-5">
          {piezaSeleccionada ? (
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-950 space-y-4 sticky top-4 animate-slideIn">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-widest">Evaluando Pieza</span>
                <h3 className="text-base font-bold tracking-tight mt-0.5">
                  {piezasCarroceria.find(p => p.id === piezaSeleccionada)?.name}
                </h3>
              </div>

              <hr className="border-slate-800" />

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tipo de Hallazgo</label>
                <select name="tipo" value={formDano.tipo} onChange={handleFormChange} className="w-full p-2.5 text-xs font-bold bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                  <option value="Ninguno">Ninguno (Pieza Sana)</option>
                  <option value="Rayón">Rayón / Raspadura</option>
                  <option value="Abolladura">Abolladura Leve</option>
                  <option value="Golpe">Golpe / Deformación Alta</option>
                  <option value="Repintado">Repintado / Masillado</option>
                </select>
              </div>

              {esVehiculoLivianoPesado && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Espesor de Pintura (Micras μm)</label>
                  <input type="number" name="micras" value={formDano.micras} onChange={handleFormChange} placeholder="Ej: 110" className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white font-mono placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Anotaciones Específicas</label>
                <textarea name="comentario" value={formDano.comentario} onChange={handleFormChange} rows="3" placeholder="Detalles del daño..." className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-1.5">Foto de Evidencia</label>
                <input type="file" name="foto" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-blue-400 hover:file:bg-slate-700 cursor-pointer" />
                
                {formDano.foto && (
                  <div className="mt-2 space-y-2">
                    <p className="text-[11px] text-emerald-400 font-mono">✓ Cargada: {formDano.fotoNombre || 'evidencia.jpg'}</p>
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-800">
                      <img src={formDano.foto} alt="Vista previa" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex space-x-2">
                <button type="button" onClick={() => setPiezaSeleccionada(null)} className="w-1/3 py-2 text-xs font-bold uppercase tracking-wider border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-800 transition">
                  Cancelar
                </button>
                <button type="button" onClick={handleGuardarDano} className="w-2/3 py-2 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                  Aplicar Cambios
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-300 p-8 rounded-xl text-center h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
              <span className="text-3xl mb-2">🎨</span>
              <p className="text-xs font-bold uppercase tracking-wider">Ninguna Pieza Seleccionada</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Toca cualquier componente en el esquema para registrar daños.</p>
              
              {Object.keys(safeData.danosExternos || {}).length > 0 && (
                <div className="w-full mt-6 pt-4 border-t border-slate-100 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Resumen de daños ({Object.keys(safeData.danosExternos).length}):</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {Object.entries(safeData.danosExternos).map(([piezaKey, val]) => (
                      <div key={piezaKey} className="flex justify-between items-center text-xs py-1.5 px-2 bg-slate-50 border rounded font-medium">
                        <span className="text-slate-700 font-bold">{piezasCarroceria.find(p => p.id === piezaKey)?.name || piezaKey}</span>
                        <div className="flex items-center space-x-2">
                          {val.foto && <span className="text-[10px] text-emerald-600 font-bold">🖼️ Foto</span>}
                          <span className="text-slate-500 font-mono">{val.tipo} {val.micras ? `(${val.micras} μm)` : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}