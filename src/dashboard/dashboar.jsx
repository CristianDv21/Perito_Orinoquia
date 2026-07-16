export default function Dashboard({ onLogout }) {
  const inspecciones = [
    { id: "V-001", placa: "XYZ-123", marca: "Toyota Hilux", estado: "Pendiente", fecha: "15/07/2026" },
    { id: "V-002", placa: "ABC-890", marca: "Chevrolet D-Max", estado: "En Proceso", fecha: "15/07/2026" },
    { id: "V-003", placa: "KLP-456", marca: "Ford Ranger", estado: "Completado", fecha: "14/07/2026" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Barra de Navegación Profesional */}
      <nav className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Perito <span className="text-blue-600">Orinoquia</span>
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-md border border-blue-100">
              Módulo de Inspección
            </span>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg transition duration-150 bg-white"
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Panel de Diagnóstico</h1>
            <p className="text-slate-500 mt-0.5 text-sm">Registro, control y seguimiento de peritajes vehiculares.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white rounded-lg shadow transition duration-150 self-start md:self-auto">
            Nueva Inspección
          </button>
        </div>

        {/* Tarjetas de Métricas Corporativas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inspecciones Hoy</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">3</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm border-l-4 border-l-amber-500">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">En proceso</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">1</p>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completadas</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">1</p>
          </div>
        </div>

        {/* Tabla de Inspecciones Limpia */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Últimos Vehículos Registrados</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Placa</th>
                  <th className="px-6 py-3">Vehículo</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Estado</th>
                  <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inspecciones.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition duration-100">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{item.id}</td>
                    <td className="px-6 py-4"><span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded font-bold border border-slate-200 text-xs">{item.placa}</span></td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.marca}</td>
                    <td className="px-6 py-4 text-slate-500">{item.fecha}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        item.estado === "Completado" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        item.estado === "En Proceso" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                        "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}