import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Loader2, Landmark } from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

const CATEGORY_COLORS: Record<string, string> = {
  'Vivienda': '#2f81f7',
  'Alimentación': '#f78166',
  'Comida': '#f78166',
  'Transporte': '#39d353',
  'Entretenimiento': '#ab7df8',
  'Salud': '#ff7b72',
  'Educación': '#d29922',
  'Tecnología': '#79c0ff',
  'Otros': '#8b949e',
  'Otros Gastos': '#8b949e',
};

const StatCard = ({ title, amount, percentage, trend, icon: Icon, color, formatAmount }: any) => (
  <div className="glass-card" style={{ flex: 1 }}>
    <div className="flex-between" style={{ marginBottom: '1rem' }}>
      <div style={{ background: `${color}20`, padding: '0.5rem', borderRadius: '8px' }}>
        <Icon size={20} color={color} />
      </div>
      {percentage !== undefined && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.25rem', 
          color: trend === 'up' ? 'var(--accent-secondary)' : 'var(--accent-danger)',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {percentage}%
        </div>
      )}
    </div>
    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</div>
    <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{formatAmount(amount)}</div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { formatAmount } = useSettings();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await apiRequest('/finance/dashboard');
        setData(result);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-primary)" />
      </div>
    );
  }

  const pieData = data?.categoryData?.length > 0 ? data.categoryData : [
    { name: 'Sin datos', value: 1, color: '#30363d' }
  ];

  const handleExport = () => {
    if (!data) return;

    const sections = [
      ['Reporte Financiero - FinancePro'],
      ['Fecha', new Date().toLocaleDateString()],
      [''],
      ['RESUMEN GENERAL'],
      ['Concepto', 'Monto'],
      ['Balance Total', data.balance],
      ['Ingresos Totales', data.income],
      ['Gastos Totales', data.expenses],
      [''],
      ['GASTOS POR CATEGORÍA'],
      ['Categoría', 'Monto Total'],
      ...data.categoryData.map((c: any) => [c.name, c.value]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + sections.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reporte_financiero_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Resumen Financiero</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Análisis actualizado de tus ingresos y gastos.</p>
        </div>
        <button 
          onClick={handleExport}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Landmark size={18} />
          Exportar Reporte
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <StatCard title="Balance Total" amount={data?.balance || 0} icon={Wallet} color="#2f81f7" formatAmount={formatAmount} />
        <StatCard title="Ingresos Totales" amount={data?.income || 0} icon={ArrowUpRight} color="#39d353" formatAmount={formatAmount} />
        <StatCard title="Gastos Totales" amount={data?.expenses || 0} icon={ArrowDownRight} color="#f78166" formatAmount={formatAmount} />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div className="glass-card" style={{ flex: 2 }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Distribución de Gastos</h3>
          <div style={{ height: '350px' }}>
            {data?.categoryData?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8b949e' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8b949e' }} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Tooltip 
                    contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
                    itemStyle={{ color: '#f0f6fc' }}
                    formatter={(value: any) => [formatAmount(value), 'Gasto']}
                  />
                  <Bar dataKey="value" name="Gasto" radius={[4, 4, 0, 0]}>
                    {data.categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Otros']} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                No hay transacciones registradas para este periodo.
              </div>
            )}
          </div>
        </div>

        <div className="glass-card" style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Resumen por Categoría</h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || CATEGORY_COLORS[entry.name] || CATEGORY_COLORS['Otros']} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px' }}
                  formatter={(value: any) => formatAmount(value)}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
