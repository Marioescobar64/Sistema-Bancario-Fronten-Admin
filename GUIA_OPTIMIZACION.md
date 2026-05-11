# 🚀 Guía de Optimización - Componentes Features

## Resumen de Cambios

Se han creado **hooks y componentes reutilizables** para eliminar código duplicado y mejorar la mantenibilidad.

---

## 📦 Nuevos Hooks

### 1. `useDarkMode()`
Simplifica el acceso al estado de darkMode.

```jsx
import { useDarkMode } from '../../../shared/hooks';

export const MyComponent = () => {
  const dm = useDarkMode();  // Reemplaza: const { darkMode = false } = useOutletContext();
  
  return <div style={{ color: dm ? 'dark' : 'light' }}>...</div>;
};
```

### 2. `usePaginatedList(fetchFunction, pageSize = 10)`
Maneja toda la lógica de paginación automáticamente.

```jsx
import { usePaginatedList } from '../../../shared/hooks';
import { getUsers } from '../../../shared/api/banking';

export const MyList = () => {
  const { 
    items,           // Array de items
    loading,         // Boolean de cargando
    pagination,      // {currentPage, totalPages, total}
    loadItems,       // Function para cargar datos
    nextPage,        // Function para siguiente página
    prevPage,        // Function para página anterior
    resetPage,       // Function para reset a página 1
    goToPage         // Function(page) para ir a página específica
  } = usePaginatedList(getUsers, 10);
  
  useEffect(() => {
    loadItems();  // Cargar datos al montar o cambiar página
  }, [pagination.currentPage]);
  
  return (
    <>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      <button onClick={nextPage}>Siguiente</button>
    </>
  );
};
```

---

## 🎨 Utilidades de Estilos

### `styleHelpers.js` - Funciones predefinidas para estilos

```jsx
import { 
  getSurfaceStyle,
  getInputStyle,
  getPrimaryButtonStyle,
  getPrimaryTextStyle,
  getSecondaryTextStyle,
  getStatusBadgeStyle,
  getPaginationContainerStyle
} from '../../../shared/utils/styleHelpers';

// Uso:
<div style={getSurfaceStyle(dm)}>...</div>
<input style={getInputStyle(dm)} />
<button style={getPrimaryButtonStyle(dm)}>Guardar</button>
<span style={getPrimaryTextStyle(dm)}>Texto</span>
```

---

## 🧩 Componentes Reutilizables

### 1. `<Pagination>`
Componente completo de paginación.

```jsx
import { Pagination } from '../../../shared/components';

<Pagination
  pagination={{ currentPage: 1, totalPages: 5, total: 50 }}
  onPrevPage={() => setPagination(prev => ({...prev, currentPage: prev.currentPage - 1}))}
  onNextPage={() => setPagination(prev => ({...prev, currentPage: prev.currentPage + 1}))}
  itemLabel="usuarios"
  showTotal={true}
/>
```

### 2. `<SearchFilter>`
Envoltorio para buscador con estilos automáticos.

```jsx
import { SearchFilter } from '../../../shared/components';

<SearchFilter
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Buscar por nombre..."
>
  {/* Puedes agregar más filtros aquí */}
  <select>...</select>
</SearchFilter>
```

### 3. `<TableHeader>`
Header de tabla con estilos de darkMode.

```jsx
import { TableHeader } from '../../../shared/components';

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'actions', label: 'Acciones', className: 'text-right' }
];

<table>
  <TableHeader columns={columns} onClick={(key) => console.log('Sort by', key)} />
  {/* tbody */}
</table>
```

### 4. `<ActionButton>`
Botón reutilizable con variantes.

```jsx
import { ActionButton } from '../../../shared/components';

<ActionButton 
  label="Guardar"
  onClick={() => console.log('Saved')}
  variant="primary"  // 'primary' | 'danger' | 'success' | 'secondary' | 'blue'
  loading={false}
  disabled={false}
/>
```

### 5. `<StatusBadge>`
Badge para mostrar estado.

```jsx
import { StatusBadge } from '../../../shared/components';

<StatusBadge 
  isActive={user.isActive}
  activeLabel="Activo"
  inactiveLabel="Inactivo"
/>
```

### 6. `<LoadingSpinner>` y `<EmptyState>`
Estados de tabla.

```jsx
import { LoadingSpinner, EmptyState } from '../../../shared/components';

{loading ? (
  <LoadingSpinner colSpan={6} />
) : items.length === 0 ? (
  <EmptyState message="No hay datos" colSpan={6} />
) : (
  // Renderizar filas
)}
```

---

## 📋 Ejemplo Completo de Refactorización

**Antes (150+ líneas):**
```jsx
// Código original - ver users.jsx
```

**Después (~80 líneas):**
Ver archivo: `EJEMPLO_REFACTORIZADO.jsx`

---

## 🔄 Cómo Refactorizar tus Componentes

### Paso 1: Reemplazar imports
```jsx
// Antes
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

// Después
import { usePaginatedList, useDarkMode } from '../../../shared/hooks';
import { Pagination, SearchFilter, ActionButton, StatusBadge, LoadingSpinner, EmptyState } from '../../../shared/components';
```

### Paso 2: Simplificar hooks
```jsx
// Antes
const { darkMode = false } = useOutletContext() ?? {};
const dm = darkMode;
const [pagination, setPagination] = useState({...});
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(false);
// ... más código para cargar...

// Después
const dm = useDarkMode();
const { items, loading, pagination, loadItems, nextPage, prevPage } = usePaginatedList(getItems);
```

### Paso 3: Usar componentes compartidos
```jsx
// Antes - 20+ líneas de div con estilos
<div style={{ backgroundColor: dm ? '...' : '...', border: `1px solid ...` }}>
  <input style={{ backgroundColor: dm ? '...' : '...' }} />
</div>

// Después - 1 línea
<SearchFilter value={term} onChange={setTerm} placeholder="Buscar..." />
```

---

## 📊 Beneficios

| Aspecto | Antes | Después |
|---------|-------|---------|
| Líneas código (7 componentes) | ~1050 líneas | ~560 líneas (47% menos) |
| Código duplicado | Alto | Eliminado |
| Mantenibilidad | Difícil | Fácil |
| Consistencia visual | Manual | Garantizada |
| Refactorización de estilos | 50+ lugares | 1 archivo (styleHelpers) |

---

## ✅ Próximos Pasos

1. Refactorizar `users.jsx` → Usar el ejemplo
2. Refactorizar `accounts.jsx` → Similar a users
3. Refactorizar `cards.jsx` → Similar a users
4. Refactorizar `transfers.jsx`
5. Refactorizar `loans.jsx`
6. Refactorizar `auditLogs.jsx`
7. Refactorizar `suspiciousMovement.jsx`

Cada refactorización debería reducir ~40-50 líneas de código.
