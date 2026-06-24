# 📐 Blueprint Canvas

**Asistente de Revisión Técnica para Proyectos de Ingeniería**

Blueprint Canvas es una aplicación web minimalista y técnica diseñada para ingenieros y revisores de proyectos. Permite gestionar observaciones, notas y documentos mediante una interfaz de línea de comandos (CLI) integrada en un entorno visual tipo "plano técnico".

## ✨ Características Principales

- **Interfaz Blueprint:** Diseño técnico con cuadrícula, paleta cyanotype y tipografía monoespaciada
- **Gestión Jerárquica:** Organiza observaciones por Coherencia Global, Interna y Propia
- **Flujo CLI:** Comandos rápidos para ingresar datos sin fricción
- **Panel de Notas:** Notas persistentes por documento con Drag & Drop
- **Timeline de Auditoría:** Registro visual de cada acción realizada
- **Exportación Profesional:** Generación de informes en Markdown y JSON
- **Comparador de Documentos:** Vista lado a lado de múltiples documentos

## 🚀 Inicio Rápido

### Instalación
```bash
git clone https://github.com/TU_USUARIO/blueprint-canvas.git
cd blueprint-canvas
npm install
```

### Desarrollo
```bash
npm run dev
```

Abre tu navegador en http://localhost:5173/

### Producción
```bash
npm run build
npm run preview
```

## ⌨️ Comandos Principales

### Gestión de Proyectos
- `/create project "nombre"` - Crea un nuevo proyecto
- `/list projects` - Lista todos los proyectos
- `/delete project "nombre"` - Elimina un proyecto
- `/status` - Muestra el estado actual

### Gestión de Documentos
- `/doc NOMBRE [disciplina]` - Carga o crea un documento
- `/list docs` - Lista documentos del proyecto
- `/delete doc NOMBRE` - Elimina un documento
- `/compare` - Compara documentos lado a lado

### Gestión de Observaciones
- `/obs DOC TIPO: "texto" | Fuente: origen` - Agrega una observación
- `/list obs` - Lista todas las observaciones
- `/edit OBS-ID nuevo texto` - Edita una observación
- `/approve OBS-ID` - Aprueba una observación
- `/reject OBS-ID` - Rechaza una observación
- `/delete obs OBS-ID` - Elimina una observación
- `/tag OBS-ID "etiqueta"` - Agrega una etiqueta
- `/priority OBS-ID alta|media|baja` - Asigna prioridad
- `/comment OBS-ID "comentario"` - Agrega un comentario
- `/review` - Modo revisión (lista pendientes)

### Notas y Búsqueda
- `/note "texto"` - Agrega una nota al panel derecho
- `/search "texto"` - Busca observaciones
- `/filter type "tipo"` - Filtra por tipo
- `/filter status "estado"` - Filtra por estado

### Exportación y Utilidades
- `/export markdown` - Exporta informe en Markdown
- `/export json` - Exporta datos en JSON
- `/help` - Muestra la ayuda completa
- `/shortcuts` - Muestra atajos de teclado
- `/timeline` - Muestra historial de cambios
- `/clear` - Limpia el historial del chat

## ⚡ Atajos de Teclado

- `Cmd/Ctrl + K` : Enfocar input
- `Cmd/Ctrl + H` : Ejecutar /help
- `Cmd/Ctrl + S` : Ejecutar /status
- `Cmd/Ctrl + E` : Exportar a Markdown
- `Cmd/Ctrl + N` : Iniciar nueva nota
- `Cmd/Ctrl + L` : Limpiar chat
- `Esc` : Limpiar y salir del input
- `↑ / ↓` : Navegar historial de comandos

## 🧪 Testing

El proyecto cuenta con una suite de más de 100 tests unitarios y de flujo de usuario.

```bash
npm run test
```

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + Vite
- **Estilos:** Tailwind CSS (Diseño Blueprint personalizado)
- **Estado:** Zustand (con persistencia en LocalStorage)
- **Testing:** Vitest (109 tests)
- **Iconos:** Lucide React
- **Deploy:** GitHub Pages con GitHub Actions

## 📦 Estructura del Proyecto

```
blueprint-canvas/
├── src/
│   ├── components/     # Componentes React
│   ├── store/          # Estado con Zustand
│   ├── utils/          # Parser y exportadores
│   ├── hooks/          # Hooks personalizados
│   ├── types/          # Tipos TypeScript
│   └── test/           # Suite de tests
├── public/
├── .github/workflows/  # GitHub Actions
└── dist/               # Build de producción
```

## 🎨 Diseño

Blueprint Canvas utiliza una paleta inspirada en planos técnicos:
- **Modo Noche:** Fondo #0A0F16, acentos cian #00D1FF, crítico dorado #FFD700
- **Modo Día:** Fondo #F0F4F8, acentos azul #0088CC, crítico bronce #C5A467
- **Tipografía:** JetBrains Mono (datos) + Inter (UI)

## 📄 Licencia

MIT License. Diseñado para optimizar flujos de revisión técnica.

---

**Desarrollado con ❤️ para ingenieros que valoran la precisión.**
