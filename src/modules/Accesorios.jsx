export default function Accesorios({ peritajeData: data, onChange }) {
  const safeData = data || {};
  const tipoVehiculo = safeData.tipoVehiculo || 'carro';

  // 1. Definir los listados específicos para cada categoría de vehículo
  const listasPorTipo = {
    carro: [
      { id: 'aire', name: 'Aire Acondicionado', presente: true, danado: false },
      { id: 'climatizador', name: 'Climatizador', presente: true, danado: false },
      { id: 'frenos_abs', name: 'Frenos ABS', presente: true, danado: false },
      { id: 'airbags', name: 'Airbags', presente: true, danado: false },
      { id: 'cierre', name: 'Cierre Centralizado', presente: true, danado: false },
      { id: 'llantas', name: 'Llantas', presente: true, danado: false },
      { id: 'neblineros', name: 'Neblineros', presente: true, danado: false },
      { id: 'espejos', name: 'Espejos Eléctricos', presente: true, danado: false },
      { id: 'alza_vidrios', name: 'Alza Vidrios Eléctricos', presente: true, danado: false },
      { id: 'direccion', name: 'Dirección', tipo: 'seleccion_multiple', opciones: ['Asistida', 'Eléctrica', 'Hidráulica'], seleccion: 'Eléctrica' },
      { id: 'techo_corr', name: 'Techo Corredizo', presente: true, danado: false },
      { id: 'techo_pano', name: 'Techo Panorámico', presente: true, danado: false },
      { id: 'crucero', name: 'Velocidad Crucero', presente: true, danado: false },
      { id: 'gps', name: 'GPS', presente: true, danado: false },
      { id: 'bluetooth', name: 'Bluetooth', presente: true, danado: false },
      { id: 'sensor_retro', name: 'Sensor de Retroceso', tipo: 'seleccion_multiple', opciones: ['Solo Sensor', 'Solo Cámara', 'Ambos', 'No'], seleccion: 'Ambos' },
      { id: 'paddle_shift', name: 'Paddle shift', presente: true, danado: false },
      { id: 'asientos_elec', name: 'Asientos Eléctricos', presente: true, danado: false },
      { id: 'radio_orig', name: 'Radio Original', presente: true, danado: false },
      { id: 'segunda_copia', name: 'Segunda copia llave', tipo: 'seleccion_multiple', opciones: ['Sí', 'No'], seleccion: 'No' },
      { id: 'anclaje_isofix', name: 'Anclaje Isofix', presente: true, danado: false },
      { id: 'control_est', name: 'Control de Estabilidad', presente: true, danado: false },
      { id: 'pelicula_seg', name: 'Película de seguridad', presente: true, danado: false },
      { id: 'sensor_lluvia', name: 'Sensor de Lluvia', presente: true, danado: false },
      { id: 'tiro_arrastre', name: 'Tiro de Arrastre', presente: true, danado: false },
      { id: 'volante_ajust', name: 'Volante Ajustable', presente: true, danado: false },
      { id: 'asiento_memoria', name: 'Asiento con memoria', presente: true, danado: false },
      { id: 'tapiz_cuero', name: 'Tapiz de Cuero', presente: true, danado: false },
      { id: 'transmision', name: 'Transmisión', tipo: 'seleccion_multiple', opciones: ['Mecánico', 'Automático'], seleccion: 'Automático' },
      { id: 'traccion', name: 'Tracción', tipo: 'seleccion_multiple', opciones: ['4x2', '4x4'], seleccion: '4x2' },
      { id: 'combustible', name: 'Tipo de combustible', tipo: 'seleccion_multiple', opciones: ['Gasolina', 'Diesel', 'Híbrido', 'Eléctrico'], seleccion: 'Gasolina' },
      { id: 'kit_inflado', name: 'Kit de inflado', tipo: 'seleccion_multiple', opciones: ['Sí', 'No', 'No corresponde'], seleccion: 'No' },
      { id: 'piso_goma', name: 'Piso de goma', tipo: 'seleccion_multiple', opciones: ['Sí (original de la marca)', 'Alternativo', 'Sin piso de goma'], seleccion: 'Sí (original de la marca)' },
      { id: 'tuerca_seg', name: 'Dado y tuerca de seguridad', presente: true, danado: false },
      // Maleta
      { id: 'gato', name: 'Gato hidráulico', presente: true, danado: false },
      { id: 'llave_rueda', name: 'Llave rueda', presente: true, danado: false },
      { id: 'extintor', name: 'Extintor', presente: true, danado: false },
      { id: 'triangulo', name: 'Triángulo', presente: true, danado: false },
      { id: 'botiquin', name: 'Botiquín', presente: true, danado: false },
      { id: 'chaleco', name: 'Chaleco reflectante', presente: true, danado: false },
      { id: 'libro', name: 'Libro de mantenciones', presente: true, danado: false },
      { id: 'repuesto', name: 'Rueda de Repuesto', presente: true, danado: false },
      { id: 'cubre_equipaje', name: 'Cubre equipaje', presente: true, danado: false },
    ],
    moto: [
      { id: 'espejos_moto', name: 'Espejos Retrovisores (Par)', presente: true, danado: false },
      { id: 'herramientas_moto', name: 'Kit de Herramientas Básico', presente: true, danado: false },
      { id: 'pata_apoyo', name: 'Pata Lateral / Central', presente: true, danado: false },
      { id: 'reposapies', name: 'Estribos / Reposapiés', presente: true, danado: false },
      { id: 'tapa_gasolina', name: 'Tapa de Tanque con Llave', presente: true, danado: false },
      { id: 'cadena_transmision', name: 'Kit de Arrastre (Cadena/Piñones)', presente: true, danado: false },
    ],
    motocarro: [
      { id: 'espejos_moto', name: 'Espejos Retrovisores (Par)', presente: true, danado: false },
      { id: 'herramientas_moto', name: 'Kit de Herramientas Básico', presente: true, danado: false },
      { id: 'sillas_pasajeros', name: 'Tapicería / Sillas', presente: true, danado: false },
    ],
    pesado: [
      { id: 'aire', name: 'Aire Acondicionado', presente: true, danado: false },
      { id: 'climatizador', name: 'Climatizador', presente: true, danado: false },
      { id: 'frenos_abs', name: 'Frenos ABS', presente: true, danado: false },
      { id: 'airbags', name: 'Airbags', presente: true, danado: false },
      { id: 'cierre', name: 'Cierre Centralizado', presente: true, danado: false },
      { id: 'llantas', name: 'Llantas', presente: true, danado: false },
      { id: 'neblineros', name: 'Neblineros', presente: true, danado: false },
      { id: 'espejos', name: 'Espejos Eléctricos', presente: true, danado: false },
      { id: 'alza_vidrios', name: 'Alza Vidrios Eléctricos', presente: true, danado: false },
      { id: 'direccion', name: 'Dirección', tipo: 'seleccion_multiple', opciones: ['Asistida', 'Eléctrica', 'Hidráulica'], seleccion: 'Eléctrica' },
      { id: 'techo_corr', name: 'Techo Corredizo', presente: true, danado: false },
      { id: 'techo_pano', name: 'Techo Panorámico', presente: true, danado: false },
      { id: 'crucero', name: 'Velocidad Crucero', presente: true, danado: false },
      { id: 'gps', name: 'GPS', presente: true, danado: false },
      { id: 'bluetooth', name: 'Bluetooth', presente: true, danado: false },
      { id: 'sensor_retro', name: 'Sensor de Retroceso', tipo: 'seleccion_multiple', opciones: ['Solo Sensor', 'Solo Cámara', 'Ambos', 'No'], seleccion: 'Ambos' },
      { id: 'paddle_shift', name: 'Paddle shift', presente: true, danado: false },
      { id: 'asientos_elec', name: 'Asientos Eléctricos', presente: true, danado: false },
      { id: 'radio_orig', name: 'Radio Original', presente: true, danado: false },
      { id: 'segunda_copia', name: 'Segunda copia llave', tipo: 'seleccion_multiple', opciones: ['Sí', 'No'], seleccion: 'No' },
      { id: 'anclaje_isofix', name: 'Anclaje Isofix', presente: true, danado: false },
      { id: 'control_est', name: 'Control de Estabilidad', presente: true, danado: false },
      { id: 'pelicula_seg', name: 'Película de seguridad', presente: true, danado: false },
      { id: 'sensor_lluvia', name: 'Sensor de Lluvia', presente: true, danado: false },
      { id: 'tiro_arrastre', name: 'Tiro de Arrastre', presente: true, danado: false },
      { id: 'volante_ajust', name: 'Volante Ajustable', presente: true, danado: false },
      { id: 'asiento_memoria', name: 'Asiento con memoria', presente: true, danado: false },
      { id: 'tapiz_cuero', name: 'Tapiz de Cuero', presente: true, danado: false },
      { id: 'transmision', name: 'Transmisión', tipo: 'seleccion_multiple', opciones: ['Mecánico', 'Automático'], seleccion: 'Automático' },
      { id: 'traccion', name: 'Tracción', tipo: 'seleccion_multiple', opciones: ['4x2', '4x4'], seleccion: '4x2' },
      { id: 'combustible', name: 'Tipo de combustible', tipo: 'seleccion_multiple', opciones: ['Gasolina', 'Diesel', 'Híbrido', 'Eléctrico'], seleccion: 'Gasolina' },
      { id: 'kit_inflado', name: 'Kit de inflado', tipo: 'seleccion_multiple', opciones: ['Sí', 'No', 'No corresponde'], seleccion: 'No' },
      { id: 'piso_goma', name: 'Piso de goma', tipo: 'seleccion_multiple', opciones: ['Sí (original de la marca)', 'Alternativo', 'Sin piso de goma'], seleccion: 'Sí (original de la marca)' },
      { id: 'tuerca_seg', name: 'Dado y tuerca de seguridad', presente: true, danado: false },
      // Maleta
      { id: 'gato', name: 'Gato hidráulico', presente: true, danado: false },
      { id: 'llave_rueda', name: 'Llave rueda', presente: true, danado: false },
      { id: 'extintor', name: 'Extintor', presente: true, danado: false },
      { id: 'triangulo', name: 'Triángulo', presente: true, danado: false },
      { id: 'botiquin', name: 'Botiquín', presente: true, danado: false },
      { id: 'chaleco', name: 'Chaleco reflectante', presente: true, danado: false },
      { id: 'libro', name: 'Libro de mantenciones', presente: true, danado: false },
      { id: 'repuesto', name: 'Rueda de Repuesto', presente: true, danado: false },
      { id: 'cubre_equipaje', name: 'Cubre equipaje', presente: true, danado: false },
      { id: 'extintor_pesado', name: 'Extintor de Mayor Capacidad', presente: true, danado: false },
      { id: 'botiquin_pesado', name: 'Botiquín Industrial', presente: true, danado: false },
      { id: 'conos_pesados', name: 'Conos y Tacos Viales', presente: true, danado: false },
      { id: 'cinturones_pesado', name: 'Cinturones de Seguridad', presente: true, danado: false },
      { id: 'tacografo', name: 'Tacógrafo / Sistema de Monitoreo', presente: true, danado: false },
    ]
  };

  const listaIdeal = listasPorTipo[tipoVehiculo] || listasPorTipo.carro;

  // Fusiona inteligentemente la información guardada en la base de datos con los ítems ideales del vehículo actual
  const accesoriosActivos = (() => {
    if (!safeData.accesoriosList || safeData.accesoriosList.length === 0) {
      return listaIdeal;
    }
    const coincidencias = safeData.accesoriosList.filter(item => 
      listaIdeal.some(l => l.id === item.id)
    ).length;

    if (coincidencias < listaIdeal.length * 0.3) {
      return listaIdeal;
    }
    return listaIdeal.map(idealItem => {
      const encontrado = safeData.accesoriosList.find(item => item.id === idealItem.id);
      return encontrado ? { ...idealItem, ...encontrado } : idealItem;
    });
  })();

  const handleItemChange = (id, campo, valor) => {
    const listaActualizada = accesoriosActivos.map((item) => {
      if (item.id === id) {
        return { ...item, [campo]: valor };
      }
      return item;
    });
    // Se preservan los demás datos del formulario al actualizar la lista de accesorios
    onChange({ ...safeData, accesoriosList: listaActualizada });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span>🧰</span> Equipamiento Específico ({tipoVehiculo.toUpperCase()})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Se muestran exclusivamente los componentes y accesorios válidos para esta categoría vehicular.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accesoriosActivos.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 pb-1 border-b border-slate-100">
                {item.name}
              </h4>

              <div className="space-y-2 text-xs">
                {item.tipo === 'seleccion_multiple' ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Selección:</label>
                    <select
                      value={item.seleccion !== undefined ? item.seleccion : item.opciones[0]}
                      onChange={(e) => handleItemChange(item.id, 'seleccion', e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50 text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      {item.opciones.map((op, idx) => (
                        <option key={idx} value={op}>{op}</option>
                      ))}
                    </select>
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
                  </div>
                )}

                <div className="pt-2 mt-2 border-t border-slate-50">
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
            </div>

            {item.danado && (
              <div className="mt-3 pt-2 border-t border-red-100 space-y-2 animate-fadeIn">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-xs text-slate-400 font-semibold">$</span>
                  <input 
                    type="number" 
                    placeholder="Costo..."
                    value={item.costoReparacion || ''}
                    onChange={(e) => handleItemChange(item.id, 'costoReparacion', e.target.value)}
                    className="w-full pl-5 pr-2 py-1 text-[11px] border border-red-200 rounded bg-red-50/50 text-red-700 focus:outline-none"
                  />
                </div>
                <textarea 
                  rows="2"
                  placeholder="Comentario..."
                  value={item.comentarioDaño || ''}
                  onChange={(e) => handleItemChange(item.id, 'comentarioDaño', e.target.value)}
                  className="w-full p-1.5 text-[11px] border border-red-200 rounded bg-red-50/50 text-red-700 focus:outline-none"
                />
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}