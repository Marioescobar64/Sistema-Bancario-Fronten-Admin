import { useState, useEffect } from "react";
import { LoginForm } from "../components/LoginForm";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export const AuthPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${'/src/assets/img/background.png'})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Toggle Dark Mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-5 right-5 px-4 py-2 rounded-lg shadow-lg font-medium
          transform transition-all duration-200 hover:scale-105 active:scale-95
          hover:shadow-2xl active:shadow-md z-20"
        style={{
          backgroundColor: darkMode
            ? "var(--color-dark-surface)"
            : "var(--color-surface)",
          color: darkMode
            ? "var(--color-dark-text-primary)"
            : "var(--color-text-primary)",
        }}
      >
        {darkMode ? "🌙 Oscuro" : "☀️ Claro"}
      </button>

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-xl shadow-2xl p-8 transition-colors duration-500 animate-fadeIn"
        style={{
          backgroundColor: darkMode
            ? "var(--color-dark-surface)"
            : "var(--color-surface)",
          border: `1px solid ${
            darkMode
              ? "var(--color-dark-border)"
              : "var(--color-border)"
          }`,
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={
              darkMode
                ? "/src/assets/img/veraff-dark.png"
                : "/src/assets/img/veraff-light.png"
            }
            alt="Logo"
            className="h-40 mb-1"
          />

          {/* Title */}
          <h1
            className="text-2xl font-bold mb-1 transition-colors duration-500"
            style={{
              color: darkMode
                ? "var(--color-dark-text-primary)"
                : "var(--color-text-primary)",
            }}
          >
            {isForgot ? "Recuperar Contraseña" : "Acceso Seguro"}
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm transition-colors duration-500 text-center"
            style={{
              color: darkMode
                ? "var(--color-dark-text-secondary)"
                : "var(--color-text-secondary)",
            }}
          >
            {isForgot
              ? "Ingresa tu correo para recuperar tu contraseña"
              : "Ingresa a tu banca digital"}
          </p>
        </div>

        {/* Forms */}
        {isForgot ? (
          <ForgotPasswordForm onSwitch={() => setIsForgot(false)} />
        ) : (
          <LoginForm
            darkMode={darkMode}
            onForgot={() => setIsForgot(true)}
          />
        )}
      </div>
    </div>
  );
};