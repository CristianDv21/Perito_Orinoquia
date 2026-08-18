export default function Motor({ peritajeData: data, onChange }) {
  const safeData = data || {};
  const tipoVehiculo = safeData.tipoVehiculo || safeData.tipo_vehiculo || 'carro';

  let parsedSistemas = safeData.sistemasMecanicos || safeData.sistemas_mecanicos || {};
  if (typeof parsedSistemas === 'string') {
    try {
      parsedSistemas = JSON.parse(parsedSistemas);
    } catch {
      parsedSistemas = {};
    }
  }

  const kilometraje = safeData.kilometraje ?? '';
  const cilindraje = safeData.cilindraje ?? safeData.cilindraje ?? '';
  const tipoTransmision = safeData.tipoTransmision ?? safeData.tipo_transmision ?? '';
  const traccion = safeData.traccion ?? '';
  const estadoTransmision = safeData.estadoTransmision ?? safeData.estado_transmision ?? '';
  const comentariosMotor = safeData.comentariosMotor ?? safeData.comentarios_motor ?? '';

  const handleInputChange = (field, value) => {
    if (!onChange) return;
    onChange({
      ...safeData,
      [field]: value
    });
  };

  const handleMecanicoItemChange = (itemKey, field, value) => {
    const currentItem = parsedSistemas[itemKey] || { estado: '', observaciones: '' };

    handleInputChange('sistemasMecanicos', {
      ...parsedSistemas,
      [itemKey]: {
        ...currentItem,
        [field]: value
      }
    });
  };

  const inputStyle = 'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition duration-150';
  const pillBase = 'px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg border transition duration-150 cursor-pointer flex-1 text-center select-none';

  const itemsPorModelo = {
    carro: [
      { key: 'fugasMotor', label: 'Estanqueidad del Motor (Fugas de Aceite)' },
      { key: 'fugasRefrigerante', label: 'Sistema de Refrigeración (Fugas / Radiador)' },
      { key: 'ruidosMotor', label: 'Componentes Internos (Ruidos / Cascabeleo)' },
      { key: 'correas', label: 'Correas de Accesorios (Estado / Tensión)' },
      { key: 'soportesMotor', label: 'Soportes de Motor y Caja' },
      { key: 'sistemaEscape', label: 'Sistema de Escape (Humo / Roturas)' },
      { key: 'bateria', label: 'Sistema Eléctrico y Batería (Bornes / Voltaje)' }
    ],
    moto: [
      { key: 'fugasMotor', label: 'Estanqueidad del Motor (Fugas de Aceite / Empaques)' },
      { key: 'ruidosMotor', label: 'Componentes Internos (Ruidos de Válvulas / Cadena de Distribución)' },
      { key: 'transmisionSecundaria', label: 'Kit de Arrastre (Cadena, Sprocket / Correa)' },
      { key: 'sistemaEscape', label: 'Sistema de Escape / Mofle' },
      { key: 'bateria', label: 'Sistema Eléctrico y Batería (Carga / C.G.)' }
    ],
    pesado: [
      { key: 'fugasMotor', label: 'Estanqueidad del Motor (Fugas de Aceite / Turbo)' },
      { key: 'fugasRefrigerante', label: 'Sistema de Refrigeración (Intercooler / Radiador / Mangueras)' },
      { key: 'ruidosMotor', label: 'Componentes Internos (Ruidos de Motor / Operación)' },
      { key: 'correas', label: 'Correas y Tensores' },
      { key: 'soportesMotor', label: 'Soportes de Motor y Chasis' },
      { key: 'sistemaEscape', label: 'Sistema de Escape y Freno de Acometida / Motor' },
      { key: 'bateria', label: 'Sistema Eléctrico y Baterías (24V / Bornes)' }
    ],
    motocarro: [
      { key: 'fugasMotor', label: 'Estanqueidad del Motor y Reversa' },
      { key: 'fugasRefrigerante', label: 'Sistema de Refrigeración (Si aplica por agua/aire)' },
      { key: 'ruidosMotor', label: 'Componentes Internos / Embrague Centrífugo' },
      { key: 'transmisionSecundaria', label: 'Eje de Transmisión / Cardán / Cadena' },
      { key: 'sistemaEscape', label: 'Sistema de Escape' },
      { key: 'bateria', label: 'Sistema Eléctrico y Batería' }
    ]
  };

  const itemsMecanicos = itemsPorModelo[tipoVehiculo] || itemsPorModelo.carro;

  const getCilindrosConfig = () => {
    if (tipoVehiculo === 'moto') return [1];
    if (tipoVehiculo === 'motocarro') return [1, 2];
    return [1, 2, 3, 4];
  };

  const cilindrosActivos = getCilindrosConfig();

  return (
    <div className="space-y-6 text-slate-800">
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Inspección de Componentes Mecánicos ({tipoVehiculo.toUpperCase()})
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">
            Clase: {tipoVehiculo}
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {itemsMecanicos.map((item) => {
            const itemState = parsedSistemas[item.key] || {
              estado: '',
              observaciones: ''
            };

            return (
              <div key={item.key} className="py-4 first:pt-0 last:pb-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="lg:w-1/3">
                  <span className="text-xs font-bold text-slate-700 block">{item.label}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 lg:w-2/3 w-full">
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

      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Parámetros de Motor, Transmisión y Tracción
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div className="max-w-xs">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">
              Lectura Actual del Odómetro (KM)
            </label>
            <input
              type="number"
              min="0"
              placeholder="Ej. 15000"
              value={kilometraje}
              onChange={(e) => handleInputChange('kilometraje', e.target.value)}
              className={`${inputStyle} font-mono font-bold text-blue-600`}
            />
          </div>
          <div className="max-w-xs">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">
              Cilindraje
            </label>
            <input
              type="text"
              placeholder="Ej. 1500cc"
              value={cilindraje}
              onChange={(e) => handleInputChange('cilindraje', e.target.value)} // <--- Cámbialo a 'cilindraje'
              className={`${inputStyle} font-mono font-bold text-blue-600`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">
              Tipo de Transmisión
            </label>
            <select
              value={tipoTransmision}
              onChange={(e) => handleInputChange('tipoTransmision', e.target.value)}
              className={inputStyle}
            >
              <option value="">Seleccione opción...</option>
              {tipoVehiculo === 'moto' ? (
                <>
                  <option value="mecanicaCadena">Mecánica con Embrague Manual</option>
                  <option value="semiautomatica">Semicentrifuga / Semicautomática</option>
                  <option value="automaticaScooter">Automática (CVT / Scooter)</option>
                </>
              ) : (
                <>
                  <option value="mecanica">Mecánica / Manual</option>
                  <option value="automatica">Automática (Convertidor de par)</option>
                  <option value="cvt">Automática (CVT)</option>
                  <option value="dobleEmbrague">Doble Embrague (DCT / DSG)</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">
              Tipo de Tracción
            </label>
            <select
              value={traccion}
              onChange={(e) => handleInputChange('traccion', e.target.value)}
              className={inputStyle}
            >
              <option value="">Seleccione opción...</option>
              {tipoVehiculo === 'moto' ? (
                <>
                  <option value="cadena">Transmisión por Cadena</option>
                  <option value="correa">Transmisión por Correa</option>
                  <option value="cardan">Transmisión por Cardán</option>
                </>
              ) : (
                <>
                  <option value="FWD">Delantera (FWD)</option>
                  <option value="RWD">Trasera (RWD)</option>
                  <option value="AWD">Integral Inteligente (AWD)</option>
                  <option value="4WD">Doble Tracción 4x4 (4WD)</option>
                  <option value="4x2">Tracción Simple (4x2)</option>
                </>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">
              Estado del Conjunto / Caja
            </label>
            <select
              value={estadoTransmision}
              onChange={(e) => handleInputChange('estadoTransmision', e.target.value)}
              className={inputStyle}
            >
              <option value="">Seleccione opción...</option>
              <option value="operativo">Operación Suave y Correcta</option>
              <option value="patina">Desgastado / Patina</option>
              <option value="golpeteo">Golpeteo / Tirones al cambiar</option>
              <option value="ruidoRodamiento">Ruido de rodamiento interno</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wide">
            Lectura de Compresión (PSI)
          </label>
          <div className={`grid grid-cols-2 ${cilindrosActivos.length > 2 ? 'sm:grid-cols-4' : 'sm:grid-cols-2'} gap-3 max-w-2xl`}>
            {cilindrosActivos.map((num) => {
              const campoCamel = `compresionCil${num}`;
              const campoSnake = `compresion_cil_${num}`;
              const campoSnake2 = `compresion_cil${num}`;

              let valor = safeData[campoCamel] ?? safeData[campoSnake] ?? safeData[campoSnake2];
              if (typeof valor === 'object') valor = '';

              return (
                <div key={num} className="relative flex items-center">
                  <span className="absolute left-3 text-[10px] font-extrabold text-slate-400 uppercase select-none">
                    Cil {num}
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="000"
                    value={valor ?? ''}
                    onChange={(e) => handleInputChange(campoCamel, e.target.value)}
                    className={`${inputStyle} pl-12 text-right font-mono font-bold text-blue-600`}
                  />
                </div>
              );
            })}
          </div>
          <span className="text-[10px] text-slate-400 mt-1.5 block font-medium">
            * Ingrese los valores obtenidos con el manómetro/compresómetro para el motor de {cilindrosActivos.length} cilindro(s).
          </span>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Resumen Técnico del Conjunto Motor
        </h3>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">
            Notas y Concepto Mecánico Final
          </label>
          <textarea
            rows="3"
            placeholder="Registre observaciones finales sobre el estado operativo del motor, si requiere reparaciones urgentes, sincronización o cambios de fluidos..."
            value={comentariosMotor}
            onChange={(e) => handleInputChange('comentariosMotor', e.target.value)}
            className={`${inputStyle} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}