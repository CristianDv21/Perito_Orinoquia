import { useState } from 'react';

// COMPONENTE PRINCIPAL: EVALUACIÓN DE VISTA INTERNA Y HABITÁCULO
export default function VistaInterna({ data, onChange }) {
  const safeData = data || {};

  // Estado local para rastrear qué zona de la silletería está seleccionada en el mapa interactivo
  const [selectedAsiento, setSelectedAsiento] = useState('piloto');

  // Manejador genérico para actualizar campos raíz
  const handleInputChange = (field, value) => {
    if (onChange) {
      onChange({ [field]: value });
    }
  };

  // Manejador específico para los componentes del habitáculo
  const handleInternoItemChange = (itemKey, field, value) => {
    const currentItems = safeData.sistemasInternos || {};
    const updatedItems = {
      ...currentItems,
      [itemKey]: {
        ...(currentItems[itemKey] || { estado: 'OPERATIVO', observaciones: '' }),
        [field]: value
      }
    };
    handleInputChange('sistemasInternos', updatedItems);
  };

  // Manejador para el estado específico de cada zona de la silletería
  const handleSilleteriaChange = (asientoKey, field, value) => {
    const currentSilleteria = safeData.silleteriaData || {};
    const updatedSilleteria = {
      ...currentSilleteria,
      [asientoKey]: {
        ...(currentSilleteria[asientoKey] || { estado: 'Buen Estado', material: 'Cuero', observaciones: '' }),
        [field]: value
      }
    };
    handleInputChange('silleteriaData', updatedSilleteria);
  };

  // Clase de diseño estándar y uniforme
  const inputStyle = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition duration-150";
  
  // Clases compartidas para los selectores de diagnóstico tipo pastilla (Pills)
  const pillBase = "px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition duration-150 cursor-pointer flex-1 text-center select-none";

  // Listado de componentes internos a inspeccionar
  const itemsInternos = [
    { key: 'testigosTablero', label: 'Testigos de Alerta en Tablero (Check Engine, Airbag, ABS)' },
    { key: 'odometro', label: 'Funcionamiento de Odómetro y Clúster de Instrumentos' },
    { key: 'pitoClaxon', label: 'Funcionamiento del Pito / Claxon' },
    { key: 'lucesInteriores', label: 'Iluminación de Cortesía y Luces del Techo' },
    { key: 'limpiaparabrisas', label: 'Comando de Limpiaparabrisas (Velocidades / Agua)' },
    { key: 'cinturones', label: 'Cinturones de Seguridad (Anclajes y Retracción)' },
    { key: 'bloqueoCentral', label: 'Bloqueo Central y Seguros Eléctricos' },
    { key: 'manijasCerraduras', label: 'Manijas Internas y Cerraduras de Puertas' },
  ];

  // Configuración de los asientos para el plano esquemático
  const asientosConfig = [
    { id: 'piloto', label: 'Piloto', gridClass: 'col-start-1 row-start-1' },
    { id: 'copiloto', label: 'Copiloto', gridClass: 'col-start-2 row-start-1' },
    { id: 'trasero_izq', label: 'Trasero Izq.', gridClass: 'col-start-1 row-start-2' },
    { id: 'trasero_central', label: 'Trasero Central', gridClass: 'col-start-1 col-span-2 row-start-3' },
    { id: 'trasero_der', label: 'Trasero Der.', gridClass: 'col-start-2 row-start-2' },
  ];

  // Obtener el estado actual del asiento seleccionado en el formulario dinámico
  const currentAsientoState = safeData.silleteriaData?.[selectedAsiento] || { estado: 'Buen Estado', material: 'Cuero', observaciones: '' };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* 🧭 SECCIÓN 1: CHECKLIST DE COMPONENTES INTERNOS */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Inspección de Mandos y Sistemas del Habitáculo
        </h3>

        <div className="divide-y divide-slate-100">
          {itemsInternos.map((item) => {
            const itemState = safeData.sistemasInternos?.[item.key] || { estado: 'OPERATIVO', observaciones: '' };
            
            return (
              <div key={item.key} className="py-4 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fadeIn">
                
                {/* Nombre del sistema interno */}
                <div className="lg:w-1/3">
                  <span className="text-xs font-bold text-slate-700 block">{item.label}</span>
                </div>

                {/* Controles de estado y notas */}
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:w-2/3 w-full">
                  
                  {/* Selector de Estado (Pills) */}
                  <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto min-w-[260px] gap-1">
                    <button
                      type="button"
                      onClick={() => handleInternoItemChange(item.key, 'estado', 'FUNCIONAL')}
                      className={`${pillBase} ${itemState.estado === 'FUNCIONAL' ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Funcional
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInternoItemChange(item.key, 'estado', 'DEFECTUOSO')}
                      className={`${pillBase} ${itemState.estado === 'DEFECTUOSO' ? 'bg-rose-500 border-rose-600 text-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Falla
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInternoItemChange(item.key, 'estado', 'N/A')}
                      className={`${pillBase} ${itemState.estado === 'N/A' ? 'bg-slate-300 border-slate-400 text-slate-700 shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      N/A
                    </button>
                  </div>

                  {/* Detalle del hallazgo */}
                  <div className="flex-1 w-full">
                    <input 
                      type="text" 
                      placeholder="Describa si hay bombillos quemados, botones rotos o fallas..."
                      value={itemState.observaciones || ''}
                      onChange={(e) => handleInternoItemChange(item.key, 'observaciones', e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 💺 NUEVA SECCIÓN: PLANO INTERACTIVO DE SILLETERÍA Y COJINERÍA */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Evaluación y Mapeo de Silletería (Cojinería)
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Columna Izquierda: Esquema Interactivo de Distribución del Habitáculo */}
          <div className="lg:col-span-5 bg-slate-50 p-6 rounded-xl border border-slate-200/60 flex flex-col items-center justify-center min-h-[280px]">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-6 text-center">
              Seleccione la zona a evaluar en el plano
            </p>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-[240px]">
              {asientosConfig.map((asiento) => {
                const estadoAsiento = safeData.silleteriaData?.[asiento.id]?.estado || 'Buen Estado';
                const isSelected = selectedAsiento === asiento.id;
                
                // Color dinámico del mapa según el estado registrado en ese asiento
                let estadoColorClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";
                if (estadoAsiento === 'Roto / Quemado') estadoColorClass = "bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100";
                if (estadoAsiento === 'Manchado / Sucio') estadoColorClass = "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100";
                
                return (
                  <button
                    key={asiento.id}
                    type="button"
                    onClick={() => setSelectedAsiento(asiento.id)}
                    className={`
                      ${asiento.gridClass} ${estadoColorClass}
                      p-4 text-[11px] font-bold rounded-xl border-2 transition duration-150 flex flex-col items-center justify-center gap-1.5 shadow-sm
                      ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 border-transparent scale-105 z-10' : ''}
                    `}
                  >
                    <span className="text-lg">💺</span>
                    <span className="text-center leading-tight">{asiento.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Columna Derecha: Formulario de Estado del Asiento Seleccionado */}
          <div className="lg:col-span-7 bg-white p-2 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-4 bg-blue-50/50 border border-blue-100 p-3 rounded-lg">
                <span className="text-base">📝</span>
                <p className="text-xs font-bold text-blue-900">
                  Evaluando: <span className="uppercase text-blue-600 font-extrabold">{asientosConfig.find(a => a.id === selectedAsiento)?.label}</span>
                </p>
              </div>

              <div className="space-y-4">
                {/* Diagnóstico del tapizado */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Estado del Tapizado</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full">
                    {['Buen Estado', 'Manchado / Sucio', 'Roto / Quemado'].map((estado) => (
                      <button
                        key={estado}
                        type="button"
                        onClick={() => handleSilleteriaChange(selectedAsiento, 'estado', estado)}
                        className={`
                          ${pillBase} 
                          ${currentAsientoState.estado === estado 
                            ? estado === 'Buen Estado' ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' :
                              estado === 'Manchado / Sucio' ? 'bg-amber-500 border-amber-600 text-white shadow-sm' : 
                              'bg-rose-500 border-rose-600 text-white shadow-sm'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                          }
                        `}
                      >
                        {estado}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tipo de Material de Cojinería */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Material</label>
                    <select
                      value={currentAsientoState.material || 'Cuero'}
                      onChange={(e) => handleSilleteriaChange(selectedAsiento, 'material', e.target.value)}
                      className={inputStyle}
                    >
                      <option value="Cuero">Cuero Original</option>
                      <option value="Tela">Tela / Paño</option>
                      <option value="Sintetico">Sintético / Vinilcuero</option>
                      <option value="Alcantara">Alcántara</option>
                    </select>
                  </div>

                  {/* Observación puntual por pieza */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Detalle de Daños</label>
                    <input
                      type="text"
                      placeholder="Ej. Desgaste en la oreja izquierda..."
                      value={currentAsientoState.observaciones || ''}
                      onChange={(e) => handleSilleteriaChange(selectedAsiento, 'observaciones', e.target.value)}
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium">
              * Nota: Los cambios realizados se guardan automáticamente en la estructura interna de sincronización del peritaje.
            </p>
          </div>
        </div>
      </div>

      {/* 📊 SECCIÓN 3: LECTURAS Y DATOS DE CONTROL */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Lecturas de Tablero y Control de Mandos
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Kilometraje Actual *</label>
            <div className="relative flex items-center">
              <input 
                type="number" 
                placeholder="Ej. 85000"
                value={safeData.kilometraje || ''} 
                onChange={(e) => handleInputChange('kilometraje', e.target.value)}
                className={`${inputStyle} pr-12 font-mono font-bold text-blue-600 text-right`}
                required
              />
              <span className="absolute right-3 text-[10px] font-extrabold text-slate-400 uppercase select-none pointer-events-none">
                KM
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Estado de las Llaves / Comandos</label>
            <select 
              value={safeData.estadoLlaves || ''} 
              onChange={(e) => handleInputChange('estadoLlaves', e.target.value)}
              className={inputStyle}
            >
              <option value="">Seleccione una opción...</option>
              <option value="originalDuplicado">Posee Llave Original y Duplicado Operativos</option>
              <option value="soloOriginal">Posee Únicamente Llave Original</option>
              <option value="controlFalla">Tiene llave pero el control remoto no funciona</option>
              <option value="llaveCopia">Posee solo una copia sencilla (Sin chip/control)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📝 SECCIÓN 4: RESUMEN DE LA INSPECCIÓN INTERNA */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Concepto Final del Habitáculo y Mandos
        </h3>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Notas y Observaciones de la Vista Interna</label>
          <textarea 
            rows="3" 
            placeholder="Registre observaciones específicas sobre el estado del sistema eléctrico interno, testigos encendidos permanentemente o mal funcionamiento de mandos..."
            value={safeData.comentariosVistaInterna || ''} 
            onChange={(e) => handleInputChange('comentariosVistaInterna', e.target.value)}
            className={`${inputStyle} resize-none`}
          />
        </div>
      </div>

    </div>
  );
}