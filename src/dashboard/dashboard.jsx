import { useState, useEffect } from "react";
import Documentacion from '../modules/Documentacion';
import Accesorios from '../modules/Accesorios';
import Motor from '../modules/Motor';
import VistaExterna from '../modules/VistaExterna';
import VistaInterna from '../modules/VistaInterna';
import Firma from '../modules/Firmas';
import InformePdf from '../modules/InformePdf';
import DetallesTecnicos from '../modules/DetallesTecnicos';
import api from '../api/axios';
import { useAuth } from '../useAuth';
import { generarPdfEstiloCliente } from '../modules/Pdf';

import {
  User,
  LayoutDashboard,
  BarChart3,
  Settings,
  Users,
  Building,
  FileText,
  Sliders,
  Save,
  CheckCircle2
} from "lucide-react";

export default function Dashboard({ onLogout }) {
  const { user } = useAuth();

  const [modalActivo, setModalActivo] = useState(null);
  const [nombreInput, setNombreInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Bandeja');
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionStep, setInspectionStep] = useState('Documentacion');
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [inspecciones, setInspecciones] = useState([]);
  const [loadingInspecciones, setLoadingInspecciones] = useState(false);

  const [showMisPeritajesModal, setShowMisPeritajesModal] = useState(false);

  // Estados para los filtros del módulo de Estadística
  const [filtroEstadisticasPlaca, setFiltroEstadisticasPlaca] = useState('');
  const [filtroEstadisticasInspector, setFiltroEstadisticasInspector] = useState('');
  const [filtroEstadisticasFecha, setFiltroEstadisticasFecha] = useState('');
  const [filtroEstadisticasTipo, setFiltroEstadisticasTipo] = useState('');

  // Gestión de usuarios y perfil administrativo
  const [usuariosList, setUsuariosList] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [showCrearUsuarioModal, setShowCrearUsuarioModal] = useState(false);
  const [showEditarUsuarioModal, setShowEditarUsuarioModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);

  // Estado para el nuevo módulo de Configuración del Sistema
  const [configSistema, setConfigSistema] = useState({
    nombreEmpresa: 'Servi-Centro CDA / Perito Orinoquia',
    nit: '900.456.789-1',
    telefono: '+57 320 1234567',
    direccion: 'Carrera 20 # 15-40',
    ciudad: 'Yopal, Casanare',
    emailEmpresa: 'contacto@peritoorinoquia.com',
    scoreInicialDefecto: 100,
    exigirFotosDocumentos: true,
    modoOscuroPorDefecto: false,
    textoLegalPdf: 'El presente peritaje es un diagnóstico visual, estético y mecánico del estado del vehículo al momento de la inspección. No compromete responsabilidad legal sobre fallas fortuitas posteriores ni vicios ocultos no detectables en banco.'
  });

  const [nuevoUsuarioData, setNuevoUsuarioData] = useState({
    name: '',
    email: '',
    password: '',
    rol: 'tecnico',
    sucursal_id: '',
    activo: true
  });

  const [usuarioEditData, setUsuarioEditData] = useState({
    name: '',
    email: '',
    password: '',
    rol: 'tecnico',
    sucursal_id: '',
    activo: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  const [profileData, setProfileData] = useState({
    name: user?.name || user?.nombre || '',
    email: user?.email || '',
    rol: user?.rol || user?.cargo || '',
    ubicacion: user?.ubicacion || ''
  });

  const esAdmin = (profileData.rol || '').toLowerCase().includes('admin');
  const usuario = JSON.parse(localStorage.getItem("peritaje_user"));

  const [sucursales, setSucursales] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    tipo: 'confirm',
    titulo: '',
    mensaje: '',
    onConfirm: null,
  });

  const fetchUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const token = localStorage.getItem('auth_token');
      const response = await api.get('users', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      setUsuariosList(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoadingUsuarios(false);
    }
  };



  const fetchInspecciones = async () => {
    try {
      setLoadingInspecciones(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

      const [resPeritajes, resSucursales, resVendedores] = await Promise.all([
        api.get('peritajes', { headers }),
        api.get('sucursales', { headers }).catch(() => ({ data: [] })),
        api.get('vendedores', { headers }).catch(() => ({ data: [] }))
      ]);

      const peritajesMapeados = (resPeritajes.data.data || resPeritajes.data || []).map(p => ({
        ...p,
        modelo: p.modelo !== undefined && p.modelo !== null && p.modelo !== "" ? p.modelo : p.modelo_anio,
        siniestros: p.siniestros || p.comentarios_siniestros || '',
        comentarios_siniestros: p.comentarios_siniestros || p.siniestros || '',
        archivoSoat: p.archivoSoat || p.archivo_soat || p.foto_soat || null,
        archivoRtm: p.archivoRtm || p.archivo_rtm || p.foto_rtm || null,
        soatAlDia: p.soatAlDia !== undefined ? p.soatAlDia : p.soat_al_dia,
        tecnicoMecanicaAlDia: p.tecnicoMecanicaAlDia !== undefined ? p.tecnicoMecanicaAlDia : p.tecnico_mecanica_al_dia,
        venceSoat: p.venceSoat || p.vence_soat || '',
        venceTecnicoMecanica: p.venceTecnicoMecanica || p.vence_tecnico_mecanica || '',
      }));

      setInspecciones(peritajesMapeados);
      setSucursales(resSucursales.data.data || resSucursales.data || []);
      setVendedores(resVendedores.data.data || resVendedores.data || []);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      setLoadingInspecciones(false);
    }
  };

  useEffect(() => {
    const cargarUsuarios = async () => {
      if (activeTab === 'Usuarios' && esAdmin) {
        await fetchUsuarios();
      }
    };
    cargarUsuarios();
  }, [activeTab, esAdmin]);

  useEffect(() => {
    const cargarInspecciones = async () => {
      if (activeTab === 'Bandeja' || activeTab === 'Perfil' || activeTab === 'Estadisticas') {
        await fetchInspecciones();
      }
    };
    cargarInspecciones();
  }, [activeTab]);

  const handleUpdateProfile = async () => {
    try {
      await api.put('user/profile', profileData);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert(error.response?.data?.message || "Error al actualizar el perfil");
    }
  };

  const handleGuardarConfiguracion = (e) => {
    if (e) e.preventDefault();
    localStorage.setItem('peritaje_config_sistema', JSON.stringify(configSistema));
    alert('¡Configuración del sistema guardada exitosamente!');
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth_token');
      await api.post('users', nuevoUsuarioData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      alert('¡Usuario creado exitosamente!');
      setShowCrearUsuarioModal(false);
      setNuevoUsuarioData({ name: '', email: '', password: '', rol: 'tecnico', sucursal_id: '', activo: true });
      fetchUsuarios();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      alert(error.response?.data?.message || 'Error al crear el usuario en el servidor.');
    }
  };

  const handleEditarUsuarioModalOpen = (usr) => {
    setSelectedUserForProfile(usr);
    setUsuarioEditData({
      name: usr.name || '',
      email: usr.email || '',
      password: '',
      rol: usr.rol || 'tecnico',
      sucursal_id: usr.sucursal_id || '',
      activo: usr.activo !== false
    });
    setShowEditarUsuarioModal(true);
  };

  const handleActualizarUsuarioSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserForProfile) return;
    try {
      const token = localStorage.getItem('auth_token');
      const payload = { ...usuarioEditData };
      if (!payload.password) delete payload.password;

      await api.put(`users/${selectedUserForProfile.id}`, payload, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      alert('¡Usuario actualizado exitosamente!');
      setShowEditarUsuarioModal(false);
      setSelectedUserForProfile(null);
      fetchUsuarios();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      alert(error.response?.data?.message || 'Error al actualizar el usuario en el servidor.');
    }
  };

  const handleEliminarUsuario = (userId) => {
    setModalConfig({
      isOpen: true,
      mensaje: '¿Estás seguro de que deseas eliminar este usuario del sistema?',
      onConfirm: async () => {
        setModalConfig({ isOpen: false, mensaje: '', onConfirm: null });
        try {
          const token = localStorage.getItem('auth_token');
          await api.delete(`users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          });
          setUsuariosList(prev => prev.filter(u => u.id !== userId));
          alert('Usuario eliminado correctamente.');
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          alert(error.response?.data?.message || 'Hubo un error al intentar eliminar el usuario.');
        }
      }
    });
  };

  const mainMenuItems = [
    { id: "Perfil", label: "Perfil", icon: User },
    { id: "Bandeja", label: "Bandeja de Entrada", icon: LayoutDashboard },
    { id: "Estadisticas", label: "Estadísticas", icon: BarChart3 },
    ...(esAdmin ? [{ id: "Usuarios", label: "Gestión de Usuarios", icon: Users }] : []),
    { id: "Configuracion", label: "Configuración", icon: Settings },
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

  const misPeritajesList = inspecciones?.filter(item => {
    const inspectorNombre = item.inspector?.name || item.inspector || '';
    const userName = profileData.name || user?.name || user?.nombre || '';
    return inspectorNombre.toLowerCase().includes(userName.toLowerCase());
  }) || [];

  const totalPeritajes = misPeritajesList.length;

  const handleActualizarPassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Por favor completa todos los campos de contraseña.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }
    try {
      const token = localStorage.getItem('auth_token');
      await api.put('user/password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword
      }, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });

      alert("¡Contraseña actualizada exitosamente!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      alert(error.response?.data?.message || "Ocurrió un error al actualizar la contraseña.");
    }
  };



  const guardarPeritajeCompleto = async (formDataDelEstado) => {
    try {
      const token = localStorage.getItem('auth_token');
      const esEdicion = Boolean(formDataDelEstado.id);
      const endpoint = esEdicion ? `peritajes/${formDataDelEstado.id}` : 'peritajes';
      const dataToSend = new FormData();

      if (esEdicion) dataToSend.append('_method', 'PATCH');

      dataToSend.append('estado', 'completado');
      dataToSend.append('tipo_vehiculo_id', formDataDelEstado.tipoVehiculoId || formDataDelEstado.tipoVehiculo || '');

      if (formDataDelEstado.sucursalVendedorId && !formDataDelEstado.sucursalVendedorId.includes('AQUI')) {
        dataToSend.append('sucursal_vendedor_id', formDataDelEstado.sucursalVendedorId);
      }
      if (formDataDelEstado.sucursalInspeccionId && !formDataDelEstado.sucursalInspeccionId.includes('AQUI')) {
        dataToSend.append('sucursal_inspeccion_id', formDataDelEstado.sucursalInspeccionId);
      }
      if (formDataDelEstado.vendedorId && !formDataDelEstado.vendedorId.includes('AQUI')) {
        dataToSend.append('vendedor_id', formDataDelEstado.vendedorId);
      }

      dataToSend.append('placa', formDataDelEstado.placa ? String(formDataDelEstado.placa).trim() : '');
      dataToSend.append('marca', formDataDelEstado.marca || '');
      dataToSend.append('linea', formDataDelEstado.linea || '');
      dataToSend.append('color', formDataDelEstado.color || '');

      let anioModelo = Number(formDataDelEstado.modeloAnio || formDataDelEstado.modelo);
      if (!anioModelo || isNaN(anioModelo) || anioModelo > 2050 || anioModelo < 1900) {
        anioModelo = 2026;
      }
      dataToSend.append('modelo_anio', anioModelo);

      dataToSend.append('num_motor', formDataDelEstado.numMotor || '');
      dataToSend.append('num_chasis', formDataDelEstado.numChasis || '');
      dataToSend.append('kilometraje', Number(formDataDelEstado.kilometraje || 0));
      dataToSend.append('organismo_transito', formDataDelEstado.organismoTransito || '');
      dataToSend.append('siniestros', formDataDelEstado.siniestros || formDataDelEstado.comentariosSiniestros || '');
      dataToSend.append('numero_soat', formDataDelEstado.numeroSoat || '');
      dataToSend.append('entidad_emisora_soat', formDataDelEstado.entityEmisoraSoat || '');
      if (formDataDelEstado.venceSoat) dataToSend.append('vence_soat', formDataDelEstado.venceSoat);
      dataToSend.append('soat_al_dia', formDataDelEstado.soatAlDia ? '1' : '0');

      dataToSend.append('numero_control_rtm', formDataDelEstado.numeroControlRtm || '');
      dataToSend.append('cda_emisor', formDataDelEstado.cdaEmisor || '');
      if (formDataDelEstado.venceTecnicoMecanica) dataToSend.append('vence_tecnico_mecanica', formDataDelEstado.venceTecnicoMecanica);
      dataToSend.append('tecnico_mecanica_al_dia', formDataDelEstado.tecnicoMecanicaAlDia ? '1' : '0');
      dataToSend.append('coincide_propietario_runt', formDataDelEstado.coincidePropietarioRunt ? '1' : '0');
      dataToSend.append('tiene_embargos_o_alertas', formDataDelEstado.tieneEmbargosOAlertas ? '1' : '0');
      dataToSend.append('restriccion_blindaje', formDataDelEstado.restriccionBlindaje || 'sin_blindaje');
      dataToSend.append('compresion_motor', formDataDelEstado.compresionMotor || '');
      dataToSend.append('fugas_aceite', formDataDelEstado.fugasAceite ? '1' : '0');
      dataToSend.append('estado_bateria', formDataDelEstado.estadoBateria || 'Bueno');
      dataToSend.append('ruidos_extranos', formDataDelEstado.ruidosExtranos ? '1' : '0');

      dataToSend.append('comentarios_motor', formDataDelEstado.comentariosMotor || '');
      dataToSend.append('tipo_transmision', formDataDelEstado.tipoTransmision || '');
      dataToSend.append('traccion', formDataDelEstado.traccion || '');
      dataToSend.append('estado_transmision', formDataDelEstado.estadoTransmision || '');
      dataToSend.append('estado_general_vehiculo', formDataDelEstado.estadoGeneralVehiculo || 'Aceptable');
      dataToSend.append('concepto_final', formDataDelEstado.conceptoFinal || '');
      dataToSend.append('tiempo_estimado_reparacion', formDataDelEstado.tiempoEstimadoReparacion || '');
      dataToSend.append('score_estructura', Number(formDataDelEstado.scoreEstructura ?? 100));
      dataToSend.append('score_carroceria', Number(formDataDelEstado.scoreCarroceria ?? 100));
      dataToSend.append('score_mecanica', Number(formDataDelEstado.scoreMecanica ?? 100));
      dataToSend.append('score_electrico', Number(formDataDelEstado.scoreElectrico ?? 100));
      dataToSend.append('score_legal', Number(formDataDelEstado.scoreLegal ?? 100));

      dataToSend.append('cliente_nombre', formDataDelEstado.clienteNombre || '');
      dataToSend.append('cliente_documento', formDataDelEstado.clienteDocumento || '');
      dataToSend.append('cliente_telefono', formDataDelEstado.clienteTelefono || '');

      if (formDataDelEstado.firmaInspector) {
        dataToSend.append('firma_inspector', formDataDelEstado.firmaInspector);
      }

      const normalizarLista = (lista) => {
        if (!lista) return [];
        if (Array.isArray(lista)) return lista;
        if (typeof lista === 'object') return Object.values(lista);
        return [];
      };

      dataToSend.append('accesorios', JSON.stringify(normalizarLista(formDataDelEstado.accesoriosList)));
      dataToSend.append('danos_externos', JSON.stringify(normalizarLista(formDataDelEstado.danosExternos)));
      dataToSend.append('danos_internos', JSON.stringify(normalizarLista(formDataDelEstado.danosInternos)));
      dataToSend.append('detalles_tecnicos', JSON.stringify(normalizarLista(formDataDelEstado.detallesTecnicos)));
      dataToSend.append('sistemas_mecanicos', JSON.stringify(normalizarLista(formDataDelEstado.sistemasMecanicos)));

      const compresionCilindros = [1, 2, 3, 4]
        .map((n) => formDataDelEstado[`compresionCil${n}`])
        .filter((v) => v !== undefined && v !== null && v !== '');
      dataToSend.append('compresion_cilindros', JSON.stringify(compresionCilindros));

      if (formDataDelEstado.archivoSoat?.file instanceof File) {
        dataToSend.append('foto_soat', formDataDelEstado.archivoSoat.file);
      }
      if (formDataDelEstado.archivoTecnicoMecanica?.file instanceof File) {
        dataToSend.append('foto_rtm', formDataDelEstado.archivoTecnicoMecanica.file);
      }

      await api.post(endpoint, dataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });

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
    if (updatedFields.modelo && typeof updatedFields.modelo === 'string' && isNaN(updatedFields.modelo)) {
      delete updatedFields.modelo;
    }
    setPeritajeData((prev) => ({ ...prev, ...updatedFields }));
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
      inspectorNombre: profileData.name || user?.name || user?.nombre || null,
    };
  };

  const resolverTipoVehiculo = (item) => {
    const tipoIdBD = item.tipo_vehiculo_id || item.tipoVehiculoId;
    if (tipoIdBD === '7c68a26d-372b-42dc-be00-92c4ed2ee6ce') return 'moto';
    if (tipoIdBD === 'd5017832-04ac-4ead-8f57-efbe8af78860') return 'pesado';
    if (tipoIdBD === 'e8ca5ff6-fe17-4916-b949-c13cac3a706e') return 'motocarro';
    if (tipoIdBD === '1c9740ed-b045-4643-9fe6-cfb2c412854f') return 'carro';
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
      ...compresionCilFields,
      tipoVehiculo: resolverTipoVehiculo(item),
      tipoVehiculoId: item.tipo_vehiculo_id || item.tipoVehiculoId || '',
      modelo: item.modelo || (item.modelo_anio ? String(item.modelo_anio) : ''),
      version: item.version || '',
      cilindrada: item.cilindrada || '',
      color: item.color || '',
      tipoTransmision: item.tipo_transmision || item.tipoTransmision || '',
      traccion: item.traccion || '',
      estadoTransmision: item.estado_transmision || item.estadoTransmision || '',
      numMotor: item.num_motor || item.numMotor || '',
      numChasis: item.num_chasis || item.numChasis || '',
      kilometraje: item.kilometraje || item.km || 0,
      comprimido: item.comprimido || item.compresionCil1 || item.compresionCil2 || item.compresionCil3 || item.compresionCil4 || false,
      venceSoat: item.vence_soat || item.venceSoat || '',
      soatAlDia: item.soat_al_dia ?? item.soatAlDia ?? true,
      archivoSoat: item.archivo_soat || item.archivoSoat || item.foto_soat || null,
      venceTecnicoMecanica: item.vence_tecnico_mecanica || item.venceTecnicoMecanica || '',
      tecnicoMecanicaAlDia: item.tecnico_mecanica_al_dia ?? item.tecnicoMecanicaAlDia ?? true,
      archivoTecnicoMecanica: item.archivo_tecnico_mecanica || item.archivoTecnicoMecanica || item.archivoRtm || item.foto_rtm || null,
      siniestros: item.siniestros || item.comentarios_siniestros || '',
      tarjetaOperacion: item.tarjeta_operacion || item.tarjetaOperacion || '',
      configuracionEjes: item.configuracion_ejes || item.configuracionEjes || '',
      clienteNombre: item.cliente_nombre || item.cliente?.nombre || item.clienteNombre || '',
      clienteDocumento: item.cliente_documento || item.cliente?.documento || item.clienteDocumento || '',
      clienteTelefono: item.cliente_telefono || item.cliente?.telefono || item.clienteTelefono || '',
      sistemasMecanicos: item.sistemas_mecanicos || item.sistemasMecanicos || {},
      comentariosMotor: item.comentarios_motor || item.comentariosMotor || '',
      danosExternos: item.danos_externos || item.danosExternos || {},
      danosInternos: item.danos_internos || item.danosInternos || {},
      detallesTecnicos: item.detalles_tecnicos || item.detallesTecnicos || {},
      accesoriosList: item.accesorios || item.accesoriosList || [],
      firmaInspector: item.firma_inspector || item.firmaInspector || null,
      tiempoCompletitud: item.tiempo_completitud || item.tiempoCompletitud || '',
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

  const handleEliminarPeritaje = (idPeritaje) => {
    if (!idPeritaje) return;
    setModalConfig({
      isOpen: true,
      mensaje: '¿Estás seguro de que deseas eliminar este peritaje?',
      onConfirm: async () => {
        setModalConfig({ isOpen: false, mensaje: '', onConfirm: null });
        try {
          await api.delete(`peritajes/${idPeritaje}`);
          setInspecciones(prevLista => prevLista.filter(item => item.id !== idPeritaje));
          alert('Peritaje eliminado correctamente.');
        } catch (error) {
          console.error("Error al eliminar:", error);
          alert(error.response?.data?.message || 'Hubo un error al intentar eliminar el peritaje.');
        }
      }
    });
  };

  const handleEditarPeritaje = (item) => {
    const peritajeMapeado = mapearPeritajeDeBackend(item);
    setPeritajeData(peritajeMapeado);
    setIsInspecting(true);
    setInspectionStep('Documentacion');
  };

  // Novedad: Helper para forzar la visualización del nombre de la sucursal si el backend manda el ID
  const getNombreSucursal = (id, obj) => {
    if (obj?.nombre) return obj.nombre;
    if (id) {
      const match = sucursales.find(s => String(s.id) === String(id));
      if (match) return match.nombre;
    }
    return 'Sin sucursal asignada';
  };

  const totalInspeccionesCount = inspecciones.length;
  const enProcesoCount = inspecciones.filter(i => ['en proceso', 'borrador'].includes((i.estado || '').toLowerCase())).length;
  const completadasCount = inspecciones.filter(i => (i.estado || '').toLowerCase() === 'completado').length;

  const inspeccionesFiltradasEstadisticas = inspecciones.filter(item => {
    const placaMatch = !filtroEstadisticasPlaca || (item.placa || '').toLowerCase().includes(filtroEstadisticasPlaca.toLowerCase());
    const inspectorNombre = (item.inspector?.name || item.inspector || '').toLowerCase();
    const inspectorMatch = !filtroEstadisticasInspector || inspectorNombre.includes(filtroEstadisticasInspector.toLowerCase());
    const fechaItem = item.fechaPeritaje || item.created_at ? (item.fechaPeritaje || item.created_at).split('T')[0] : '';
    const fechaMatch = !filtroEstadisticasFecha || fechaItem === filtroEstadisticasFecha;
    const tipoVehiculoItem = resolverTipoVehiculo(item);
    const tipoMatch = !filtroEstadisticasTipo || tipoVehiculoItem === filtroEstadisticasTipo;

    return placaMatch && inspectorMatch && fechaMatch && tipoMatch;
  });

  return (
    <div className="flex min-h-screen bg-[#f4f6fa] text-slate-800 font-sans relative overflow-x-hidden">
      {isSidebarOpen && (
        <div onClick={toggleSidebar} className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
      )}

      {/* Selectors y Modales existentes */}
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
                      const response = await api.post('peritajes', {
                        tipo_vehiculo_id: tipo.tipoId,
                        placa: 'SIN-PLACA',
                        estado: 'borrador'
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

      {showCrearUsuarioModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* Contenido modal crear usuario */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registrar Nuevo Usuario</h3>
                <p className="text-xs text-slate-500 mt-0.5">Asigna credenciales y rol en el sistema</p>
              </div>
              <button onClick={() => setShowCrearUsuarioModal(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg hover:bg-slate-200/50 transition">✕</button>
            </div>

            <form onSubmit={handleCrearUsuario} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Nombre Completo *</label>
                <input type="text" required value={nuevoUsuarioData.name} onChange={(e) => setNuevoUsuarioData({ ...nuevoUsuarioData, name: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Correo Electrónico *</label>
                <input type="email" required value={nuevoUsuarioData.email} onChange={(e) => setNuevoUsuarioData({ ...nuevoUsuarioData, email: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Contraseña *</label>
                <input type="password" required value={nuevoUsuarioData.password} onChange={(e) => setNuevoUsuarioData({ ...nuevoUsuarioData, password: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Rol *</label>
                  <select value={nuevoUsuarioData.rol} onChange={(e) => setNuevoUsuarioData({ ...nuevoUsuarioData, rol: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="tecnico">Técnico</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Estado</label>
                  <select value={nuevoUsuarioData.activo ? '1' : '0'} onChange={(e) => setNuevoUsuarioData({ ...nuevoUsuarioData, activo: e.target.value === '1' })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Sucursal Asignada</label>
                <select value={nuevoUsuarioData.sucursal_id || ''} onChange={(e) => setNuevoUsuarioData({ ...nuevoUsuarioData, sucursal_id: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Seleccione una sucursal...</option>
                  {sucursales && sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.id}>{sucursal.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowCrearUsuarioModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition">Guardar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditarUsuarioModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* Contenido modal editar usuario */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Editar Usuario / Perfil</h3>
                <p className="text-xs text-slate-500 mt-0.5">Modifica los datos del usuario en el sistema</p>
              </div>
              <button onClick={() => setShowEditarUsuarioModal(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg hover:bg-slate-200/50 transition">✕</button>
            </div>

            <form onSubmit={handleActualizarUsuarioSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Nombre Completo *</label>
                <input type="text" required value={usuarioEditData.name} onChange={(e) => setUsuarioEditData({ ...usuarioEditData, name: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Correo Electrónico *</label>
                <input type="email" required value={usuarioEditData.email} onChange={(e) => setUsuarioEditData({ ...usuarioEditData, email: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Nueva Contraseña (Opcional)</label>
                <input type="password" placeholder="Dejar en blanco para mantener la actual" value={usuarioEditData.password} onChange={(e) => setUsuarioEditData({ ...usuarioEditData, password: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Rol *</label>
                  <select value={usuarioEditData.rol} onChange={(e) => setUsuarioEditData({ ...usuarioEditData, rol: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="tecnico">Técnico</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Estado</label>
                  <select value={usuarioEditData.activo ? '1' : '0'} onChange={(e) => setUsuarioEditData({ ...usuarioEditData, activo: e.target.value === '1' })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Sucursal Asignada</label>
                <select value={usuarioEditData.sucursal_id} onChange={(e) => setUsuarioEditData({ ...usuarioEditData, sucursal_id: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Sin sucursal fija --</option>
                  {sucursales.map((suc) => (
                    <option key={suc.id} value={suc.id}>{suc.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowEditarUsuarioModal(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl transition">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition">Actualizar Usuario</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para ver el perfil del usuario (Audit/Admin) */}
      {showUserProfileModal && selectedUserForProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Perfil del Usuario</h3>
                <p className="text-xs text-slate-500">Vista de auditoría administrativa</p>
              </div>
              <button
                onClick={() => { setShowUserProfileModal(false); setSelectedUserForProfile(null); }}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg hover:bg-slate-200/50 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-black shadow-md">
                  {selectedUserForProfile.name ? selectedUserForProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{selectedUserForProfile.name}</h4>
                  <p className="text-xs text-slate-500">{selectedUserForProfile.email}</p>
                  <span className="inline-block mt-1.5 bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase border border-blue-100">
                    {selectedUserForProfile.rol || 'tecnico'}
                  </span>
                </div>
              </div>

              {/* AQUI SE AGREGA LA ESTADÍSTICA DE PERITAJES REALIZADOS PARA EL GESTOR DE USUARIOS */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Sucursal</span>
                  <span className="font-semibold text-slate-700 mt-0.5 block truncate">
                    {sucursales.find(s => s.id === selectedUserForProfile.sucursal_id)?.nombre || 'General'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Estado</span>
                  <span className={`inline-block mt-0.5 font-bold ${selectedUserForProfile.activo !== false ? 'text-emerald-600' : 'text-red-600'}`}>
                    {selectedUserForProfile.activo !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Peritajes</span>
                  <span className="font-black text-blue-600 mt-0.5 block text-lg leading-none">
                    {inspecciones.filter(i => (i.inspector?.name || i.inspector || '').toLowerCase() === (selectedUserForProfile.name || '').toLowerCase()).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowUserProfileModal(false);
                    handleEditarUsuarioModalOpen(selectedUserForProfile);
                  }}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    setShowUserProfileModal(false);
                    handleEliminarUsuario(selectedUserForProfile.id);
                  }}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition"
                >
                  Eliminar
                </button>
              </div>
              <button
                onClick={() => { setShowUserProfileModal(false); setSelectedUserForProfile(null); }}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
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
              <img src="/Logo1.png" alt="Servi-Centro CDA" className="w-40 object-contain" draggable={false} />
            </button>
            <button onClick={toggleSidebar} className="absolute right-4 top-4 lg:hidden text-slate-400 hover:text-white">✕</button>
          </div>

          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsInspecting(false);
                      setIsSidebarOpen(false);
                    }}
                    className={`group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id && !isInspecting
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                  >
                    <Icon size={18} strokeWidth={2} className={activeTab === item.id && !isInspecting ? "text-white" : "text-slate-400 group-hover:text-white"} />
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

      {/* Main Content */}
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
                    {peritajeData.id ? 'Editar Peritaje Vehicular' : 'Nuevo Peritaje Vehicular'} {peritajeData.tipoVehiculo && <span className="text-blue-600 uppercase text-lg">({peritajeData.tipoVehiculo})</span>}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold border border-amber-200">
                    {peritajeData.id ? 'Modo Edición' : 'Borrador en Progreso'}
                  </span>
                </div>
              </div>

              <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-thin">
                {inspectionSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setInspectionStep(step.id)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-lg border whitespace-nowrap transition flex items-center space-x-2 ${inspectionStep === step.id
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
                        onAgregarSucursal={() => { setNombreInput(''); setModalActivo('sucursal'); }}
                        onAgregarVendedor={() => { setNombreInput(''); setModalActivo('vendedor'); }}
                      />
                    )}
                    {inspectionStep === 'Accesorios y Equipamiento' && <Accesorios peritajeData={peritajeData} onChange={handleDataChange} />}
                    {inspectionStep === 'Motor' && <Motor peritajeData={peritajeData} onChange={handleDataChange} />}
                    {inspectionStep === 'Pintura' && <VistaExterna peritajeData={peritajeData} onChange={handleDataChange} />}
                    {inspectionStep === 'VistaInterna' && <VistaInterna peritajeData={peritajeData} onChange={handleDataChange} />}
                    {inspectionStep === 'Detalles Técnicos' && <DetallesTecnicos peritajeData={peritajeData} onChange={handleDataChange} />}
                    {inspectionStep === 'Firma' && <Firma peritajeData={peritajeData} onChange={handleDataChange} />}
                    {inspectionStep === 'PDF' && <InformePdf peritajeData={construirDatosParaPdf(peritajeData)} onChange={handleDataChange} />}
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

                  {inspectionStep !== inspectionSteps[inspectionSteps.length - 1].id ? (
                    <button
                      onClick={() => {
                        const idx = inspectionSteps.findIndex(s => s.id === inspectionStep);
                        if (idx < inspectionSteps.length - 1) setInspectionStep(inspectionSteps[idx + 1].id);
                      }}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      onClick={() => guardarPeritajeCompleto(peritajeData)}
                      className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow"
                    >
                      {peritajeData.id ? 'Actualizar Peritaje' : 'Finalizar Peritaje'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'Bandeja' && (
                <div className="space-y-6">
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
                                <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                                  {item.fecha_peritaje || item.created_at
                                    ? new Date(item.fecha_peritaje || item.created_at).toLocaleDateString('es-ES')
                                    : 'N/A'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-800">{item.marca || 'N/A'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">{item.modelo || item.linea || 'N/A'}</td>
                                <td className="px-4 py-4 whitespace-nowrap font-mono">{item.km || item.kilometraje || '0'}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="inline-block bg-slate-900 text-white px-2.5 py-1 rounded-md font-mono font-bold text-[11px] shadow-sm">
                                    {item.placa || 'SIN PLACA'}
                                  </span>
                                </td>
                                {/* AQUI ESTÁ EL AJUSTE PARA MOSTRAR SUCURSALES (Usando getNombreSucursal) */}
                                <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                                  {getNombreSucursal(item.sucursal_vendedor_id || item.sucursalVendedorId, item.sucursal_vendedor || item.sucursalVendedor)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-slate-500">
                                  {getNombreSucursal(item.sucursal_inspeccion_id || item.sucursalInspeccionId, item.sucursal_inspeccion || item.sucursalInspeccion)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-slate-700">
                                  {item.vendedor?.nombre || item.vendedor || 'Sin vendedor'}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-800">
                                  {item.inspector?.name || item.inspector || 'Inspector Activo'}
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
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEliminarPeritaje(item.id);
                                      }}
                                      className="text-[11px] font-semibold text-red-600 hover:text-red-800 hover:underline transition duration-140"
                                    >
                                      Eliminar
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
                </div>
              )}

              {activeTab === 'Estadisticas' && (
                <div className="space-y-6">
                  {/* Contenido Estadísticas existente */}
                  <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Estadísticas y Rendimiento</h1>
                    <p className="text-slate-500 mt-1 text-sm">Análisis global de los peritajes vehiculares registrados en el sistema con filtros avanzados.</p>
                  </div>

                  <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Filtros de Análisis</h3>
                      {(filtroEstadisticasPlaca || filtroEstadisticasInspector || filtroEstadisticasFecha || filtroEstadisticasTipo) && (
                        <button
                          onClick={() => {
                            setFiltroEstadisticasPlaca('');
                            setFiltroEstadisticasInspector('');
                            setFiltroEstadisticasFecha('');
                            setFiltroEstadisticasTipo('');
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:underline"
                        >
                          Limpiar filtros
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">Filtrar por Placa</label>
                        <input
                          type="text"
                          placeholder="Ej. ABC123"
                          value={filtroEstadisticasPlaca}
                          onChange={(e) => setFiltroEstadisticasPlaca(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2.5 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">Filtrar por Inspector</label>
                        <input
                          type="text"
                          placeholder="Nombre del inspector"
                          value={filtroEstadisticasInspector}
                          onChange={(e) => setFiltroEstadisticasInspector(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">Fecha de Peritaje</label>
                        <input
                          type="date"
                          value={filtroEstadisticasFecha}
                          onChange={(e) => setFiltroEstadisticasFecha(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-600 mb-1">Tipo de Vehículo</label>
                        <select
                          value={filtroEstadisticasTipo}
                          onChange={(e) => setFiltroEstadisticasTipo(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Todos --</option>
                          <option value="carro">Carro</option>
                          <option value="moto">Moto</option>
                          <option value="pesado">Pesado</option>
                          <option value="motocarro">Motocarro</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Inspecciones Filtradas</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{inspeccionesFiltradasEstadisticas.length}</p>
                    </div>
                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm border-l-4 border-l-blue-500">
                      <p className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Completadas</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">
                        {inspeccionesFiltradasEstadisticas.filter(i => (i.estado || '').toLowerCase() === 'completado').length}
                      </p>
                    </div>
                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm border-l-4 border-l-amber-500">
                      <p className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">Borradores / En Proceso</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">
                        {inspeccionesFiltradasEstadisticas.filter(i => ['en proceso', 'borrador'].includes((i.estado || '').toLowerCase())).length}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Distribución por Tipo de Vehículo
                      </h3>
                      <div className="space-y-3 text-xs">
                        {['carro', 'moto', 'pesado', 'motocarro'].map((tipo) => {
                          const count = inspeccionesFiltradasEstadisticas.filter(i => resolverTipoVehiculo(i) === tipo).length;
                          const porcentaje = inspeccionesFiltradasEstadisticas.length ? Math.round((count / inspeccionesFiltradasEstadisticas.length) * 100) : 0;
                          return (
                            <div key={tipo} className="space-y-1">
                              <div className="flex justify-between font-medium text-slate-700 capitalize">
                                <span>{tipo}</span>
                                <span>{count} ({porcentaje}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${porcentaje}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                        Resumen Operativo
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Las métricas se calculan de forma dinámica en base a los filtros aplicados (Placa, Inspector, Fecha y Tipo de Vehículo) sobre los registros sincronizados en el sistema.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Peritajes Filtrados ({inspeccionesFiltradasEstadisticas.length})
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-600 min-w-[1000px]">
                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Placa</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Marca / Modelo</th>
                            <th className="px-4 py-3">Inspector</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {inspeccionesFiltradasEstadisticas.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                                No se encontraron peritajes con los filtros seleccionados.
                              </td>
                            </tr>
                          ) : (
                            inspeccionesFiltradasEstadisticas.map((item) => (
                              <tr key={item.id || item.placa} className="hover:bg-slate-50/50 transition">
                                <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                                  {item.fechaPeritaje || item.created_at ? new Date(item.fechaPeritaje || item.created_at).toLocaleDateString('es-CO') : 'N/A'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className="inline-block bg-slate-900 text-white px-2 py-0.5 rounded-md font-mono font-bold text-[11px]">
                                    {item.placa || 'SIN PLACA'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap capitalize font-medium text-slate-700">
                                  {resolverTipoVehiculo(item)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap font-semibold text-slate-800">
                                  {item.marca || 'N/A'} {item.modelo || item.linea || ''}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                                  {item.inspector?.name || item.inspector || 'Inspector Activo'}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${(item.estado || '').toLowerCase() === 'completado'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                    {item.estado || 'en proceso'}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-2">
                                    {item.estado === "completado" && (
                                      <button
                                        onClick={() => handleDescargarPDF(item)}
                                        className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-slate-800 transition shadow-xs"
                                      >
                                        ⬇️ PDF
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleEditarPeritaje(item)}
                                      className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase rounded-lg transition font-medium"
                                    >
                                      Ver / Editar
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
                </div>
              )}

              {/* REDISEÑO COMPLETO DE CONFIGURACIONES */}
              {activeTab === 'Configuracion' && (
                <div className="space-y-6 max-w-5xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Configuración del Sistema</h1>
                      <p className="text-slate-500 mt-1 text-sm">Gestiona los parámetros generales, textos legales para reportes PDF y reglas de inspección.</p>
                    </div>
                    <button
                      onClick={handleGuardarConfiguracion}
                      className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-black text-white rounded-xl shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
                    >
                      <Save size={16} />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna Izquierda: Menú Navegación Rápida */}
                    <div className="lg:col-span-1 space-y-4">
                      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Módulos de Ajuste</h3>
                        <ul className="space-y-2 text-sm font-medium text-slate-600">
                          <li className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 cursor-default">
                            <Building size={18} /> <span>Perfil de la Empresa</span>
                          </li>
                          <li className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition cursor-default">
                            <Sliders size={18} /> <span>Reglas de Inspección</span>
                          </li>
                          <li className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-xl transition cursor-default">
                            <FileText size={18} /> <span>Documentos & PDF</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-sm text-white">
                        <CheckCircle2 size={24} className="mb-3 text-blue-200" />
                        <h3 className="text-sm font-bold mb-1">Ajustes Globales</h3>
                        <p className="text-xs text-blue-100 leading-relaxed">
                          Estos parámetros afectarán a todas las nuevas inspecciones generadas por los técnicos desde la plataforma.
                        </p>
                      </div>
                    </div>

                    {/* Columna Derecha: Formularios rediseñados */}
                    <div className="lg:col-span-2 space-y-6">

                      {/* Form: Empresa */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Building size={18} className="text-blue-600" /> Datos Fiscales y del CDA
                          </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Nombre del Centro / Taller</label>
                            <input type="text" value={configSistema.nombreEmpresa} onChange={(e) => setConfigSistema({ ...configSistema, nombreEmpresa: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" required />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">NIT</label>
                            <input type="text" value={configSistema.nit} onChange={(e) => setConfigSistema({ ...configSistema, nit: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" required />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Teléfono de Contacto</label>
                            <input type="text" value={configSistema.telefono} onChange={(e) => setConfigSistema({ ...configSistema, telefono: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Correo Electrónico</label>
                            <input type="email" value={configSistema.emailEmpresa} onChange={(e) => setConfigSistema({ ...configSistema, emailEmpresa: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Dirección Física</label>
                            <input type="text" value={configSistema.direccion} onChange={(e) => setConfigSistema({ ...configSistema, direccion: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                          </div>
                        </div>
                      </div>

                      {/* Form: Reglas */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Sliders size={18} className="text-blue-600" /> Parámetros de Inspección
                          </h3>
                        </div>
                        <div className="p-6 space-y-5">
                          <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-100 transition-colors bg-white">
                            <div>
                              <p className="text-sm font-bold text-slate-800">Validación Estricta de Documentos</p>
                              <p className="text-xs text-slate-500 mt-0.5">Exigir formato alfanumérico válido para SOAT y RTM.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={configSistema.exigirFotosDocumentos} onChange={(e) => setConfigSistema({ ...configSistema, exigirFotosDocumentos: e.target.checked })} />
                              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="space-y-1.5 w-full sm:w-1/2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Score / Puntaje Inicial</label>
                            <div className="relative">
                              <input type="number" min="50" max="100" value={configSistema.scoreInicialDefecto} onChange={(e) => setConfigSistema({ ...configSistema, scoreInicialDefecto: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" />
                              <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">pts</span>
                            </div>
                            <p className="text-[10px] text-slate-400">Puntaje máximo asignado al iniciar un nuevo peritaje.</p>
                          </div>
                        </div>
                      </div>

                      {/* Form: Textos Legales */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <FileText size={18} className="text-blue-600" /> Términos y PDF
                          </h3>
                        </div>
                        <div className="p-6 space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Texto Legal al Pie de Página (Reportes PDF)</label>
                          <textarea rows="4" value={configSistema.textoLegalPdf} onChange={(e) => setConfigSistema({ ...configSistema, textoLegalPdf: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none resize-none leading-relaxed" />
                          <p className="text-[10px] text-slate-400 mt-1">Este texto se adjuntará automáticamente al generar el diagnóstico en PDF.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Perfil' && (
                <div key={user?.id || 'loading'} className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Perfil de Técnico</h1>
                      <p className="text-slate-500 mt-1 text-sm">Gestiona tu información personal y estadísticas de trabajo.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm text-center space-y-6 md:col-span-1 flex flex-col items-center justify-between">
                      <div className="space-y-4 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-blue-500/20">
                          <span>{profileData.name ? profileData.name.charAt(0).toUpperCase() : 'C'}</span>
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900">{profileData.name}</h2>
                          <span className="inline-block mt-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                            {profileData.rol || 'Técnico / Inspector'}
                          </span>
                        </div>
                      </div>

                      <div
                        onClick={() => setShowMisPeritajesModal(true)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-center cursor-pointer hover:bg-blue-50/40 hover:border-blue-200 transition group"
                        title="Haz clic para ver la lista de tus peritajes"
                      >
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 mb-1">
                          Peritajes Realizados 🔍
                        </span>
                        <span className="text-3xl font-black text-blue-600">
                          {totalPeritajes}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm space-y-6 md:col-span-2 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                          Información Personal y Profesional
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nombre Completo</label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Correo Electrónico</label>
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Rol / Ocupación</label>
                            <input
                              type="text"
                              value={profileData.rol}
                              disabled
                              className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-500 font-medium cursor-not-allowed outline-none transition"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button onClick={handleUpdateProfile} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm space-y-6">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                      Seguridad y Contraseña
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Contraseña Actual</label>
                        <input type="password" placeholder="••••••••" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Nueva Contraseña</label>
                        <input type="password" placeholder="••••••••" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Confirmar Contraseña</label>
                        <input type="password" placeholder="••••••••" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button onClick={handleActualizarPassword} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow transition">
                        Actualizar Contraseña
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Usuarios' && esAdmin && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Usuarios</h1>
                      <p className="text-slate-500 mt-1 text-sm">Panel exclusivo de administración para dar de alta nuevos usuarios, editar o eliminar perfiles.</p>
                    </div>
                    <button
                      onClick={() => setShowCrearUsuarioModal(true)}
                      className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow hover:bg-blue-700 transition self-start sm:self-auto"
                    >
                      + Crear Nuevo Usuario
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200/85 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                      <h2 className="text-sm font-bold text-slate-900">LISTADO DE USUARIOS REGISTRADOS</h2>
                      {loadingUsuarios && <span className="text-xs text-blue-500 animate-pulse">Cargando usuarios...</span>}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Correo Electrónico</th>
                            <th className="px-6 py-3">Rol</th>
                            <th className="px-6 py-3">Sucursal Asignada</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {usuariosList.length === 0 && !loadingUsuarios ? (
                            <tr>
                              <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                                No se encontraron usuarios registrados.
                              </td>
                            </tr>
                          ) : (
                            usuariosList.map((usr) => (
                              <tr key={usr.id} className="hover:bg-slate-50/50 transition">
                                <td className="px-6 py-4 font-semibold text-slate-800">{usr.name}</td>
                                <td className="px-6 py-4 text-slate-500">{usr.email}</td>
                                <td className="px-6 py-4">
                                  <span className="inline-block bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-md text-[10px] uppercase border border-blue-100">
                                    {usr.rol || 'tecnico'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                  {sucursales.find(s => s.id === usr.sucursal_id)?.nombre || 'Sin sucursal fija'}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${usr.activo !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                    {usr.activo !== false ? 'Activo' : 'Inactivo'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedUserForProfile(usr);
                                        setShowUserProfileModal(true);
                                      }}
                                      className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] font-bold uppercase rounded-lg transition"
                                    >
                                      Ver
                                    </button>
                                    <button
                                      onClick={() => handleEditarUsuarioModalOpen(usr)}
                                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline transition duration-140"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      onClick={() => handleEliminarUsuario(usr.id)}
                                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-bold uppercase rounded-lg transition"
                                    >
                                      Eliminar
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
                </div>
              )}
            </>
          )}

          {showMisPeritajesModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Mis Peritajes Realizados</h3>
                    <p className="text-xs text-slate-500">Listado de inspecciones asociadas a tu cuenta ({misPeritajesList.length})</p>
                  </div>
                  <button
                    onClick={() => setShowMisPeritajesModal(false)}
                    className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-200/50 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  {misPeritajesList.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No tienes peritajes registrados a tu nombre actualmente.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {misPeritajesList.map((item) => (
                        <div key={item.id || item.placa} className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-slate-900 text-white px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                                {item.placa || 'SIN PLACA'}
                              </span>
                              <span className="text-xs font-bold text-slate-800">{item.marca} {item.modelo || item.linea || ''}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Fecha: {item.fechaPeritaje || item.created_at ? new Date(item.fechaPeritaje || item.created_at).toLocaleDateString('es-CO') : 'N/A'}
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            {item.estado === "completado" && (
                              <button
                                onClick={() => handleDescargarPDF(item)}
                                className="px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-slate-800 transition shadow-xs"
                              >
                                PDF
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setShowMisPeritajesModal(false);
                                handleEditarPeritaje(item);
                              }}
                              className="px-2.5 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-bold uppercase rounded-lg transition font-medium"
                            >
                              Ver / Editar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setShowMisPeritajesModal(false)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {modalActivo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
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
                  <button onClick={() => setModalActivo(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">Cancelar</button>
                  <button
                    onClick={async () => {
                      if (!nombreInput || !nombreInput.trim()) return;
                      try {
                        const token = localStorage.getItem('auth_token');
                        const endpoint = modalActivo === 'sucursal' ? 'sucursales' : 'vendedores';
                        const response = await api.post(endpoint, { nombre: nombreInput }, {
                          headers: { 'Authorization': `Bearer ` + token, 'Accept': 'application/json' }
                        });
                        const nuevoRegistro = response.data.data || response.data;
                        if (modalActivo === 'sucursal') setSucursales(prev => [...prev, nuevoRegistro]);
                        else setVendedores(prev => [...prev, nuevoRegistro]);
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

      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 transform transition-all scale-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar acción</h3>
            <p className="text-gray-600 text-xs mb-6">{modalConfig.mensaje}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalConfig({ isOpen: false, mensaje: '', onConfirm: null })}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={modalConfig.onConfirm}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-xl shadow transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}