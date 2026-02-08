import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Wallet, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al registrarse');
      }

      // After successful registration, redirect to login
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: 'var(--bg-color)',
      color: 'var(--text-primary)'
    }}>
      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Crea tu Cuenta</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Empieza a gestionar tus finanzas hoy mismo.</p>
          
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

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Usuario</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
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
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Contraseña</label>
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
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
              {!loading && <ArrowRight size={18} />}
            </button>
            
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
              ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Hero Side */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(225deg, #0d1117 0%, #161b22 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '4rem',
        borderLeft: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
           <h2 style={{ fontSize: '3rem', lineHeight: '1.2', marginBottom: '2rem' }}>
            Tu camino hacia la <br/>
            <span style={{ color: 'var(--accent-secondary)' }}>libertad financiera</span> <br/>
            empieza aquí.
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              'Seguimiento automático de gastos fijos',
              'Proyecciones inteligentes a 30 años',
              'Informes detallados por categoría',
              'Acceso seguro y encriptado'
            ].map((text, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-secondary)' }}></div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ 
          position: 'absolute', 
          top: '-100px', 
          left: '-100px', 
          width: '400px', 
          height: '400px', 
          background: 'var(--accent-secondary)', 
          filter: 'blur(150px)', 
          opacity: 0.1 
        }}></div>
      </div>
    </div>
  );
};

export default Register;
