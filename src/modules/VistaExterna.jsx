import { useState } from 'react';

export default function VistaExterna({ data, onChange }) {
  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null);
  
  // Estado local para el formulario de la pieza activa
  const [formDano, setFormDano] = useState({
    tipo: 'Ninguno',
    micras: '',
    comentario: '',
    foto: null
  });

  // Lista de piezas del mapa interactivo
  const piezasCarroceria = [
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
  ];

  // Al hacer clic en una pieza del mapa
  const handleSelectPieza = (piezaId) => {
    setPiezaSeleccionada(piezaId);
    // Si la pieza ya tenía un daño registrado, cargar sus datos en el formulario local
    if (data.danosExternos && data.danosExternos[piezaId]) {
      setFormDano(data.danosExternos[piezaId]);
    } else {
      setFormDano({ tipo: 'Ninguno', micras: '', comentario: '', foto: null });
    }
  };

  // Manejar cambios en el formulario del daño
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormDano(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      setFormDano(prev => ({ ...prev, foto: files[0] }));
    }
  };

  // Guardar el daño en el estado global del Dashboard
  const handleGuardarDano = () => {
    const nuevosDanos = { ...data.danosExternos };
    
    if (formDano.tipo === 'Ninguno' && !formDano.micras && !formDano.comentario) {
      // Si se limpia el formulario, remover la pieza de los daños
      delete nuevosDanos[piezaSeleccionada];
    } else {
      // Registrar o actualizar los datos de la pieza
      nuevosDanos[piezaSeleccionada] = { ...formDano };
    }

    onChange({ danosExternos: nuevosDanos });
    setPiezaSeleccionada(null); // Deseleccionar pieza tras guardar
  };

  // Retorna el color de la pieza en el mapa según el tipo de daño registrado
  const getPiezaColorClass = (piezaId) => {
    const dano = data.danosExternos?.[piezaId];
    if (!dano || dano.tipo === 'Ninguno') return 'bg-slate-100 hover:bg-blue-100 border-slate-300 text-slate-700';
    if (dano.tipo === 'Golpe' || dano.tipo === 'Abolladura') return 'bg-red-500 text-white border-red-600 hover:bg-red-600';
    if (dano.tipo === 'Rayón') return 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600';
    if (dano.tipo === 'Repintado') return 'bg-purple-500 text-white border-purple-600 hover:bg-purple-600';
    return 'bg-slate-100';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-500 font-medium">
          💡 <strong>Instrucciones:</strong> Selecciona una pieza en el mapa interactivo de la izquierda para evaluar su estado, registrar abolladuras, rayones y el grosor de la capa de pintura en micras.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: MAPA INTERACTIVO DE CARROCERÍA */}
        <div className="lg:col-span-7 bg-white p-6 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 w-full text-left">Plano Esquemático de Inspección</h3>
          
          <div className="w-full max-w-md space-y-2 font-mono text-[11px] font-bold">
            {/* Frente */}
            <div className="flex justify-center">
              <button type="button" onClick={() => handleSelectPieza('bomper_del')} className={`w-40 py-3 border rounded-t-2xl transition shadow-sm text-center ${getPiezaColorClass('bomper_del')} ${piezaSeleccionada === 'bomper_del' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                Bómper Delantero
              </button>
            </div>

            {/* Capó e Izq/Der Delanteros */}
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

            {/* Puertas Delanteras y Techo */}
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

            {/* Puertas Traseras */}
            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => handleSelectPieza('puerta_tras_izq')} className={`py-8 border rounded-l-md transition shadow-sm text-center ${getPiezaColorClass('puerta_tras_izq')} ${piezaSeleccionada === 'puerta_tras_izq' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                Puerta Tras. Izq
              </button>
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded flex items-center justify-center text-slate-300 text-[10px]">Cabina</div>
              <button type="button" onClick={() => handleSelectPieza('puerta_tras_der')} className={`py-8 border rounded-r-md transition shadow-sm text-center ${getPiezaColorClass('puerta_tras_der')} ${piezaSeleccionada === 'puerta_tras_der' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                Puerta Tras. Der
              </button>
            </div>

            {/* Baúl y Guardabarros Traseros */}
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

            {/* Trasera */}
            <div className="flex justify-center">
              <button type="button" onClick={() => handleSelectPieza('bomper_tras')} className={`w-40 py-3 border rounded-b-2xl transition shadow-sm text-center ${getPiezaColorClass('bomper_tras')} ${piezaSeleccionada === 'bomper_tras' ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}>
                Bómper Trasero
              </button>
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 pt-4 border-t border-slate-100 text-xs font-semibold">
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-slate-100 border border-slate-300 rounded"></span><span className="text-slate-500">Sin Daños</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-amber-500 rounded"></span><span className="text-slate-500">Rayón</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-red-500 rounded"></span><span className="text-slate-500">Golpe/Abolladura</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-purple-500 rounded"></span><span className="text-slate-500">Repintado</span></div>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
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

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Espesor de Pintura (Micras μm)</label>
                <input type="number" name="micras" value={formDano.micras} onChange={handleFormChange} placeholder="Ej: 110" className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white font-mono placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Anotaciones Específicas</label>
                <textarea name="comentario" value={formDano.comentario} onChange={handleFormChange} rows="3" placeholder="Detalles del daño..." className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-1.5">Foto de Evidencia</label>
                <input type="file" name="foto" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-blue-400 hover:file:bg-slate-700 cursor-pointer" />
                {formDano.foto && <p className="text-[11px] text-emerald-400 mt-1 font-mono">✓ Cargada: {formDano.foto.name}</p>}
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
            <div className="bg-white border border-dashed border-slate-300 p-8 rounded-xl text-center h-full flex flex-col items-center justify-center text-slate-400">
              <span className="text-3xl mb-2">🎨</span>
              <p className="text-xs font-bold uppercase tracking-wider">Ninguna Pieza Seleccionada</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Toca cualquier componente del vehículo en el esquema de la izquierda para registrar daños o lecturas de pintura.</p>
              
              {Object.keys(data.danosExternos || {}).length > 0 && (
                <div className="w-full mt-6 pt-4 border-t border-slate-100 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Resumen de daños ({Object.keys(data.danosExternos).length}):</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                    {Object.entries(data.danosExternos).map(([piezaKey, val]) => (
                      <div key={piezaKey} className="flex justify-between text-xs py-1 px-2 bg-slate-50 border rounded font-medium">
                        <span className="text-slate-700 font-bold">{piezasCarroceria.find(p => p.id === piezaKey)?.name}</span>
                        <span className="text-slate-500 font-mono">{val.tipo} {val.micras ? `(${val.micras} μm)` : ''}</span>
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