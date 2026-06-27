# Blueprint Canvas - Metodología de Trabajo

## Filosofía de Desarrollo

### Principios Fundamentales
- **Tests First**: Siempre verificar que los tests pasen después de cada cambio
- **Type Safety**: TypeScript estricto, sin `any` innecesarios
- **Incremental Changes**: Migraciones archivo por archivo, no todo a la vez
- **Documentation**: Documentar decisiones técnicas y patrones
- **User Experience**: Feedback visual inmediato para todas las acciones

## Flujo de Trabajo Estándar

### 1. Antes de Cualquier Cambio
    npm run test        # Verificar estado actual
    npm run type-check  # Verificar tipos

### 2. Durante el Desarrollo
- Hacer cambios pequeños y verificables
- Ejecutar tests después de cada cambio significativo
- Si un test falla, corregirlo inmediatamente antes de continuar

### 3. Después del Cambio
    npm run test        # Todos los tests deben pasar
    npm run type-check  # Sin errores de TypeScript
    npm run build       # Build exitoso

### 4. Commit y Push
    git add .
    git commit -m "feat: descripción clara del cambio"
    git push

## Patrones de Migración JavaScript a TypeScript

### Patrón: Migración de Componentes React

**Paso 1: Renombrar archivo**
    mv Component.jsx Component.tsx

**Paso 2: Agregar tipos a props**
    // ANTES (JavaScript)
    export const Component = ({ onClose, data }) => { ... }
    
    // DESPUÉS (TypeScript)
    interface ComponentProps {
      onClose: () => void;
      data: DataType;
    }
    export const Component: React.FC<ComponentProps> = ({ onClose, data }) => { ... }

**Paso 3: Agregar tipos a estados**
    // ANTES
    const [value, setValue] = useState('');
    
    // DESPUÉS
    const [value, setValue] = useState<string>('');

## Errores Comunes y Soluciones

### Error 1: Heredocs Largos se Cortan
**Problema**: Al usar heredocs de bash con contenido muy largo, se corta.
**Solución**: Usar base64 encoding o dividir en múltiples pasos pequeños.

### Error 2: Tests Buscan Archivos .jsx Después de Migración
**Problema**: Tests fallan buscando archivos .jsx después de migrar a .tsx
**Solución**: Actualizar referencias en tests
    const fs = require('fs');
    let content = fs.readFileSync('src/test/test.test.js', 'utf8');
    content = content.replace(/Component\.jsx/g, 'Component.tsx');
    fs.writeFileSync('src/test/test.test.js', content);

### Error 3: Propiedad Opcional Usada Sin Verificación
**Problema**:
    interface ParsedCommand {
      name?: string;  // Opcional
    }
    store.createProject(result.name);  // ERROR

**Solución**: Agregar verificación
    if (result.name) {
      store.createProject(result.name);
    }

### Error 4: Tipo Unknown en Catch
**Problema**:
    catch (error) {
      console.log(error.message);  // ERROR
    }

**Solución**:
    catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error';
      console.log(msg);
    }

### Error 5: Array con Tipo Implícito any[]
**Problema**:
    const items = [];  // ERROR

**Solución**:
    const items: string[] = [];

### Error 6: Import No Usado
**Solución**: Eliminar imports no usados

### Error 7: Variable Declarada pero No Usada
**Solución**: Usar underscore
    const [, setValue] = useState('');

### Error 8: Backticks de Markdown Cortan el Código en el Chat ⚠️ NUEVA REGLA OBLIGATORIA
**Problema**: Al usar backticks de markdown dentro de strings Python que están dentro de heredocs de bash, el parser del chat se confunde y corta el código prematuramente.

**Solución**: NUNCA usar backticks de markdown dentro de strings Python en heredocs. En su lugar, usar indentación simple (4 espacios) para código.

**Ejemplo INCORRECTO** (corta el código):
    content = """
    ```bash
    npm run test
    ```
    """

**Ejemplo CORRECTO** (no corta):
    content = """
        npm run test  # Sin errores
        npm run build # Build exitoso
    """

**Regla OBLIGATORIA**: Cuando generes código para archivos markdown dentro de heredocs de bash, usa indentación de 4 espacios en lugar de backticks de markdown.

## Convenciones de Código

### Nomenclatura
- **Componentes**: PascalCase.tsx (ej: ProjectTree.tsx)
- **Utils**: camelCase.ts (ej: parser.ts)
- **Hooks**: useCamelCase.ts (ej: useKeyboardShortcuts.ts)
- **Tests**: kebab-case.test.js (ej: project-management.test.js)
- **Constantes**: UPPER_SNAKE_CASE (ej: COMMANDS)
- **Variables**: camelCase (ej: activeProject)
- **Interfaces**: PascalCase (ej: Project)

### Estructura de Componentes
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

## Decisiones Técnicas

### ¿Por qué TypeScript Estricto?
- Detecta errores en tiempo de compilación
- Mejor autocompletado en el IDE
- Documentación automática vía tipos

### ¿Por qué Zustand en lugar de Redux?
- Menos boilerplate
- API más simple
- Mejor integración con TypeScript

### ¿Por qué Tests en JavaScript?
- Tests son más simples
- Migración más rápida
- Vitest maneja bien la mezcla

### ¿Por qué Migración Incremental?
- Menos riesgo de romper la app
- Tests siguen pasando durante la migración
- Permite pausar y continuar

## Checklist para Nuevas Features

### Antes de Implementar
- [ ] ¿Hay tests existentes que puedan afectar?
- [ ] ¿Necesito crear nuevos tests?
- [ ] ¿Qué tipos necesito definir?

### Durante la Implementación
- [ ] Tipos definidos correctamente
- [ ] Tests actualizados/creados
- [ ] npm run test pasa
- [ ] npm run type-check pasa

### Después de Implementar
- [ ] npm run build exitoso
- [ ] Commit con mensaje descriptivo
- [ ] Push a GitHub

## Recursos Útiles

### Comandos de Verificación
    npm run test          # Ejecutar tests
    npm run type-check    # Verificar tipos
    npm run build         # Build producción

### Búsqueda de Errores
    # Buscar archivos .jsx restantes
    find src -name "*.jsx"
    
    # Buscar imports específicos
    grep -r "from './Component'" src/
    
    # Buscar tests que buscan .jsx
    grep -r "\.jsx" src/test/

---

**Última actualización**: 26 de junio de 2026
**Versión**: v1.0.0 (Migración TypeScript Completada)
**Tests**: 193 pasando
