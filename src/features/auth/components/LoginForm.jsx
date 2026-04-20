export const LoginForm = ({ darkMode, onForgot }) => {
  return (
    <form className="space-y-5">
      {/* Usuario / Email */}
      <div
        className="animate-fadeIn"
        style={{ animationDelay: "0.1s", animationFillMode: "both" }}
      >
        <label
          className="block text-sm font-medium mb-1 transition-colors duration-300"
          style={{
            color: darkMode
              ? "var(--color-dark-text-primary)"
              : "var(--color-text-primary)",
          }}
        >
          Usuario o correo
        </label>

        <input
          type="text"
          placeholder="ejemplo@correo.com"
          className="w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-300"
          style={{
            backgroundColor: darkMode
              ? "var(--color-dark-surface)"
              : "var(--color-surface)",
            border: `1px solid ${
              darkMode
                ? "var(--color-dark-border)"
                : "var(--color-border)"
            }`,
            color: darkMode
              ? "var(--color-dark-text-primary)"
              : "var(--color-text-primary)",
          }}
        />
      </div>

      {/* Contraseña */}
      <div
        className="animate-fadeIn"
        style={{ animationDelay: "0.2s", animationFillMode: "both" }}
      >
        <label
          className="block text-sm font-medium mb-1 transition-colors duration-300"
          style={{
            color: darkMode
              ? "var(--color-dark-text-primary)"
              : "var(--color-text-primary)",
          }}
        >
          Contraseña
        </label>

        <input
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-2.5 text-sm rounded-lg transition-all duration-300"
          style={{
            backgroundColor: darkMode
              ? "var(--color-dark-surface)"
              : "var(--color-surface)",
            border: `1px solid ${
              darkMode
                ? "var(--color-dark-border)"
                : "var(--color-border)"
            }`,
            color: darkMode
              ? "var(--color-dark-text-primary)"
              : "var(--color-text-primary)",
          }}
        />
      </div>

      {/* Opciones */}
      <div
        className="flex items-center justify-between text-sm animate-fadeIn"
        style={{ animationDelay: "0.3s", animationFillMode: "both" }}
      >
        <label
          className="flex items-center gap-2 transition-colors duration-300"
          style={{
            color: darkMode
              ? "var(--color-dark-text-secondary)"
              : "var(--color-text-secondary)",
          }}
        >
          <input type="checkbox" className="accent-[#1F4E79]" />
          Recordarme
        </label>

        {/* Forgot password (FUNCIONAL) */}
        <button
          type="button"
          onClick={onForgot}
          className="hover:underline font-medium transition-colors duration-300"
          style={{
            color: darkMode
              ? "var(--color-dark-primary)"
              : "var(--color-primary)",
          }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      {/* Botón submit */}
      <button
        type="submit"
        className="w-full font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fadeIn"
        style={{
          animationDelay: "0.4s",
          animationFillMode: "both",
          backgroundColor: darkMode
            ? "var(--color-dark-primary)"
            : "var(--color-primary)",
          color: "#fff",
        }}
      >
        Iniciar sesión
      </button>

      {/* Footer */}
      <p
        className="text-xs text-center mt-4 animate-fadeIn"
        style={{
          animationDelay: "0.5s",
          animationFillMode: "both",
          color: darkMode
            ? "var(--color-dark-text-secondary)"
            : "var(--color-text-secondary)",
        }}
      >
        🔒 Conexión segura protegida
      </p>
    </form>
  );
};