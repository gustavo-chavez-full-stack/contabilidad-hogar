import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Wallet, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/api';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      const data = await response.json();
      login(data.access_token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        if (!response.ok) {
          throw new Error('Error en la autenticación con Google');
        }

        const data = await response.json();
        login(data.access_token);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Error al iniciar sesión con Google'),
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: 'var(--bg-color)',
      color: 'var(--text-primary)'
    }}>
      {/* Left Side: Branding/Hero */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        borderRight: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem' }}>
            <div style={{ background: 'var(--accent-primary)', padding: '0.75rem', borderRadius: '12px' }}>
              <Wallet size={32} color="white" />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>FinancePro</h1>
          </div>
          
          <h2 style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '2rem', maxWidth: '500px' }}>
            Domina tu futuro con <span style={{ color: 'var(--accent-primary)' }}>precisión.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '450px', marginBottom: '3rem' }}>
            La plataforma de gestión financiera diseñada para profesionales modernos y ahorradores ambiciosos.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', marginLeft: '0' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  border: '2px solid var(--bg-color)', 
                  background: 'var(--bg-tertiary)',
                  marginLeft: i > 1 ? '-12px' : '0'
                }}></div>
              ))}
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Únete a +10k usuarios</span>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Bienvenido</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Ingresa tus credenciales para continuar.</p>
          
          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: '#ef4444', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.875rem'
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Usuario</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Tu usuario" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.75rem' }} 
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="flex-between">
                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Contraseña</label>
                <a href="#" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>¿Olvidaste tu contraseña?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2.75rem' }} 
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              {!loading && <ArrowRight size={18} />}
            </button>
            
            <div style={{ position: 'relative', textAlign: 'center', margin: '1rem 0' }}>
              <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />
              <span style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate( -50%, -50%)', 
                background: 'var(--bg-secondary)', 
                padding: '0 1rem', 
                fontSize: '0.75rem',
                color: 'var(--text-secondary)'
              }}>Ó CONTINÚA CON</span>
            </div>
            
            <button 
              type="button" 
              onClick={() => googleLogin()}
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.172.282-1.712V4.956H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.044l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.956l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>
            
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2rem' }}>
              ¿No tienes una cuenta? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Crea una ahora</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
