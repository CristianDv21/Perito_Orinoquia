import { useState, useEffect } from 'react';

// 1. Elementos para Automóviles
const elementosAuto = [
  { id: 'motor', nombre: 'Motor' },
  { id: 'caja_diferencial', nombre: 'Caja y Diferencial' },
  { id: 'direccion', nombre: 'Dirección' },
  { id: 'alineacion_susp', nombre: 'Alineación/Susp.' },
  { id: 'luces', nombre: 'Luces' },
  { id: 'tableros_instr', nombre: 'Tableros instr.' },
  { id: 'calefaccion', nombre: 'Calefacción' },
  { id: 'l_parabrisas_del_tras', nombre: 'L.Parabrisas del./tras.' },
  { id: '4x4', nombre: '4x4' },
  { id: 'frenos', nombre: 'Frenos' },
  { id: 'correas', nombre: 'Correas' },
  { id: 'perdidas_agua', nombre: 'Pérdidas de Agua' },
  { id: 'perdidas_aceite', nombre: 'Pérdidas de Aceite' },
  { id: 'mangueras', nombre: 'Mangueras' },
  { id: 'embrague', nombre: 'Embrague' },
  { id: 'parabrisas', nombre: 'Parabrisas' },
  { id: 'bocina', nombre: 'Bocina' },
  { id: 'anclaje_cinturon', nombre: 'Anclaje del cinturón' },
];

// 2. Elementos para Camionetas / Camperos / SUVs
const elementosCamioneta = [
  { id: 'motor', nombre: 'Motor' },
  { id: 'caja_diferencial', nombre: 'Caja y Diferencial' },
  { id: 'direccion', nombre: 'Dirección' },
  { id: 'alineacion_susp', nombre: 'Alineación/Susp.' },
  { id: 'luces', nombre: 'Luces' },
  { id: 'tableros_instr', nombre: 'Tableros instr.' },
  { id: 'calefaccion', nombre: 'Calefacción' },
  { id: 'l_parabrisas_del_tras', nombre: 'L.Parabrisas del./tras.' },
  { id: '4x4', nombre: '4x4 / Doble Tracción' },
  { id: 'frenos', nombre: 'Frenos' },
  { id: 'correas', nombre: 'Correas' },
  { id: 'perdidas_agua', nombre: 'Pérdidas de Agua' },
  { id: 'perdidas_aceite', nombre: 'Pérdidas de Aceite' },
  { id: 'mangueras', nombre: 'Mangueras' },
  { id: 'embrague', nombre: 'Embrague' },
  { id: 'parabrisas', nombre: 'Parabrisas' },
  { id: 'bocina', nombre: 'Bocina' },
  { id: 'anclaje_cinturon', nombre: 'Anclaje del cinturón' },
];

// 3. Elementos para Motocicletas
const elementosMoto = [
  { id: 'motor', nombre: 'Motor' },
  { id: 'caja_transmision', nombre: 'Caja / Transmisión' },
  { id: 'direccion', nombre: 'Dirección / Manubrio' },
  { id: 'suspension', nombre: 'Suspensión Delantera y Trasera' },
  { id: 'luces', nombre: 'Luces e Indicadores' },
  { id: 'frenos', nombre: 'Frenos' },
  { id: 'cadena_correa', nombre: 'Cadena / Correa / Kit de arrastre' },
  { id: 'perdidas_aceite', nombre: 'Pérdidas de Aceite' },
  { id: 'llantas_rines', nombre: 'Llantas y Rines' },
  { id: 'bocina', nombre: 'Bocina' },
  { id: 'sistema_electrico', nombre: 'Sistema Eléctrico y Batería' },
];

// 4. Elementos para Motocarros
const elementosMotocarro = [
  { id: 'motor', nombre: 'Motor' },
  { id: 'caja_transmision', nombre: 'Caja / Transmisión y Reversa' },
  { id: 'direccion', nombre: 'Dirección / Manubrio' },
  { id: 'suspension', nombre: 'Suspensión' },
  { id: 'luces', nombre: 'Luces' },
  { id: 'frenos', nombre: 'Frenos' },
  { id: 'cardan_transmision', nombre: 'Cardán / Kit de arrastre' },
  { id: 'perdidas_aceite', nombre: 'Pérdidas de Aceite' },
  { id: 'llantas_rines', nombre: 'Llantas y Rines' },
  { id: 'bocina', nombre: 'Bocina' },
  { id: 'sistema_electrico', nombre: 'Sistema Eléctrico y Batería' },
];

export default function DetallesTecnicos({ peritajeData, onChange }) {
  const safeData = peritajeData || {};
  const detalles = safeData.detallesTecnicos || {};

  const [form, setForm] = useState(detalles);

  // Sincronizar el estado local si peritajeData cambia o se carga asíncronamente
  useEffect(() => {
  }, [safeData.detallesTecnicos]);

  // Detectar el tipo de vehículo
  const tipoVehiculo = (safeData.tipoVehiculoId || safeData.tipo_vehiculo_id || '').toString().toLowerCase();

  const obtenerElementosPorTipo = () => {
    if (tipoVehiculo.includes('camioneta') || tipoVehiculo.includes('campero') || tipoVehiculo.includes('suv')) {
      return elementosCamioneta;
    }
    if (tipoVehiculo.includes('motocarro')) {
      return elementosMotocarro;
    }
    if (tipoVehiculo.includes('moto')) {
      return elementosMoto;
    }
    return elementosAuto; //
  };

  const elementosIniciales = obtenerElementosPorTipo();
  const esVehiculoLiviano = tipoVehiculo.includes('auto') || tipoVehiculo.includes('camioneta') || tipoVehiculo.includes('campero') || tipoVehiculo.includes('suv') || (!tipoVehiculo.includes('moto') && !tipoVehiculo.includes('motocarro'));

  // Calcular costo total manejando correctamente el tipo numérico
  // Calcular costo total manejando correctamente el tipo numérico (incluyendo opcionalmente la mano de obra)
  const calcularCostoTotal = (currentForm) => {
    let total = 0;
    elementosIniciales.forEach((item) => {
      const costoItem = parseFloat(currentForm[item.id]?.costo) || 0;
      total += costoItem;
    });
    
    // Opcional: Si deseas que también sume la mano de obra (costoAlistamiento) automáticamente:
    const costoManoDeObra = parseFloat(currentForm.costoAlistamiento) || 0;
    
    return total + costoManoDeObra;
  };

  const handleCheckboxChange = (id, checked) => {
    const updated = {
      ...form,
      [id]: { ...(form[id] || {}), dañado: checked }
    };
    setForm(updated);
    if (onChange) onChange({ detallesTecnicos: updated });
  };

  const handleTextChange = (id, field, value) => {
    const updatedItem = { ...(form[id] || {}), [field]: value };
    const tempForm = { ...form, [id]: updatedItem };
    
    const updated = {
      ...tempForm,
      costoReparacion: calcularCostoTotal(tempForm)
    };

    setForm(updated);
    if (onChange) onChange({ detallesTecnicos: updated });
  };

  const handleGlobalChange = (field, value) => {
    const tempForm = { ...form, [field]: value };
    const updated = {
      ...tempForm,
      costoReparacion: calcularCostoTotal(tempForm) // Asegura que si cambia la mano de obra, el total se actualice
    };
    setForm(updated);
    if (onChange) onChange({ detallesTecnicos: updated });
  };

  const handleImagenChange = (id, file) => {
    if (!file) return;
    const lector = new FileReader();
    lector.onload = (evento) => {
      const updated = {
        ...form,
        [id]: { ...(form[id] || {}), imagen: evento.target.result, imagenNombre: file.name }
      };
      setForm(updated);
      if (onChange) onChange({ detallesTecnicos: updated });
    };
    lector.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
      {/* Tabla principal de componentes */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
              <th className="py-3 px-4 w-1/4">Elemento</th>
              <th className="py-3 px-3 text-center w-20">Dañado</th>
              <th className="py-3 px-4">Comentario</th>
              <th className="py-3 px-4 w-44">Costo de daño</th>
              <th className="py-3 px-4 w-48">Imágenes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {elementosIniciales.map((item) => {
              const itemData = form[item.id] || {};
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-4 font-semibold text-slate-700">
                    {item.nombre}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!itemData.dañado}
                      onChange={(e) => handleCheckboxChange(item.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      maxLength="255"
                      value={itemData.comentario || ''}
                      onChange={(e) => handleTextChange(item.id, 'comentario', e.target.value)}
                      placeholder="Observaciones..."
                      className="w-full p-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 text-xs text-slate-800"
                    />
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="relative flex items-center">
                      <span className="absolute left-2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        value={itemData.costo || ''}
                        onChange={(e) => handleTextChange(item.id, 'costo', e.target.value)}
                        placeholder="0"
                        className="w-full pl-6 pr-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 text-xs text-slate-800"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center space-x-2">
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-2 py-1 rounded text-[11px] font-medium transition">
                        Elegir archivos
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImagenChange(item.id, e.target.files[0])}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400 truncate max-w-[100px]">
                        {itemData.imagenNombre || 'Sin archivos'}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sección condicional para vehículos híbridos/eléctricos */}
      {esVehiculoLiviano && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Vehículos híbridos/eléctricos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Porcentaje restante de la batería (debe ser entre 0 y 100)
              </label>
              <div className="flex">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.porcentajeBateria || ''}
                  onChange={(e) => handleGlobalChange('porcentajeBateria', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-l text-xs focus:ring-1 focus:ring-blue-500"
                />
                <span className="bg-slate-100 border border-l-0 border-slate-300 px-3 flex items-center text-xs font-bold text-slate-600 rounded-r">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Vida útil de la batería
              </label>
              <input
                type="text"
                value={form.vidaUtilBateria || ''}
                onChange={(e) => handleGlobalChange('vidaUtilBateria', e.target.value)}
                placeholder="Estado de la batería..."
                className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sección: Otros */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Otros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Costo Mano de Obra
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={form.costoAlistamiento || ''}
                onChange={(e) => handleGlobalChange('costoAlistamiento', e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Comentarios</label>
            <textarea
              rows="3"
              value={form.comentariosGenerales || ''}
              onChange={(e) => handleGlobalChange('comentariosGenerales', e.target.value)}
              placeholder="Comentarios generales..."
              className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Costo de reparación (Automático)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={form.costoReparacion || ''}
                readOnly
                placeholder="0"
                className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded text-xs bg-slate-50 text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}