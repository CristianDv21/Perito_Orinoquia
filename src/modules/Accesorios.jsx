
export default function Accesorios({ data, onChange }) {
  
  // Manejador para el checklist de accesorios
  const handleAccesoriosChange = (id, campo) => {
    const listaActualizada = data.accesoriosList.map((item) => {
      if (item.id === id) {
        return { ...item, [campo]: !item[campo] };
      }
      return item;
    });
    onChange({ accesoriosList: listaActualizada });
  };

  // Manejador para la matriz detallada de llantas
  const handleLlantaChange = (posicion, campo, value) => {
    const llantasActualizadas = {
      ...data.llantasData,
      [posicion]: {
        ...data.llantasData[posicion],
        [campo]: value
      }
    };
    onChange({ llantasData: llantasActualizadas });
  };

  // Agrupar los accesorios por categoría para renderizarlos de forma organizada
  const categorias = ["Interior", "Seguridad", "Exterior", "Tecnología", "Herramientas / Maleta"];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* SECCIÓN 1: CHECKLIST DE ACCESORIOS */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          🧰 Checklist de Accesorios y Equipamiento
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categorias.map((cat) => {
            const itemsCat = data.accesoriosList.filter(item => item.categoria === cat);
            if (itemsCat.length === 0) return null;

            return (
              <div key={cat} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3 pb-1 border-b border-slate-100">
                  {cat}
                </h4>
                <div className="space-y-2">
                  {itemsCat.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input type="checkbox" checked={item.presente} onChange={() => handleAccesoriosChange(item.id, 'presente')} className="h-3.5 w-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                          <span className="text-[11px] font-medium text-slate-500">Presente</span>
                        </label>
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input type="checkbox" checked={item.danado} onChange={() => handleAccesoriosChange(item.id, 'danado')} className="h-3.5 w-3.5 text-red-600 border-slate-300 rounded focus:ring-red-500" />
                          <span className={`text-[11px] font-bold ${item.danado ? 'text-red-600' : 'text-slate-400'}`}>Mal Estado</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: CONTROL PROFUNDO DE LLANTAS */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>⭕</span> Evaluación de Llantas (Estado y Labrado)
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider bg-slate-50">
                <th className="p-3">Posición</th>
                <th className="p-3">Marca</th>
                <th className="p-3">Dimensión/Medida</th>
                <th className="p-3">Profundidad (mm)</th>
                <th className="p-3">Vida Útil (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(data.llantasData).map(([posKey, llanta]) => {
                const etiquetasPos = {
                  delantera_der: "Delantera Derecha",
                  delantera_izq: "Delantera Izquierda",
                  trasera_der: "Trasera Derecha",
                  trasera_izq: "Trasera Izquierda",
                  repuesto: "Repuesto / Auxiliar"
                };

                return (
                  <tr key={posKey} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-bold text-slate-700">{etiquetasPos[posKey]}</td>
                    <td className="p-2">
                      <input type="text" value={llanta.marca} onChange={(e) => handleLlantaChange(posKey, 'marca', e.target.value)} placeholder="Ej: Michelin" className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500" />
                    </td>
                    <td className="p-2">
                      <input type="text" value={llanta.medida} onChange={(e) => handleLlantaChange(posKey, 'medida', e.target.value)} placeholder="Ej: 205/55 R16" className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 font-mono" />
                    </td>
                    <td className="p-2">
                      <input type="number" step="0.1" value={llanta.profundidad_mm} onChange={(e) => handleLlantaChange(posKey, 'profundidad_mm', e.target.value)} placeholder="mm" className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 font-mono" />
                    </td>
                    <td className="p-2">
                      <select value={llanta.porcentaje_vida} onChange={(e) => handleLlantaChange(posKey, 'porcentaje_vida', e.target.value)} className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700">
                        <option value="">Seleccionar</option>
                        <option value="100">100% (Nueva)</option>
                        <option value="75">75% (Bueno)</option>
                        <option value="50">50% (Media Vida)</option>
                        <option value="25">25% (Límite Legal)</option>
                        <option value="0">0% (Lisa / Cambiar)</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* OBSERVACIONES DE ACCESORIOS */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Observaciones Generales de Accesorios</label>
        <textarea value={data.accesoriosObservaciones || ''} onChange={(e) => onChange({ accesoriosObservaciones: e.target.value })} rows="2" placeholder="Notas sobre herramientas faltantes, kits de carretera vencidos..." className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white" />
      </div>

    </div>
  );
}