export default function Accesorios({ data, onChange }) {
  // Lista por defecto de respaldo
  const defaultItems = [
    { id: "aire", name: "Aire Acondicionado / Climatizador", categoria: "Interior", presente: true, danado: false },
    { id: "abs", name: "Frenos ABS", categoria: "Seguridad", presente: true, danado: false },
    { id: "airbag", name: "Airbags Piloto/Copiloto", categoria: "Seguridad", presente: true, danado: false },
    { id: "vidrios", name: "Alza Vidrios Eléctricos", categoria: "Interior", presente: true, danado: false },
    { id: "alarma", name: "Alarma y Bloqueo Central", categoria: "Seguridad", presente: true, danado: false },
    { id: "camara", name: "Cámara de Reversa", categoria: "Tecnología", presente: false, danado: false },
    { id: "sensores", name: "Sensores de Parqueo", categoria: "Tecnología", presente: false, danado: false },
    { id: "radio", name: "Pantalla / Radio Bluetooth", categoria: "Tecnología", presente: true, danado: false },
    { id: "retrovisores", name: "Retrovisores Eléctricos", categoria: "Exterior", presente: true, danado: false },
    { id: "gato", name: "Gato Hidráulico y Palanca", categoria: "Herramientas / Maleta", presente: true, danado: false },
    { id: "repuesto", name: "Llanta de Repuesto", categoria: "Herramientas / Maleta", presente: true, danado: false },
    { id: "cruceta", name: "Cruceta de Pernos", categoria: "Herramientas / Maleta", presente: true, danado: false },
  ];

  // Garantizamos que las variables existan para evitar pantallas en blanco
  const safeData = data || {};
  const items = Array.isArray(safeData.accesoriosList) ? safeData.accesoriosList : defaultItems;
  const llantas = safeData.llantasData || { presente: true, danado: false, foto: null };
  const observaciones = safeData.accesoriosObservaciones || "";
  const costoReparacion = safeData.accesoriosCosto || 0;

  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });

    if (onChange) {
      onChange({ accesoriosList: updatedItems });
    }
  };

  const handleLlantasChange = (field, value) => {
    if (onChange) {
      onChange({
        llantasData: {
          ...llantas,
          [field]: value
        }
      });
    }
  };

  const handleFotoLlanta = (e) => {
    if (e.target.files && e.target.files[0] && onChange) {
      const fileUrl = URL.createObjectURL(e.target.files[0]);
      onChange({
        llantasData: {
          ...llantas,
          foto: fileUrl
        }
      });
    }
  };

  const itemsDanados = items.filter((item) => item.presente && item.danado);

  return (
    <div className="space-y-8 text-slate-800">
      
      {/* 📋 SECCIÓN 1: CHECKLIST DE ACCESORIOS */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Evaluación de Accesorios y Equipamiento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-150 rounded-lg">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 block">{item.name}</span>
                <span className="text-[9px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-semibold uppercase">
                  {item.categoria}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 shrink-0">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={!!item.presente}
                    onChange={(e) => handleItemChange(item.id, "presente", e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" 
                  />
                  <span className="text-xs font-semibold text-slate-500">¿Está?</span>
                </label>

                {item.presente && (
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!item.danado}
                      onChange={(e) => handleItemChange(item.id, "danado", e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4 border-red-300" 
                    />
                    <span className={`text-xs font-bold ${item.danado ? "text-red-500" : "text-slate-400"}`}>
                      ⚠️ Dañado
                    </span>
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚗 SECCIÓN 2: INSPECCIÓN DE LLANTAS */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Inspección de Llantas y Rines
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!llantas.presente}
                  onChange={(e) => handleLlantasChange("presente", e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" 
                />
                <span className="text-xs font-bold text-slate-600">Llantas registradas</span>
              </label>

              {llantas.presente && (
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={!!llantas.danado}
                    onChange={(e) => handleLlantasChange("danado", e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 w-4 h-4" 
                  />
                  <span className="text-xs font-bold text-red-600">Presentan daño</span>
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Evidencia Labrado / Rines</label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100/50 transition">
                <span className="text-xl">📸</span>
                <span className="text-[10px] text-slate-500 font-bold mt-1">Cámara / Archivo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFotoLlanta} 
                />
              </label>
              {llantas.foto && (
                <div className="w-20 h-20 border border-slate-200 rounded-lg overflow-hidden relative">
                  <img src={llantas.foto} alt="Llantas" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => handleLlantasChange("foto", null)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-[9px] p-0.5"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📊 SECCIÓN 3: CONSOLIDACIÓN DE AVERÍAS */}
      <div className="bg-slate-900 text-white rounded-xl p-6 space-y-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-3">
          Resumen de Equipamiento Dañado
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Lista de Accesorios con Daño</span>
            {itemsDanados.length > 0 || llantas.danado ? (
              <ul className="space-y-1.5 max-h-[140px] overflow-y-auto pr-2">
                {itemsDanados.map((item) => (
                  <li key={item.id} className="text-xs font-bold text-red-300 flex items-center space-x-2">
                    <span>•</span> <span>{item.name}</span>
                  </li>
                ))}
                {llantas.danado && (
                  <li className="text-xs font-bold text-red-300 flex items-center space-x-2">
                    <span>•</span> <span>Llantas (Desgaste/Daño)</span>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-xs font-semibold text-slate-400 italic">No se registraron daños en el equipamiento.</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Costo Estimado Reparación ($ COP)</label>
              <input 
                type="number"
                placeholder="Ej. 300000"
                value={costoReparacion}
                onChange={(e) => {
                  if (onChange) {
                    onChange({ accesoriosCosto: parseFloat(e.target.value) || 0 });
                  }
                }}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Observaciones Generales</label>
              <textarea 
                rows="2"
                placeholder="Comentarios adicionales sobre el inventario..."
                value={observaciones}
                onChange={(e) => {
                  if (onChange) {
                    onChange({ accesoriosObservaciones: e.target.value });
                  }
                }}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}