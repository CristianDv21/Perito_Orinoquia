import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FormularioPeritaje({ peritajeId, token, onSaveSuccess }) {
    // Estados principales del formulario
    const [formDataPrincipal, setFormDataPrincipal] = useState({
        vehiculo_id: '',
        kilometraje: '',
        observaciones: '',
    });

    // Estados para las relaciones hasMany
    const [listaAccesorios, setListaAccesorios] = useState([]);
    const [danosExternos, setDanosExternos] = useState([]);
    const [danosInternos, setDanosInternos] = useState([]);
    const [detallesTecnicos, setDetallesTecnicos] = useState([]);
    const [sistemasMecanicos, setSistemasMecanicos] = useState([]);
    const [compresionCilindros, setCompresionCilindros] = useState([]);

    const [loading, setLoading] = useState(false);

    // 1. Cargar datos del peritaje de forma segura dentro del useEffect
    useEffect(() => {
        if (!peritajeId) return;

        let isMounted = true;

        const cargarPeritaje = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/peritajes/${peritajeId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (isMounted && response.data.success) {
                    const data = response.data.data;
                    
                    const { 
                        accesorios, 
                        danos_externos, 
                        danos_internos, 
                        detalles_tecnicos, 
                        sistemas_mecanicos, 
                        compresion_cilindros, 
                        ...principal 
                    } = data;

                    setFormDataPrincipal(principal);
                    setListaAccesorios(accesorios || []);
                    setDanosExternos(danos_externos || []);
                    setDanosInternos(danos_internos || []);
                    setDetallesTecnicos(detalles_tecnicos || []);
                    setSistemasMecanicos(sistemas_mecanicos || []);
                    setCompresionCilindros(compresion_cilindros || []);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error al cargar el peritaje para edición:', error);
                    alert('No se pudo cargar la información del peritaje.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        cargarPeritaje();

        return () => {
            isMounted = false;
        };
    }, [peritajeId, token]);

    // 2. Función unificada para Guardar (Crear o Actualizar)
    const guardarPeritajeCompleto = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const isEditing = Boolean(peritajeId);
            const url = isEditing 
                ? `/api/peritajes/${peritajeId}` 
                : '/api/peritajes';
                
            const payload = {
                ...formDataPrincipal,
                accesorios: listaAccesorios,
                danos_externos: danosExternos,
                danos_internos: danosInternos,
                detalles_tecnicos: detallesTecnicos,
                sistemas_mecanicos: sistemasMecanicos,
                compresion_cilindros: compresionCilindros,
            };

            const response = await axios({
                method: isEditing ? 'PUT' : 'POST',
                url: url,
                data: payload,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.data.success) {
                alert(response.data.message);
                if (typeof onSaveSuccess === 'function') {
                    onSaveSuccess(response.data.data);
                }
            }
        } catch (error) {
            console.error('Error al guardar el peritaje:', error);
            const errorMessage = error.response?.data?.message || 'Ocurrió un error al procesar la solicitud.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={guardarPeritajeCompleto} className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {peritajeId ? `Editar Peritaje #${peritajeId}` : 'Registrar Nuevo Peritaje'}
            </h2>

            {loading && <p className="text-blue-500 mb-4">Cargando datos...</p>}

            {/* Campos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Kilometraje</label>
                    <input 
                        type="number" 
                        value={formDataPrincipal.kilometraje || ''} 
                        onChange={(e) => setFormDataPrincipal({...formDataPrincipal, kilometraje: e.target.value})}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Observaciones</label>
                    <textarea 
                        value={formDataPrincipal.observaciones || ''} 
                        onChange={(e) => setFormDataPrincipal({...formDataPrincipal, observaciones: e.target.value})}
                        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    />
                </div>
            </div>

            {/* Botón de envío */}
            <div className="flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Procesando...' : (peritajeId ? 'Actualizar Peritaje' : 'Guardar Peritaje')}
                </button>
            </div>
        </form>
    );
}