import React from 'react';
import { Mail, ArrowLeft, Info } from 'lucide-react';

export const ForgotPasswordForm = ({ darkMode, onSwitch }) => {
  // Mapeo de colores: Forzamos blanco puro en modo oscuro
  const theme = {
    textPrimary: darkMode ? '#FFFFFF' : 'var(--color-text-primary)',
    textSecondary: darkMode ? '#EAF2F8' : 'var(--color-text-secondary)',
    surface: darkMode ? 'var(--color-dark-surface)' : 'var(--color-surface)',
    border: darkMode ? 'var(--color-dark-border)' : 'var(--color-border)',
    primary: darkMode ? 'var(--color-dark-primary)' : 'var(--color-primary)',
    secondary: darkMode ? 'var(--color-dark-secondary)' : 'var(--color-secondary)',
  };

  return (
    <form className="space-y-6 w-full max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
      
      {/* Cabecera Informativa */}
      <div 
        className="flex items-start gap-3 p-4 rounded-xl mb-2 animate-fadeIn transition-colors duration-300"
        style={{ 
          backgroundColor: `${theme.secondary}15`, 
          borderLeft: `4px solid ${theme.secondary}`,
          animationDelay: "0.1s", 
          animationFillMode: "both" 
        }}
      >
        <Info size={20} style={{ color: theme.secondary }} className="shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>
          Le enviaremos un código de verificación a su correo registrado para restablecer su acceso.
        </p>
      </div>

      {/* Campo: Email */}
      <div className="animate-fadeIn" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        {/* CORRECCIÓN AQUÍ: Forzamos el color directamente en el style */}
        <label 
          className="block text-sm font-bold mb-2 transition-colors duration-300" 
          style={{ color: theme.textPrimary }} 
        >
          Correo electrónico corporativo
        </label>
        
        <div className="relative group">
          <div 
            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300" 
            style={{ color: theme.textSecondary }}
          >
            <Mail size={18} />
          </div>
          <input
            type="email"
            placeholder="usuario@dominio.com"
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border transition-all duration-500 outline-none focus:ring-4"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.textPrimary, // Esto asegura que lo que escribes también sea blanco
              '--tw-ring-color': `${theme.primary}20`
            }}
          />
        </div>
      </div>

      {/* Botón de Envío */}
      <button
        type="submit"
        className="w-full font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-[0.98] hover:brightness-110 animate-fadeIn"
        style={{
          animationDelay: "0.3s",
          animationFillMode: "both",
          backgroundColor: theme.primary,
          color: '#FFFFFF', 
          boxShadow: `0 10px 15px -3px ${theme.primary}40`
        }}
      >
        Solicitar nueva clave
      </button>

      {/* Volver al Login */}
      <div 
        className="flex justify-center animate-fadeIn" 
        style={{ animationDelay: "0.4s", animationFillMode: "both" }}
      >
        <button
          type="button"
          onClick={onSwitch}
          className="flex items-center gap-2 text-sm font-bold transition-all hover:gap-3 group"
          style={{ color: theme.primary }}
        >
          <ArrowLeft size={16} className="transition-transform" />
          <span style={{ color: theme.primary }}>Volver al inicio de sesión</span>
        </button>
      </div>

    </form>
  );
};