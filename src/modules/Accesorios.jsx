export default function Accesorios({ data, onChange }) {

  // Manejador genérico para actualizar los campos del ítem
  const handleItemChange = (id, campo, valor) => {
    const listaActualizada = data.accesoriosList.map((item) => {
      if (item.id === id) {
        return { ...item, [campo]: valor };
      }
      return item;
    });
    onChange({ accesoriosList: listaActualizada });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      {/* Encabezado */}
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-base font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <span>🧰</span> Accesorios y Equipamiento del Vehículo
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Complete la evaluación detallada de cada componente del vehículo según los requerimientos.
        </p>
      </div>

      {/* Grid con todos los elementos tal cual las fotos del cliente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.accesoriosList?.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Título del accesorio */}
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 pb-1 border-b border-slate-100">
                {item.name}
              </h4>

              {/* Opciones según el tipo */}
              <div className="space-y-2 text-xs">
                {item.tipo === 'seleccion_multiple' ? (
                  <div className="space-y-1.5">
                    {item.opciones.map((opt) => (
                      <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name={`radio-${item.id}`}
                          checked={item.seleccion === opt}
                          onChange={() => handleItemChange(item.id, 'seleccion', opt)}
                          className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span className="text-slate-600 font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input 
                          type="radio" 
                          name={`estado-${item.id}`}
                          checked={item.presente === true}
                          onChange={() => handleItemChange(item.id, 'presente', true)}
                          className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span className="text-slate-600 font-medium">Sí</span>
                      </label>

                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input 
                          type="radio" 
                          name={`estado-${item.id}`}
                          checked={item.presente === false}
                          onChange={() => handleItemChange(item.id, 'presente', false)}
                          className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span className="text-slate-600 font-medium">No</span>
                      </label>
                    </div>

                    {/* Checkbox de Dañado */}
                    <div className="pt-1 mt-1 border-t border-slate-50">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={item.danado || false}
                          onChange={(e) => handleItemChange(item.id, 'danado', e.target.checked)}
                          className="h-3.5 w-3.5 text-red-600 border-slate-300 rounded focus:ring-red-500"
                        />
                        <span className={`text-[11px] font-bold ${item.danado ? 'text-red-600' : 'text-slate-400'}`}>
                          Dañado / Mal Estado
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campos de Costo y Comentario si está Dañado */}
            {item.danado && (
              <div className="mt-3 pt-2 border-t border-red-100 space-y-2 animate-fadeIn">
                {/* Input de Costo de Reparación con el símbolo $ */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-xs text-slate-400 font-semibold">$</span>
                  <input 
                    type="number" 
                    placeholder="Costo reparación..."
                    value={item.costoReparacion || ''}
                    onChange={(e) => handleItemChange(item.id, 'costoReparacion', e.target.value)}
                    className="w-full pl-5 pr-2 py-1 text-[11px] border border-red-200 rounded bg-red-50/50 text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Textarea de Comentario */}
                <textarea 
                  rows="2"
                  placeholder="Comentario (30)..."
                  value={item.comentarioDaño || ''}
                  onChange={(e) => handleItemChange(item.id, 'comentarioDaño', e.target.value)}
                  className="w-full p-1.5 text-[11px] border border-red-200 rounded bg-red-50/50 text-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Observaciones Generales */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-6">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
          Observaciones Generales de Accesorios y Maleta
        </label>
        <textarea 
          value={data.accesoriosObservaciones || ''} 
          onChange={(e) => onChange({ accesoriosObservaciones: e.target.value })} 
          rows="3" 
          placeholder="Escriba notas adicionales..." 
          className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50/50 focus:ring-1 focus:ring-blue-500 focus:outline-none" 
        />
      </div>

    </div>
  );
}