export const ForgotPasswordForm = ({ darkMode, onSwitch }) => {
  return (
    <form className="space-y-5">
      
      {/* Email */}
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
            Email
        </label>

        <input
          type="email"
          placeholder="correo@ejemplo.com"
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

      {/* Submit */}
      <button
        type="submit"
        className="w-full font-semibold py-2.5 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fadeIn"
        style={{
          animationDelay: "0.2s",
          animationFillMode: "both",
          backgroundColor: darkMode
            ? "var(--color-dark-primary)"
            : "var(--color-primary)",
          color: "#fff",
        }}
      >
        Enviar correo
      </button>

      {/* Switch back to login */}
      <p
        className="text-center text-sm animate-fadeIn"
        style={{
          animationDelay: "0.3s",
          animationFillMode: "both",
          color: darkMode
            ? "var(--color-dark-text-secondary)"
            : "var(--color-text-secondary)",
        }}
      >
        ¿Recordaste tu contraseña?{" "}

        <button
          type="button"
          onClick={onSwitch}
          className="font-medium hover:underline transition-colors duration-300"
          style={{
            color: darkMode
              ? "var(--color-dark-primary)"
              : "var(--color-primary)",
          }}
        >
          Iniciar sesión
        </button>
      </p>
    </form>
  );
};