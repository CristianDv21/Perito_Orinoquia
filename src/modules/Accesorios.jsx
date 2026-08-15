export default function Accesorios({ peritajeData: data, onChange }) {
  const safeData = data || {};

  const resolverTipoVehiculo = (valor) => {
    if (valor && typeof valor === 'object') {
      valor = valor.id || valor.codigo || valor.slug || valor.nombre || valor.name;
    }

    const v = String(valor || '').toLowerCase().trim();

    if (v === '7c68a26d-372b-42dc-be00-92c4ed2ee6ce' || v === 'moto' || v.includes('moto')) return 'moto'; if (v === 'd5017832-04ac-4ead-8f57-efbe8af78860' || v === 'pesado' || v.includes('pesado') || v.includes('carga') || v.includes('camion') || v.includes('camión')) return 'pesado';
    if (v === 'e8ca5ff6-fe17-4916-b949-c13cac3a706e' || v === 'motocarro' || v.includes('motocarro')) return 'motocarro';
    return 'carro';
  };

  const tipoValor =
    safeData.tipoVehiculoId ||
    safeData.tipo_vehiculo_id ||
    safeData.tipoVehiculo ||
    safeData.tipo_vehiculo;

  const tipoVehiculo = resolverTipoVehiculo(tipoValor);

  const tipoVehiculoId =
    typeof tipoValor === 'object'
      ? tipoValor?.id || tipoValor?.tipo_vehiculo_id || ''
      : tipoValor || '';

  const accesoriosCarro = [
    { id: 'aire', name: 'Aire Acondicionado' },
    { id: 'climatizador', name: 'Climatizador' },
    { id: 'frenos_abs', name: 'Frenos ABS' },
    { id: 'airbags', name: 'Airbags' },
    { id: 'cierre', name: 'Cierre Centralizado' },
    { id: 'llantas', name: 'Llantas' },
    { id: 'neblineros', name: 'Neblineros' },
    { id: 'espejos', name: 'Espejos Eléctricos' },
    { id: 'alza_vidrios', name: 'Alza Vidrios Eléctricos' },
    { id: 'direccion', name: 'Dirección', tipo: 'seleccion_multiple', opciones: ['Asistida', 'Eléctrica', 'Hidráulica'] },
    { id: 'techo_corr', name: 'Techo Corredizo' },
    { id: 'techo_pano', name: 'Techo Panorámico' },
    { id: 'crucero', name: 'Velocidad Crucero' },
    { id: 'gps', name: 'GPS' },
    { id: 'bluetooth', name: 'Bluetooth' },
    { id: 'sensor_retro', name: 'Sensor de Retroceso', tipo: 'seleccion_multiple', opciones: ['Solo Sensor', 'Solo Cámara', 'Ambos', 'No'] },
    { id: 'paddle_shift', name: 'Paddle shift' },
    { id: 'asientos_elec', name: 'Asientos Eléctricos' },
    { id: 'radio_orig', name: 'Radio Original' },
    { id: 'segunda_copia', name: 'Segunda copia llave', tipo: 'seleccion_multiple', opciones: ['Sí', 'No'] },
    { id: 'anclaje_isofix', name: 'Anclaje Isofix' },
    { id: 'control_est', name: 'Control de Estabilidad' },
    { id: 'pelicula_seg', name: 'Película de seguridad' },
    { id: 'sensor_lluvia', name: 'Sensor de Lluvia' },
    { id: 'tiro_arrastre', name: 'Tiro de Arrastre' },
    { id: 'volante_ajust', name: 'Volante Ajustable' },
    { id: 'asiento_memoria', name: 'Asiento con memoria' },
    { id: 'tapiz_cuero', name: 'Tapiz de Cuero' },
    { id: 'transmision', name: 'Transmisión', tipo: 'seleccion_multiple', opciones: ['Mecánico', 'Automático'] },
    { id: 'traccion', name: 'Tracción', tipo: 'seleccion_multiple', opciones: ['4x2', '4x4'] },
    { id: 'combustible', name: 'Tipo de combustible', tipo: 'seleccion_multiple', opciones: ['Gasolina', 'Diesel', 'Híbrido', 'Eléctrico'] },
    { id: 'kit_inflado', name: 'Kit de inflado', tipo: 'seleccion_multiple', opciones: ['Sí', 'No', 'No corresponde'] },
    { id: 'piso_goma', name: 'Piso de goma', tipo: 'seleccion_multiple', opciones: ['Sí (original de la marca)', 'Alternativo', 'Sin piso de goma'] },
    { id: 'tuerca_seg', name: 'Dado y tuerca de seguridad' },
    { id: 'gato', name: 'Gato hidráulico' },
    { id: 'llave_rueda', name: 'Llave rueda' },
    { id: 'extintor', name: 'Extintor' },
    { id: 'triangulo', name: 'Triángulo' },
    { id: 'botiquin', name: 'Botiquín' },
    { id: 'chaleco', name: 'Chaleco reflectante' },
    { id: 'libro', name: 'Libro de mantenciones' },
    { id: 'repuesto', name: 'Rueda de Repuesto' },
    { id: 'cubre_equipaje', name: 'Cubre equipaje' }
  ];

  const accesoriosMoto = [
    { id: 'espejos_moto', name: 'Espejos Retrovisores (Par)' },
    { id: 'herramientas_moto', name: 'Kit de Herramientas Básico' },
    { id: 'pata_apoyo', name: 'Pata Lateral / Central' },
    { id: 'reposapies', name: 'Estribos / Reposapiés' },
    { id: 'tapa_gasolina', name: 'Tapa de Tanque con Llave' },
    { id: 'cadena_transmision', name: 'Kit de Arrastre (Cadena/Piñones)' }
  ];

  const accesoriosMotocarro = [
    { id: 'espejos_moto', name: 'Espejos Retrovisores (Par)' },
    { id: 'herramientas_moto', name: 'Kit de Herramientas Básico' },
    { id: 'sillas_pasajeros', name: 'Tapicería / Sillas' }
  ];

  const accesoriosPesado = [
    ...accesoriosCarro,
    { id: 'extintor_pesado', name: 'Extintor de Mayor Capacidad' },
    { id: 'botiquin_pesado', name: 'Botiquín Industrial' },
    { id: 'conos_pesados', name: 'Conos y Tacos Viales' },
    { id: 'cinturones_pesado', name: 'Cinturones de Seguridad' },
    { id: 'tacografo', name: 'Tacógrafo / Sistema de Monitoreo' }
  ];

  const listasPorTipo = {
    carro: accesoriosCarro,
    moto: accesoriosMoto,
    motocarro: accesoriosMotocarro,
    pesado: accesoriosPesado
  };

  const listaIdeal = listasPorTipo[tipoVehiculo] || accesoriosCarro;

  const guardados = safeData.accesoriosList ?? safeData.accesorios ?? [];
  const accesoriosGuardados = Array.isArray(guardados) ? guardados : [];

  const normalizar = (valor) => String(valor ?? '').trim().toLowerCase();

  const convertirBooleano = (valor) => {
    if (valor === true || valor === 1 || valor === '1') return true;
    if (typeof valor === 'string') {
      return ['true', 'si', 'sí', 'yes', 'on'].includes(valor.toLowerCase().trim());
    }
    return false;
  };

const buscarGuardado = (idealItem) => {
    const idealId = normalizar(idealItem.id);
    const idealName = normalizar(idealItem.name);

    return accesoriosGuardados.find((item) => {
      const catalogo = item.catalogo_accesorio || item.catalogoAccesorio || {};

      const valoresParaComparar = [
        item.id,
        item.codigo,
        item.slug,
        item.name,
        item.nombre,
        catalogo.id,
        catalogo.codigo,
        catalogo.slug,
        catalogo.nombre,
        catalogo.name,
        // Si el backend guarda el identificador en otra propiedad:
        item.catalogo_accesorio_id,
        item.catalogoAccesorioId
      ].map(normalizar).filter(Boolean);

      // Compara si alguna de las propiedades del registro guardado coincide con el ID o el nombre del frontend
      return valoresParaComparar.includes(idealId) || valoresParaComparar.includes(idealName);
    });
  };

  const accesoriosActivos = listaIdeal.map((idealItem) => {
    const guardado = buscarGuardado(idealItem);

    if (!guardado) {
      return {
        ...idealItem,
        db_id: null,
        catalogo_accesorio_id: null,
        presente: false,
        danado: false,
        seleccion: '',
        costoReparacion: '',
        comentarioDaño: ''
      };
    }

    const catalogo = guardado.catalogo_accesorio || guardado.catalogoAccesorio || {};

    return {
      ...idealItem,
      
      db_id: guardado.db_id || (guardado.id !== idealItem.id ? guardado.id : null),
      catalogo_accesorio_id:
        guardado.catalogo_accesorio_id ||
        guardado.catalogoAccesorioId ||
        catalogo.id ||
        null,
      codigo: guardado.codigo || catalogo.codigo || idealItem.id,
      slug: guardado.slug || catalogo.slug || idealItem.id,
      presente: convertirBooleano(guardado.presente),
      danado: convertirBooleano(guardado.danado),
      seleccion: guardado.seleccion ?? '',
      costoReparacion:
        guardado.costoReparacion ??
        guardado.costo_reparacion ??
        '',
      comentarioDaño:
        guardado.comentarioDaño ??
        guardado.comentario_dano ??
        ''
    };
  });

  const handleItemChange = (id, campo, valor) => {
    const listaActualizada = accesoriosActivos.map((item) =>
      item.id === id ? { ...item, [campo]: valor } : item
    );

    onChange?.({
      ...safeData,
      tipoVehiculo: tipoVehiculo,
      tipoVehiculoId: tipoVehiculoId,
      accesoriosList: listaActualizada,
      accesorios: listaActualizada
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span>🧰</span> Equipamiento Específico ({tipoVehiculo.toUpperCase()})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Se muestran los componentes y accesorios válidos para esta categoría vehicular.
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Selección:
                    </label>
                    <select
                      value={item.seleccion || ''}
                      onChange={(e) => handleItemChange(item.id, 'seleccion', e.target.value)}
                      className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50 text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Seleccione...</option>
                      {item.opciones.map((op) => (
                        <option key={op} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`estado-${tipoVehiculo}-${item.id}`}
                          checked={item.presente === true}
                          onChange={() => handleItemChange(item.id, 'presente', true)}
                          className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                        />
                        <span className="text-slate-600 font-medium">Sí</span>
                      </label>

                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name={`estado-${tipoVehiculo}-${item.id}`}
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
                      checked={item.danado === true}
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
                  <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-xs text-slate-400 font-semibold">
                    $
                  </span>
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