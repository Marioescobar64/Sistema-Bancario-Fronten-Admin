export const ResetPasswordForm = ({ darkMode = false }) => {
    const dm = darkMode;
    return (
        <form className="space-y-5">
            {/* Nueva contraseña */}
            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}
                >
                    Nueva contraseña
                </label>

                <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : '#D1D5DB'}` }}
                />

                <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#DC2626' }}>
                    La contraseña es obligatoria
                </p>
            </div>

            {/* Confirmar contraseña */}
            <div>
                <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}
                >
                    Confirmar contraseña
                </label>

                <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : '#D1D5DB'}` }}
                />

                <p className="text-xs mt-1" style={{ color: dm ? '#F87171' : '#DC2626' }}>
                    Las contraseñas no coinciden
                </p>
            </div>

            {/* Error backend (mock) */}
            <p className="text-sm text-center" style={{ color: dm ? '#F87171' : '#DC2626' }}>
                Error al actualizar la contraseña
            </p>

            {/* Botón */}
            <button
                type="button"
                className="w-full hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
                style={{ backgroundColor: dm ? '#5DADE2' : '#2563EB' }}
            >
                Actualizar contraseña
            </button>

            {/* Volver al login */}
            <p className="text-center text-sm" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                ¿Recordaste tu contraseña?{" "}
                <span className="font-medium hover:opacity-80 transition-colors cursor-pointer" style={{ color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}>
                    Iniciar sesión
                </span>
            </p>
        </form>
    );
};
