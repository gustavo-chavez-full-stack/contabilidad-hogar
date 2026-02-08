import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, ArrowUpCircle, ArrowDownCircle, Loader2, Calendar } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

const History = () => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { formatAmount } = useSettings();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const result = await apiRequest('/finance/transactions');
        setHistoryData(result);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredData = historyData.filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (historyData.length === 0) return;

    const headers = ['Descripción', 'Categoría', 'Tipo', 'Fecha', 'Monto'];
    const rows = historyData.map(item => [
      item.description,
      item.category?.name || 'Sin categoría',
      item.category?.type === 'income' ? 'Ingreso' : 'Gasto',
      new Date(item.date).toLocaleDateString(),
      item.amount
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historial_transacciones_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Historial de Movimientos</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Consulta y filtra todas tus transacciones pasadas.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleExportCSV}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem 1.25rem', 
              borderRadius: '8px', 
              background: 'var(--bg-tertiary)', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </header>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Buscar por descripción o categoría..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem' }} 
            />
          </div>
          <select style={{ minWidth: '150px' }}>
            <option>Todos los periodos</option>
            <option>Últimos 30 días</option>
            <option>Este mes</option>
            <option>Este año</option>
          </select>
          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1.25rem', 
            borderRadius: '8px', 
            background: 'var(--bg-tertiary)', 
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}>
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
          </div>
        ) : filteredData.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>Transacción</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>Categoría</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} /> Fecha
                </th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: '500', textAlign: 'right' }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }}>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        background: item.category?.type === 'income' ? 'rgba(57, 211, 83, 0.1)' : 'rgba(248, 81, 73, 0.1)',
                        padding: '0.5rem',
                        borderRadius: '8px'
                      }}>
                        {item.category?.type === 'income' ? <ArrowUpCircle size={20} color="#39d353" /> : <ArrowDownCircle size={20} color="#f85149" />}
                      </div>
                      <span style={{ fontWeight: '600' }}>{item.description}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                      {item.category?.name || 'Sin categoría'}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(item.date).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ 
                    padding: '1.25rem 1.5rem', 
                    textAlign: 'right', 
                    fontWeight: '700',
                    color: item.category?.type === 'income' ? '#39d353' : '#f85149',
                    fontSize: '1rem'
                  }}>
                    {item.category?.type === 'income' ? '+' : '-'}{formatAmount(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ background: 'var(--bg-tertiary)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Search size={32} />
            </div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No se encontraron transacciones</h3>
            <p>Intenta ajustar tus criterios de búsqueda o filtros.</p>
          </div>
        )}
        <div className="flex-between" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Mostrando {filteredData.length} transacciones</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'not-allowed' }}>Anterior</button>
            <button style={{ padding: '0.5rem 1rem', borderRadius: '6px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'not-allowed' }}>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
