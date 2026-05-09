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
            style={{ backgroundImage: `url(${'/src/assets/img/background.png'})` }}
        >
            {/* Overlay con tinte según modo */}
            <div
                className="absolute inset-0 transition-colors duration-500"
                style={{ backgroundColor: darkMode ? 'rgba(11,28,44,0.80)' : 'rgba(10,37,64,0.65)' }}
            />

            {/* Toggle Dark Mode */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                className={`
                    absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center
                    border transition-all duration-300 hover:scale-105 active:scale-95
                    ${darkMode
                        ? 'bg-[#112B3C] border-[#1B4F72] text-[#5DADE2] hover:bg-[#1B4F72]'
                        : 'bg-white/90 border-[#D6EAF8] text-[#1F4E79] hover:bg-white'
                    }
                `}
            >
                {darkMode ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                )}
            </button>

            {/* Card principal */}
            <div
                className="relative z-10 w-full max-w-md transition-colors duration-500 animate-fadeIn"
                style={{
                    backgroundColor: darkMode ? 'var(--color-dark-surface)' : 'var(--color-surface)',
                    borderRadius: '16px',
                    border: `1px solid ${darkMode ? 'var(--color-dark-border)' : 'var(--color-border)'}`,
                    boxShadow: darkMode
                        ? '0 24px 64px rgba(0,0,0,0.5)'
                        : '0 24px 64px rgba(10,37,64,0.12)',
                    overflow: 'hidden',
                }}
            >
                {/* Franja superior decorativa */}
                <div
                    className="h-1 w-full"
                    style={{
                        background: darkMode
                            ? 'linear-gradient(90deg, #1B4F72, #5DADE2, #85C1E9)'
                            : 'linear-gradient(90deg, #1F4E79, #5DADE2, #D6EAF8)'
                    }}
                />

                <div className="px-8 py-8">
                    {/* Logo + Header */}
                    <div className="flex flex-col items-center mb-7">
                        <img
                            src={darkMode ? "/src/assets/img/veraff-dark.png" : "/src/assets/img/veraff-light.png"}
                            alt="Logo"
                            className="h-28 mb-4 transition-all duration-500"
                        />

                        {/* Línea divisoria con icono */}
                        <div className="flex items-center gap-3 w-full mb-5">
                            <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: darkMode ? 'var(--color-dark-border)' : 'var(--color-border)' }}
                            />
                            <span
                                className="p-1.5 rounded-md"
                                style={{
                                    backgroundColor: darkMode ? '#0B1C2C' : '#F4F7FB',
                                    border: `1px solid ${darkMode ? '#1B4F72' : '#D6EAF8'}`
                                }}
                            >
                                {isForgot ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                        stroke={darkMode ? '#5DADE2' : '#1F4E79'}
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                        stroke={darkMode ? '#5DADE2' : '#1F4E79'}
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                )}
                            </span>
                            <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: darkMode ? 'var(--color-dark-border)' : 'var(--color-border)' }}
                            />
                        </div>

                        <h1
                            className="text-xl font-bold tracking-tight mb-1 transition-colors duration-500"
                            style={{ color: darkMode ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}
                        >
                            {isForgot ? "Recuperar Contraseña" : "Acceso Seguro"}
                        </h1>

                        <p
                            className="text-xs transition-colors duration-500 text-center"
                            style={{ color: darkMode ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}
                        >
                            {isForgot
                                ? "Ingresa tu correo y te enviaremos instrucciones"
                                : "Ingresa tus credenciales para continuar"
                            }
                        </p>
                    </div>

                    {/* Formularios */}
                    {isForgot ? (
                        <ForgotPasswordForm
                            onSwitch={() => setIsForgot(false)}
                            darkMode={darkMode}
                        />
                    ) : (
                        <LoginForm
                            onForgot={() => setIsForgot(true)}
                            darkMode={darkMode}
                        />
                    )}

                    {/* Footer de seguridad */}
                    <div className="mt-7 pt-5" style={{ borderTop: `1px solid ${darkMode ? '#1B4F72' : '#D6EAF8'}` }}>
                        <div className="flex items-center justify-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                stroke={darkMode ? '#A9CCE3' : '#5D6D7E'}
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                            <span className="text-xs" style={{ color: darkMode ? '#A9CCE3' : '#5D6D7E' }}>
                                Conexión segura SSL · 256-bit
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};