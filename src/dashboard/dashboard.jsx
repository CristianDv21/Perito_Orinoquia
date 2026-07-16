import { useState } from 'react';
import Documentacion from '../modules/Documentacion';
import Accesorios from '../modules/Accesorios';

export default function Dashboard({ onLogout }) {
  // --- ESTADOS DE CONTROL DE INTERFAZ ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Bandeja');
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionStep, setInspectionStep] = useState('Documentacion'); // Paso actual del peritaje

  // --- EL ÚNICO ESTADO DE VERDAD DE TODO EL PERITAJE ---
  const [peritajeData, setPeritajeData] = useState({
    // Módulo 1: Datos & RUNT
    placa: '',
    marca: '',
    linea: '',
    modelo: '',
    numMotor: '',
    numChasis: '',
    soatAlDia: true,
    venceSoat: '',
    tecnicoMecanicaAlDia: true,
    venceTecnicoMecanica: '',
    organismoTransito: '',
    comentariosSiniestros: '',

    // Módulo 2: Accesorios (Inicializado con la lista de prueba desde el origen)[cite: 1]
    accesoriosList: [
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
    ],
    llantasData: { presente: true, danado: false, foto: null },
    accesoriosObservaciones: '',
    accesoriosCosto: 0
  });

  // --- DATOS ESTATICOS DE NAVEGACION ---
  const mainMenuItems = [
    { id: 'Bandeja', label: 'Bandeja de Entrada', icon: '📥' },
    { id: 'Estadisticas', label: 'Estadísticas', icon: '📊' },
    { id: 'Configuracion', label: 'Configuración', icon: '⚙️' },
  ];

  const inspectionSteps = [
    { id: 'Documentacion', label: '1. Documentación', icon: '📄' },
    { id: 'Accesorios', label: '2. Accesorios', icon: '🚗' },
    { id: 'Motor', label: '3. Motor', icon: '⚙️' },
    { id: 'Pintura', label: '4. Estructura & Pintura', icon: '🎨' },
    { id: 'Reportes', label: '5. Resumen & Reporte', icon: '📋' },
  ];

  // Datos mock para la bandeja de peritajes guardados
  const inspecciones = [
    { id: 'PER-001', placa: 'HBS124', marca: 'Mazda 3', fecha: '2026-07-15', estado: 'Completado' },
    { id: 'PER-002', placa: 'KLY789', marca: 'Chevrolet Onix', fecha: '2026-07-16', estado: 'En Proceso' },
  ];

  // --- MANEJADORES DE EVENTOS ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleDataChange = (updatedFields) => {
    setPeritajeData((prev) => {
      const newState = {
        ...prev,
        ...updatedFields
      };
      return newState;
    });
  };

  return (
    <div className="flex min-h-screen bg-[#f4f6fa] text-slate-800 font-sans relative overflow-x-hidden">
      
      {/* 1. SOBRECAPA OSCURA MÓVIL */}
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
      )}

      {/* 2. BARRA LATERAL (Sidebar) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#080d1a] border-r border-slate-800/50 flex flex-col justify-between shrink-0
        transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div>
          <div className="px-6 py-6 border-b border-slate-800/60 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Perito <span className="text-blue-500">Orinoquia</span>
              </h2>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">Consola de Peritaje</p>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-white text-xl">✕</button>
          </div>

          <nav className="p-4 space-y-1">
            {mainMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsInspecting(false); // Salir del peritaje si va a otra pestaña
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 text-xs font-bold rounded-lg transition duration-150 border-l-2 ${
                  activeTab === item.id && !isInspecting
                    ? "text-white bg-blue-600/20 border-blue-500"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/60">
          <button onClick={onLogout} className="w-full px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 w-full">
        
        {/* Topbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="lg:hidden text-slate-600 hover:text-slate-900 text-2xl">☰</button>
            <span className="text-xs font-semibold text-slate-400">Rol: Administrador / Inspector</span>
          </div>
          <span className="text-xs font-medium text-slate-500">Yopal, Casanare</span>
        </header>

        {/* Área de Trabajo Dinámica */}
        <div className="p-6 lg:p-8 space-y-8 overflow-y-auto flex-1">
          
          {/* MODO PERITAJE ACTIVO */}
          {isInspecting ? (
            <div className="space-y-6">
              {/* Botón de regreso y título */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <button 
                    onClick={() => setIsInspecting(false)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 mb-1 flex items-center space-x-1"
                  >
                    <span>←</span> <span>Volver a la Bandeja</span>
                  </button>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nuevo Peritaje Vehicular</h1>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold border border-amber-200">
                    Borrador en Progreso
                  </span>
                </div>
              </div>

              {/* Stepper Horizontal / Selector de Módulo */}
              <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
                {inspectionSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setInspectionStep(step.id)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-lg border whitespace-nowrap transition flex items-center space-x-2 ${
                      inspectionStep === step.id
                        ? "bg-slate-900 text-white border-slate-950 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span>{step.icon}</span>
                    <span>{step.label}</span>
                  </button>
                ))}
              </div>

              {/* Contenedor del Formulario del Paso Activo */}
              <div className="bg-white border border-slate-200/80 p-8 rounded-xl shadow-sm min-h-[350px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl">{inspectionSteps.find(s => s.id === inspectionStep)?.icon}</span>
                    <h2 className="text-lg font-bold text-slate-900">
                      {inspectionSteps.find(s => s.id === inspectionStep)?.label}
                    </h2>
                  </div>
                  
                  {/* RENDERIZADO DINÁMICO DE MÓDULOS ACTIVOS */}
                  <div className="mt-2">
                    {inspectionStep === 'Documentacion' && (
                      <Documentacion data={peritajeData} onChange={handleDataChange} />
                    )}
                    
                    {inspectionStep === 'Accesorios' && (
                      <Accesorios data={peritajeData} onChange={handleDataChange} />
                    )}

                    {/* Pasos en desarrollo o temporales */}
                    {!['Documentacion', 'Accesorios'].includes(inspectionStep) && (
                      <div className="text-slate-500 text-sm">
                        <p className="max-w-xl">
                          Campos específicos para recolectar información de: <strong>{inspectionSteps.find(s => s.id === inspectionStep)?.label}</strong>.
                        </p>
                        <div className="mt-6 p-12 bg-slate-50 border border-slate-150 rounded-lg border-dashed text-center font-semibold text-slate-400">
                          Sección en construcción
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navegación inferior entre Pasos */}
                <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-100">
                  <button 
                    disabled={inspectionStep === 'Documentacion'}
                    onClick={() => {
                      const idx = inspectionSteps.findIndex(s => s.id === inspectionStep);
                      setInspectionStep(inspectionSteps[idx - 1].id);
                    }}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <button 
                    onClick={() => {
                      const idx = inspectionSteps.findIndex(s => s.id === inspectionStep);
                      if (idx < inspectionSteps.length - 1) {
                        setInspectionStep(inspectionSteps[idx + 1].id);
                      } else {
                        alert("¡Guardando peritaje y generando PDF!");
                        setIsInspecting(false);
                      }
                    }}
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                  >
                    {inspectionStep === 'Reportes' ? 'Finalizar y Generar PDF' : 'Siguiente Paso'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* VISTAS GENERALES DEL DASHBOARD */
            <>
              {activeTab === 'Bandeja' && (
                <>
                  {/* Encabezado */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bandeja de Entrada</h1>
                      <p className="text-slate-500 mt-1 text-sm">Monitoreo y registro de peritajes en tiempo real.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsInspecting(true);
                        setInspectionStep('Documentacion');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white rounded-lg shadow-md transition duration-150 self-start sm:self-auto"
                    >
                      Nueva Inspección +
                    </button>
                  </div>

                  {/* Tarjetas de Métricas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Inspecciones Hoy</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">3</p>
                    </div>
                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm border-l-4 border-l-amber-500">
                      <p className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">En proceso</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">1</p>
                    </div>
                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
                      <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Completadas</p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">1</p>
                    </div>
                  </div>

                  {/* Tabla de Vehículos */}
                  <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                      <h2 className="text-sm font-bold text-slate-900">Vehículos Registrados</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-slate-600 min-w-[600px]">
                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Placa</th>
                            <th className="px-6 py-4">Vehículo</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {inspecciones.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition duration-100">
                              <td className="px-6 py-5 font-mono text-xs text-slate-400 whitespace-nowrap">{item.id}</td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <span className="inline-block bg-slate-900 text-white px-3 py-1.5 rounded-md font-mono font-bold border border-slate-800 text-xs tracking-wider shadow-sm">
                                  {item.placa}
                                </span>
                              </td>
                              <td className="px-6 py-5 font-semibold text-slate-800 whitespace-nowrap">{item.marca}</td>
                              <td className="px-6 py-5 text-slate-500 whitespace-nowrap">{item.fecha}</td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border ${
                                  item.estado === "Completado" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                  item.estado === "En Proceso" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                  "bg-slate-50 text-slate-600 border-slate-200"
                                }`}>
                                  {item.estado}
                                </span>
                              </td>
                              <td className="px-6 py-5 text-right whitespace-nowrap">
                                <button 
                                  onClick={() => {
                                    setIsInspecting(true);
                                    setInspectionStep('Documentacion');
                                  }}
                                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-150"
                                >
                                  Editar Peritaje
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Estadisticas' && (
                <div className="bg-white border border-slate-200/80 p-8 rounded-xl shadow-sm text-center">
                  <h2 className="text-lg font-bold text-slate-900">Estadísticas de Peritaje</h2>
                  <p className="text-slate-500 text-sm mt-2">Próximamente métricas avanzadas e informes consolidados.</p>
                </div>
              )}

              {activeTab === 'Configuracion' && (
                <div className="bg-white border border-slate-200/80 p-8 rounded-xl shadow-sm text-center">
                  <h2 className="text-lg font-bold text-slate-900">Configuración del Sistema</h2>
                  <p className="text-slate-500 text-sm mt-2">Administración de perfiles, firmas digitales y parámetros RUNT.</p>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}