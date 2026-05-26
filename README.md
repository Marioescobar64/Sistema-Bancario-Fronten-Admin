# Veraff Sistema Bancario - Frontend Admin

## Descripción general

Este proyecto es un panel administrativo para el banco digital Veraff, construido con:

- `React 19` para la interfaz de usuario.
- `Vite` como bundler y servidor de desarrollo.
- `Tailwind CSS` para estilos utilitarios.
- `Zustand` para estado local y global.
- `React Router v7` para rutas y navegación.
- `react-hot-toast` para notificaciones.
- `@material-tailwind/react` para algunos componentes y temas.

El código está organizado por características dentro de `src/features`, y la capa compartida se encuentra en `src/shared`.

---

## Estructura del proyecto

- `src/app/main.jsx` - punto de entrada de la aplicación.
- `src/app/App.jsx` - raíz de la app, contiene `AppRoutes` y `react-hot-toast`.
- `src/app/router/AppRoutes.jsx` - define las rutas públicas y protegidas.
- `src/app/layouts/DashboardPage.jsx` - layout principal del dashboard.
- `src/shared/components/` - componentes reutilizables como botones, tablas y navegación.
- `src/shared/hooks/` - hooks compartidos como `useDarkMode` y `usePaginatedList`.
- `src/styles/index.css` - estilos globales, variables CSS y configuración de Tailwind.
- `src/features/*` - páginas específicas por módulo: cuentas, tarjetas, transferencias, préstamos, usuarios, auditoría y movimientos sospechosos.

---

## Cómo iniciar el proyecto

1. Instalar dependencias:

```bash
pnpm install
```

2. Ejecutar en modo desarrollo:

```bash
pnpm run dev
```

3. Construir para producción:

```bash
pnpm run build
```

4. Previsualizar el build:

```bash
pnpm run preview
```

---

## Arquitectura de rutas

Las rutas principales están en `src/app/router/AppRoutes.jsx`:

- `/` → `AuthPage` (página de login).
- `/dashboard/*` → `DashboardPage` con layout protegido.
- `/dashboard/accounts` → listado de cuentas.
- `/dashboard/cards` → tarjetas.
- `/dashboard/transfers` → transferencias.
- `/dashboard/loans` → préstamos.
- `/dashboard/users` → usuarios.
- `/dashboard/audit-logs` → auditoría.
- `/dashboard/suspicious-movements` → movimientos sospechosos.

El layout `DashboardPage` carga `DashBoardContainer` que renderiza `Navbar` y `Sidebar` y un `<Outlet />` para cada página.

---

## Personalización rápida: colores y tema

### Colores globales

Los colores principales se definen en `src/styles/index.css` como variables CSS:

```css
:root {
  --color-background: #F4F7FB;
  --color-surface: #FFFFFF;
  --color-text-primary: #0A2540;
  --color-text-secondary: #5D6D7E;
  --color-primary: #1F4E79;
  --color-secondary: #5DADE2;
  --color-border: #D6EAF8;
  --color-success: #27AE60;
  --color-error: #E74C3C;
}
```

Para cambiar el esquema principal, edita esos valores. Por ejemplo, si quieres un azul más oscuro:

```css
--color-primary: #0f3c6d;
--color-secondary: #3b82f6;
```

### Tema oscuro

También hay variables para el modo oscuro:

```css
--color-dark-background: #0B1C2C;
--color-dark-surface: #112B3C;
--color-dark-text-primary: #EAF2F8;
```

El modo oscuro se activa en el layout `src/shared/components/layout/DashBoardContainer.jsx` y se aplica con `style={{ backgroundColor: darkMode ? 'var(--color-dark-background)' : 'var(--color-background)' }}`.

---

## Personalizar un componente común

### Cambiar los colores del botón global `ActionButton`

El componente está en `src/shared/components/ActionButton.jsx`.

- Para modificar el color de `primary`, cambia el objeto `baseStyle.primary`.
- Para agregar un nuevo `variant`, añade una nueva clave en `baseStyle`.

Ejemplo:

```js
const baseStyle = {
  primary: {
    backgroundColor: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)',
    color: 'white',
    border: 'none',
  },
  warning: {
    backgroundColor: dm ? 'rgba(245,158,11,0.15)' : 'rgba(251,191,36,0.15)',
    color: dm ? '#fbbf24' : '#b45309',
    border: `1px solid ${dm ? 'rgba(245,158,11,0.3)' : 'rgba(251,191,36,0.2)'}`,
  },
};
```

Luego úsalo con `<ActionButton variant="warning" label="Atención" />`.

### Cambiar estilo de textos, bordes y sombra

El estilo base de los componentes usa tanto clases Tailwind como `style={}` en línea.

- `className="px-4 py-2 rounded-lg ..."` controla padding, border-radius y animaciones.
- `style={...}` aplica colores dinámicos según `darkMode`.

Para cambiar el tipo de letra o tamaño, modifica esa clase o inserta `font-size` y `font-family` en `index.css`.

---

## Mover elementos o cambiar layout

### Mover el botón de modo oscuro

El botón está en `src/shared/components/layout/Navbar.jsx`. Para moverlo al sidebar, copia la sección del botón y pégala en `Sidebar.jsx`, luego elimina el código del `Navbar`.

### Cambiar el orden de los elementos del menú lateral

El menú se define en `src/shared/components/layout/Sidebar.jsx` dentro del arreglo `NAV_ITEMS`.

Ejemplo para mover "Usuarios" arriba:

```js
const NAV_ITEMS = [
  { label: 'Usuarios', to: '/dashboard/users', icon: ... },
  { label: 'Cuentas', to: '/dashboard/accounts', icon: ... },
  ...
];
```

### Cambiar el layout de escritorio/móvil

El layout principal está en `src/shared/components/layout/DashBoardContainer.jsx`:

- `Navbar` se muestra siempre en la parte superior.
- `Sidebar` es fijo en escritorio y deslizable en móvil.
- El contenido se renderiza en `<main className="flex-1 overflow-y-auto p-6">`.

Para mover el side bar a la derecha, cambia el orden dentro del contenedor y ajusta las clases `md:flex-row`.

---

## Cómo modificar páginas completas

Cada página está en su módulo correspondiente, por ejemplo:

- `src/features/accounts/components/Accounts.jsx`
- `src/features/cards/components/Cards.jsx`
- `src/features/transfers/components/Transfers.jsx`
- `src/features/loans/components/Loans.jsx`
- `src/features/users/components/Users.jsx`
- `src/features/auditLogs/components/auditLogs.jsx`
- `src/features/suspiciousMovement/components/SuspiciousMovements.jsx`

Si quieres cambiar el contenido de una tarjeta o tabla, edita el JSX de esa página directamente.

### Ejemplo: agregar un botón extra en la página de cuentas

Busca `src/features/accounts/components/Accounts.jsx` y añade un nuevo `<ActionButton ... />` dentro del render:

```jsx
<div className="flex justify-end gap-2 mb-4">
  <ActionButton label="Nuevo" onClick={...} variant="primary" />
  <ActionButton label="Exportar" onClick={...} variant="secondary" />
</div>
```

### Ejemplo: cambiar la posición de un modal

Los modales como `CreateAccountModal.jsx` se importan y renderizan dentro de la página de cuentas.

Para mostrar el modal en otra página, mueve la importación y el estado que controla su visibilidad a la página deseada.

---

## Personalización de estilos y Tailwind

El proyecto usa Tailwind a través de `@tailwindcss/vite` y `@material-tailwind/react`.

- `src/styles/index.css` importa todo Tailwind con `@import "tailwindcss";`.
- Las clases como `flex`, `rounded-lg`, `text-xs`, `bg-black/50` son utilidades de Tailwind.

Si quieres cambiar un color global, hazlo en las variables CSS y no en cada componente.

---

## Buenas prácticas para modificar el proyecto

1. Cambia temas globales en `src/styles/index.css` siempre que sea posible.
2. Modifica componentes comunes en `src/shared/components/` para que las actualizaciones se apliquen a toda la app.
3. Ajusta la navegación en `src/shared/components/layout/Sidebar.jsx`.
4. Actualiza las rutas en `src/app/router/AppRoutes.jsx` si agregas nuevas páginas.
5. Usa `useDarkMode` para detectar modo oscuro en los componentes.

---

## Añadir nuevas páginas o componentes

1. Crea un nuevo archivo dentro de `src/features/<nombre>/components/`.
2. Importa tu componente en `src/app/router/AppRoutes.jsx`.
3. Añade una ruta nueva al arreglo de rutas del dashboard.
4. Usa componentes compartidos de `src/shared/components/` para mantener estilo uniforme.

---

## Notas adicionales

- El login y la autenticación usan `features/auth`.
- Los estados globales se guardan en `features/*/store` con `zustand`.
- El proyecto no tiene TypeScript, aunque incluye tipos de React para el editor.

Con esta guía puedes entender mejor cómo funciona la app y dónde cambiar colores, mover elementos o modificar componentes con seguridad.
