export const ForgotPasswordForm = ({onSwitch, darkMode = false}) => {
    const dm = darkMode;
    return (
        <form className="space-y-5">
            <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                    Email
                </label>
                <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-2 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 mb-5"
                    style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB', color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : '#D1D5DB'}` }}
                />
                <button
                    type="submit"
                    className="w-full text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition"
                    style={{ backgroundColor: dm ? '#5DADE2' : '#2563EB' }}
                >
                    Enviar correo
                </button>
            </div>

            <p className="text-center text-sm" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>
                ¿Recordaste tu contraseña?{" "}
                <button
                    type="button"
                    onClick={onSwitch}
                    className="font-medium hover:underline"
                    style={{ color: dm ? 'var(--color-dark-primary)' : 'var(--color-primary)' }}
                >
                    Iniciar sesión
                </button>
            </p>
        </form>
    );
};