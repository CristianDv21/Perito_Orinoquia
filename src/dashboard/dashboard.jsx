import { useState, useEffect } from "react";
import Documentacion from '../modules/Documentacion';
import Accesorios from '../modules/Accesorios';
import Motor from '../modules/Motor'; 
import VistaExterna from '../modules/VistaExterna'; 
import VistaInterna from '../modules/VistaInterna';
import Firma from '../modules/Firmas';
import InformePdf from '../modules/informePdf';
import DetallesTecnicos from '../modules/DetallesTecnicos';
import api from '../api/axios';
import { useAuth } from '../useAuth';
import { generarPdfEstiloCliente } from '../modules/Pdf';

import {
  User,
  LayoutDashboard,
  BarChart3,
  Settings,
} from "lucide-react";


export default function Dashboard({ onLogout }) {

  const { user } = useAuth();

const [modalActivo, setModalActivo] = useState(null); // 'sucursal' o 'vendedor'
const [nombreInput, setNombreInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Bandeja');
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionStep, setInspectionStep] = useState('Documentacion');
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
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

  const usuario = JSON.parse(localStorage.getItem("peritaje_user"));

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
          
          // Verificamos que el token exista antes de hacer la petición
          const token = localStorage.getItem('auth_token');
          if (!token) {
            console.warn("No hay token de autenticación en el localStorage.");
            return;
          }

          // Nota la barra '/' al inicio para asegurar que tome la ruta absoluta de la API
          const response = await api.get('/peritajes', {
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
    {
      id: "Perfil",
      label: "Perfil",
      icon: User, // <-- Sin < />
    },
    {
      id: "Bandeja",
      label: "Bandeja de Entrada",
      icon: LayoutDashboard, // <-- Sin < />
    },
    {
      id: "Estadisticas",
      label: "Estadísticas",
      icon: BarChart3, // <-- Sin < />
    },
    {
      id: "Configuracion",
      label: "Configuración",
      icon: Settings, // <-- Sin < />
    },
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

    // Los detalles técnicos solo se agregan si el vehículo NO es una moto
    if (tipo !== 'moto') {
      steps.push({ id: 'Detalles Técnicos', label: '5. Detalles Técnicos', icon: '🛠️' });
    }

    steps.push(
      { id: 'Firma', label: '6. Firma Digital', icon: '🖋️' },
      { id: 'PDF', label: '7. Reporte & PDF', icon: '📋' }
    );

    return steps;

  };

  const inspectionSteps = getInspectionSteps(peritajeData.tipoVehiculo);

 const guardarPeritajeCompleto = async (formDataDelEstado) => {
    try {
      const token = localStorage.getItem('auth_token');

      const esEdicion = Boolean(formDataDelEstado.id);
      const endpoint = esEdicion ? `peritajes/${formDataDelEstado.id}` : 'peritajes';
      const metodo = esEdicion ? 'patch' : 'post';

      const response = await api[metodo](endpoint, {
        // FORZAMOS EL ESTADO A COMPLETADO AQUÍ:
        estado: 'completado',

        // Relaciones y IDs principales
        tipo_vehiculo_id: formDataDelEstado.tipoVehiculoId || formDataDelEstado.tipoVehiculo || null,
        sucursal_vendedor_id: (formDataDelEstado.sucursalVendedorId && !formDataDelEstado.sucursalVendedorId.includes('AQUI')) ? formDataDelEstado.sucursalVendedorId : null,
        sucursal_inspeccion_id: (formDataDelEstado.sucursalInspeccionId && !formDataDelEstado.sucursalInspeccionId.includes('AQUI')) ? formDataDelEstado.sucursalInspeccionId : null,
        vendedor_id: (formDataDelEstado.vendedorId && !formDataDelEstado.vendedorId.includes('AQUI')) ? formDataDelEstado.vendedorId : null,

        // Información General del Vehículo
        // Información General del Vehículo
        placa: formDataDelEstado.placa ? String(formDataDelEstado.placa) : '',
        marca: formDataDelEstado.marca || '',
        linea: formDataDelEstado.linea || '',
        modelo_anio: Number(formDataDelEstado.modeloAnio || formDataDelEstado.modelo || 2026),
        num_motor: formDataDelEstado.numMotor || '',
        num_chasis: formDataDelEstado.numChasis || '',
        kilometraje: Number(formDataDelEstado.kilometraje || 0),
        organismo_transito: formDataDelEstado.organismoTransito || '',

        // Documentación y SOAT / RTM
        numero_soat: formDataDelEstado.numeroSoat || '',
        entidad_emisora_soat: formDataDelEstado.entityEmisoraSoat || '',
        vence_soat: formDataDelEstado.venceSoat || null,
        soat_al_dia: Boolean(formDataDelEstado.soatAlDia),
        
        numero_control_rtm: formDataDelEstado.numeroControlRtm || '',
        cda_emisor: formDataDelEstado.cdaEmisor || '',
        vence_tecnico_mecanica: formDataDelEstado.venceTecnicoMecanica || null,
        tecnico_mecanica_al_dia: Boolean(formDataDelEstado.tecnicoMecanicaAlDia),

        // Restricciones y Alertas Legales (RUNT)
        coincide_propietario_runt: Boolean(formDataDelEstado.coincidePropietarioRunt),
        tiene_embargos_o_alertas: Boolean(formDataDelEstado.tieneEmbargosOAlertas),
        restriccion_blindaje: formDataDelEstado.restriccionBlindaje || 'sin_blindaje',

        // Motor y Diagnósticos
        compresion_motor: formDataDelEstado.compresionMotor || '',
        fugas_aceite: Boolean(formDataDelEstado.fugasAceite),
        estado_bateria: formDataDelEstado.estadoBateria || '',
        ruidos_extranos: Boolean(formDataDelEstado.ruidosExtranos),
        comentarios_motor: formDataDelEstado.motorObservaciones || '',

        // Resultados y Concepto Final
        estado_general_vehiculo: formDataDelEstado.estadoGeneralVehiculo || 'Aceptable',
        concepto_final: formDataDelEstado.conceptoFinal || '',
        tiempo_estimado_reparacion: formDataDelEstado.tiempoEstimadoReparacion || '',

        // Scores / Puntuaciones
        score_estructura: Number(formDataDelEstado.scoreEstructura || 100),
        score_carroceria: Number(formDataDelEstado.scoreCarroceria || 100),
        score_mecanica: Number(formDataDelEstado.scoreMecanica || 100),
        score_electrico: Number(formDataDelEstado.scoreElectrico || 100),
        score_legal: Number(formDataDelEstado.scoreLegal || 100),

        // Listas y Arrays Relacionados
        accesorios: formDataDelEstado.accesoriosList || [],
        danos_externos: formDataDelEstado.danosExternosList || [],
        danos_internos: formDataDelEstado.danosInternosList || [],
        detalles_tecnicos: formDataDelEstado.detallesTecnicosList || [],
        sistemas_mecanicos: formDataDelEstado.sistemasMecanicosList || [],
        compresion_cilindros: formDataDelEstado.compresionCilindrosList || [],
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Peritaje finalizado con éxito:', response.data);
      alert('¡Peritaje finalizado correctamente!');
      setIsInspecting(false);
      fetchInspecciones(); 
    } catch (error) {
      console.error('Error al guardar el peritaje:', error);
      alert(error.response?.data?.message || 'Hubo un error al guardar el peritaje en el servidor.');
    }
  };


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleDataChange = (updatedFields) => {
    setPeritajeData((prev) => ({
      ...prev,
      ...updatedFields
    }));
  };

  

const construirDatosParaPdf = (datos) => {
  const buscarSucursal = (id) => sucursales.find((s) => s.id === id)?.nombre || null;
  const buscarVendedor = (id) => {
    const v = vendedores.find((v) => v.id === id);
    return v ? [v.nombre, v.apellido].filter(Boolean).join(' ') : null;
  };
  return {
    ...datos,
    sucursalVendedorNombre: buscarSucursal(datos.sucursalVendedorId),
    sucursalInspeccionNombre: buscarSucursal(datos.sucursalInspeccionId),
    vendedorNombre: buscarVendedor(datos.vendedorId),
    inspectorNombre: user?.name || user?.nombre || null,
  };
};

const [sucursales, setSucursales] = useState([]);
const [vendedores, setVendedores] = useState([]);

useEffect(() => {
    let isMounted = true;

    const cargarDatosYCatalogos = async () => {
      if (activeTab === 'Bandeja') {
        try {
          if (isMounted) setLoadingInspecciones(true);
          const token = localStorage.getItem('auth_token');
          const headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          };

          // Hacemos todas las peticiones en paralelo de forma limpia
          const [resPeritajes, resSucursales, resVendedores] = await Promise.all([
            api.get('peritajes', { headers }),
            api.get('sucursales', { headers }).catch(() => ({ data: [] })),
            api.get('vendedores', { headers }).catch(() => ({ data: [] }))
          ]);

          if (isMounted) {
            setInspecciones(resPeritajes.data.data || resPeritajes.data || []);
            setSucursales(resSucursales.data.data || resSucursales.data || []);
            setVendedores(resVendedores.data.data || resVendedores.data || []);
          }
        } catch (error) {
          console.error('Error al cargar los datos:', error);
        } finally {
          if (isMounted) {
            setLoadingInspecciones(false);
          }
        }
      }
    };

    cargarDatosYCatalogos();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const resolverTipoVehiculo = (item) => {
    const tipoIdBD = item.tipo_vehiculo_id || item.tipoVehiculoId;
    if (tipoIdBD === '7c68a26d-372b-42dc-be00-92c4ed2ee6ce') return 'moto';
    if (tipoIdBD === 'd5017832-04ac-4ead-8f57-efbe8af78860') return 'pesado';
    if (tipoIdBD === 'e8ca5ff6-fe17-4916-b949-c13cac3a706e') return 'motocarro';
    if (tipoIdBD === '1c9740ed-b045-4643-9fe6-cfb2c412854f') return 'carro';
    // Si no reconocemos el ID, intentamos con el texto que venga del backend antes de asumir 'carro'
    const tipoTexto = (item.tipoVehiculo || item.tipo_vehiculo?.nombre || item.tipo_vehiculo || '').toString().toLowerCase();
    if (['carro', 'moto', 'pesado', 'motocarro'].includes(tipoTexto)) return tipoTexto;
    return 'carro';
  };

  const mapearPeritajeDeBackend = (item) => {
    const compresiones = Array.isArray(item.compresion_cilindros) ? item.compresion_cilindros : [];
    const compresionCilFields = {};
    [0, 1, 2, 3].forEach((idx) => {
      compresionCilFields[`compresionCil${idx + 1}`] = item[`compresionCil${idx + 1}`] || compresiones[idx] || null;
    });

    return {
      ...item,
      tipoVehiculo: resolverTipoVehiculo(item),
      tipoVehiculoId: item.tipo_vehiculo_id || item.tipoVehiculoId || '',
      modelo: item.modelo || item.linea || '',
      version: item.version || '',
      cilindrada: item.cilindrada || '',
      tipoTransmision: item.tipo_transmision || item.tipoTransmision || '',
      traccion: item.traccion || '',
      estadoTransmision: item.estado_transmision || item.estadoTransmision || '',
      numMotor: item.num_motor || item.numMotor || '',
      numChasis: item.num_chasis || item.numChasis || '',
      kilometraje: item.kilometraje || item.km || 0,
      ...compresionCilFields,

      // Documentación SOAT / RTM
      venceSoat: item.vence_soat || item.venceSoat || '',
      soatAlDia: item.soat_al_dia ?? item.soatAlDia ?? true,
      archivoSoat: item.archivo_soat || item.archivoSoat || null,
      venceTecnicoMecanica: item.vence_tecnico_mecanica || item.venceTecnicoMecanica || '',
      tecnicoMecanicaAlDia: item.tecnico_mecanica_al_dia ?? item.tecnicoMecanicaAlDia ?? true,
      archivoTecnicoMecanica: item.archivo_tecnico_mecanica || item.archivoTecnicoMecanica || null,
      siniestros: item.siniestros || '',
      tarjetaOperacion: item.tarjeta_operacion || item.tarjetaOperacion || '',
      configuracionEjes: item.configuracion_ejes || item.configuracionEjes || '',

      // Cliente
      clienteNombre: item.cliente_nombre || item.cliente?.nombre || item.clienteNombre || '',
      clienteDocumento: item.cliente_documento || item.cliente?.documento || item.clienteDocumento || '',
      clienteTelefono: item.cliente_telefono || item.cliente?.telefono || item.clienteTelefono || '',

      // Motor / mecánica
      sistemasMecanicos: item.sistemas_mecanicos || item.sistemasMecanicos || {},
      comentariosMotor: item.comentarios_motor || item.comentariosMotor || '',

      // Daños y detalles técnicos (nombres SIN sufijo "List", así los busca Pdf.jsx)
      danosExternos: item.danos_externos || item.danosExternos || {},
      danosInternos: item.danos_internos || item.danosInternos || {},
      detallesTecnicos: item.detalles_tecnicos || item.detallesTecnicos || {},
      accesoriosList: item.accesorios || item.accesoriosList || [],

      // Firma / metadatos finales
      firmaInspector: item.firma_inspector || item.firmaInspector || null,
      tiempoCompletitud: item.tiempo_completitud || item.tiempoCompletitud || '',

      // Relaciones / nombres para mostrar
      sucursalVendedorNombre: item.sucursal_vendedor?.nombre || item.sucursalVendedor?.nombre || null,
      sucursalInspeccionNombre: item.sucursal_inspeccion?.nombre || item.sucursalInspeccion?.nombre || null,
      vendedorNombre: item.vendedor?.nombre || (typeof item.vendedor === 'string' ? item.vendedor : null),
      inspectorNombre: item.inspector?.name || 'Inspector Activo',
      fechaPeritaje: item.fechaPeritaje || item.fecha_peritaje || item.created_at,
    };
  };

  const handleDescargarPDF = (item) => {
    generarPdfEstiloCliente(mapearPeritajeDeBackend(item));
  };

const handleEditarPeritaje = (item) => {
  // 1. Mapeamos los datos del backend
  const itemMapeado = mapearPeritajeDeBackend(item);
  const tipoTexto = resolverTipoVehiculo(item);
  const tipoIdBD = item.tipo_vehiculo_id || item.tipoVehiculoId;

  // 2. Seteamos el estado del peritaje con la información existente
  setPeritajeData({
    ...peritajeData,
    id: itemMapeado.id,
    tipoVehiculo: tipoTexto,
    tipoVehiculoId: tipoIdBD || '1c9740ed-b045-4643-9fe6-cfb2c412854f',
    placa: itemMapeado.placa || '',
    marca: itemMapeado.marca || '',
    linea: itemMapeado.linea || '',
    modelo: itemMapeado.modeloAnio || itemMapeado.modelo || item.modelo_anio || '',
    color: itemMapeado.color || '',
    numMotor: itemMapeado.numMotor || '',
    numChasis: itemMapeado.numChasis || '',
    kilometraje: itemMapeado.kilometraje || 0,
    siniestros: itemMapeado.siniestros || item.comentarios_siniestros || '',
    sucursalVendedorId: item.sucursal_vendedor_id || item.sucursalVendedorId || '',
    sucursalInspeccionId: item.sucursal_inspeccion_id || item.sucursalInspeccionId || '',
    vendedorId: item.vendedor_id || item.vendedorId || '',
    clienteNombre: itemMapeado.clienteNombre || '',
    clienteDocumento: itemMapeado.clienteDocumento || '',
    clienteTelefono: itemMapeado.clienteTelefono || '',
    soatAlDia: itemMapeado.soatAlDia ?? true,
    venceSoat: itemMapeado.venceSoat ? itemMapeado.venceSoat.split('T')[0] : '',
    tecnicoMecanicaAlDia: itemMapeado.tecnicoMecanicaAlDia ?? true,
    venceTecnicoMecanica: itemMapeado.venceTecnicoMecanica ? itemMapeado.venceTecnicoMecanica.split('T')[0] : '',
    accesoriosList: itemMapeado.accesoriosList || item.accesorios || [],
    danosExternosList: itemMapeado.danosExternos || item.danos_externos || {},
    danosInternosList: itemMapeado.danosInternos || item.danos_internos || {},
    detallesTecnicosList: itemMapeado.detallesTecnicos || item.detalles_tecnicos || {},
    sistemasMecanicosList: itemMapeado.sistemasMecanicos || item.sistemas_mecanicos || {},
    compresionCilindrosList: itemMapeado.compresionCilindros || item.compresion_cilindros || [],
  });

  // 3. Cambiamos las vistas para abrir el formulario de inspección
  setIsInspecting(true);
  setInspectionStep('Documentacion');
};

  const totalInspeccionesCount = inspecciones.length;
  const enProcesoCount = inspecciones.filter(i => ['en proceso', 'borrador'].includes((i.estado || '').toLowerCase())).length;
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
                  { id: 'carro', label: 'Carro / Automóvil', icon: '🚗', desc: 'Livianos, Sedán, SUV, Camperos', tipoId: '1c9740ed-b045-4643-9fe6-cfb2c412854f' },
                  { id: 'moto', label: 'Moto', icon: '🏍️', desc: 'Motocicletas de cilindrada variada', tipoId: '7c68a26d-372b-42dc-be00-92c4ed2ee6ce' },
                  { id: 'pesado', label: 'Vehículo Pesado', icon: '🚛', desc: 'Camiones, Tractocamiones, Buses', tipoId: 'd5017832-04ac-4ead-8f57-efbe8af78860' },
                  { id: 'motocarro', label: 'Motocarro', icon: '🛺', desc: 'Tricimotos de carga o pasajeros', tipoId: 'e8ca5ff6-fe17-4916-b949-c13cac3a706e' },
                ].map((tipo) => (
                  <button
                    key={tipo.id}
                    onClick={async () => {
                      try {
                        // Obtenemos el token directamente aquí para asegurarnos de que no sea nulo
                        const token = localStorage.getItem('auth_token');

                        const response = await api.post('/peritajes', {
                          tipo_vehiculo_id: tipo.tipoId, 
                          placa: 'SIN-PLACA', 
                          estado: 'borrador'
                        }, {
                          headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json'
                          }
                        });
                        
                        const peritajeCreado = response.data.data || response.data;
                        
                        handleDataChange({ 
                          id: peritajeCreado.id,
                          tipoVehiculo: tipo.id,
                          tipoVehiculoId: tipo.tipoId,
                          accesoriosList: []
                        });

                        setShowVehicleSelector(false);
                        setIsInspecting(true);
                        setInspectionStep('Documentacion');
                      } catch (error) {
                        console.error('Error detallado:', error.response?.data);
                        alert('Error del servidor: ' + (error.response?.data?.message || error.message));
                      }
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
        <div className="flex flex-col h-full">

  <div className="relative flex items-center justify-center h-24 border-b border-slate-800/60">

    <button
      onClick={() => {
        setActiveTab("Bandeja");
        setIsInspecting(false);
        setIsSidebarOpen(false);
      }}
      className="transition duration-500 hover:scale-105"
    >
      <img
        src="/Logo1.png"
        alt="Servi-Centro CDA"
        className="w-500 object-contain"
        draggable={false}
      />
    </button>

    <button
      onClick={toggleSidebar}
      className="absolute right-4 top-4 lg:hidden text-slate-400 hover:text-white"
    >
      ✕
    </button>

  </div>

  <nav className="flex-1 px-3 py-4">

    <div className="space-y-1">

      {mainMenuItems.map((item) => {
    const Icon = item.icon; // Asignamos la referencia a una constante con mayúscula

    return (
      <button
        key={item.id}
        onClick={() => {
          setActiveTab(item.id);
          setIsInspecting(false);
          setIsSidebarOpen(false);
        }}
        className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
          activeTab === item.id && !isInspecting
            ? "bg-blue-600 text-white shadow-lg"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Icon
          size={18}
          strokeWidth={2}
          className={
            activeTab === item.id && !isInspecting
              ? "text-white"
              : "text-slate-400 group-hover:text-white"
          }
        />
        <span>{item.label}</span>
      </button>
    );
  })}

        </div>

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
          <span className="text-xs font-semibold text-slate-400">
            {usuario ? `${usuario.nombre} • ${usuario.rol}` : "Usuario"}
          </span>
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
                      <Documentacion 
                        peritajeData={peritajeData} 
                        onChange={handleDataChange} 
                        sucursales={sucursales}
                        vendedores={vendedores}
                        onAgregarSucursal={() => {
                        setNombreInput('');
                        setModalActivo('sucursal'); 
                      }}
                      onAgregarVendedor={() => {
                        setNombreInput('');
                        setModalActivo('vendedor');
                      }}
                      />
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
                      <InformePdf peritajeData={construirDatosParaPdf(peritajeData)} onChange={handleDataChange} />
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

                  {/* Lógica dinámica para el botón derecho */}
                  {inspectionStep !== inspectionSteps[inspectionSteps.length - 1].id ? (
                    <button 
                      onClick={() => {
                        const idx = inspectionSteps.findIndex(s => s.id === inspectionStep);
                        if (idx < inspectionSteps.length - 1) {
                          setInspectionStep(inspectionSteps[idx + 1].id);
                        }
                      }}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        // Imprimimos el JSON exacto que se va a enviar a Laravel en la consola
                        console.log("JSON enviado al servidor:", JSON.stringify(peritajeData, null, 2));

                        // Ejecutamos la función de guardado
                        guardarPeritajeCompleto(peritajeData);
                      }}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
                    >
                    Finalizar Peritaje
                  </button>
                  )}
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
                        <th className="px-4 py-3">Fecha</th>
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
                    
                    {/* 2. EL CUERPO (<tbody>) MAPEA CADA 'item' CORRECTAMENTE */}
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
                            {/* Aquí usamos 'item' de forma válida gracias al .map() */}
                            <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                              {item.fechaPeritaje || item.created_at 
                                ? new Date(item.fechaPeritaje || item.created_at).toLocaleDateString('es-CO') 
                                : 'N/A'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-800">{item.marca || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{item.modelo || item.linea || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap">{item.anioModelo || item.modelo_anio || 'N/A'}</td>
                            <td className="px-4 py-4 whitespace-nowrap font-mono">{item.km || item.kilometraje || '0'}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="inline-block bg-slate-900 text-white px-2.5 py-1 rounded-md font-mono font-bold text-[11px] shadow-sm">
                                {item.placa || 'SIN PLACA'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.sucursal_vendedor?.nombre || item.sucursalVendedor?.nombre || 'Sin sucursal'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.sucursal_inspeccion?.nombre || item.sucursalInspeccion?.nombre || 'Sin sucursal'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-slate-700">
                              {item.vendedor?.nombre || item.vendedor || 'Sin vendedor'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-800">
                              {item.inspector?.name || 'Inspector Activo'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap font-semibold text-emerald-600">{item.costoReparacion || '$0'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-slate-500">{item.tiempoReparacion || '0 días'}</td>
                            <td className="px-4 py-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-3">
                                {item.estado === "completado" && (
                                  <button 
                                    onClick={() => handleDescargarPDF(item)}
                                    className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg shadow hover:bg-slate-800 transition duration-150"
                                  >
                                    ⬇️ PDF
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleEditarPeritaje(item)}
                                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-140"
                                >
                                  Editar
                                </button>
                              </div>
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
              {modalActivo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
                  <div className="bg-white rounded-lg p-6 w-96 shadow-2xl border border-gray-100">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">
                      {modalActivo === 'sucursal' ? 'Nueva Sucursal' : 'Nuevo Vendedor / Asesor'}
                    </h3>
                    
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Ingrese el nombre de la ${modalActivo}...`}
                      value={nombreInput}
                      onChange={(e) => setNombreInput(e.target.value)}
                      autoFocus
                    />

                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => setModalActivo(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={async () => {
                          if (!nombreInput || !nombreInput.trim()) return;
                          try {
                            const token = localStorage.getItem('auth_token');
                            const endpoint = modalActivo === 'sucursal' ? 'sucursales' : 'vendedores';
                            
                            const response = await api.post(endpoint, { nombre: nombreInput }, {
                              headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
                            });

                            // Obtenemos el registro recién creado que devuelve Laravel
                            const nuevoRegistro = response.data.data || response.data;

                            // Actualizamos el estado local según corresponda para que se vea de inmediato
                            if (modalActivo === 'sucursal') {
                              setSucursales(prev => [...prev, nuevoRegistro]);
                            } else {
                              setVendedores(prev => [...prev, nuevoRegistro]);
                            }

                            setModalActivo(null);
                            setNombreInput('');
                          } catch (error) {
                            console.error(error);
                            alert(error.response?.data?.message || "Ocurrió un error al guardar.");
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </div>
              )}
        </div>
      </main>
    </div>
  );
}