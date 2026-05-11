import toast from "react-hot-toast";

export function ShowConfirmToast({ title, message, onConfirm, darkMode = false }) {
    const dm = darkMode;
    toast.custom((t) => (
        <div className="p-6 rounded-xl w-96 text-center shadow-lg" style={{ backgroundColor: dm ? 'var(--color-dark-surface)' : 'var(--color-surface)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}`, color: dm ? 'var(--color-dark-text-primary)' : 'var(--color-text-primary)' }}>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="mb-4" style={{ color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)' }}>{message}</p>
            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-5 py-2 rounded-lg font-medium hover:opacity-80 transition"
                    style={{ backgroundColor: dm ? 'var(--color-dark-background)' : 'var(--color-background)', color: dm ? 'var(--color-dark-text-secondary)' : 'var(--color-text-secondary)', border: `1px solid ${dm ? 'var(--color-dark-border)' : 'var(--color-border)'}` }}
                >
                    Cancelar
                </button>
                <button
                    onClick={() => {
                        onConfirm?.();
                        toast.dismiss(t.id);
                    }}
                    className="px-5 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
                    style={{ backgroundColor: dm ? '#F87171' : '#DC2626' }}
                >
                    Confirmar
                </button>
            </div>
        </div>
    ));
}
