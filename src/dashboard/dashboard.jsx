import { useState } from "react";
import Documentacion from '../modules/Documentacion';
import Accesorios from '../modules/Accesorios';
import Motor from '../modules/Motor'; 
import VistaExterna from '../modules/VistaExterna'; 
import VistaInterna from '../modules/VistaInterna';
import Firma from '../modules/Firmas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import InformePdf from '../modules/informePdf';

export default function Dashboard({ onLogout }) {

  // --- ESTADOS DE CONTROL DE INTERFAZ ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Bandeja');
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionStep, setInspectionStep] = useState('Documentacion'); // Paso actual del peritaje

  // --- ESTADO GENERAL DE PERITAJE ---
  const [peritajeData, setPeritajeData] = useState({
    // Módulo 1: Datos & RUNT Ampliado
    placa: '',
    marca: '',
    linea: '',
    modelo: '',
    numMotor: '',
    numChasis: '',
    organismoTransito: '',
    comentariosSiniestros: '',
    
    // Control de Documentos Legales y Archivos Binarios
    numeroSoat: '',
    entityEmisoraSoat: '',
    venceSoat: '',
    soatAlDia: true,
    fotoSoat: null, 
    
    numeroControlRtm: '',
    cdaEmisor: '',
    venceTecnicoMecanica: '',
    tecnicoMecanicaAlDia: true,
    fotoRtm: null, 
    
    coincidePropietarioRunt: true,
    tieneEmbargosOAlertas: false,
    restriccionBlindaje: 'sin_blindaje',

    // Módulo 2: Accesorios
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
    llantasData: {
      delantera_der: { marca: '', medida: '', profundidad_mm: '', porcentaje_vida: '' },
      delantera_izq: { marca: '', medida: '', profundidad_mm: '', porcentaje_vida: '' },
      trasera_der:  { marca: '', medida: '', profundidad_mm: '', porcentaje_vida: '' },
      trasera_izq:  { marca: '', medida: '', profundidad_mm: '', porcentaje_vida: '' },
      repuesto:     { marca: '', medida: '', profundidad_mm: '', porcentaje_vida: '' }
    },
    accesoriosObservaciones: '',
    accesoriosCosto: 0,

    // Módulo 3: Motor
    compresionMotor: '',
    fugasAceite: false,
    estadoBateria: 'Bueno',
    ruidosExtranos: false,
    motorObservaciones: '',

    // Módulo 4: Estructura & Pintura
    danosExternos: {},
    tiempoEstimadoReparacion: '',

    // Módulo 5: Cierre & Reporte
    firmaInspector: null,
    estadoGeneralVehiculo: 'Aceptable',
    conceptoFinal: '',

    scoreEstructura: 100,
    scoreCarroceria: 100,
    scoreMecanica: 100,
    scoreElectrico: 100,
    scoreLegal: 100
  });

  // --- DATOS ESTÁTICOS DE NAVEGACIÓN ---
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
    { id: 'VistaInterna', label: '5. Vista Interna', icon: '👀' },
    { id: 'Firma', label: '6. Firma Digital', icon: '🖋️' },
    { id: 'PDF', label: '7. Reporte & PDF', icon: '📋' },
  ];

  const inspecciones = [
    { 
      id: 'PER-001', 
      fechaPeritaje: '17/07/26 - 14:15', 
      marca: 'CHEVROLET', 
      modelo: 'TRAVERSE', 
      anioModelo: '2017', 
      km: '157.700', 
      placa: 'DOL507', 
      sucursalVendedor: 'Mg Yopal', 
      sucursalInspeccion: 'Mg Yopal', 
      vendedor: 'Cristian Eduardo Castillo Triana', 
      inspector: 'Kevin Osorio', 
      costoReparacion: '$1,400,000', 
      tiempoReparacion: '0 días', 
      estado: 'Completado' 
    },
    { 
      id: 'PER-002', 
      fechaPeritaje: '24/07/26 - 16:03', 
      marca: 'CHEVROLET', 
      modelo: 'JOY', 
      anioModelo: '2022', 
      km: '53.500', 
      placa: 'KST810', 
      sucursalVendedor: 'Chevrolet Yopal', 
      sucursalInspeccion: 'Chevrolet Yopal', 
      vendedor: 'Yuly Martinez', 
      inspector: 'Kevin Osorio', 
      costoReparacion: '$500,000', 
      tiempoReparacion: '0 días', 
      estado: 'En Proceso' 
    },
    { 
      id: 'PER-003', 
      fechaPeritaje: '23/07/26 - 22:07', 
      marca: 'JAC', 
      modelo: 'REFINE', 
      anioModelo: '2013', 
      km: '275.000', 
      placa: 'SPD868', 
      sucursalVendedor: 'Chevrolet Yopal', 
      sucursalInspeccion: 'Chevrolet Yopal', 
      vendedor: 'Joiner Requiniva', 
      inspector: 'Kevin Osorio', 
      costoReparacion: '$550,000', 
      tiempoReparacion: '0 días', 
      estado: 'Completado' 
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleDataChange = (updatedFields) => {
    setPeritajeData((prev) => ({
      ...prev,
      ...updatedFields
    }));
  };

  const handleDescargarPDF = (item) => {
    const data = peritajeData; 

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const colorPrimario = [8, 13, 26]; 
    const colorSecundario = [37, 99, 235]; 
    const colorExito = [16, 185, 129]; 
    const colorGris = [100, 116, 139]; 

    doc.setFillColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
    doc.rect(160, 0, 50, 10, 'F');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text('PERITO ORINOQUIA', 14, 20);
    
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('CONSOLA DE PERITAJE TÉCNICO AUTOMOTRIZ', 14, 26);
    doc.text('Sede Central: Yopal, Casanare', 14, 31);

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(135, 14, 61, 18, 2, 2, 'FD');
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text(`INSPECCIÓN: ${item.id}`, 139, 20);
    doc.text(`FECHA: ${item.fechaPeritaje}`, 139, 25);
    doc.text(`ESTADO: ${item.estado.toUpperCase()}`, 139, 30);

    doc.setDrawColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]); 
    doc.setLineWidth(0.8);
    doc.line(14, 36, 196, 36);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
    doc.text('1. INFORMACIÓN GENERAL DEL VEHÍCULO', 14, 44);

    autoTable(doc, {
      startY: 47,
      theme: 'grid',
      headStyles: { fillColor: colorPrimario, fontStyle: 'bold', fontSize: 9 },
      bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [248, 250, 252], width: 35 },
        2: { fontStyle: 'bold', fillColor: [248, 250, 252], width: 35 }
      },
      body: [
        ['Placa:', item.placa || data.placa || 'N/A', 'Marca / Línea:', `${item.marca || data.marca || 'N/A'} ${data.linea || ''}`],
        ['Modelo / Año:', item.anioModelo || data.modelo || 'N/A', 'N° de Motor:', data.numMotor || 'N/A'],
        ['N° de Chasis:', data.numChasis || 'N/A', 'Organismo Tránsito:', data.organismoTransito || 'N/A'],
      ],
    });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
    doc.text('2. VERIFICACIÓN LEGAL Y DOCUMENTAL', 14, doc.lastAutoTable.finalY + 8);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 11,
      theme: 'striped',
      headStyles: { fillColor: [71, 85, 105], fontStyle: 'bold', fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      head: [['DOCUMENTO', 'NÚMERO DE CONTROL', 'ENTIDAD EMISORA', 'VENCIMIENTO', 'ESTADO']],
      body: [
        ['SOAT', data.numeroSoat || 'N/A', data.entityEmisoraSoat || 'N/A', data.venceSoat || 'N/A', data.soatAlDia ? 'AL DÍA' : 'VENCIDO'],
        ['RTM (Tecnicomecánica)', data.numeroControlRtm || 'N/A', data.cdaEmisor || 'N/A', data.venceTecnicoMecanica || 'N/A', data.tecnicoMecanicaAlDia ? 'AL DÍA' : 'VENCIDO'],
      ],
    });

    doc.setFillColor(254, 243, 199); 
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(14, doc.lastAutoTable.finalY + 4, 182, 12, 1, 1, 'FD');
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9);
    doc.text(`ALERTAS RUNT: Coincide Propietario: ${data.coincidePropietarioRunt ? 'SÍ' : 'NO'}  |  Posee Embargos/Alertas: ${data.tieneEmbargosOAlertas ? 'SÍ' : 'NO'}  |  Blindaje: ${data.restriccionBlindaje.toUpperCase()}`, 18, doc.lastAutoTable.finalY + 11);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
    doc.text('3. EVALUACIÓN COMPONENTES DEL MOTOR', 14, doc.lastAutoTable.finalY + 24);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 27,
      theme: 'grid',
      headStyles: { fillColor: colorPrimario, fontStyle: 'bold', fontSize: 8.5 },
      bodyStyles: { fontSize: 8.5 },
      body: [
        ['Compresión del Motor:', data.compresionMotor ? `${data.compresionMotor} PSI` : 'No registrada', 'Fugas de Aceite:', data.fugasAceite ? 'SÍ CORRESPONDE' : 'NO DETECTADAS'],
        ['Estado de la Batería:', data.estadoBateria, 'Ruidos Extraños:', data.ruidosExtranos ? 'SÍ DETECTADOS' : 'NO DETECTADOS'],
      ],
    });

    if (data.motorObservaciones) {
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
      doc.text(`Notas del Inspector: ${data.motorObservaciones}`, 14, doc.lastAutoTable.finalY + 5);
    }

    doc.addPage();

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text('PERITO ORINOQUIA - REPORTE TÉCNICO CONTINUACIÓN', 14, 15);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 18, 196, 18);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
    doc.text('4. INVENTARIO DE ACCESORIOS Y EQUIPAMIENTO', 14, 26);

    const filasAccesorios = data.accesoriosList.map(acc => [
      acc.name,
      acc.categoria,
      acc.presente ? 'SÍ' : 'NO',
      acc.danado ? 'MAL ESTADO' : 'OPERATIVO'
    ]);

    autoTable(doc, {
      startY: 29,
      theme: 'striped',
      headStyles: { fillColor: [71, 85, 105], fontStyle: 'bold', fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      head: [['ELEMENTO / ACCESORIO', 'CATEGORÍA', 'PRESENTE', 'ESTADO EVALUADO']],
      body: filasAccesorios,
      styles: { cellPadding: 1.5 }
    });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
    doc.text('5. ESTADO Y PROFUNDIDAD DE NEUMÁTICOS', 14, doc.lastAutoTable.finalY + 8);

    const filasLlantas = Object.entries(data.llantasData).map(([posicion, info]) => [
      posicion.toUpperCase().replace('_', ' '),
      info.marca || 'N/A',
      info.medida || 'N/A',
      info.profundidad_mm ? `${info.profundidad_mm} mm` : 'N/A',
      info.porcentaje_vida ? `${info.porcentaje_vida}%` : 'N/A'
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 11,
      theme: 'grid',
      headStyles: { fillColor: colorPrimario, fontStyle: 'bold', fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      head: [['POSICIÓN', 'MARCA', 'MEDIDA', 'PROFUNDIDAD', 'VIDA ÚTIL ESTIMADA']],
      body: filasLlantas,
    });

    const YFinal = doc.lastAutoTable.finalY + 12;
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
    doc.text('6. CONCEPTO FINAL DE EVALUACIÓN', 14, YFinal);

    const observacionesTexto = data.conceptoFinal || 'El vehículo se encuentra en condiciones óptimas operativas de acuerdo a la documentación examinada y pruebas dinámicas de motor realizadas en el departamento de Casanare.';
    const textoDividido = doc.splitTextToSize(observacionesTexto, 174);
    const lineasTexto = textoDividido.length;
    const altoCuadro = 12 + (lineasTexto * 4);

    doc.setDrawColor(209, 213, 219);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, YFinal + 3, 182, altoCuadro, 1, 1, 'FD');

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text(`ESTADO GENERAL DEL AUTOMOTOR:`, 18, YFinal + 9);
    
    doc.setFontSize(10);
    doc.setTextColor(colorExito[0], colorExito[1], colorExito[2]);
    doc.text(`${data.estadoGeneralVehiculo.toUpperCase()}`, 78, YFinal + 9);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(textoDividido, 18, YFinal + 15, { width: 180 });
    doc.text(textoDividido, 18, YFinal + 15);

    const YFirma = YFinal + altoCuadro + 25;

    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.5);
    doc.line(14, YFirma, 74, YFirma);

    // Validación segura de la firma digital
    if (data.firmaInspector && typeof data.firmaInspector === 'string' && data.firmaInspector.startsWith('data:image')) {
      try {
        doc.addImage(data.firmaInspector, 'PNG', 16, YFirma - 22, 50, 20);
      } catch (e) {
        console.error("No se pudo cargar la firma en el PDF", e);
      }
    }

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colorPrimario[0], colorPrimario[1], colorPrimario[2]);
    doc.text('Firma del Inspector Autorizado', 14, YFirma + 4);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colorGris[0], colorGris[1], colorGris[2]);
    doc.text('Perito Certificado - Orinoquia', 14, YFirma + 8);

    doc.setFontSize(7.5);
    doc.text('Este documento es un dictamen técnico de inspección automotriz y no constituye un seguro contractual.', 14, 285);
    doc.text(`Página 2 de 2`, 180, 285);

    doc.save(`Peritaje_Orinoquia_${item.placa || 'VEHICULO'}.pdf`);
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
                  setIsInspecting(false); 
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
      <main className="flex-1 flex flex-1 flex-col min-w-0 w-full">
        
        {/* Topbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="lg:hidden text-slate-600 hover:text-slate-900 text-2xl">☰</button>
            <span className="text-xs font-semibold text-slate-400">Rol: Inspector Automotriz</span>
          </div>
          <span className="text-xs font-medium text-slate-500">Yopal, Casanare</span>
        </header>

        {/* Área de Trabajo Dinámica */}
        <div className="p-6 lg:p-8 space-y-8 overflow-y-auto flex-1">
          
          {/* MODO PERITAJE ACTIVO */}
          {isInspecting ? (
            <div className="space-y-6">
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

              {/* Stepper Horizontal */}
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

                    {inspectionStep === 'Motor' && (
                      <Motor data={peritajeData} onChange={handleDataChange} />
                    )}

                    {inspectionStep === 'Pintura' && (
                      <VistaExterna data={peritajeData} onChange={handleDataChange} />
                    )}

                    {inspectionStep === 'VistaInterna' && (
                      <VistaInterna data={peritajeData} onChange={handleDataChange} />
                    )}

                    {inspectionStep === 'Firma' && (
                      <Firma data={peritajeData} onChange={handleDataChange} />
                    )}
                    
                    {inspectionStep === 'PDF' && (
                      <InformePdf peritajeData={peritajeData} onChange={handleDataChange} />
                    )}
                  </div>
                </div>

                {/* Navegación inferior */}
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
                        alert("¡Guardando peritaje y preparando datos de sincronización!");
                        setIsInspecting(false);
                      }
                    }}
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                  >
                    {inspectionStep === 'PDF' ? 'Finalizar' : 'Siguiente Paso'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* VISTAS GENERALES DEL DASHBOARD (BANDEJA) ACTUALIZADA */
            <>
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
                  <p className="text-2xl font-bold text-slate-900 mt-2">2</p>
                </div>
              </div>

              {/* Tabla de Vehículos Completa */}
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-sm font-bold text-slate-900">HISTORIAL DE INSPECCIONES</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 min-w-[1200px]">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Fecha de Peritaje</th>
                        <th className="px-4 py-3">Marca</th>
                        <th className="px-4 py-3">Modelo</th>
                        <th className="px-4 py-3">Año del modelo</th>
                        <th className="px-4 py-3">Km</th>
                        <th className="px-4 py-3">Placa</th>
                        <th className="px-4 py-3">Sucursal Vendedor</th>
                        <th className="px-4 py-3">Sucursal Inspección</th>
                        <th className="px-4 py-3">Vendedor</th>
                        <th className="px-4 py-3">Inspector</th>
                        <th className="px-4 py-3">Costo reparación</th>
                        <th className="px-4 py-3">Tiempo de reparación</th>
                        <th className="px-4 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inspecciones.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition duration-100">
                          <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.fechaPeritaje}</td>
                          <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-800">{item.marca}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{item.modelo}</td>
                          <td className="px-4 py-4 whitespace-nowrap">{item.anioModelo}</td>
                          <td className="px-4 py-4 whitespace-nowrap font-mono">{item.km}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-block bg-slate-900 text-white px-2.5 py-1 rounded-md font-mono font-bold text-[11px] shadow-sm">
                              {item.placa}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.sucursalVendedor}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.sucursalInspeccion}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-slate-700">{item.vendedor}</td>
                          <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-800">{item.inspector}</td>
                          <td className="px-4 py-4 whitespace-nowrap font-semibold text-emerald-600">{item.costoReparacion}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.tiempoReparacion}</td>
                          <td className="px-4 py-4 text-right whitespace-nowrap">
                            {item.estado === "Completado" ? (
                              <button 
                                onClick={() => handleDescargarPDF(item)}
                                className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg shadow hover:bg-slate-800 transition duration-150"
                              >
                                ⬇️ PDF
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  setIsInspecting(true);
                                  setInspectionStep('Documentacion');
                                }}
                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-140"
                              >
                                Editar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}