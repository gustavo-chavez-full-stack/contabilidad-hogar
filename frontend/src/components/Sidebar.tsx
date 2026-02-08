import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Repeat, 
  TrendingUp, 
  History, 
  Settings, 
  LogOut,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: PlusCircle, label: 'Nueva Transacción', path: '/transactions' },
    { icon: Repeat, label: 'Gastos Fijos', path: '/fixed-expenses' },
    { icon: TrendingUp, label: 'Proyecciones', path: '/projections' },
    { icon: History, label: 'Historial', path: '/history' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
        <div style={{ 
          background: 'var(--accent-primary)', 
          padding: '0.5rem', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Wallet size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>FinancePro</h2>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                <Link
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    background: isActive ? 'rgba(47, 129, 247, 0.1)' : 'transparent',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : '400',
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <button 
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-danger)',
            transition: 'all 0.2s',
            cursor: 'pointer'
          }}
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
