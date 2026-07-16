import { useState } from 'react';

export default function VistaExterna() {
  // Estado para almacenar los daños registrados en cada pieza
  const [damages, setDamages] = useState({});
  // Estado para la pieza actualmente seleccionada para edición
  const [selectedPiece, setSelectedPiece] = useState(null);
  // Estado para el formulario de registro de daños de la pieza seleccionada
  const [damageForm, setDamageForm] = useState({
    tipo: 'Golpe', // Golpe, Rayón, Abolladura[cite: 1]
    comentario: '',
    costo: '',
    foto: null
  });
  // Tiempo estimado de reparación en días[cite: 1]
  const [repairDays, setRepairDays] = useState('');

  // Listado de piezas mapeadas en el SVG interactivo[cite: 1]
  const carPieces = [
    { id: 'capo', name: 'Capó / Motor', x: 80, y: 35, width: 60, height: 50 },
    { id: 'parabrisas', name: 'Parabrisas', x: 80, y: 95, width: 60, height: 25 },
    { id: 'techo', name: 'Techo', x: 80, y: 130, width: 60, height: 70 },
    { id: 'luneta', name: 'Luneta Trasera', x: 80, y: 210, width: 60, height: 20 },
    { id: 'baul', name: 'Baúl / Compuerta', x: 80, y: 240, width: 60, height: 40 },
    { id: 'bomper_delantero', name: 'Bómper Delantero', x: 75, y: 10, width: 70, height: 15 },
    { id: 'bomper_trasero', name: 'Bómper Trasero', x: 75, y: 290, width: 70, height: 15 },
    { id: 'puerta_del_izq', name: 'Puerta Delantera Izq.', x: 40, y: 110, width: 30, height: 50 },
    { id: 'puerta_tra_izq', name: 'Puerta Trasera Izq.', x: 40, y: 170, width: 30, height: 50 },
    { id: 'puerta_del_der', name: 'Puerta Delantera Der.', x: 150, y: 110, width: 30, height: 50 },
    { id: 'puerta_tra_der', name: 'Puerta Trasera Der.', x: 150, y: 170, width: 30, height: 50 },
  ];

  // Al hacer clic en una pieza del carro[cite: 1]
  const handlePieceClick = (piece) => {
    setSelectedPiece(piece);
    // Si ya tiene un daño registrado, cargamos sus datos; si no, reiniciamos el formulario[cite: 1]
    if (damages[piece.id]) {
      setDamageForm(damages[piece.id]);
    } else {
      setDamageForm({ tipo: 'Golpe', comentario: '', costo: '', foto: null });
    }
  };

  // Guardar o actualizar el daño de la pieza seleccionada[cite: 1]
  const saveDamage = (e) => {
    e.preventDefault();
    setDamages({
      ...damages,
      [selectedPiece.id]: {
        ...damageForm,
        costo: parseFloat(damageForm.costo) || 0
      }
    });
    setSelectedPiece(null); // Cerrar panel de edición
  };

  // Eliminar el daño registrado en una pieza[cite: 1]
  const removeDamage = (pieceId) => {
    const updatedDamages = { ...damages };
    delete updatedDamages[pieceId];
    setDamages(updatedDamages);
    setSelectedPiece(null);
  };

  // Simulación de captura de fotos (Carga de archivos locales)[cite: 1]
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDamageForm({
        ...damageForm,
        foto: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  // Calcular automáticamente el costo total consolidado de reparaciones externas (HU-14)[cite: 1]
  const totalRepairCost = Object.values(damages).reduce((sum, item) => sum + (item.costo || 0), 0);

  return (
    <div className="space-y-8 text-slate-800">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA 1: MAPA INTERACTIVO 2D (HU-12)[cite: 1] */}
        <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center min-h-[450px]">
          <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
            Plano Interactivo del Vehículo
          </h3>
          <p className="text-xs text-slate-400 mb-6 text-center">
            Haz clic en la pieza exterior donde identificaste el daño para registrarlo[cite: 1].
          </p>

          {/* SVG Dinámico representando el automóvil visto desde arriba */}
          <svg 
            viewBox="0 0 220 320" 
            className="w-full max-w-[280px] drop-shadow-md cursor-pointer"
          >
            {/* Chasis Base (Fondo del carro) */}
            <rect x="70" y="20" width="80" height="280" rx="20" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

            {/* Renderizado dinámico de cada pieza interactiva */}
            {carPieces.map((piece) => {
              const hasDamage = !!damages[piece.id];
              const isSelected = selectedPiece?.id === piece.id;

              // Color dinámico según el estado de la pieza[cite: 1]
              let fillColor = "#ffffff"; // Por defecto: blanco (sin daño)
              let strokeColor = "#94a3b8"; // Gris medio

              if (hasDamage) {
                fillColor = "#fee2e2"; // Rojo suave (dañado)[cite: 1]
                strokeColor = "#ef4444"; // Borde rojo fuerte[cite: 1]
              }
              if (isSelected) {
                fillColor = "#dbeafe"; // Azul (seleccionado actualmente)
                strokeColor = "#3b82f6";
              }

              return (
                <g key={piece.id} onClick={() => handlePieceClick(piece)}>
                  <rect
                    x={piece.x}
                    y={piece.y}
                    width={piece.width}
                    height={piece.height}
                    rx="4"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    className="transition duration-150 hover:opacity-85"
                  />
                  {/* Etiqueta de texto simplificada sobre la pieza */}
                  <text
                    x={piece.x + piece.width / 2}
                    y={piece.y + piece.height / 2 + 3}
                    textAnchor="middle"
                    fill={hasDamage ? "#b91c1c" : "#475569"}
                    fontSize="6"
                    fontWeight="bold"
                    className="select-none pointer-events-none"
                  >
                    {piece.id === 'capo' ? 'CAPÓ' : piece.name.split(' ')[0].toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* COLUMNA 2: DETALLES DEL DAÑO (HU-13)[cite: 1] */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          {selectedPiece ? (
            <form onSubmit={saveDamage} className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Registrar Daño: <span className="text-blue-600">{selectedPiece.name}</span>
                </h3>
                <button 
                  type="button" 
                  onClick={() => setSelectedPiece(null)} 
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancelar
                </button>
              </div>

              {/* Selector de Tipo de Daño[cite: 1] */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Tipo de Daño</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Golpe', 'Rayón', 'Abolladura'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDamageForm({ ...damageForm, tipo: t })}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition ${
                        damageForm.tipo === t
                          ? "bg-red-50 text-red-700 border-red-300 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {t === 'Golpe' ? '💥 Golpe' : t === 'Rayón' ? '✏️ Rayón' : '🔨 Abollado'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Costo Estimado de Reparación[cite: 1] */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Costo Estimado ($ COP)</label>
                <input
                  required
                  type="number"
                  placeholder="Ej. 150000"
                  value={damageForm.costo}
                  onChange={(e) => setDamageForm({ ...damageForm, costo: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-blue-500 text-sm font-mono"
                />
              </div>

              {/* Comentarios de la avería[cite: 1] */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Observaciones</label>
                <textarea
                  rows="2"
                  placeholder="Detalles sobre la profundidad del daño o afectación estructural..."
                  value={damageForm.comentario}
                  onChange={(e) => setDamageForm({ ...damageForm, comentario: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-blue-500 text-sm"
                />
              </div>

              {/* Carga de Fotos (HU-13)[cite: 1] */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Evidencia Fotográfica</label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100/50 transition">
                    <span className="text-xl">📸</span>
                    <span className="text-[10px] text-slate-500 font-bold mt-1">Tomar / Subir Foto</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoChange} 
                    />
                  </label>
                  {damageForm.foto && (
                    <div className="w-20 h-20 border border-slate-200 rounded-lg overflow-hidden relative">
                      <img src={damageForm.foto} alt="Evidencia" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setDamageForm({ ...damageForm, foto: null })}
                        className="absolute top-0 right-0 bg-red-500 text-white text-[9px] p-0.5"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción del Formulario */}
              <div className="flex space-x-2 pt-2">
                {damages[selectedPiece.id] && (
                  <button
                    type="button"
                    onClick={() => removeDamage(selectedPiece.id)}
                    className="flex-1 py-2 text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition"
                  >
                    Eliminar Registro
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
                >
                  Guardar Daño
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-8 text-center flex flex-col items-center justify-center flex-1">
              <span className="text-3xl text-slate-300">👈</span>
              <p className="text-sm font-semibold text-slate-500 mt-3">Selecciona una pieza en el mapa</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[250px]">
                Puedes ir tocando cada parte del vehículo para documentar abolladuras, golpes o rayones encontrados[cite: 1].
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- SECCIÓN CONSOLIDADA (HU-14)[cite: 1] --- */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">
          Resumen Consolidado de Reparación Externa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Daños Registrados */}
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Piezas Afectadas</p>
            <p className="text-xl font-bold mt-1 text-red-400">
              {Object.keys(damages).length} {Object.keys(damages).length === 1 ? 'pieza' : 'piezas'}
            </p>
          </div>

          {/* Cálculo Automático de Costos (HU-14 - Escenario 1)[cite: 1] */}
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Presupuesto Estimado de Reparación</p>
            <p className="text-xl font-mono font-bold mt-1 text-emerald-400">
              ${totalRepairCost.toLocaleString('es-CO')} COP
            </p>
          </div>

          {/* Ingreso manual del tiempo estimado (HU-14 - Escenario 2)[cite: 1] */}
          <div>
            <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
              Tiempo Estimado de Taller (Días)
            </label>
            <input
              type="number"
              placeholder="Ej. 3"
              value={repairDays}
              onChange={(e) => setRepairDays(e.target.value)}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}