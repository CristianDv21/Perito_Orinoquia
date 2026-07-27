// COMPONENTE PRINCIPAL: EVALUACIÓN MECÁNICA Y MOTOR
export default function Motor({ data, onChange }) {
  const safeData = data || {};

  // Manejador genérico para actualizar campos raíz
  const handleInputChange = (field, value) => {
    if (onChange) {
      onChange({ [field]: value });
    }
  };

  // Manejador específico para los componentes mecánicos del checklist
  const handleMecanicoItemChange = (itemKey, field, value) => {
    const currentItems = safeData.sistemasMecanicos || {};
    const updatedItems = {
      ...currentItems,
      [itemKey]: {
        ...(currentItems[itemKey] || { estado: 'BUENO', observaciones: '' }),
        [field]: value
      }
    };
    handleInputChange('sistemasMecanicos', updatedItems);
  };

  // Clase de diseño estándar y uniforme (idéntica a Documentación y Accesorios)
  const inputStyle = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition duration-150";
  
  // Clases compartidas para los selectores de diagnóstico tipo pastilla (Pills)
  const pillBase = "px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition duration-150 cursor-pointer flex-1 text-center select-none";

  // Listado de sistemas mecánicos clave a inspeccionar bajo el capó
  const itemsMecanicos = [
    { key: 'fugasMotor', label: 'Estanqueidad del Motor (Fugas de Aceite)' },
    { key: 'fugasRefrigerante', label: 'Sistema de Refrigeración (Fugas / Radiador)' },
    { key: 'ruidosMotor', label: 'Componentes Internos (Ruidos / Cascabeleo)' },
    { key: 'correas', label: 'Correas de Accesorios (Estado / Tensión)' },
    { key: 'soportesMotor', label: 'Soportes de Motor y Caja' },
    { key: 'sistemaEscape', label: 'Sistema de Escape (Humo / Roturas)' },
    { key: 'bateria', label: 'Sistema Eléctrico y Batería (Bornes / Voltaje)' },
  ];

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* ⚙️ SECCIÓN 1: ESTADO DE COMPONENTES BAJO EL CAPÓ */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Inspección de Componentes Mecánicos
        </h3>

        <div className="divide-y divide-slate-100">
          {itemsMecanicos.map((item) => {
            const itemState = safeData.sistemasMecanicos?.[item.key] || { estado: 'BUENO', observaciones: '' };
            
            return (
              <div key={item.key} className="py-4 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fadeIn">
                
                {/* Nombre del sistema o pieza */}
                <div className="lg:w-1/3">
                  <span className="text-xs font-bold text-slate-700 block">{item.label}</span>
                </div>

                {/* Controles de estado y notas */}
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:w-2/3 w-full">
                  
                  {/* Selector de Diagnóstico (Pills) */}
                  <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto min-w-[240px] gap-1">
                    <button
                      type="button"
                      onClick={() => handleMecanicoItemChange(item.key, 'estado', 'BUENO')}
                      className={`${pillBase} ${itemState.estado === 'BUENO' ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Bueno
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMecanicoItemChange(item.key, 'estado', 'REGULAR')}
                      className={`${pillBase} ${itemState.estado === 'REGULAR' ? 'bg-amber-500 border-amber-600 text-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Regular
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMecanicoItemChange(item.key, 'estado', 'MALO')}
                      className={`${pillBase} ${itemState.estado === 'MALO' ? 'bg-rose-500 border-rose-600 text-white shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                      Malo
                    </button>
                  </div>

                  {/* Detalle o gravedad del hallazgo */}
                  <div className="flex-1 w-full">
                    <input 
                      type="text" 
                      placeholder="Describa la anomalía, goteo o pieza afectada..."
                      value={itemState.observaciones || ''}
                      onChange={(e) => handleMecanicoItemChange(item.key, 'observaciones', e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📊 SECCIÓN 2: COMPRESIÓN DE CILINDROS Y TRANSMISIÓN */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Parámetros de Motor y Transmisión
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Tipo de Transmisión</label>
            <select 
              value={safeData.tipoTransmision || ''} 
              onChange={(e) => handleInputChange('tipoTransmision', e.target.value)}
              className={inputStyle}
            >
              <option value="">Seleccione una opción...</option>
              <option value="mecanica">Mecánica / Manual</option>
              <option value="automatica">Automática (Convertidor de par)</option>
              <option value="cvt">Automática (CVT)</option>
              <option value="dobleEmbrague">Doble Embrague (DCT / DSG)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Estado del Embrague / Caja de Cambios</label>
            <select 
              value={safeData.estadoTransmision || ''} 
              onChange={(e) => handleInputChange('estadoTransmision', e.target.value)}
              className={inputStyle}
            >
              <option value="">Seleccione una opción...</option>
              <option value="operativo">Operación Suave y Correcta</option>
              <option value="patina">Embrague Desgastado (Patina)</option>
              <option value="golpeteo">Golpeteo / Tirones al cambiar</option>
              <option value="ruidoRodamiento">Ruido de rodamiento interno</option>
            </select>
          </div>
        </div>

        {/* Datos técnicos de compresión (Inputs numéricos alineados) */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wide">Lectura de Compresión (PSI)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="relative flex items-center">
                <span className="absolute left-3 text-[10px] font-extrabold text-slate-400 uppercase select-none">
                  Cil {num}
                </span>
                <input 
                  type="number" 
                  placeholder="000"
                  value={safeData[`compresionCil${num}`] || ''} 
                  onChange={(e) => handleInputChange(`compresionCil${num}`, e.target.value)}
                  className={`${inputStyle} pl-12 text-right font-mono font-bold text-blue-600`}
                />
              </div>
            ))}
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block font-medium">
            * Ingrese los valores obtenidos con el manómetro/compresómetro.
          </span>
        </div>
      </div>

      {/* 📝 SECCIÓN 3: DICTAMEN FINAL DEL MOTOR */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Resumen Técnico del Conjunto Motor
        </h3>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Notas y Concepto Mecánico Final</label>
          <textarea 
            rows="3" 
            placeholder="Registre observaciones finales sobre el estado operativo del motor, si requiere reparaciones urgentes, sincronización o cambios de fluidos..."
            value={safeData.comentariosMotor || ''} 
            onChange={(e) => handleInputChange('comentariosMotor', e.target.value)}
            className={`${inputStyle} resize-none`}
          />
        </div>
      </div>

    </div>
  );
}