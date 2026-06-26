# Blueprint Canvas - Metodología de Trabajo

## Filosofía de Desarrollo

### Principios Fundamentales
1. Tests First: Siempre verificar que los tests pasen despues de cada cambio
2. Type Safety: TypeScript estricto, sin any innecesarios
3. Incremental Changes: Migraciones archivo por archivo, no todo a la vez
4. Documentation: Documentar decisiones técnicas y patrones
5. User Experience: Feedback visual inmediato para todas las acciones

---

## Flujo de Trabajo Estándar

### 1. Antes de Cualquier Cambio
npm run test        # Verificar estado actual
npm run type-check  # Verificar tipos

### 2. Durante el Desarrollo
- Hacer cambios pequeños y verificables
- Ejecutar tests despues de cada cambio significativo
- Si un test falla, corregirlo inmediatamente antes de continuar

### 3. Después del Cambio
npm run test        # Todos los tests deben pasar
npm run type-check  # Sin errores de TypeScript
npm run build       # Build exitoso

### 4. Commit y Push
git add .
git commit -m "feat: descripción clara del cambio"
git push
---

## Patrones de Migración JavaScript a TypeScript

### Patró: Migración de Componentes React

**Paso 1**: Renombrar archivo
```bash
mv Component.jsx Component.tsx
```

**Paso 2**: Agregar tipos a props
```typescript
// ANTES (JavaScript)
export const Component = ({ onClose, data }) => { ... }

// DESPUIS (TypeScript)
interface ComponentProps {
  onClose: () => void;
  data: DataType;
}

export const Component: React.FC<ComponentProps> = ({ onClose, data }) => { ... }
```

**Paso 3**: Agregar tipos a estados
```typescript
// ANTES
const [value, setValue] = useState('');

// DESPUIS
const [value, setValue] = useState<string>('');
```

---

## Errores Comunes y Soluciones

### Error 1: Heredocs Largos se Cortan
**Problema**: Al usar heredocs de bash con contenido muy largo, se corta.

**Solución**: Usar base64 encoding para evitar problemas de interpretación de caracteres especiales.

### Error 2: Tests Buscan Archivos .jsx Despues de Migración
**Problema**: Tests fallan buscando archivos .jsx despues de migrar a .tsx

**Solución**: Actualizar referencias en tests
```javascript
const fs = require('fs');
let content = fs.readFileSync('src/test/test.test.js', 'utf8');
content = content.replace(/Component\.jsx/g, 'Component.tsx');
fs.writeFileSync('src/test/test.test.js', content);
```
---

### Error 3: Propiedad Opcional Usada Sin Verificación
**Problema**:
```typescript
interface ParsedCommand {
  name?: string;  // Opcional
}
store.createProject(result.name);  // ERROR
```

**Solución**: Agregar verificación
```typescript
if (result.name) {
  store.createProject(result.name);
}
```

### Error 4: Tipo Unknown en Catch
**Problema**:
```typescript
catch (error) {
  console.log(error.message);  // ERROR
}
```

**Solución**:
```typescript
catch (error: unknown) {
  const msg = error instanceof Error ? error.message : 'Error';
  console.log(msg);
}
```

### Error 5: Array con Tipo Impícito any[]
**Problema**:
```typescript
const items = [];  // ERROR
```

**Solución**:
```typescript
const items: string[] = [];
```

### Error 6: Import No Usado
**Solución**: Eliminar imports no usados

### Error 7: Variable Declarada pero No Usada
**Solución**: Usar underscore
```typescript
const [, setValue] = useState('');
```
---

## Convenciones de C6digo

### Nomenclatura
- **Componentes**: PascalCase.tsx (ej: ProjectTree.tsx)
- **Utils**: camelCase.ts (ej: parser.ts)
- **Hooks**: useCamelCase.ts (ej: useKeyboardShortcuts.ts)
- **Tests**: kebab-case.test.js (ej: project-management.test.js)
- **Constantes**: UPPER_SNAKE_CASE (ej: COMMANDS)
- **Variables**: camelCase (ej: activeProject)
- **Interfaces**: PascalCase (ej: Project)

### Estructura de Componentes
```typescript
// 1. Imports
import { useState } from 'react';
import type { Project } from '../types';

// 2. Interfaces de props
interface ComponentProps {
  project: Project;
}

// 3. Componente
export const Component: React.FC<ComponentProps> = ({ project }) => {
  const [value, setValue] = useState<string>('');
  return <div>...</div>;
};
```

---

## Decisiones Técnicas

### »Por quñ TypeScript Estricto?
**Razones**:
- Detecta errores en tiempo de compilación
- Mejor autocompletado en el IDE
- Documentación automática via tipos

### ¿Por qué Zustand en lugar de Redux?
**Razones**:
- Menos boilerplate
- API más simple
- Mejor integración con TypeScript

### ¿Por qué Tests en JavaScript?
**Razones**:
- Tests son más simples
- Migración más répida
- Vitest maneja bien la mezcla

### ¿Por qué Migración Incremental?
**Razones**:
- Menos riesgo de romper la app
- Tests siguen pasando durante la migración
- Permite pausar y continuar
---

## Checklist para Nuevas Features

### Antes de Implementar
- [] ¯Hay tests existentes que puedan afectar?
- [] ¯Necesito crear nuevos tests?
- [] ¯�Qué tipos necesito definir?

### Durante la Implementación
- [] Tipos definidos correctamente
- [] Tests actualizados/creados
- [] npm run test pasa
- [] npm run type-check pasa

### Después de Implementar
- [] npm run build exitoso
- [] Commit con mensaje descriptivo
- [] Push a GitHub

---

## Recursos útiles

### Comandos de Verificación
```bash
npm run test          # Ejecutar tests
npm run type-check    # Verificar tipos
npm run build         # Build producción
```

### Búsqueda de Errores
```bash
# Buscar archivos .jsx restantes
find src -name "*.jsx"

# Buscar imports específicos
grep -r "from './Component'" src/

# Buscar tests que buscan .jsx
grep -r "\.jxs" src/test/
```

---

## Continuación en Nuevo Chat

**Mensaje para el nuevo chat**:
```
Continuemos con la migración TypeScript de Blueprint Canvas.
Lee WORK_METHODOLOGY.md para entender nuestra dinámica.
Empecemos corrigiendo los errores en CommandInput.tsx.
```

---

**Última actualización**: 26 de junio de 2026  
**Versión**: v0.0.0  
**Tests**: 193 pasando
