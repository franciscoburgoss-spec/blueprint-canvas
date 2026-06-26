# Archivos Pendientes de Migración a TypeScript

## 1. CommandInput.tsx (33 errores de tipo)

Ubicación: src/components/CommandInput.tsx

Errores principales:
1. AutocompleteContext no incluye activeDocumentId
2. Parámetros implícitamente any
3. Propiedades opcionales de ParsedCommand usadas sin verificación
4. Variables con tipos implícitos (allObs, pendingObs)
5. Error handling con tipo unknown
6. project puede ser undefined

---

## 2. DocumentComparator.jsx → .tsx

Ubicación: src/components/DocumentComparator.jsx

Tareas:
1. Renombrar a .tsx
2. Agregar tipos a props:
   interface DocumentComparatorProps {
     onClose: () => void;
   }
3. Agregar tipos a estados internos
4. Actualizar tests que buscan .jsx

---

## 3. DocumentationModal.jsx → .tsx

Ubicación: src/components/DocumentationModal.jsx

Tareas:
1. Renombrar a .tsx
2. Agregar tipos a props:
   interface DocumentationModalProps {
     onClose: () => void;
   }
3. Actualizar tests que buscan .jsx

---

## 4. Timeline.jsx → .tsx

Ubicación: src/components/Timeline.jsx

Tareas:
1. Renombrar a .tsx
2. Agregar tipos a estados y handlers
3. Actualizar tests que buscan .jsx

---

## 5. App.jsx → .tsx

Ubicación: src/App.jsx

Tareas:
1. Renombrar a .tsx
2. Agregar tipos a estados:
   const [showComparator, setShowComparator] = useState<boolean>(false);
   const [showDocs, setShowDocs] = useState<boolean>(false);
3. Actualizar tests que buscan .jsx

---

## Orden Recomendado de Migración

1. CommandInput.tsx (corregir errores existentes)
2. DocumentComparator.tsx (simple, pocas props)
3. DocumentationModal.tsx (simple, pocas props)
4. Timeline.tsx (moderado)
5. App.tsx (último, es el componente raíz)

---

## Verificación Final

Después de migrar todos los archivos:

```bash
npm run type-check  # Sin errores
npm run test        # 193 tests pasando
npm run build       # Build exitoso
```
