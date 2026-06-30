import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../../shared/api/auth';
import { useDarkMode } from '../../../shared/hooks/useDarkMode';

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const dm = useDarkMode();

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Verificando tu correo electrónico...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No se encontró el token de verificación.');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('¡Tu correo ha sido verificado exitosamente!');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Hubo un error al verificar tu correo.');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: dm ? '#0B1C2C' : '#F4F7FB' }}>
      <div className="max-w-md w-full p-8 rounded-2xl shadow-xl text-center" style={{ backgroundColor: dm ? '#112240' : '#FFFFFF', border: `1px solid ${dm ? '#1E3A8A' : '#E5E7EB'}` }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: dm ? '#E2E8F0' : '#1E293B' }}>
          Verificación de Correo
        </h2>
        
        <div className="mb-8">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          )}
          {status === 'success' && (
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          {status === 'error' && (
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          
          <p className="mt-4 text-lg" style={{ color: dm ? '#94A3B8' : '#64748B' }}>
            {message}
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 rounded-lg font-bold text-white transition-all shadow-md hover:shadow-lg focus:outline-none"
          style={{ background: "linear-gradient(90deg, #0066cc 0%, #1956a3 100%)" }}
        >
          Ir al Inicio de Sesión
        </button>
      </div>
    </div>
  );
};
