import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const previsualizarPdfEstiloCliente = (peritajeData) => {
  const doc = generarInstanciaPdf(peritajeData);
  const pdfBlobUrl = doc.output('bloburl');
  window.open(pdfBlobUrl, '_blank');
};

export const generarPdfEstiloCliente = (peritajeData) => {
  const doc = generarInstanciaPdf(peritajeData);
  const placa = peritajeData?.placa;
  const nombreArchivo = `Peritaje_${placa ? placa.toUpperCase() : "REGISTRO"}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(nombreArchivo);
};

const PIEZAS_EXTERNAS = {
  carro: [
    { id: 'capo', name: 'Capó / Motor' },
    { id: 'techo', name: 'Techo' },
    { id: 'baul', name: 'Baúl / Compuerta' },
    { id: 'bomper_del', name: 'Bómper Delantero' },
    { id: 'bomper_tras', name: 'Bómper Trasero' },
    { id: 'puerta_del_izq', name: 'Puerta Delantera Izquierda' },
    { id: 'puerta_tras_izq', name: 'Puerta Trasera Izquierda' },
    { id: 'puerta_del_der', name: 'Puerta Delantera Derecha' },
    { id: 'puerta_tras_der', name: 'Puerta Trasera Derecha' },
    { id: 'guardabarro_del_izq', name: 'Guardabarro Delantero Izquierdo' },
    { id: 'guardabarro_tras_izq', name: 'Guardabarro Trasero Izquierdo' },
    { id: 'guardabarro_del_der', name: 'Guardabarro Delantero Derecho' },
    { id: 'guardabarro_tras_der', name: 'Guardabarro Trasero Derecho' },
  ],
  moto: [
    { id: 'carenaje_frontal', name: 'Carenaje / Máscara Frontal' },
    { id: 'guardafango_del', name: 'Guardafango Delantero' },
    { id: 'tanque_gasolina', name: 'Tanque de Gasolina' },
    { id: 'sillon_asiento', name: 'Asiento / Sillín' },
    { id: 'tapa_lateral_izq', name: 'Tapa Lateral Izquierda (Cacha)' },
    { id: 'tapa_lateral_der', name: 'Tapa Lateral Derecha (Cacha)' },
    { id: 'chasis_cuna', name: 'Chasis / Cuna de Dirección' },
    { id: 'tubo_escape', name: 'Tubo de Escape / Mofle' },
    { id: 'guardafango_tras', name: 'Guardafango Trasero' },
  ],
  pesado: [
    { id: 'bomper_pesado', name: 'Bómper y Defensa Frontal' },
    { id: 'parabrisas_pesado', name: 'Parabrisas y Vidrios Cabina' },
    { id: 'capo_motor_pesado', name: 'Capó / Tapa Motor' },
    { id: 'puerta_izq_pesado', name: 'Puerta Conductor' },
    { id: 'puerta_der_pesado', name: 'Puerta Pasajero' },
    { id: 'tanque_combustible_pesado', name: 'Tanques de Combustible' },
    { id: 'furgon_carroceria', name: 'Carrocería / Furgón / Estacas' },
    { id: 'carpa_lona', name: 'Carpa / Lona de Cobertura' },
    { id: 'compuerta_trasera_pesado', name: 'Compuerta / Puertas Traseras' },
  ],
  motocarro: [
    { id: 'carenaje_mcarro', name: 'Carenaje / Frente Motocarro' },
    { id: 'guardafango_del_mcarro', name: 'Guardafango Delantero' },
    { id: 'cabina_mcarro', name: 'Estructura Cabina / Techo' },
    { id: 'puerta_izq_mcarro', name: 'Puerta / Protección Izquierda' },
    { id: 'puerta_der_mcarro', name: 'Puerta / Protección Derecha' },
    { id: 'platoh_carga', name: 'Platón / Bodega de Carga' },
    { id: 'carpa_mcarro', name: 'Carpa Protectora' },
  ],
};

const ZONAS_INTERNAS = {
  carro: [
    { id: 'tapiceria_del', name: 'Silletería / Tapicería Delantera' },
    { id: 'tapiceria_tras', name: 'Silletería / Tapicería Trasera' },
    { id: 'tablero', name: 'Tablero de Instrumentos y Testigos' },
    { id: 'volante', name: 'Volante y Columnas de Dirección' },
    { id: 'cinturones', name: 'Cinturones de Seguridad y Airbags' },
    { id: 'cielo', name: 'Cielo raso / Tapizado de techo' },
    { id: 'alfombras', name: 'Alfombras y Pisos' },
    { id: 'paneles_puertas', name: 'Paneles y Tapizados de Puertas' },
  ],
  pesado: [
    { id: 'silla_conductor', name: 'Asiento Conductor (Neumático/Ergonómico)' },
    { id: 'silleteria_pasajeros_pesado', name: 'Silletería / Litera de Descanso' },
    { id: 'tablero_instrumentos_pesado', name: 'Tablero, Relojes y Tacógrafo' },
    { id: 'volante_columna_pesado', name: 'Volante y Mandos de Cabina' },
    { id: 'cinturones_seguridad_pesado', name: 'Cinturones y Sistemas de Retención' },
    { id: 'tapizado_techo_pesado', name: 'Revestimiento y Techo de Cabina' },
    { id: 'pisos_alfombras_pesado', name: 'Pisos, Pedales y Alfombras de Trabajo' },
    { id: 'paneles_puertas_pesado', name: 'Paneles de Puertas y Guantera' },
  ],
};

const ITEMS_MOTOR = {
  carro: [
    { key: 'fugasMotor', label: 'Estanqueidad del Motor (Fugas de Aceite)' },
    { key: 'fugasRefrigerante', label: 'Sistema de Refrigeración (Fugas / Radiador)' },
    { key: 'ruidosMotor', label: 'Componentes Internos (Ruidos / Cascabeleo)' },
    { key: 'correas', label: 'Correas de Accesorios (Estado / Tensión)' },
    { key: 'soportesMotor', label: 'Soportes de Motor y Caja' },
    { key: 'sistemaEscape', label: 'Sistema de Escape (Humo / Roturas)' },
    { key: 'bateria', label: 'Sistema Eléctrico y Batería (Bornes / Voltaje)' },
  ],
  moto: [
    { key: 'fugasMotor', label: 'Estanqueidad del Motor (Fugas de Aceite / Empaques)' },
    { key: 'ruidosMotor', label: 'Componentes Internos (Ruidos de Válvulas / Cadena)' },
    { key: 'transmisionSecundaria', label: 'Kit de Arrastre (Cadena, Sprocket / Correa)' },
    { key: 'sistemaEscape', label: 'Sistema de Escape / Mofle' },
    { key: 'bateria', label: 'Sistema Eléctrico y Batería (Carga / C.G.)' },
  ],
  pesado: [
    { key: 'fugasMotor', label: 'Estanqueidad del Motor (Fugas de Aceite / Turbo)' },
    { key: 'fugasRefrigerante', label: 'Sist. de Refrigeración (Intercooler / Radiador)' },
    { key: 'ruidosMotor', label: 'Componentes Internos (Ruidos de Motor)' },
    { key: 'correas', label: 'Correas y Tensores' },
    { key: 'soportesMotor', label: 'Soportes de Motor y Chasis' },
    { key: 'sistemaEscape', label: 'Escape y Freno de Motor / Acometida' },
    { key: 'bateria', label: 'Sistema Eléctrico y Baterías (24V / Bornes)' },
  ],
  motocarro: [
    { key: 'fugasMotor', label: 'Estanqueidad del Motor y Reversa' },
    { key: 'fugasRefrigerante', label: 'Sistema de Refrigeración (si aplica)' },
    { key: 'ruidosMotor', label: 'Componentes Internos / Embrague Centrífugo' },
    { key: 'transmisionSecundaria', label: 'Eje de Transmisión / Cardán / Cadena' },
    { key: 'sistemaEscape', label: 'Sistema de Escape' },
    { key: 'bateria', label: 'Sistema Eléctrico y Batería' },
  ],
};

// --- Listas de Detalles Técnicos actualizadas con soporte para Camionetas / SUVs ---
const ELEMENTOS_DETALLES_TECNICOS_AUTO = [
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

const ELEMENTOS_DETALLES_TECNICOS_CAMIONETA = [
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

const ELEMENTOS_DETALLES_TECNICOS_MOTO = [
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

const ELEMENTOS_DETALLES_TECNICOS_MOTOCARRO = [
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

// Posiciones aproximadas de cada pieza exterior sobre el esquema
const POSICIONES_DIAGRAMA_CARRO = {
  bomper_del: [0.5, 0.05], capo: [0.5, 0.16], techo: [0.5, 0.5], baul: [0.5, 0.84], bomper_tras: [0.5, 0.95],
  guardabarro_del_izq: [0.14, 0.15], puerta_del_izq: [0.1, 0.34], puerta_tras_izq: [0.1, 0.6], guardabarro_tras_izq: [0.14, 0.82],
  guardabarro_del_der: [0.86, 0.15], puerta_del_der: [0.9, 0.34], puerta_tras_der: [0.9, 0.6], guardabarro_tras_der: [0.86, 0.82],
};

const POSICIONES_DIAGRAMA_MOTO = {
  carenaje_frontal: [0.08, 0.42], guardafango_del: [0.13, 0.78], tanque_gasolina: [0.36, 0.28],
  sillon_asiento: [0.58, 0.32], tapa_lateral_izq: [0.5, 0.52], tapa_lateral_der: [0.62, 0.52],
  chasis_cuna: [0.34, 0.58], tubo_escape: [0.78, 0.66], guardafango_tras: [0.87, 0.78],
};

const POSICIONES_DIAGRAMA_PESADO = {
  bomper_pesado: [0.04, 0.62], parabrisas_pesado: [0.14, 0.28], capo_motor_pesado: [0.08, 0.5],
  puerta_izq_pesado: [0.22, 0.5], puerta_der_pesado: [0.22, 0.62], tanque_combustible_pesado: [0.38, 0.78],
  furgon_carroceria: [0.65, 0.42], carpa_lona: [0.65, 0.24], compuerta_trasera_pesado: [0.93, 0.5],
};

const POSICIONES_DIAGRAMA_MOTOCARRO = {
  carenaje_mcarro: [0.09, 0.42], guardafango_del_mcarro: [0.14, 0.78], cabina_mcarro: [0.26, 0.3],
  puerta_izq_mcarro: [0.3, 0.5], puerta_der_mcarro: [0.34, 0.58], platoh_carga: [0.7, 0.5], carpa_mcarro: [0.7, 0.26],
};

const POSICIONES_DIAGRAMA_POR_TIPO = {
  carro: POSICIONES_DIAGRAMA_CARRO,
  moto: POSICIONES_DIAGRAMA_MOTO,
  pesado: POSICIONES_DIAGRAMA_PESADO,
  motocarro: POSICIONES_DIAGRAMA_MOTOCARRO,
};

const COLOR_POR_TIPO_DANO = {
  'Golpe': [220, 38, 38],
  'Abolladura': [234, 88, 12],
  'Rayón': [217, 119, 6],
  'Repintado': [147, 51, 234],
};

export const generarInstanciaPdf = (peritajeData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  const data = peritajeData || {};
  const {
    placa, marca, linea, modelo, numMotor, numChasis, color, version,
    kilometraje, cilindrada, tipoTransmision, traccion, estadoTransmision, tipoVehiculo,
    venceSoat, soatAlDia, archivoSoat,
    venceTecnicoMecanica, tecnicoMecanicaAlDia, archivoTecnicoMecanica,
    siniestros, tarjetaOperacion, configuracionEjes,
    clienteNombre, clienteDocumento, clienteTelefono,
    sucursalVendedorNombre, sucursalInspeccionNombre, vendedorNombre, inspectorNombre,
    accesoriosList, sistemasMecanicos, comentariosMotor,
    danosExternos, danosInternos, detallesTecnicos,
    firmaInspector,
    firmaCliente, // <-- Se añade la propiedad de la firma del cliente / solicitante
    tiempoCompletitud, fechaPeritaje,
  } = data;

  const compresionCilindros = [1, 2, 3, 4]
    .map((n) => data[`compresionCil${n}`])
    .filter(Boolean);

  const detalles = detallesTecnicos || {};
  const porcentajeBateria = detalles.porcentajeBateria;
  const vidaUtilBateria = detalles.vidaUtilBateria;
  const costoAlistamiento = detalles.costoAlistamiento;
  const costoReparacion = detalles.costoReparacion;
  const comentariosGenerales = detalles.comentariosGenerales;

  const extraerTexto = (campo) => {
    if (!campo) return "N/A";
    if (typeof campo === 'object') {
      return campo.nombre || campo.nombres || campo.name || campo.label || campo.descripcion || "N/A";
    }
    return String(campo);
  };

  const tipoStr = (tipoVehiculo || data.tipoVehiculoId || data.tipo_vehiculo_id || "carro").toLowerCase();
  const esMoto = tipoStr === "moto";
  const esMotocarro = tipoStr === "motocarro";
  const esPesado = tipoStr === "pesado";
  const esCamioneta = tipoStr.includes("camioneta") || tipoStr.includes("campero") || tipoStr.includes("suv");

  const catalogoKey = ["carro", "moto", "pesado", "motocarro"].includes(tipoStr) ? tipoStr : "carro";
  
  // Selección dinámica de detalles técnicos según el tipo de vehículo evaluado
  const obtenerElementosTecnicos = () => {
    if (esCamioneta) return ELEMENTOS_DETALLES_TECNICOS_CAMIONETA;
    if (esMoto) return ELEMENTOS_DETALLES_TECNICOS_MOTO;
    if (esMotocarro) return ELEMENTOS_DETALLES_TECNICOS_MOTOCARRO;
    if (esPesado) return ELEMENTOS_DETALLES_TECNICOS_AUTO;
    return ELEMENTOS_DETALLES_TECNICOS_AUTO;
  };
  const elementosTecnicosTipo = obtenerElementosTecnicos();

  const colorFondoBarra = [41, 55, 77];
  const colorTextoBarra = [255, 255, 255];
  const colorTextoNegro = [30, 41, 59];
  const colorBordeGrid = [203, 213, 225];

  let currentY = 33;

  const asegurarEspacio = (alturaNecesaria) => {
    if (currentY + alturaNecesaria > 268) {
      doc.addPage();
      currentY = 15;
    }
  };

  const agregarBarraSeccion = (titulo) => {
    asegurarEspacio(10);
    doc.setFillColor(...colorFondoBarra);
    doc.rect(10, currentY, 196, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...colorTextoBarra);
    doc.text(titulo.toUpperCase(), 108, currentY + 3.5, { align: "center" });
    currentY += 5;
  };

  const tablaSimple = (body, styleOverrides = {}) => {
    autoTable(doc, {
      startY: currentY,
      margin: { left: 10, right: 10, top: 14 },
      theme: "grid",
      styles: { fontSize: 6.5, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
      body,
      ...styleOverrides,
    });
    currentY = doc.lastAutoTable.finalY;
  };

  // --- ENCABEZADO PRINCIPAL (con logo) ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...colorBordeGrid);
  doc.roundedRect(10, 8, 196, 22, 1, 1, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("LLANCIGRANDE", 32, 16);

  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`USADOS • INSPECCIÓN ${esMoto ? 'MOTOCICLETA' : esPesado ? 'VEHÍCULO PESADO' : 'AUTOMOTRIZ'}`, 32, 20.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...colorTextoNegro);

  const vehiculoTexto = [marca, linea, modelo].filter(Boolean).join(" ");
  doc.text(`Peritaje ${vehiculoTexto || "Vehículo"} Placa:`.trim(), 105, 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 64, 175);
  doc.text(placa ? placa.toUpperCase() : "SIN PLACA", 168, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...colorTextoNegro);
  doc.text(`Sucursal: ${sucursalVendedorNombre ? extraerTexto(sucursalVendedorNombre) : "N/A"}`, 105, 16);
  doc.text(`Inspector: ${inspectorNombre ? extraerTexto(inspectorNombre) : "N/A"}`, 150, 16);
  doc.text(`Cliente: ${clienteNombre || "N/A"}`, 105, 20);
  doc.text(`Vendedor: ${vendedorNombre ? extraerTexto(vendedorNombre) : "N/A"}`, 150, 20);
  doc.text(`Fecha: ${fechaPeritaje || new Date().toLocaleString()}`, 105, 24);
  doc.text(`Tiempo de completitud: ${tiempoCompletitud || "N/A"}`, 150, 24);

  // --- 1. DATOS DEL VEHÍCULO ---
  agregarBarraSeccion("1. Datos del vehículo");
  tablaSimple([
    ["VERSIÓN / LÍNEA:", version || linea || "N/A", "KILOMETRAJE:", kilometraje ? `${kilometraje} km` : "N/A", "CILINDRADA:", cilindrada || "N/A"],
    ["TRANSMISIÓN:", tipoTransmision || "N/A", "TRACCIÓN:", traccion || "N/A", "COLOR:", color || "N/A"],
    ["ESTADO CONJUNTO/CAJA:", estadoTransmision || "N/A", "COMPRESIÓN (PSI):", compresionCilindros.length ? compresionCilindros.join(" / ") : "N/A", "N° MOTOR:", numMotor || "N/A"],
  ]);

  // --- 2. DOCUMENTACIÓN ---
  agregarBarraSeccion("2. Documentación");
  const filasDocumentacion = [
    ["Sucursal Vendedor", sucursalVendedorNombre ? extraerTexto(sucursalVendedorNombre) : "N/A", "Sucursal Inspección", sucursalInspeccionNombre ? extraerTexto(sucursalInspeccionNombre) : "N/A"],
    ["Cliente / Propietario", clienteNombre || "N/A", "Documento Cliente", clienteDocumento || "N/A"],
    ["Teléfono Cliente", clienteTelefono || "N/A", "Número de Chasis", numChasis || "N/A"],
    ["SOAT vigente", soatAlDia ? "Sí" : "No", "Vencimiento SOAT", venceSoat || "N/A"],
    ["Técnico-mecánica vigente", tecnicoMecanicaAlDia ? "Sí" : "No", "Vencimiento RTM", venceTecnicoMecanica || "N/A"],
    ["Soporte SOAT adjunto", archivoSoat?.name ? `Sí (${archivoSoat.name})` : "No", "Soporte RTM adjunto", archivoTecnicoMecanica?.name ? `Sí (${archivoTecnicoMecanica.name})` : "No"],
  ];
  if (esPesado) {
    filasDocumentacion.push(["N° Tarjeta de Operación", tarjetaOperacion || "N/A", "Configuración de Ejes", configuracionEjes || "N/A"]);
  }
  tablaSimple(filasDocumentacion);
  tablaSimple([[`Historial de siniestros / antecedentes: ${siniestros || "Sin observaciones."}`]]);

  // --- 3. ACCESORIOS Y EQUIPAMIENTOS ---
  agregarBarraSeccion("3. Accesorios y equipamientos");
  const listaAccesorios = Array.isArray(accesoriosList) ? accesoriosList : [];
  let accesoriosBody = [];
  let filaAcc = [];
  listaAccesorios.forEach((item) => {
    const valor = item.tipo === 'seleccion_multiple'
      ? (item.seleccion || item.opciones?.[0] || "N/A")
      : (item.presente ? "Sí" : "No");
    const etiqueta = item.danado ? `${item.name} ⚠` : item.name;
    filaAcc.push(etiqueta, valor);
    if (filaAcc.length === 4) {
      accesoriosBody.push(filaAcc);
      filaAcc = [];
    }
  });
  if (filaAcc.length > 0) {
    while (filaAcc.length < 4) filaAcc.push("", "");
    accesoriosBody.push(filaAcc);
  }
  if (accesoriosBody.length === 0) {
    accesoriosBody = [["Sin accesorios registrados en este peritaje.", "", "", ""]];
  }
  tablaSimple(accesoriosBody, { styles: { fontSize: 6, textColor: colorTextoNegro, cellPadding: 0.8, lineColor: colorBordeGrid } });

  const accesoriosDanados = listaAccesorios.filter((i) => i.danado);
  if (accesoriosDanados.length > 0) {
    autoTable(doc, {
      startY: currentY,
      margin: { left: 10, right: 10, top: 14 },
      theme: "grid",
      head: [["Accesorio dañado", "Comentario", "Costo reparación"]],
      headStyles: { fillColor: [254, 226, 226], textColor: [153, 27, 27], fontSize: 6, cellPadding: 1 },
      styles: { fontSize: 6, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
      body: accesoriosDanados.map((i) => [i.name, i.comentarioDaño || "N/A", i.costoReparacion ? `$ ${i.costoReparacion}` : "N/A"]),
    });
    currentY = doc.lastAutoTable.finalY;
  }

  // --- 4. MOTOR ---
  agregarBarraSeccion("4. Motor");
  const itemsMotorTipo = ITEMS_MOTOR[catalogoKey] || ITEMS_MOTOR.carro;
  const sistemas = sistemasMecanicos || {};
  const motorBody = itemsMotorTipo.map((item) => {
    const st = sistemas[item.key] || { estado: "N/A", observaciones: "" };
    return [item.label, st.estado || "N/A", st.observaciones || "Sin observaciones."];
  });
  autoTable(doc, {
    startY: currentY,
    margin: { left: 10, right: 10, top: 14 },
    theme: "grid",
    head: [["Componente", "Estado", "Observaciones"]],
    headStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontSize: 6.5, cellPadding: 1 },
    styles: { fontSize: 6, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
    body: motorBody,
  });
  currentY = doc.lastAutoTable.finalY;
  if (comentariosMotor) {
    tablaSimple([[`Concepto mecánico final: ${comentariosMotor}`]]);
  }

  // --- 5. VISTA EXTERNA ---
  agregarBarraSeccion("5. Vista Externa / Daños de Carrocería");
  const piezasTipo = PIEZAS_EXTERNAS[catalogoKey] || PIEZAS_EXTERNAS.carro;
  const danosExt = danosExternos || {};
  const piezasConDano = piezasTipo.filter((p) => danosExt[p.id] && danosExt[p.id].tipo && danosExt[p.id].tipo !== 'Ninguno');
  autoTable(doc, {
    startY: currentY,
    margin: { left: 10, right: 10, top: 14 },
    theme: "grid",
    head: [["Pieza", "Hallazgo", "Micras (μm)", "Comentario"]],
    headStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontSize: 6.5, cellPadding: 1 },
    styles: { fontSize: 6, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
    body: piezasConDano.length > 0
      ? piezasConDano.map((p) => [p.name, danosExt[p.id].tipo, danosExt[p.id].micras || "N/A", danosExt[p.id].comentario || "N/A"])
      : [["Sin novedades: todas las piezas evaluadas se encuentran en buen estado.", "", "", ""]],
  });
  currentY = doc.lastAutoTable.finalY;

  // --- 6. VISTA INTERNA ---
  if (!esMoto && !esMotocarro) {
    agregarBarraSeccion("6. Vista Interna / Cabina");
    const zonasTipo = ZONAS_INTERNAS[catalogoKey] || ZONAS_INTERNAS.carro;
    const danosInt = danosInternos || {};
    autoTable(doc, {
      startY: currentY,
      margin: { left: 10, right: 10, top: 14 },
      theme: "grid",
      head: [["Zona", "Estado", "Desgaste", "Comentario"]],
      headStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontSize: 6.5, cellPadding: 1 },
      styles: { fontSize: 6, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
      body: zonasTipo.map((z) => {
        const info = danosInt[z.id];
        return [z.name, info?.estado || "Óptimo", info?.desgaste || "Normal", info?.comentario || "N/A"];
      }),
    });
    currentY = doc.lastAutoTable.finalY;
  }

  // --- 7. DETALLES TÉCNICOS ---
  agregarBarraSeccion("7. Detalles Técnicos");
  autoTable(doc, {
    startY: currentY,
    margin: { left: 10, right: 10, top: 14 },
    theme: "grid",
    head: [["Elemento", "Estado", "Comentario", "Costo"]],
    headStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontSize: 6.5, cellPadding: 1 },
    styles: { fontSize: 6, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid },
    body: elementosTecnicosTipo.map((el) => {
      const it = detalles[el.id] || {};
      return [el.nombre, it.dañado ? "Dañado" : "Bueno", it.comentario || "N/A", it.costo ? `$ ${it.costo}` : "N/A"];
    }),
  });
  currentY = doc.lastAutoTable.finalY;

  // --- 8. VEHÍCULOS HÍBRIDOS / ELÉCTRICOS ---
  const esHibridoOElectrico = (tipoStr.includes("híbrido") || tipoStr.includes("hibrido") || tipoStr.includes("eléctrico") || tipoStr.includes("electrico") || porcentajeBateria !== undefined);
  if (esHibridoOElectrico) {
    agregarBarraSeccion("8. Vehículos Híbridos / Eléctricos");
    tablaSimple([
      ["PORCENTAJE RESTANTE DE LA BATERÍA:", `${porcentajeBateria || "N/A"} %`, "VIDA ÚTIL DE LA BATERÍA:", vidaUtilBateria || "N/A"],
    ], { styles: { fontSize: 6, textColor: colorTextoNegro, cellPadding: 1, lineColor: colorBordeGrid } });
  }

  // --- COMENTARIOS GENERALES Y COSTOS ---
  tablaSimple([[`Comentarios generales: ${comentariosGenerales || "Sin observaciones."}`]]);
  tablaSimple([
    ["Costo Mano de Obra:", `$ ${costoAlistamiento || "0"}`],
    ["Costo total de reparación:", `$ ${costoReparacion || "0"}`],
  ], { styles: { fontSize: 6.5, textColor: colorTextoNegro, cellPadding: 1, halign: "right", lineColor: colorBordeGrid } });

  // --- BLOQUE DE FIRMAS: INSPECTOR Y CLIENTE / SOLICITANTE ---
  agregarBarraSeccion(esMoto ? "9. Firmas de Autorización e Inspección" : "10. Firmas de Autorización e Inspección");
  asegurarEspacio(32);
  
  // Dos cuadros de firma lado a lado (Inspector a la izquierda, Solicitante a la derecha)
  const anchoCajaFirma = 94;
  const altoCajaFirma = 26;
  
  // Cuadro Firma Inspector
  doc.setDrawColor(...colorBordeGrid);
  doc.roundedRect(10, currentY, anchoCajaFirma, altoCajaFirma, 1, 1, "S");
  if (firmaInspector) {
    try {
      const formato = firmaInspector.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(firmaInspector, formato, 14, currentY + 2, 45, 16, undefined, "FAST");
    } catch {
      doc.text("Firma no disponible.", 14, currentY + 12);
    }
  } else {
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text("Firma del inspector no registrada.", 14, currentY + 14);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...colorTextoNegro);
  doc.text(`Inspector: ${inspectorNombre ? extraerTexto(inspectorNombre) : "N/A"}`, 14, currentY + 22);

  // Cuadro Firma Cliente / Solicitante
  doc.roundedRect(112, currentY, anchoCajaFirma, altoCajaFirma, 1, 1, "S");
  if (firmaCliente) {
    try {
      const formato = firmaCliente.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(firmaCliente, formato, 116, currentY + 2, 45, 16, undefined, "FAST");
    } catch {
      doc.text("Firma no disponible.", 116, currentY + 12);
    }
  } else {
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text("Firma del solicitante no registrada.", 116, currentY + 14);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...colorTextoNegro);
  doc.text(`Solicita Peritaje: ${clienteNombre || "N/A"}`, 116, currentY + 21);
  doc.setFont("helvetica", "normal");
  doc.text(`Doc: ${clienteDocumento || "N/A"}`, 116, currentY + 24.5);

  currentY += 28;

  // ==========================================================================
  // PÁGINA FINAL: ESQUEMA DE INSPECCIÓN + RESUMEN VISUAL
  // ==========================================================================
  doc.addPage();
  currentY = 15;
  agregarBarraSeccion("Resumen Visual de la Inspección");

  const calcularPorcentaje = () => {
    let puntos = 0;
    let total = 0;

    listaAccesorios.forEach(() => { total += 1; });
    listaAccesorios.forEach((i) => { puntos += i.danado ? 0 : 1; });

    itemsMotorTipo.forEach((item) => {
      total += 1;
      const st = sistemas[item.key]?.estado;
      puntos += st === "MALO" ? 0 : st === "REGULAR" ? 0.5 : 1;
    });

    piezasTipo.forEach((p) => {
      total += 1;
      const t = danosExt[p.id]?.tipo;
      if (!t || t === "Ninguno") puntos += 1;
      else if (t === "Rayón" || t === "Repintado") puntos += 0.5;
    });

    if (!esMoto && !esMotocarro) {
      (ZONAS_INTERNAS[catalogoKey] || []).forEach((z) => {
        total += 1;
        const est = danosInternos?.[z.id]?.estado;
        puntos += est === "Dañado" ? 0 : est === "Regular" ? 0.5 : 1;
      });
    }

    elementosTecnicosTipo.forEach((el) => {
      total += 1;
      puntos += detalles[el.id]?.dañado ? 0 : 1;
    });

    if (total === 0) return 100;
    return (puntos / total) * 100;
  };
  const porcentajeGeneral = calcularPorcentaje();

  const dx = 45, dy = currentY + 4, dw = 80, dh = catalogoKey === "carro" ? 130 : 60;
  doc.setDrawColor(...colorBordeGrid);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(dx, dy, dw, dh, 3, 3, "FD");

  if (catalogoKey === "carro") {
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(dx + dw * 0.18, dy + dh * 0.04, dw * 0.64, dh * 0.92, 8, 8, "F");
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.roundedRect(dx + dw * 0.18, dy + dh * 0.04, dw * 0.64, dh * 0.92, 8, 8, "S");
    doc.setFillColor(203, 213, 225);
    doc.roundedRect(dx + dw * 0.26, dy + dh * 0.30, dw * 0.48, dh * 0.30, 4, 4, "F");
    doc.setFillColor(71, 85, 105);
    [0.14, 0.86].forEach((fx) => {
      [0.18, 0.82].forEach((fy) => {
        doc.roundedRect(dx + dw * fx - 3, dy + dh * fy - 6, 6, 12, 1.5, 1.5, "F");
      });
    });
  } else {
    doc.setFillColor(226, 232, 240);
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.3);
    doc.roundedRect(dx + dw * 0.06, dy + dh * 0.28, dw * 0.88, dh * 0.34, 6, 6, "FD");
    if (catalogoKey === "pesado") {
      doc.roundedRect(dx + dw * 0.06, dy + dh * 0.12, dw * 0.26, dh * 0.5, 4, 4, "FD");
      doc.roundedRect(dx + dw * 0.55, dy + dh * 0.16, dw * 0.40, dh * 0.46, 3, 3, "FD");
    } else {
      doc.roundedRect(dx + dw * 0.28, dy + dh * 0.14, dw * 0.30, dh * 0.24, 4, 4, "FD");
    }
    doc.setFillColor(71, 85, 105);
    const radioLlanta = dh * 0.16;
    [0.14, 0.86].forEach((fx) => {
      doc.circle(dx + dw * fx, dy + dh * 0.62 + radioLlanta * 0.5, radioLlanta, "F");
      doc.setFillColor(226, 232, 240);
      doc.circle(dx + dw * fx, dy + dh * 0.62 + radioLlanta * 0.5, radioLlanta * 0.45, "F");
      doc.setFillColor(71, 85, 105);
    });
  }

  const posiciones = POSICIONES_DIAGRAMA_POR_TIPO[catalogoKey] || {};
  piezasTipo.forEach((p) => {
    const pos = posiciones[p.id];
    if (!pos) return;
    const info = danosExt[p.id];
    const px = dx + dw * pos[0];
    const py = dy + dh * pos[1];
    const colorPunto = info && info.tipo && info.tipo !== 'Ninguno' ? (COLOR_POR_TIPO_DANO[info.tipo] || [100, 116, 139]) : [16, 185, 129];
    doc.setFillColor(...colorPunto);
    doc.circle(px, py, 2.1, "F");
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.circle(px, py, 2.1, "S");
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...colorTextoNegro);
  doc.text(
    catalogoKey === "carro" ? "ESQUEMA DE CARROCERÍA (VISTA EN PLANTA)" : "ESQUEMA DE CARROCERÍA (VISTA LATERAL)",
    dx + dw / 2, dy + dh + 5, { align: "center" }
  );

  const leyenda = [
    ["Sin novedad", [16, 185, 129]],
    ["Rayón", COLOR_POR_TIPO_DANO['Rayón']],
    ["Abolladura", COLOR_POR_TIPO_DANO['Abolladura']],
    ["Golpe", COLOR_POR_TIPO_DANO['Golpe']],
    ["Repintado", COLOR_POR_TIPO_DANO['Repintado']],
  ];
  let leyendaY = dy + 4;
  const leyendaX = dx + dw + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...colorTextoNegro);
  doc.text("CONVENCIONES", leyendaX, leyendaY);
  leyendaY += 5;
  leyenda.forEach(([label, rgb]) => {
    doc.setFillColor(...rgb);
    doc.circle(leyendaX + 1.5, leyendaY - 1, 1.6, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...colorTextoNegro);
    doc.text(label, leyendaX + 5, leyendaY);
    leyendaY += 5.5;
  });

  currentY += (catalogoKey === "carro" ? 145 : 80);
  asegurarEspacio(20);
  autoTable(doc, {
    startY: currentY,
    margin: { left: 10, right: 10, top: 14 },
    theme: "grid",
    head: [[esMoto ? "ESTADO DE CHASIS / ESTRUCTURA" : "ESTADO GENERAL DE CARROCERÍA", "ESTADO MECÁNICO GENERAL"]],
    headStyles: { fillColor: [226, 232, 240], textColor: [15, 23, 42], fontStyle: "bold", fontSize: 6.5, cellPadding: 1.5, halign: "center" },
    styles: { fontSize: 6.5, textColor: colorTextoNegro, cellPadding: 1.5, halign: "center", lineColor: colorBordeGrid },
    body: [[`${porcentajeGeneral >= 80 ? "Bueno" : porcentajeGeneral >= 60 ? "Regular" : "Requiere atención"} (${Math.round(porcentajeGeneral)}%)`, `${itemsMotorTipo.length} componentes evaluados`]],
  });
  currentY = doc.lastAutoTable.finalY;

  // ==========================================================================
  // SET DE IMÁGENES
  // ==========================================================================
  const imagenes = [];
  piezasTipo.forEach((p) => {
    const info = danosExt[p.id];
    if (info?.foto) imagenes.push({ label: `Ext.: ${p.name}`, src: info.foto });
  });
  elementosTecnicosTipo.forEach((el) => {
    const info = detalles[el.id];
    if (info?.imagen) imagenes.push({ label: `Téc.: ${el.nombre}`, src: info.imagen });
  });
  if (archivoSoat?.dataUrl) imagenes.push({ label: "Soporte SOAT", src: archivoSoat.dataUrl });
  if (archivoTecnicoMecanica?.dataUrl) imagenes.push({ label: "Soporte Técnico-Mecánica", src: archivoTecnicoMecanica.dataUrl });

  if (imagenes.length > 0) {
    doc.addPage();
    currentY = 15;
    agregarBarraSeccion("Set de Imágenes del Peritaje");

    const cols = 3;
    const margenX = 10;
    const gap = 4;
    const cellW = (196 - gap * (cols - 1)) / cols;
    const cellH = cellW * 0.75;
    let col = 0;

    imagenes.forEach((img) => {
      asegurarEspacio(cellH + 8);
      const x = margenX + col * (cellW + gap);
      doc.setDrawColor(...colorBordeGrid);
      doc.roundedRect(x, currentY, cellW, cellH, 1.5, 1.5, "S");
      try {
        const formato = img.src.includes("image/png") ? "PNG" : "JPEG";
        doc.addImage(img.src, formato, x + 1, currentY + 1, cellW - 2, cellH - 2, undefined, "FAST");
      } catch {
        doc.setFontSize(6);
        doc.setTextColor(148, 163, 184);
        doc.text("Imagen no disponible", x + cellW / 2, currentY + cellH / 2, { align: "center" });
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.8);
      doc.setTextColor(...colorTextoNegro);
      doc.text(img.label, x + cellW / 2, currentY + cellH + 3.5, { align: "center", maxWidth: cellW });

      col += 1;
      if (col >= cols) {
        col = 0;
        currentY += cellH + 8;
      }
    });
  }

  return doc;
};