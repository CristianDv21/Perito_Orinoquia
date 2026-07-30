import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function ModeloDinamico({ tipo }) {
  // Mapeo seguro del tipo de vehículo al archivo .glb correspondiente
  const rutasModelos = {
    sedan: '/models/sedan.glb',
    suv: '/models/suv.glb',
    pickup: '/models/pickup.glb',
    camion: '/models/camion.glb',
  };

  // Si no encuentra el tipo, carga un sedán por defecto
  const rutaModelo = rutasModelos[tipo] || '/models/sedan.glb';

  const { scene } = useGLTF(rutaModelo);
  return <primitive object={scene} scale={1.2} />;
}

export default function VisorVehiculoDinamico({ tipoVehiculo }) {
  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner">
      <Canvas camera={{ position: [4, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} />
        <ModeloDinamico tipo={tipoVehiculo} />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}