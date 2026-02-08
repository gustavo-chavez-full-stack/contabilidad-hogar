import React, { useEffect, useState } from 'react';
import { 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Palette, 
  Globe, 
  Loader2, 
  Save, 
  CheckCircle, 
  Lock, 
  Smartphone,
  Mail,
  Zap,
  Star,
  Clock,
  Check
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

type Tab = 'profile' | 'security' | 'localization' | 'notifications' | 'appearance' | 'subscription';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { 
    currency, setCurrency, 
    theme, setTheme, 
    language, setLanguage,
    notifications, setNotifications 
  } = useSettings();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await apiRequest('/auth/profile');
        setProfile(result);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Persist changes (most are already in context/localStorage)
    setTimeout(() => {
      setSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
        <Loader2 className="animate-spin" size={64} color="var(--accent-primary)" />
      </div>
    );
  }

  const menuItems: { id: Tab; icon: any; label: string }[] = [
    { id: 'profile', icon: User, label: 'Perfil' },
    { id: 'security', icon: Shield, label: 'Seguridad' },
    { id: 'localization', icon: Globe, label: 'Moneda & Localización' },
    { id: 'notifications', icon: Bell, label: 'Notificaciones' },
    { id: 'appearance', icon: Palette, label: 'Apariencia' },
    { id: 'subscription', icon: CreditCard, label: 'Suscripción' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', letterSpacing: '-0.02em' }}>Configuración</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Personaliza tu experiencia y gestiona tu seguridad.</p>
      </header>

      <div style={{ display: 'flex', gap: '3rem' }}>
        {/* Navigation Sidebar */}
        <aside style={{ width: '280px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {menuItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: activeTab === item.id ? 'var(--bg-tertiary)' : 'transparent',
                  color: activeTab === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === item.id ? '600' : '500',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.95rem'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div style={{ flex: 1 }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            {showSuccess && (
              <div style={{ 
                background: 'rgba(57, 211, 83, 0.1)', 
                border: '1px solid rgba(57, 211, 83, 0.2)', 
                color: '#39d353', 
                padding: '1rem 1.25rem', 
                borderRadius: '12px', 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem'
              }}>
                <CheckCircle size={18} />
                Tus cambios se han guardado correctamente
              </div>
            )}

            <form onSubmit={handleSave}>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Perfil de Usuario</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--accent-primary), #ab7df8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      color: 'white',
                      boxShadow: '0 8px 32px rgba(47, 129, 247, 0.3)'
                    }}>
                      {profile?.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>Subir Nueva Foto</button>
                        <button type="button" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>Remover</button>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.75rem' }}>JPG, GIF o PNG. Máximo 2MB.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Nombre de Usuario</label>
                      <input type="text" value={profile?.username || ''} readOnly style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', cursor: 'not-allowed' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Correo Electrónico</label>
                      <input type="email" placeholder="usuario@ejemplo.com" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Seguridad de la Cuenta</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <section>
                      <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lock size={18} color="var(--accent-primary)" />
                        Cambiar Contraseña
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.875rem' }}>Contraseña Actual</label>
                          <input type="password" placeholder="••••••••" style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ fontSize: '0.875rem' }}>Nueva Contraseña</label>
                          <input type="password" placeholder="••••••••" style={{ width: '100%' }} />
                        </div>
                      </div>
                    </section>

                    <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />

                    <section>
                      <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Smartphone size={18} color="var(--accent-primary)" />
                          Autenticación de Dos Factores (2FA)
                        </h4>
                        <div style={{ 
                          padding: '0.25rem 0.75rem', 
                          background: 'rgba(248, 81, 73, 0.1)', 
                          color: 'var(--accent-danger)', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: '600' 
                        }}>Desactivado</div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                        Añade una capa extra de seguridad a tu cuenta utilizando una aplicación de autenticación.
                      </p>
                      <button type="button" className="btn-primary" style={{ width: 'auto' }}>Configurar 2FA</button>
                    </section>
                  </div>
                </div>
              )}

              {/* Localization Tab */}
              {activeTab === 'localization' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Moneda y Regionalización</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Moneda Principal</label>
                      <select 
                        value={currency} 
                        onChange={(e) => setCurrency(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="CLP">CLP - Peso Chileno</option>
                        <option value="USD">USD - Dólar Estadounidense</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="ARS">ARS - Peso Argentino</option>
                        <option value="MXN">MXN - Peso Mexicano</option>
                        <option value="COP">COP - Peso Colombiano</option>
                      </select>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Esta moneda se aplicará a todos tus cálculos, reportes y gráficos de forma global.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <label style={{ fontSize: '0.9rem', fontWeight: '600' }}>Idioma</label>
                      <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="es">Español (Chile)</option>
                        <option value="en">English (US)</option>
                        <option value="pt">Português</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Notificaciones</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                      { 
                        id: 'email', 
                        icon: Mail, 
                        title: 'Alertas por Email', 
                        desc: 'Recibe resúmenes y alertas importantes en tu correo.',
                        checked: notifications.email
                      },
                      { 
                        id: 'push', 
                        icon: Bell, 
                        title: 'Notificaciones Push', 
                        desc: 'Alertas en tiempo real en tu navegador o dispositivo móvil.',
                        checked: notifications.push
                      },
                      { 
                        id: 'weeklyReport', 
                        icon: Clock, 
                        title: 'Reporte Semanal', 
                        desc: 'Un resumen detallado de tus finanzas cada lunes por la mañana.',
                        checked: notifications.weeklyReport
                      },
                    ].map((n) => (
                      <div key={n.id} className="flex-between" style={{ 
                        padding: '1.25rem', 
                        background: 'var(--bg-tertiary)', 
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <div style={{ color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                            <n.icon size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{n.title}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.desc}</div>
                          </div>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={n.checked}
                          onChange={(e) => setNotifications({...notifications, [n.id]: e.target.checked})}
                          style={{ width: '22px', height: '22px', cursor: 'pointer' }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Apariencia</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {[
                      { id: 'light', label: 'Claro', icon: '☀️' },
                      { id: 'dark', label: 'Oscuro', icon: '🌙' },
                      { id: 'system', label: 'Sistema', icon: '💻' },
                    ].map((t) => (
                      <button 
                        key={t.id}
                        type="button"
                        onClick={() => setTheme(t.id as any)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1.5rem',
                          borderRadius: '16px',
                          background: theme === t.id ? 'rgba(47, 129, 247, 0.15)' : 'var(--bg-tertiary)',
                          border: theme === t.id ? '2px solid var(--accent-primary)' : '2px solid var(--border-color)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          color: theme === t.id ? 'var(--accent-primary)' : 'var(--text-primary)'
                        }}
                      >
                        <span style={{ fontSize: '2rem' }}>{t.icon}</span>
                        <span style={{ fontWeight: '600' }}>{t.label}</span>
                        {theme === t.id && <CheckCircle size={18} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="animate-fade-in">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Plan y Suscripción</h3>
                  
                  <div style={{ 
                    background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, rgba(47, 129, 247, 0.05) 100%)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    border: '1px solid var(--border-color)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div className="flex-between" style={{ marginBottom: '2rem' }}>
                        <div>
                          <span style={{ 
                            background: 'var(--accent-primary)', 
                            color: 'white', 
                            padding: '0.4rem 1rem', 
                            borderRadius: '20px', 
                            fontSize: '0.75rem', 
                            fontWeight: '700',
                            textTransform: 'uppercase'
                          }}>Plan Pro</span>
                          <h4 style={{ fontSize: '2rem', marginTop: '1rem' }}>$0 CLP <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '400' }}>/ por siempre</span></h4>
                        </div>
                        <Zap size={48} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        {[
                          'Sincronización ilimitada',
                          'Reportes avanzados PDF/CSV',
                          'Proyecciones inteligentes',
                          'Soporte prioritario 24/7'
                        ].map((feature, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                            <div style={{ background: 'rgba(57, 211, 83, 0.1)', borderRadius: '50%', padding: '0.1rem' }}>
                              <Check size={14} color="#39d353" />
                            </div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn-primary" style={{ flex: 1 }}>Gestionar Pago</button>
                        <button type="button" style={{ 
                          flex: 1, 
                          background: 'transparent', 
                          border: '1px solid var(--accent-danger)', 
                          color: 'var(--accent-danger)',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>Cancelar Suscripción</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Save Button (Only for certain tabs) */}
              {['profile', 'security', 'localization', 'notifications'].includes(activeTab) && (
                <div style={{ 
                  marginTop: '3rem', 
                  paddingTop: '2rem', 
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={saving}
                    style={{ 
                      border: 'none', 
                      cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.8rem 2rem',
                      fontSize: '1rem'
                    }}
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
