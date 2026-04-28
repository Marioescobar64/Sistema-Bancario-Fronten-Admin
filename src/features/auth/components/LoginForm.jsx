import { useAuthStore } from '../authStore.js';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";

export const LoginForm = ({ onForgot }) => {

    const navigate = useNavigate();

    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                    Email o Usuario
                </label>
                <input
                    type="text"
                    placeholder="correo@ejemplo.com o usuario"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register("emailOrUsername", {
                        required: "Email o usuario es obligatorio"
                    })}
                />
                {errors.emailOrUsername && (
                    <span className="text-red-500 text-xs">{errors.emailOrUsername.message}</span>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contraseña
                </label>
                <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    {...register("password", {
                        required: "Contraseña es obligatoria"
                    })}
                />
                {errors.password && (
                    <span className="text-red-500 text-xs">{errors.password.message}</span>
                )}
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:opacity-90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50"
            >
                {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>

            <p className="text-center text-sm">
                <button
                    type="button"
                    onClick={onForgot}
                    className="text-blue-600 hover:underline"
                >
                    ¿Olvidaste tu contraseña?
                </button>
            </p>
        </form>
    );
};