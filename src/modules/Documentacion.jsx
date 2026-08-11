import api from '../api/axios';
import { useRef, useState } from "react";

function FileUploader({ field, acceptedFile, onFileChange }) {
  const fileInputRef = useRef(null);

  const esUrlBackend = typeof acceptedFile === 'string' && acceptedFile.trim() !== '';

  const urlVisualizacion = esUrlBackend
    ? (acceptedFile.startsWith('http') ? acceptedFile : `http://127.0.0.1:8000/storage/${acceptedFile}`)
    : (acceptedFile?.previewUrl || null);

  const nombreArchivo = esUrlBackend
    ? "Documento registrado en BD"
    : (acceptedFile?.name || "Documento adjunto");

  const tipoArchivoTexto = esUrlBackend
    ? "archivo"
    : (acceptedFile?.type ? acceptedFile.type.split('/')[1] : '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPG, PNG, WEBP) o archivos PDF.');
      e.target.value = null;
      return;
    }

    if (file.type.startsWith('image/')) {
      const lector = new FileReader();
      lector.onload = (evento) => {
        onFileChange(field, {
          file: file,
          name: file.name,
          type: file.type,
          previewUrl: evento.target.result,
          dataUrl: evento.target.result,
        });
      };
      lector.readAsDataURL(file);
    } else {
      onFileChange(field, {
        file: file,
        name: file.name,
        type: file.type,
        previewUrl: null,
        dataUrl: null,
      });
    }
    e.target.value = null;
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
        </div>
      ) : (
        <div className="relative flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 overflow-hidden mr-2">
            {urlVisualizacion ? (
              <img src={urlVisualizacion} alt="Vista previa" className="w-10 h-10 object-cover rounded-lg border border-slate-100 flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-red-50 border border-red-100 text-red-500 flex items-center justify-center rounded-lg flex-shrink-0">
                <span className="text-[10px] font-extrabold uppercase">PDF</span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-700 truncate pr-4">{nombreArchivo}</span>
              <span className="text-[9px] text-slate-400 uppercase font-mono font-bold">{tipoArchivoTexto}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {esUrlBackend && (
              <a
                href={urlVisualizacion}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition"
              >
                Ver
              </a>
            )}
            <button type="button" onClick={removeFile} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Documentacion({
  peritajeData: data,
  onChange,
  sucursales = [],
  vendedores = [],
  onAgregarSucursal,
  onAgregarVendedor
}) {
  const safeData = data || {};
  const tipoVehiculo = safeData.tipoVehiculo || safeData.tipo_vehiculo || 'carro';

  const [sugerencias, setSugerencias] = useState([]);

  const handleInputChange = (field, value) => {
    if (onChange) {
      const updatedData = { ...safeData, [field]: value };

      const equivalencias = {
        clienteNombre: 'cliente_nombre',
        cliente_nombre: 'clienteNombre',
        clienteDocumento: 'cliente_documento',
        cliente_documento: 'clienteDocumento',
        clienteTelefono: 'cliente_telefono',
        cliente_telefono: 'clienteTelefono',
        archivoSoat: 'archivo_soat',
        archivo_soat: 'archivoSoat',
        archivoTecnicoMecanica: 'archivo_tecnico_mecanica',
        archivo_tecnico_mecanica: 'archivoTecnicoMecanica',
        sucursalVendedorId: 'sucursal_vendedor_id',
        sucursal_vendedor_id: 'sucursalVendedorId',
        sucursalInspeccionId: 'sucursal_inspeccion_id',
        sucursal_inspeccion_id: 'sucursalInspeccionId',
        vendedorId: 'vendedor_id',
        vendedor_id: 'vendedorId',
        soatAlDia: 'soat_al_dia',
        soat_al_dia: 'soatAlDia',
        tecnicoMecanicaAlDia: 'tecnico_mecanica_al_dia',
        tecnico_mecanica_al_dia: 'tecnicoMecanicaAlDia',
        numMotor: 'num_motor',
        num_motor: 'numMotor',
        numChasis: 'num_chasis',
        num_chasis: 'numChasis',
        venceSoat: 'vence_soat',
        vence_soat: 'venceSoat',
        venceTecnicoMecanica: 'vence_tecnico_mecanica',
        vence_tecnico_mecanica: 'venceTecnicoMecanica',
      };

      if (equivalencias[field]) {
        updatedData[equivalencias[field]] = value;
      }

      onChange(updatedData);
    }
  };

  const obtenerFechaMinima = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const inputStyle = "w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition duration-150";

  const placeholdersConfig = {
    carro: { placa: "Ej. HBS126", marca: "Ej. Chevrolet / Mazda", linea: "Ej. Spark / Mazda 3", modelo: "Ej. 2022", color: "Ej. Blanco Glaciar", siniestros: "Ej. Sin reportes" },
    moto: { placa: "Ej. ABC12D", marca: "Ej. Yamaha / Bajaj", linea: "Ej. FZ 150 / Pulsar NS", modelo: "Ej. 2023", color: "Ej. Negro Mate", siniestros: "Ej. Sin siniestros" },
    pesado: { placa: "Ej. SOG123", marca: "Ej. Kenworth / International", linea: "Ej. T800 / Mack", modelo: "Ej. 2018", color: "Ej. Rojo", siniestros: "Ej. Sin historial" },
    motocarro: { placa: "Ej. 722ABC", marca: "Ej. Bajaj / TVS", linea: "Ej. RE Maxima / Torito", modelo: "Ej. 2021", color: "Ej. Amarillo", siniestros: "Ej. Sin novedades" }
  };

  const placeholders = placeholdersConfig[tipoVehiculo] || placeholdersConfig.carro;

  return (
    <div className="space-y-6 text-slate-800">

      {/* ASIGNACIÓN DE OPERACIÓN Y PERSONAL */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Asignación de Operación y Personal
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Sucursal Vendedor *</label>
              {onAgregarSucursal && (
                <button type="button" onClick={onAgregarSucursal} className="text-[10px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded transition">
                  + Agregar
                </button>
              )}
            </div>
            <select
              value={safeData.sucursalVendedorId || safeData.sucursal_vendedor_id || ''}
              onChange={(e) => handleInputChange('sucursalVendedorId', e.target.value)}
              className={inputStyle}
              required
            >
              <option value="">Seleccione sucursal...</option>
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id}>{suc.nombre} {suc.ciudad ? `(${suc.ciudad})` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Sucursal Inspección *</label>
              {onAgregarSucursal && (
                <button type="button" onClick={onAgregarSucursal} className="text-[10px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded transition">
                  + Agregar
                </button>
              )}
            </div>
            <select
              value={safeData.sucursalInspeccionId || safeData.sucursal_inspeccion_id || ''}
              onChange={(e) => handleInputChange('sucursalInspeccionId', e.target.value)}
              className={inputStyle}
              required
            >
              <option value="">Seleccione sucursal...</option>
              {sucursales.map((suc) => (
                <option key={suc.id} value={suc.id}>{suc.nombre} {suc.ciudad ? `(${suc.ciudad})` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-500 tracking-wide">Vendedor / Asesor *</label>
              {onAgregarVendedor && (
                <button type="button" onClick={onAgregarVendedor} className="text-[10px] text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded transition">
                  + Agregar
                </button>
              )}
            </div>
            <select
              value={safeData.vendedorId || safeData.vendedor_id || ''}
              onChange={(e) => handleInputChange('vendedorId', e.target.value)}
              className={inputStyle}
              required
            >
              <option value="">Seleccione vendedor...</option>
              {vendedores.map((vend) => (
                <option key={vend.id} value={vend.id}>{vend.nombre} {vend.apellido || ''}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DATOS DE IDENTIFICACIÓN DEL VEHÍCULO */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Datos de Identificación ({tipoVehiculo.toUpperCase()})
          </h3>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Clase: {tipoVehiculo}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Placa *</label>
            <input type="text" placeholder={placeholders.placa} value={safeData.placa || ''} onChange={(e) => handleInputChange('placa', e.target.value.toUpperCase())} className={`${inputStyle} font-mono font-bold tracking-wider uppercase`} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Marca *</label>
            <input type="text" placeholder={placeholders.marca} value={safeData.marca || ''} onChange={(e) => handleInputChange('marca', e.target.value)} className={inputStyle} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Línea *</label>
            <input type="text" placeholder={placeholders.linea} value={safeData.linea || ''} onChange={(e) => handleInputChange('linea', e.target.value)} className={inputStyle} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Color *</label>
            <input type="text" placeholder={placeholders.color} value={safeData.color || ''} onChange={(e) => handleInputChange('color', e.target.value)} className={inputStyle} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Modelo (Año) *</label>
            <input type="number" placeholder={placeholders.modelo} value={safeData.modelo || safeData.modelo_anio || ''} onChange={(e) => handleInputChange('modelo', e.target.value)} className={`${inputStyle} font-mono font-bold`} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Número de Motor *</label>
            <input type="text" placeholder="Registro motor..." value={safeData.numMotor || safeData.num_motor || ''} onChange={(e) => handleInputChange('numMotor', e.target.value.toUpperCase())} className={`${inputStyle} font-mono tracking-wide uppercase`} required />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Número de Chasis *</label>
            <input type="text" placeholder="Registro chasis..." value={safeData.numChasis || safeData.num_chasis || ''} onChange={(e) => handleInputChange('numChasis', e.target.value.toUpperCase())} className={`${inputStyle} font-mono tracking-wide uppercase`} required />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wide">Historial de Siniestros / Antecedentes</label>
          <textarea rows="2" placeholder={placeholders.siniestros} value={safeData.siniestros || safeData.comentarios_siniestros || ''} onChange={(e) => handleInputChange('siniestros', e.target.value)} className={inputStyle} />
        </div>
      </div>

      {/* VERIFICACIÓN DE DOCUMENTACIÓN LEGAL Y PROPIETARIO */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-100 pb-3">
          Verificación de Documentación Legal y Propietario
        </h3>

        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
          <h4 className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">Información del Propietario / Cliente</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Nombre Completo con Autocompletado */}
            <div className="relative">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Nombre Completo *</label>
              <input
                type="text"
                placeholder="Nombre del cliente..."
                value={safeData.clienteNombre || safeData.cliente_nombre || ''}
                onChange={async (e) => {
                  const valor = e.target.value;
                  handleInputChange('clienteNombre', valor);

                  if (valor.length > 1) {
                    try {
                      const res = await api.get(`/clientes/buscar?q=${encodeURIComponent(valor)}`);
                      setSugerencias(res.data);
                    } catch (err) {
                      console.error("Error buscando cliente", err);
                    }
                  } else {
                    setSugerencias([]);
                  }
                }}
                className={inputStyle}
                autoComplete="off"
              />

              {sugerencias && sugerencias.length > 0 && (
                <ul className="absolute z-50 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {sugerencias.map((cliente) => (
                    <li
                      key={cliente.id}
                      onClick={() => {
                        handleInputChange('clienteNombre', cliente.nombre_cliente || '');
                        handleInputChange('clienteDocumento', cliente.documento_cliente || '');
                        handleInputChange('clienteTelefono', cliente.telefono_cliene || ''); // Mapeo exacto respetando el typo de la BD
                        setSugerencias([]);
                      }}
                      className="p-2 hover:bg-indigo-50 cursor-pointer text-xs border-b border-slate-100 last:border-none"
                    >
                      <p className="font-semibold text-slate-700">{cliente.nombre_cliente}</p>
                      <p className="text-[10px] text-slate-400">Doc: {cliente.documento_cliente} | Tel: {cliente.telefono_cliene}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Documento de Identidad */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Documento de Identidad *</label>
              <input
                type="text"
                placeholder="Cédula o NIT..."
                value={safeData.clienteDocumento || safeData.cliente_documento || ''}
                onChange={(e) => handleInputChange('clienteDocumento', e.target.value)}
                className={`${inputStyle} font-mono`}
              />
            </div>

            {/* Teléfono / Contacto */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Teléfono / Contacto</label>
              <input
                type="text"
                placeholder="Teléfono..."
                value={safeData.clienteTelefono || safeData.cliente_telefono || ''}
                onChange={(e) => handleInputChange('clienteTelefono', e.target.value)}
                className={`${inputStyle} font-mono`}
              />
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* SOAT */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-sm space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-1 w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-700">¿Fecha de Vencimiento SOAT?</label>
                <input
                  type="date"
                  min={obtenerFechaMinima()}
                  value={safeData.vence_soat || safeData.venceSoat || ''}
                  onChange={(e) => {
                    const fechaIngresadaSoat = e.target.value;
                    if (!fechaIngresadaSoat) {
                      handleInputChange('venceSoat', '');
                      return;
                    }
                    if (fechaIngresadaSoat < obtenerFechaMinima()) {
                      handleInputChange('venceSoat', '');
                      return;
                    }
                    handleInputChange('venceSoat', fechaIngresadaSoat);
                  }}
                  className="rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 p-2 text-sm cursor-pointer border border-slate-300 bg-slate-50"
                />
              </div>
            </div>
            <FileUploader field="archivoSoat" acceptedFile={safeData.archivoSoat || safeData.archivo_soat} onFileChange={handleInputChange} />
          </div>

          {/* RTM */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col justify-between shadow-sm space-y-4">
            <div className="space-y-3">
              <div className="flex flex-col gap-1 w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-xs font-bold text-slate-700">¿Fecha de Vencimiento RTM?</label>
                <input
                  type="date"
                  min={obtenerFechaMinima()}
                  value={safeData.vence_tecnico_mecanica || safeData.venceTecnicoMecanica || ''}
                  onChange={(e) => {
                    const fechaIngresadaRTM = e.target.value;
                    if (!fechaIngresadaRTM) {
                      handleInputChange('venceTecnicoMecanica', '');
                      return;
                    }
                    if (fechaIngresadaRTM < obtenerFechaMinima()) {
                      handleInputChange('venceTecnicoMecanica', '');
                      return;
                    }
                    handleInputChange('venceTecnicoMecanica', fechaIngresadaRTM);
                  }}
                  className="rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 p-2 text-sm cursor-pointer border border-slate-300 bg-slate-50"
                />
              </div>
            </div>
            <FileUploader field="archivoTecnicoMecanica" acceptedFile={safeData.archivoTecnicoMecanica || safeData.archivo_tecnico_mecanica} onFileChange={handleInputChange} />
          </div>
        </div>

      </div>
    </div>
  );
}