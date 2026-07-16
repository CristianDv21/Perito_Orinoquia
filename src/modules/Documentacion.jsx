

export default function Documentacion({ data, onChange }) {
  // Aseguramos que data no sea undefined para evitar que la app se rompa
  const safeData = data || {};

  const handleInputChange = (field, value) => {
    if (onChange) {
      onChange({ [field]: value });
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* 🚗 SECCIÓN 1: IDENTIFICACIÓN DEL VEHÍCULO (HU-01) */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Datos de Identificación (RUNT)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Placa *</label>
            <input 
              type="text" 
              placeholder="Ej. HBS124"
              value={safeData.placa || ''} 
              onChange={(e) => handleInputChange('placa', e.target.value.toUpperCase())}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Marca *</label>
            <input 
              type="text" 
              placeholder="Ej. Mazda"
              value={safeData.marca || ''} 
              onChange={(e) => handleInputChange('marca', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Línea *</label>
            <input 
              type="text" 
              placeholder="Ej. 3 All New"
              value={safeData.linea || ''} 
              onChange={(e) => handleInputChange('linea', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Modelo (Año) *</label>
            <input 
              type="number" 
              placeholder="Ej. 2012"
              value={safeData.modelo || ''} 
              onChange={(e) => handleInputChange('modelo', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Número de Motor *</label>
            <input 
              type="text" 
              placeholder="Ej. LF872635"
              value={safeData.numMotor || ''} 
              onChange={(e) => handleInputChange('numMotor', e.target.value.toUpperCase())}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Número de Chasis *</label>
            <input 
              type="text" 
              placeholder="Ej. 9BFGH826"
              value={safeData.numChasis || ''} 
              onChange={(e) => handleInputChange('numChasis', e.target.value.toUpperCase())}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* 📄 SECCIÓN 2: DOCUMENTOS LEGALES (HU-02) */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Verificación de Documentación Legal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SOAT */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">¿SOAT Vigente?</span>
              <input 
                type="checkbox" 
                checked={!!safeData.soatAlDia} 
                onChange={(e) => handleInputChange('soatAlDia', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </div>
            {safeData.soatAlDia && (
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Fecha de Vencimiento SOAT</label>
                <input 
                  type="date" 
                  value={safeData.venceSoat || ''} 
                  onChange={(e) => handleInputChange('venceSoat', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Técnico Mecánica */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">¿Técnico Mecánica Vigente?</span>
              <input 
                type="checkbox" 
                checked={!!safeData.tecnicoMecanicaAlDia} 
                onChange={(e) => handleInputChange('tecnicoMecanicaAlDia', e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
            </div>
            {safeData.tecnicoMecanicaAlDia && (
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Fecha de Vencimiento RTM</label>
                <input 
                  type="date" 
                  value={safeData.venceTecnicoMecanica || ''} 
                  onChange={(e) => handleInputChange('venceTecnicoMecanica', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Organismo de Tránsito (Municipio)</label>
            <input 
              type="text" 
              placeholder="Ej. Yopal"
              value={safeData.organismoTransito || ''} 
              onChange={(e) => handleInputChange('organismoTransito', e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ⚠️ SECCIÓN 3: SINIESTROS & HISTORIAL (HU-03) */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Historial de Siniestralidad
        </h3>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Comentarios de Siniestros / Alertar RUNT</label>
          <textarea 
            rows="3" 
            placeholder="Describa si el vehículo presenta alertas por pérdida de menor/mayor cuantía, embargos o limitaciones a la propiedad..."
            value={safeData.comentariosSiniestros || ''} 
            onChange={(e) => handleInputChange('comentariosSiniestros', e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

    </div>
  );
}