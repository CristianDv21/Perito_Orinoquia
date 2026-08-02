import { useState, useEffect } from "react";
import Documentacion from '../modules/Documentacion';
import Accesorios from '../modules/Accesorios';
import Motor from '../modules/Motor'; 
import VistaExterna from '../modules/VistaExterna'; 
import VistaInterna from '../modules/VistaInterna';
import Firma from '../modules/Firmas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import InformePdf from '../modules/informePdf';
import DetallesTecnicos from '../modules/DetallesTecnicos';
import api from '../api/axios';

export default function Dashboard({ onLogout }) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Bandeja');
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionStep, setInspectionStep] = useState('Documentacion');
  
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  
  // Estado para almacenar las inspecciones traídas de la base de datos
  const [inspecciones, setInspecciones] = useState([]);
  const [loadingInspecciones, setLoadingInspecciones] = useState(false);

  const [peritajeData, setPeritajeData] = useState({
    tipoVehiculo: '',
    placa: '',
    marca: '',
    linea: '',
    modelo: '',
    numMotor: '',
    numChasis: '',
    organismoTransito: '',
    comentariosSiniestros: '',
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
    accesoriosList: [],
    compresionMotor: '',
    fugasAceite: false,
    estadoBateria: 'Bueno',
    ruidosExtranos: false,
    motorObservaciones: '',
    danosExternos: {},
    tiempoEstimadoReparacion: '',
    firmaInspector: null,
    estadoGeneralVehiculo: 'Aceptable',
    conceptoFinal: '',
    scoreEstructura: 100,
    scoreCarroceria: 100,
    scoreMecanica: 100,
    scoreElectrico: 100,
    scoreLegal: 100
  });

  // 1. Declarar la función PRIMERO
  const fetchInspecciones = async () => {
    try {
      setLoadingInspecciones(true);
      const token = localStorage.getItem('auth_token');
      const response = await api.get('peritajes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      setInspecciones(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error al cargar las inspecciones:', error);
    } finally {
      setLoadingInspecciones(false);
    }
  };

  // 2. Usar el useEffect DESPUÉS
  useEffect(() => {
    let isMounted = true;

    const cargarDatos = async () => {
      if (activeTab === 'Bandeja') {
        try {
          if (isMounted) setLoadingInspecciones(true);
          const token = localStorage.getItem('auth_token');
          const response = await api.get('peritajes', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          if (isMounted) {
            setInspecciones(response.data.data || response.data || []);
          }
        } catch (error) {
          console.error('Error al cargar las inspecciones:', error);
        } finally {
          if (isMounted) {
            setLoadingInspecciones(false);
          }
        }
      }
    };

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const mainMenuItems = [
    { id: 'Perfil', label: 'Perfil', icon: '👤' },
    { id: 'Bandeja', label: 'Bandeja de Entrada', icon: '📥' },
    { id: 'Estadisticas', label: 'Estadísticas', icon: '📊' },
    { id: 'Configuracion', label: 'Configuración', icon: '⚙️' },
  ];

  const getInspectionSteps = (tipo) => {
    const steps = [
      { id: 'Documentacion', label: '1. Documentación', icon: '📄' },
      { id: 'Accesorios y Equipamiento', label: '2. Accesorios y Equipamiento', icon: '🚗' },
      { id: 'Motor', label: '3. Motor', icon: '🔧' },
      { id: 'Pintura', label: '3. Vista Externa', icon: '🎨' },
    ];

    if (tipo !== 'moto' && tipo !== 'motocarro') {
      steps.push({ id: 'VistaInterna', label: '4. Vista Interna', icon: '👀' });
    }

    steps.push(
      { id: 'Detalles Técnicos', label: '5. Detalles Técnicos', icon: '🛠️' },
      { id: 'Firma', label: '6. Firma Digital', icon: '🖋️' },
      { id: 'PDF', label: '7. Reporte & PDF', icon: '📋' }
    );

    return steps;
  };

  const inspectionSteps = getInspectionSteps(peritajeData.tipoVehiculo);

  const guardarPeritajeCompleto = async (formDataDelEstado) => {
    try {
      const token = localStorage.getItem('auth_token');

      const response = await api.post('peritajes', {
        tipo_vehiculo_id: formDataDelEstado.tipoVehiculoId || formDataDelEstado.tipoVehiculo,
        sucursal_vendedor_id: formDataDelEstado.sucursalVendedorId,
        sucursal_inspeccion_id: formDataDelEstado.sucursalInspeccionId,
        vendedor_id: formDataDelEstado.vendedorId,

        placa: formDataDelEstado.placa,
        marca: formDataDelEstado.marca,
        linea: formDataDelEstado.linea,
        modelo_anio: Number(formDataDelEstado.modeloAnio || formDataDelEstado.modelo),
        num_motor: formDataDelEstado.numMotor,
        num_chasis: formDataDelEstado.numChasis,
        kilometraje: Number(formDataDelEstado.kilometraje || 0),

        accesorios: formDataDelEstado.accesoriosList,
        danos_externos: formDataDelEstado.danosExternosList,
        danos_internos: formDataDelEstado.danosInternosList,
        detalles_tecnicos: formDataDelEstado.detallesTecnicosList,
        sistemas_mecanicos: formDataDelEstado.sistemasMecanicosList,
        compresion_cilindros: formDataDelEstado.compresionCilindrosList,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Peritaje guardado exitosamente:', response.data);
      alert('¡Peritaje guardado y sincronizado correctamente!');
      setIsInspecting(false);
      fetchInspecciones(); 
    } catch (error) {
      console.error('Error al guardar el peritaje:', error);
      alert('Hubo un error al guardar el peritaje en el servidor.');
    }
  };

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
    doc.text(`INSPECCIÓN: ${item.id || item.codigo || 'N/A'}`, 139, 20);
    doc.text(`FECHA: ${item.fechaPeritaje || item.created_at || 'N/A'}`, 139, 25);
    doc.text(`ESTADO: ${(item.estado || 'Completado').toUpperCase()}`, 139, 30);

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
        ['Modelo / Año:', item.anioModelo || item.modelo_anio || data.modelo || 'N/A', 'N° de Motor:', data.numMotor || 'N/A'],
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

    const filasAccesorios = (data.accesoriosList || []).map(acc => [
      acc.name,
      acc.presente ? 'SÍ' : 'NO',
      acc.danado ? 'MAL ESTADO' : 'OPERATIVO'
    ]);

    autoTable(doc, {
      startY: 29,
      theme: 'striped',
      headStyles: { fillColor: [71, 85, 105], fontStyle: 'bold', fontSize: 8.5 },
      bodyStyles: { fontSize: 8 },
      head: [['ELEMENTO / ACCESORIO', 'PRESENTE', 'ESTADO EVALUADO']],
      body: filasAccesorios.length > 0 ? filasAccesorios : [['Sin accesorios registrados', '-', '-']],
      styles: { cellPadding: 1.5 }
    });

    const YFinal = doc.lastAutoTable.finalY + 12;
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(colorSecundario[0], colorSecundario[1], colorSecundario[2]);
    doc.text('5. CONCEPTO FINAL DE EVALUACIÓN', 14, YFinal);

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
    doc.text(`${(data.estadoGeneralVehiculo || 'Aceptable').toUpperCase()}`, 78, YFinal + 9);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(textoDividido, 18, YFinal + 15, { width: 180 });

    const YFirma = YFinal + altoCuadro + 25;

    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.5);
    doc.line(14, YFirma, 74, YFirma);

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

  const totalInspeccionesCount = inspecciones.length;
  const enProcesoCount = inspecciones.filter(i => (i.estado || '').toLowerCase() === 'en proceso').length;
  const completadasCount = inspecciones.filter(i => (i.estado || '').toLowerCase() === 'completado').length;

  return (
    <div className="flex min-h-screen bg-[#f4f6fa] text-slate-800 font-sans relative overflow-x-hidden">
      
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
      )}

      {showVehicleSelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Seleccionar Tipo de Vehículo</h3>
                <p className="text-xs text-slate-500 mt-0.5">Elige la categoría para iniciar el protocolo de peritaje</p>
              </div>
              <button 
                onClick={() => setShowVehicleSelector(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg hover:bg-slate-200/50 transition"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { id: 'carro', label: 'Carro / Automóvil', icon: '🚗', desc: 'Livianos, Sedán, SUV, Camperos' },
                { id: 'moto', label: 'Moto', icon: '🏍️', desc: 'Motocicletas de cilindrada variada' },
                { id: 'pesado', label: 'Vehículo Pesado', icon: '🚛', desc: 'Camiones, Tractocamiones, Buses' },
                { id: 'motocarro', label: 'Motocarro', icon: '🛺', desc: 'Tricimotos de carga o pasajeros' },
              ].map((tipo) => (
                <button
                  key={tipo.id}
                  onClick={() => {
                    handleDataChange({ 
                      tipoVehiculo: tipo.id,
                      accesoriosList: []
                    });
                    setShowVehicleSelector(false);
                    setIsInspecting(true);
                    setInspectionStep('Documentacion');
                  }}
                  className="flex flex-col text-left p-5 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl transition group relative shadow-sm hover:shadow"
                >
                  <span className="text-3xl mb-3 group-hover:scale-110 transition transform origin-left">{tipo.icon}</span>
                  <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600">{tipo.label}</span>
                  <span className="text-[11px] text-slate-500 mt-1 leading-relaxed">{tipo.desc}</span>
                </button>
              ))}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowVehicleSelector(false)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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

      <main className="flex-1 flex flex-col min-w-0 w-full">
        
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="lg:hidden text-slate-600 hover:text-slate-900 text-2xl">☰</button>
            <span className="text-xs font-semibold text-slate-400">Rol: Inspector de Vehiculos</span>
          </div>
          <span className="text-xs font-medium text-slate-500">Yopal, Casanare</span>
        </header>

        <div className="p-6 lg:p-8 space-y-8 overflow-y-auto flex-1">
          
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
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Nuevo Peritaje Vehicular {peritajeData.tipoVehiculo && <span className="text-blue-600 uppercase text-lg">({peritajeData.tipoVehiculo})</span>}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold border border-amber-200">
                    Borrador en Progreso
                  </span>
                </div>
              </div>

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

              <div className="bg-white border border-slate-200/80 p-8 rounded-xl shadow-sm min-h-[350px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl">{inspectionSteps.find(s => s.id === inspectionStep)?.icon}</span>
                    <h2 className="text-lg font-bold text-slate-900">
                      {inspectionSteps.find(s => s.id === inspectionStep)?.label}
                    </h2>
                  </div>
                  
                  <div className="mt-2">
                    {inspectionStep === 'Documentacion' && (
                      <Documentacion peritajeData={peritajeData} onChange={handleDataChange} />
                    )}
                    
                    {inspectionStep === 'Accesorios y Equipamiento' && (
                      <Accesorios peritajeData={peritajeData} onChange={handleDataChange} />
                    )}

                    {inspectionStep === 'Motor' && (
                      <Motor peritajeData={peritajeData} onChange={handleDataChange} />
                    )}

                    {inspectionStep === 'Pintura' && (
                      <VistaExterna peritajeData={peritajeData} onChange={handleDataChange} />
                    )}

                    {inspectionStep === 'VistaInterna' && (
                      <VistaInterna peritajeData={peritajeData} onChange={handleDataChange} />
                    )}

                    {inspectionStep === 'Detalles Técnicos' && (
                      <DetallesTecnicos peritajeData={peritajeData} onChange={handleDataChange} />
                    )}

                    {inspectionStep === 'Firma' && (
                      <Firma peritajeData={peritajeData} onChange={handleDataChange} />
                    )}
                    
                    {inspectionStep === 'PDF' && (
                      <InformePdf peritajeData={peritajeData} onChange={handleDataChange} />
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 mt-8 border-t border-slate-100">
                  <button 
                    disabled={inspectionStep === inspectionSteps[0].id}
                    onClick={() => {
                      const idx = inspectionSteps.findIndex(s => s.id === inspectionStep);
                      if (idx > 0) setInspectionStep(inspectionSteps[idx - 1].id);
                    }}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-40"
                  >
                    Anterior
                  </button>
                  <button 
                    onClick={() => guardarPeritajeCompleto(peritajeData)}
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                  >
                    Finalizar Peritaje
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bandeja de Entrada</h1>
                  <p className="text-slate-500 mt-1 text-sm">Monitoreo y registro de peritajes en tiempo real.</p>
                </div>
                <button 
                  onClick={() => setShowVehicleSelector(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white rounded-lg shadow-md transition duration-150 self-start sm:self-auto"
                >
                  Nueva Inspección +
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Registros</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{totalInspeccionesCount}</p>
                </div>
                <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm border-l-4 border-l-amber-500">
                  <p className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">En proceso</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{enProcesoCount}</p>
                </div>
                <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
                  <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Completadas</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{completadasCount}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-sm font-bold text-slate-900">HISTORIAL DE INSPECCIONES</h2>
                  {loadingInspecciones && <span className="text-xs text-blue-500 animate-pulse">Sincronizando con BD...</span>}
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
                      {inspecciones.length === 0 && !loadingInspecciones ? (
                        <tr>
                          <td colSpan="13" className="px-4 py-8 text-center text-slate-400">
                            No hay peritajes registrados en la base de datos.
                          </td>
                        </tr>
                      ) : (
                        inspecciones.map((item) => (
                          <tr key={item.id || item.placa} className="hover:bg-slate-50/50 transition duration-100">
                            <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.fechaPeritaje || item.created_at || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-800">{item.marca || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{item.modelo || item.linea || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{item.anioModelo || item.modelo_anio || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap font-mono">{item.km || item.kilometraje || '0'}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="inline-block bg-slate-900 text-white px-2.5 py-1 rounded-md font-mono font-bold text-[11px] shadow-sm">
                                {item.placa || 'SIN PLACA'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.sucursalVendedor || 'Sede Yopal'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.sucursalInspeccion || 'Sede Yopal'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-slate-700">{item.vendedor || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-800">{item.inspector || 'Inspector Activo'}</td>
                            <td className="px-4 py-4 whitespace-nowrap font-semibold text-emerald-600">{item.costoReparacion || '$0'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.tiempoReparacion || '0 días'}</td>
                            <td className="px-4 py-4 text-right whitespace-nowrap">
                              {(item.estado || 'Completado') === "Completado" ? (
                                <button 
                                  onClick={() => handleDescargarPDF(item)}
                                  className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg shadow hover:bg-slate-800 transition duration-150"
                                >
                                  ⬇️ PDF
                                </button>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setShowVehicleSelector(true);
                                  }}
                                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-140"
                                >
                                  Editar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
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