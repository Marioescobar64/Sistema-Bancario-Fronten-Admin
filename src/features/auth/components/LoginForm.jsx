import { useState } from 'react';
import { useAuthStore } from '../authStore.js';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";

export const LoginForm = ({ onForgot, darkMode }) => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const res = await login(data);
        if (res.success) {
            navigate("/dashboard/accounts");
            toast.success("Bienvenido de nuevo 🚀");
        }
    };

    const inputBase = `
        w-full px-4 py-3 text-sm rounded-lg border outline-none transition-all duration-200
        ${darkMode
            ? 'bg-[#0B1C2C] border-[#1B4F72] text-[#EAF2F8] placeholder-[#A9CCE3]/50 focus:border-[#5DADE2] focus:ring-1 focus:ring-[#5DADE2]/30'
            : 'bg-[#F4F7FB] border-[#D6EAF8] text-[#0A2540] placeholder-[#5D6D7E]/50 focus:border-[#5DADE2] focus:ring-1 focus:ring-[#5DADE2]/30'
        }
    `;

    const labelBase = `block text-xs font-semibold uppercase tracking-widest mb-2 ${
        darkMode ? 'text-[#A9CCE3]' : 'text-[#5D6D7E]'
    }`;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email / Usuario */}
            <div>
                <label className={labelBase}>Email o Usuario</label>
                <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-[#5DADE2]' : 'text-[#1F4E79]'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="correo@ejemplo.com"
                        className={`${inputBase} pl-10`}
                        {...register("emailOrUsername", { required: "Campo obligatorio" })}
                    />
                </div>
                {errors.emailOrUsername && (
                    <p className={`mt-1.5 text-xs flex items-center gap-1 ${darkMode ? 'text-[#EC7063]' : 'text-[#E74C3C]'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {errors.emailOrUsername.message}
                    </p>
                )}
            </div>

            {/* Contraseña */}
            <div>
                <label className={labelBase}>Contraseña</label>
                <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-[#5DADE2]' : 'text-[#1F4E79]'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                    </span>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`${inputBase} pl-10 pr-10`}
                        {...register("password", { required: "Campo obligatorio" })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                            darkMode ? 'text-[#A9CCE3] hover:text-[#5DADE2]' : 'text-[#5D6D7E] hover:text-[#1F4E79]'
                        }`}
                    >
                        {showPassword ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className={`mt-1.5 text-xs flex items-center gap-1 ${darkMode ? 'text-[#EC7063]' : 'text-[#E74C3C]'}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Error global */}
            {error && (
                <div className={`flex items-start gap-2.5 text-sm p-3.5 rounded-lg border ${
                    darkMode
                        ? 'bg-[#EC7063]/10 border-[#EC7063]/30 text-[#EC7063]'
                        : 'bg-[#E74C3C]/8 border-[#E74C3C]/20 text-[#E74C3C]'
                }`}>
                    <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                </div>
            )}

            {/* Botón submit */}
            <button
                type="submit"
                disabled={loading}
                className={`
                    relative w-full py-3 px-4 rounded-lg text-sm font-semibold tracking-wide
                    transition-all duration-200 overflow-hidden
                    ${darkMode
                        ? 'bg-[#5DADE2] hover:bg-[#85C1E9] text-[#0B1C2C] disabled:opacity-50'
                        : 'bg-[#1F4E79] hover:bg-[#5DADE2] text-white disabled:opacity-50'
                    }
                    active:scale-[0.98] disabled:cursor-not-allowed
                `}
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Verificando...
                    </span>
                ) : (
                    <span className="flex items-center justify-center gap-2">
                        Iniciar Sesión
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </span>
                )}
            </button>

            {/* Olvidé contraseña */}
            <div className="text-center pt-1">
                <button
                    type="button"
                    onClick={onForgot}
                    className={`text-xs transition-colors duration-200 ${
                        darkMode
                            ? 'text-[#A9CCE3] hover:text-[#5DADE2]'
                            : 'text-[#5D6D7E] hover:text-[#1F4E79]'
                    }`}
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </div>
        </form>
    );
};