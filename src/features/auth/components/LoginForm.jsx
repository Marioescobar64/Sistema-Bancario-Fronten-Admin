import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, ShieldCheck } from 'lucide-react';

export const LoginForm = ({ darkMode, onForgot }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Mapeo de variables según el modo
  const theme = {
    textPrimary: darkMode ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)',
    textSecondary: darkMode ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)',
    surface: darkMode ? 'var(--color-dark-surface)' : 'var(--color-surface)',
    border: darkMode ? 'var(--color-dark-border)' : 'var(--color-border)',
    primary: darkMode ? 'var(--color-dark-primary)' : 'var(--color-primary)',
    success: darkMode ? 'var(--color-dark-success)' : 'var(--color-success)',
  };

  return (
    <form className="space-y-6 w-full max-w-md mx-auto p-2" onSubmit={(e) => e.preventDefault()}>
      
      {/* Campo: Usuario */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <label className="block text-sm font-bold mb-2 transition-colors duration-300" style={{ color: theme.textPrimary }}>
          Usuario o correo electrónico
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: theme.textSecondary }}>
            <User size={18} />
          </div>
          <input
            type="text"
            placeholder="ejemplo@banca.com"
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border transition-all duration-300 outline-none focus:ring-4"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.textPrimary,
              '--tw-ring-color': `${theme.primary}20` // Ring con 20% de opacidad
            }}
          />
        </div>
      </div>

      {/* Campo: Contraseña */}
      <div className="animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <label className="block text-sm font-bold mb-2 transition-colors duration-300" style={{ color: theme.textPrimary }}>
          Contraseña
        </label>
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300" style={{ color: theme.textSecondary }}>
            <Lock size={18} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 text-sm rounded-xl border transition-all duration-300 outline-none focus:ring-4"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.textPrimary,
              '--tw-ring-color': `${theme.primary}20`
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
            style={{ color: theme.textSecondary }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Opciones */}
      <div className="flex items-center justify-between text-sm animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded transition-all" 
            style={{ accentColor: theme.primary }}
          />
          <span style={{ color: theme.textSecondary }}>Recordar dispositivo</span>
        </label>

        <button
          type="button"
          onClick={onForgot}
          className="font-bold hover:opacity-80 transition-opacity"
          style={{ color: theme.primary }}
        >
          ¿Olvidó sus credenciales?
        </button>
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        className="w-full font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-95 hover:brightness-110 animate-fadeIn"
        style={{
          animationDelay: '0.4s',
          animationFillMode: 'both',
          backgroundColor: theme.primary,
          color: darkMode ? 'var(--color-dark-background)' : '#FFFFFF',
          boxShadow: `0 10px 15px -3px ${theme.primary}40` // Sombra sutil del color primario
        }}
      >
        Iniciar Sesión
      </button>

      {/* Footer de Seguridad */}
      <div 
        className="flex items-center justify-center gap-2 mt-6 animate-fadeIn" 
        style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
      >
        <ShieldCheck size={16} style={{ color: theme.success }} />
        <span className="text-[10px] uppercase tracking-tighter font-bold" style={{ color: theme.textSecondary }}>
          Sesión protegida con cifrado de extremo a extremo
        </span>
      </div>
    </form>
  );
};