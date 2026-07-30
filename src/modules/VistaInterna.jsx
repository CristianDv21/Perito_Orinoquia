import { useState } from 'react';

export default function VistaInterna({ data, onChange }) {
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  
  const [formCabina, setFormCabina] = useState({
    estado: 'Óptimo',
    desgaste: 'Normal',
    comentario: '',
  });

  const zonasInternas = [
    { id: 'tapiceria_del', name: 'Silletería / Tapicería Delantera' },
    { id: 'tapiceria_tras', name: 'Silletería / Tapicería Trasera' },
    { id: 'tablero', name: 'Tablero de Instrumentos y Testigos' },
    { id: 'volante', name: 'Volante y Columnas de Dirección' },
    { id: 'cinturones', name: 'Cinturones de Seguridad y Airbags' },
    { id: 'cielo', name: 'Cielo raso / Tapizado de techo' },
    { id: 'alfombras', name: 'Alfombras y Pisos' },
    { id: 'paneles_puertas', name: 'Paneles y Tapizados de Puertas' },
  ];

  const handleSelectZona = (zonaId) => {
    setZonaSeleccionada(zonaId);
    if (data.danosInternos && data.danosInternos[zonaId]) {
      setFormCabina(data.danosInternos[zonaId]);
    } else {
      setFormCabina({ estado: 'Óptimo', desgaste: 'Normal', comentario: '' });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormCabina(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardarZona = () => {
    const nuevosDanos = { ...(data.danosInternos || {}) };
    if (formCabina.estado === 'Óptimo' && !formCabina.comentario) {
      delete nuevosDanos[zonaSeleccionada];
    } else {
      nuevosDanos[zonaSeleccionada] = { ...formCabina };
    }
    onChange({ danosInternos: nuevosDanos });
    setZonaSeleccionada(null);
  };

  const getZonaColorClass = (zonaId) => {
    const info = data.danosInternos?.[zonaId];
    if (!info || info.estado === 'Óptimo') return 'bg-slate-100 hover:bg-blue-100 border-slate-300 text-slate-700';
    if (info.estado === 'Regular') return 'bg-amber-500 text-white border-amber-600';
    if (info.estado === 'Dañado') return 'bg-red-500 text-white border-red-600';
    return 'bg-slate-100';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-500 font-medium">
          💡 <strong>Instrucciones:</strong> Selecciona un componente de la cabina en el panel izquierdo para evaluar el estado de conservación, desgaste o anomalías en la electrónica interior.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ZONAS DE CABINA */}
        <div className="lg:col-span-7 bg-white p-6 border border-slate-200 rounded-xl flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 w-full text-left">Distribución Interior de Cabina</h3>
          
          <div className="w-full max-w-md space-y-3 font-mono text-[11px] font-bold">
            <div className="grid grid-cols-2 gap-3">
              {zonasInternas.map((zona) => (
                <button
                  key={zona.id}
                  type="button"
                  onClick={() => handleSelectZona(zona.id)}
                  className={`py-5 px-3 border rounded-xl transition shadow-sm text-center flex items-center justify-center ${getZonaColorClass(zona.id)} ${zonaSeleccionada === zona.id ? 'ring-4 ring-blue-500 border-blue-500' : ''}`}
                >
                  {zona.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8 pt-4 border-t border-slate-100 text-xs font-semibold">
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-slate-100 border border-slate-300 rounded"></span><span className="text-slate-500">Óptimo / Sin Daño</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-amber-500 rounded"></span><span className="text-slate-500">Desgaste Regular</span></div>
            <div className="flex items-center space-x-1.5"><span className="w-3 h-3 bg-red-500 rounded"></span><span className="text-slate-500">Dañado / Roto</span></div>
          </div>
        </div>

        {/* FORMULARIO DE EVALUACIÓN INTERNA */}
        <div className="lg:col-span-5">
          {zonaSeleccionada ? (
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-950 space-y-4 sticky top-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-widest">Inspección Cabina</span>
                <h3 className="text-base font-bold tracking-tight mt-0.5">
                  {zonasInternas.find(z => z.id === zonaSeleccionada)?.name}
                </h3>
              </div>

              <hr className="border-slate-800" />

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estado del Componente</label>
                <select name="estado" value={formCabina.estado} onChange={handleFormChange} className="w-full p-2.5 text-xs font-bold bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                  <option value="Óptimo">Óptimo / Buen Estado</option>
                  <option value="Regular">Desgaste Regular</option>
                  <option value="Dañado">Dañado / Inoperativo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nivel de Desgaste</label>
                <select name="desgaste" value={formCabina.desgaste} onChange={handleFormChange} className="w-full p-2.5 text-xs font-bold bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                  <option value="Mínimo">Mínimo / Muy Conservado</option>
                  <option value="Normal">Normal acorde al kilometraje</option>
                  <option value="Acelerado">Acelerado / Maltrato evidente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Observaciones de Cabina</label>
                <textarea name="comentario" value={formCabina.comentario} onChange={handleFormChange} rows="3" placeholder="Detalles de roturas, manchas o fallas eléctricas..." className="w-full p-2.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="pt-2 flex space-x-2">
                <button type="button" onClick={() => setZonaSeleccionada(null)} className="w-1/3 py-2 text-xs font-bold uppercase tracking-wider border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-800 transition">
                  Cancelar
                </button>
                <button type="button" onClick={handleGuardarZona} className="w-2/3 py-2 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition">
                  Guardar Zona
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[300px]">
              <span className="text-3xl mb-2">👈</span>
              <p className="text-xs font-bold uppercase tracking-wide">Selecciona un elemento en el plano interior para registrar su estado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}