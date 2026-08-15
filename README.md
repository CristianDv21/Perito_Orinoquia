# Perito Orinoquia - Frontend

Sistema web frontend desarrollado para la gestión, peritaje y diagnóstico vehicular en la región de la Orinoquia. Este módulo se encarga de la interfaz de usuario, control de flujos de inspección técnica, registro de accesorios y visualización de reportes detallados.

---

## 🚀 Tecnologías Principales

- **React** (Vite)
- **Tailwind CSS** (Estilos y diseño responsivo)
- **Lucide React** (Iconografía)
- **Axios** (Consumo de servicios del backend)

---

## 📂 Estructura del Proyecto

```text
src/
├── assets/          # Imágenes, logos y recursos estáticos
├── components/      # Componentes reutilizables (Botones, Modales, Tarjetas)
├── context/         # Estados globales y contextos de autenticación
├── hooks/           # Custom hooks para lógica de negocio
├── layouts/         # Estructuras principales (Sidebar, Header, Footer)
├── pages/
│   ├── Dashboard/   # Panel general de estadísticas y accesos rápidos
│   ├── Inspections/ # Módulo central de peritaje e inspección técnica
│   ├── Accessories/ # Módulo independiente de gestión de accesorios
│   └── Vehicles/    # Registro y filtrado de vehículos
├── services/        # Configuración de peticiones HTTP (API Client)
└── utils/           # Validaciones y funciones de formato
