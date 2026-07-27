import { useRef } from "react";

// 1. COMPONENTE INDEPENDIENTE PARA SUBIR ARCHIVOS
function FileUploader({ field, acceptedFile, onFileChange }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPG, PNG, WEBP) o archivos PDF.');
      return;
    }

    const fileData = {
      name: file.name,
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      rawFile: file
    };

    onFileChange(field, fileData);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    onFileChange(field, null);
  };

  return (
    <div className="mt-3">
      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">
        Documento Adjunto (PDF o Imagen)
      </label>
      
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {!acceptedFile ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-4 bg-slate-50 hover:bg-blue-50/30 cursor-pointer transition duration-150 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-hover:text-blue-500 mb-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition">
            Subir PDF o Imagen
          </span>
          <span className="text-[9px] text-slate-400 mt-0.5 font-medium">Recomendado menor a 5MB</span>
        </div>
      ) : (
        <div className="relative flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 overflow-hidden mr-2">
            {acceptedFile.previewUrl ? (
              <img 
                src={acceptedFile.previewUrl} 
                alt="Vista previa" 
                className="w-10 h-10 object-cover rounded-lg border border-slate-100 flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-red-50 border border-red-100 text-red-500 flex items-center justify-center rounded-lg flex-shrink-0">
                <span className="text-[10px] font-extrabold uppercase">PDF</span>
              </div>
            )}
            
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-700 truncate pr-4">
                {acceptedFile.name}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-mono font-bold">
                {acceptedFile.type.split('/')[1]}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition flex-shrink-0"
            title="Eliminar archivo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

// 2. COMPONENTE PRINCIPAL
export default function Documentacion({ data, onChange }) {
  const safeData = data || {};  

  const handleInputChange = (field, value) => {
    if (onChange) {
      onChange({ [field]: value });
    }
  };

  // Clase de diseño estándar y uniforme para todos los campos de entrada de la app
  const inputStyle = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition duration-150";

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* 🚗 SECCIÓN 1: IDENTIFICACIÓN DEL VEHÍCULO */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Datos de Identificación (RUNT)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Placa *</label>
            <input 
              type="text" 
              placeholder="Ej. HBS124"
              value={safeData.placa || ''} 
              onChange={(e) => handleInputChange('placa', e.target.value.toUpperCase())}
              className={`${inputStyle} font-mono font-bold tracking-wider uppercase`}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Marca *</label>
            <input 
              type="text" 
              placeholder="Ej. Mazda"
              value={safeData.marca || ''} 
              onChange={(e) => handleInputChange('marca', e.target.value)}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Línea *</label>
            <input 
              type="text" 
              placeholder="Ej. 3 All New"
              value={safeData.linea || ''} 
              onChange={(e) => handleInputChange('linea', e.target.value)}
              className={inputStyle}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Modelo (Año) *</label>
            <input 
              type="number" 
              placeholder="Ej. 2012"
              value={safeData.modelo || ''} 
              onChange={(e) => handleInputChange('modelo', e.target.value)}
              className={`${inputStyle} font-mono font-bold`}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Número de Motor *</label>
            <input 
              type="text" 
              placeholder="Ej. LF872635"
              value={safeData.numMotor || ''} 
              onChange={(e) => handleInputChange('numMotor', e.target.value.toUpperCase())}
              className={`${inputStyle} font-mono tracking-wide uppercase`}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Número de Chasis *</label>
            <input 
              type="text" 
              placeholder="Ej. 9BFGH826"
              value={safeData.numChasis || ''} 
              onChange={(e) => handleInputChange('numChasis', e.target.value.toUpperCase())}
              className={`${inputStyle} font-mono tracking-wide uppercase`}
              required
            />
          </div>
        </div>
      </div>

      {/* 📄 SECCIÓN 2: DOCUMENTOS LEGALES */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Verificación de Documentación Legal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SOAT */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-700">¿SOAT Vigente?</span>
                <input 
                  type="checkbox" 
                  checked={!!safeData.soatAlDia} 
                  onChange={(e) => handleInputChange('soatAlDia', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer border-slate-300"
                />
              </div>
              {safeData.soatAlDia && (
                <div className="animate-fadeIn">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wide">Fecha de Vencimiento SOAT</label>
                  <input 
                    type="date" 
                    value={safeData.venceSoat || ''} 
                    onChange={(e) => handleInputChange('venceSoat', e.target.value)}
                    className={`${inputStyle} font-mono font-bold text-slate-600`}
                  />
                </div>
              )}
            </div>
            
            {safeData.soatAlDia && (
              <div className="animate-fadeIn">
                <FileUploader 
                  field="archivoSoat" 
                  acceptedFile={safeData.archivoSoat} 
                  onFileChange={handleInputChange} 
                />
              </div>
            )}
          </div>

          {/* Técnico Mecánica */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-slate-700">¿Técnico Mecánica Vigente?</span>
                <input 
                  type="checkbox" 
                  checked={!!safeData.tecnicoMecanicaAlDia} 
                  onChange={(e) => handleInputChange('tecnicoMecanicaAlDia', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer border-slate-300"
                />
              </div>
              {safeData.tecnicoMecanicaAlDia && (
                <div className="animate-fadeIn">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wide">Fecha de Vencimiento RTM</label>
                  <input 
                    type="date" 
                    value={safeData.venceTecnicoMecanica || ''} 
                    onChange={(e) => handleInputChange('venceTecnicoMecanica', e.target.value)}
                    className={`${inputStyle} font-mono font-bold text-slate-600`}
                  />
                </div>
              )}
            </div>

            {safeData.tecnicoMecanicaAlDia && (
              <div className="animate-fadeIn">
                <FileUploader 
                  field="archivoTecnicoMecanica" 
                  acceptedFile={safeData.archivoTecnicoMecanica} 
                  onFileChange={handleInputChange} 
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Organismo de Tránsito (Municipio)</label>
            <input 
              type="text" 
              placeholder="Ej. Yopal"
              value={safeData.organismoTransito || ''} 
              onChange={(e) => handleInputChange('organismoTransito', e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* ⚠️ SECCIÓN 3: SINIESTROS & HISTORIAL */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Historial de Siniestralidad
        </h3>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Comentarios de Siniestros / Alertas RUNT</label>
          <textarea 
            rows="3" 
            placeholder="Describa si el vehículo presenta alertas por pérdida de menor/mayor cuantía, embargos o limitaciones a la propiedad..."
            value={safeData.comentariosSiniestros || ''} 
            onChange={(e) => handleInputChange('comentariosSiniestros', e.target.value)}
            className={`${inputStyle} resize-none`}
          />
        </div>
      </div>

    </div>
  );
}