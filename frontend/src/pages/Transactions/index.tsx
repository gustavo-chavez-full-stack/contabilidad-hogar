import React, { useState, useEffect } from 'react';
import { Save, X, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await apiRequest('/finance/categories');
        setCategories(result);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(cat => cat.type === type);

  // Set first category as default when type or categories change
  useEffect(() => {
    if (filteredCategories.length > 0 && !categoryId) {
      setCategoryId(filteredCategories[0].id.toString());
    } else if (filteredCategories.length > 0) {
      // Check if current categoryId is in the new filtered list
      const exists = filteredCategories.find(c => c.id.toString() === categoryId);
      if (!exists) {
        setCategoryId(filteredCategories[0].id.toString());
      }
    }
  }, [type, categories, filteredCategories, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId || !description) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await apiRequest('/finance/transactions', {
        method: 'POST',
        body: JSON.stringify({
          amount: parseFloat(amount),
          categoryId: parseInt(categoryId),
          description,
          date,
        }),
      });

      setMessage({ type: 'success', text: 'Transacción guardada correctamente' });
      
      // Clear form
      setAmount('');
      setDescription('');
      
      // Redirect after a short delay
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Nueva Transacción</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Registra tus ingresos o gastos puntuales de forma rápida.</p>
      </header>

      <div className="glass-card">
        {message && (
          <div style={{ 
            background: message.type === 'success' ? 'rgba(57, 211, 83, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            border: `1px solid ${message.type === 'success' ? 'rgba(57, 211, 83, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, 
            color: message.type === 'success' ? '#39d353' : '#ef4444', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem'
          }}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '12px' }}>
            <button
              type="button"
              onClick={() => setType('expense')}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '10px',
                background: type === 'expense' ? 'var(--accent-danger)' : 'transparent',
                color: 'white',
                fontWeight: '600',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '10px',
                background: type === 'income' ? 'var(--accent-secondary)' : 'transparent',
                color: 'white',
                fontWeight: '600',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Ingreso
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Monto</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>$</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ width: '100%', paddingLeft: '2rem' }} 
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Categoría</label>
              <select 
                style={{ width: '100%' }} 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={fetchingCategories}
                required
              >
                {fetchingCategories ? (
                  <option>Cargando categorías...</option>
                ) : (
                  <>
                    <option value="">Seleccionar categoría</option>
                    {filteredCategories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Fecha</label>
              <input 
                type="date" 
                style={{ width: '100%' }} 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Descripción</label>
              <input 
                type="text"
                placeholder="Ej: Compra de supermercado mensual" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%' }} 
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {loading ? 'Guardando...' : 'Guardar Transacción'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              style={{ 
                flex: 1, 
                padding: '0.75rem', 
                borderRadius: '8px', 
                background: 'var(--bg-tertiary)', 
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Transactions;
