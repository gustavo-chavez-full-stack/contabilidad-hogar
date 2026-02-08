import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Repeat, 
  Trash2, 
  Edit3, 
  Calendar, 
  Loader2, 
  X, 
  CreditCard, 
  CheckCircle,
  Zap,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

const FixedExpenses = () => {
  const [fixedExpenses, setFixedExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isOptiModalOpen, setIsOptiModalOpen] = useState(false);
  const { formatAmount } = useSettings();
  
  // Form state for Create/Edit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('1'); 
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for Pay
  const [payingExpense, setPayingExpense] = useState<any>(null);
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMonth, setPayMonth] = useState('');

  // Optimization insights
  const [insights, setInsights] = useState<any[]>([]);

  const fetchFixedExpenses = async () => {
    setLoading(true);
    try {
      const result = await apiRequest('/finance/fixed-expenses');
      setFixedExpenses(result);
    } catch (error) {
      console.error('Error loading fixed expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await apiRequest('/finance/categories');
      const expenseCats = result.filter((c: any) => c.type === 'expense');
      setCategories(expenseCats);
      if (expenseCats.length > 0 && !categoryId) setCategoryId(expenseCats[0].id.toString());
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    fetchFixedExpenses();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setDueDate('1');
    if (categories.length > 0) setCategoryId(categories[0].id.toString());
    setIsModalOpen(false);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        description,
        amount: parseFloat(amount),
        dueDate: parseInt(dueDate),
        categoryId: parseInt(categoryId)
      };

      if (editingId) {
        await apiRequest(`/finance/fixed-expenses/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest('/finance/fixed-expenses', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      fetchFixedExpenses();
    } catch (error) {
      console.error('Error saving fixed expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingId(expense.id);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setDueDate(expense.dueDate);
    setCategoryId(expense.categoryId?.toString() || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este gasto fijo?')) return;
    try {
      await apiRequest(`/finance/fixed-expenses/${id}`, { method: 'DELETE' });
      fetchFixedExpenses();
    } catch (error) {
      console.error('Error deleting fixed expense:', error);
    }
  };

  const openPayModal = (expense: any) => {
    setPayingExpense(expense);
    const now = new Date();
    const monthYear = now.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    setPayMonth(monthYear.charAt(0).toUpperCase() + monthYear.slice(1));
    setPayDate(now.toISOString().split('T')[0]);
    setIsPayModalOpen(true);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest(`/finance/fixed-expenses/${payingExpense.id}/pay`, {
        method: 'POST',
        body: JSON.stringify({
          date: payDate,
          month: payMonth
        }),
      });
      setIsPayModalOpen(false);
      alert('Pago registrado como transacción correctamente');
    } catch (error) {
      console.error('Error paying fixed expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const runOptimization = () => {
    setIsSubmitting(true);
    // Simulated optimization logic based on common subscription pattern
    setTimeout(() => {
      const newInsights = [];
      const totalFixed = fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0);

      // Check for recurring streamings
      const streamings = fixedExpenses.filter(e => 
        /netflix|disney|spotify|hbo|amazon|star|apple/i.test(e.description)
      );
      
      if (streamings.length > 3) {
        newInsights.push({
          type: 'warning',
          title: 'Exceso de Streamings',
          description: `Tienes ${streamings.length} servicios de contenido activos. Considera rotar suscripciones para ahorrar hasta ${formatAmount(streamings[0].amount)} mensual.`,
          icon: AlertTriangle
        });
      }

      // Check for high percentage of fixed expenses
      if (totalFixed > 500000) { // Threshold for Chilean pesos example
        newInsights.push({
          type: 'info',
          title: 'Alta Carga Fija',
          description: 'Tus gastos recurrentes representan un compromiso alto de tus ingresos. Evalúa renegociar planes de internet o seguros.',
          icon: TrendingDown
        });
      }

      // Individual suggestions
      fixedExpenses.forEach(e => {
        if (e.amount > 100000 && e.category?.name === 'Vivienda') {
          newInsights.push({
            type: 'light',
            title: `Optimizar ${e.description}`,
            description: 'Busca opciones de cuentas de ahorro con pago automático para obtener descuentos por fidelidad.',
            icon: Lightbulb
          });
        }
      });

      if (newInsights.length === 0) {
        newInsights.push({
          type: 'success',
          title: 'Finanzas Saludables',
          description: 'No hemos detectado duplicidades ni excesos críticos en tus gastos fijos actuales. ¡Buen trabajo!',
          icon: CheckCircle
        });
      }

      setInsights(newInsights);
      setIsSubmitting(false);
      setIsOptiModalOpen(true);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Gastos Fijos</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gestiona y automatiza tus movimientos recurrentes.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Nuevo Gasto Fijo
        </button>
      </header>

      {/* Main Form Modal (Create/Edit) */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{editingId ? 'Editar Gasto' : 'Añadir Gasto Recurrente'}</h2>
              <button onClick={resetForm} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem' }}>Descripción</label>
                <input type="text" placeholder="Ej: Alquiler, Internet, Netflix..." value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem' }}>Monto Mensual</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>$</span>
                  <input type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ paddingLeft: '2rem', width: '100%' }} required />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem' }}>Categoría</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ width: '100%' }} required>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem' }}>Día de Vencimiento (1-31)</label>
                <input type="number" min="1" max="31" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ flex: 1, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Gasto Fijo'}
                </button>
                <button type="button" onClick={resetForm} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {isPayModalOpen && payingExpense && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'var(--accent-primary)', padding: '0.5rem', borderRadius: '8px' }}>
                  <CreditCard size={20} color="white" />
                </div>
                <h2 style={{ fontSize: '1.25rem' }}>Registrar Pago</h2>
              </div>
              <button onClick={() => setIsPayModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Gasto Fijo</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{payingExpense.description}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--accent-primary)', marginTop: '0.5rem' }}>
                {formatAmount(payingExpense.amount)}
              </div>
            </div>

            <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem' }}>Mes de referencia / Detalle</label>
                <input type="text" placeholder="Ej: Febrero 2024" value={payMonth} onChange={(e) => setPayMonth(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem' }}>Fecha del pago</label>
                <input type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} required />
              </div>

              <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ 
                width: '100%', border: 'none', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}>
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                Confirmar Transacción
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Optimization Modal */}
      {isOptiModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '550px', padding: '2.5rem' }}>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Zap size={24} color="#f78166" />
                <h2 style={{ fontSize: '1.5rem' }}>Optimización de Suscripciones</h2>
              </div>
              <button onClick={() => setIsOptiModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {insights.map((insight, idx) => (
                <div key={idx} style={{ 
                  padding: '1.25rem', 
                  borderRadius: '12px', 
                  background: 'var(--bg-tertiary)', 
                  border: `1px solid ${insight.type === 'warning' ? 'var(--accent-danger)40' : 'var(--border-color)'}`,
                  display: 'flex',
                  gap: '1rem'
                }}>
                  <div style={{ color: insight.type === 'warning' ? 'var(--accent-danger)' : 'var(--accent-primary)' }}>
                    <insight.icon size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{insight.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsOptiModalOpen(false)} 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '2rem' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
        </div>
      ) : fixedExpenses.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {fixedExpenses.map(expense => (
            <div key={expense.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(47, 129, 247, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                  <Repeat size={20} color="var(--accent-primary)" />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(expense)} style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', padding: '4px' }} title="Editar"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(expense.id)} style={{ background: 'transparent', color: 'var(--accent-danger)', border: 'none', cursor: 'pointer', padding: '4px' }} title="Eliminar"><Trash2 size={18} /></button>
                </div>
              </div>
              
              <h3 style={{ marginBottom: '0.25rem' }}>{expense.description}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  {expense.category?.name || 'Gasto Fijo'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'rgba(47, 129, 247, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  Recurrente
                </span>
              </div>
              
              <div style={{ fontSize: '1.75rem', fontWeight: '700', margin: '0.5rem 0' }}>
                {formatAmount(expense.amount)}
                <span style={{ fontSize: '0.875rem', fontWeight: '400', color: 'var(--text-secondary)' }}> / mes</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                <Calendar size={14} />
                Día {expense.dueDate} de cada mes
              </div>

              <button 
                onClick={() => openPayModal(expense)}
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                className="btn-hover-accent"
              >
                <CreditCard size={18} />
                Registrar Pago
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '6rem 2rem', textAlign: 'center' }} className="glass-card">
          <div style={{ background: 'var(--bg-tertiary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Calendar size={32} color="var(--text-secondary)" />
          </div>
          <h2 style={{ marginBottom: '0.5rem' }}>No hay gastos fijos</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Añade tus gastos recurrentes mensuales para tener un mejor control de tus finanzas automáticas.
          </p>
          <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="btn-primary">Añadir el primero</button>
        </div>
      )}

      <div className="glass-card" style={{ 
        marginTop: '3rem', 
        background: 'linear-gradient(135deg, rgba(247, 129, 102, 0.1), rgba(0,0,0,0))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="#f78166" />
            Optimización de Suscripciones
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
            Analizamos tus gastos recurrentes para detectar servicios duplicados, identificar ahorros potenciales y mejorar tu salud financiera.
          </p>
        </div>
        <button 
          onClick={runOptimization} 
          className="btn-primary" 
          disabled={isSubmitting || loading}
          style={{ 
            background: 'linear-gradient(135deg, #f78166, #fa4549)', 
            border: 'none', 
            minWidth: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          {isSubmitting ? 'Analizando...' : 'Ejecutar Optimización'}
        </button>
      </div>
    </div>
  );
};

export default FixedExpenses;
