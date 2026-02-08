import React, { useEffect, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Wallet, 
  Plus, 
  Loader2, 
  Download, 
  Calendar, 
  Zap, 
  Trash2,
  Settings as SettingsIcon,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { apiRequest } from '../../utils/api';
import { useSettings } from '../../context/SettingsContext';

interface Scenario {
  id: string;
  name: string;
  amount: number;
  year: number;
  type: 'one-time' | 'recurring';
  enabled: boolean;
}

const Projections = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: '1', name: 'Compra de Vehículo', amount: -15000000, year: 2026, type: 'one-time', enabled: false },
    { id: '2', name: 'Bono Anual Estimado', amount: 2000000, year: 2025, type: 'recurring', enabled: true },
  ]);
  
  // Simulation params
  const [annualRate, setAnnualRate] = useState(7); // 7% annual interest
  const [projectionYears, setProjectionYears] = useState(10);
  
  // Form for new scenario
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioAmount, setNewScenarioAmount] = useState('');
  const [newScenarioYear, setNewScenarioYear] = useState(new Date().getFullYear() + 1);
  const [newScenarioType, setNewScenarioType] = useState<'one-time' | 'recurring'>('one-time');

  const { formatAmount } = useSettings();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiRequest('/finance/dashboard');
        setData(result);
      } catch (error) {
        console.error('Error loading data for projections:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateProjections = () => {
    if (!data) return [];
    
    const currentBalance = data.balance || 0;
    const monthlySavings = data.income - data.expenses;
    const annualSavings = monthlySavings * 12;
    const monthlyRate = (annualRate / 100) / 12;
    
    const currentYear = new Date().getFullYear();
    const results = [];
    let runningBalance = currentBalance;

    for (let i = 0; i <= projectionYears * 12; i++) {
      const year = currentYear + Math.floor(i / 12);
      const month = i % 12;

      // Apply monthly growth and savings
      if (i > 0) {
        runningBalance = runningBalance * (1 + monthlyRate) + monthlySavings;
        
        // Apply scenarios
        scenarios.forEach(s => {
          if (!s.enabled) return;
          
          if (s.type === 'one-time') {
            // Apply one-time scenarios in June of the target year for simplicity
            if (s.year === year && month === 5) {
              runningBalance += s.amount;
            }
          } else if (s.type === 'recurring') {
            // Apply recurring scenarios annually in December
            if (year >= s.year && month === 11) {
              runningBalance += s.amount;
            }
          }
        });
      }

      // Record data point every December
      if (month === 11 || i === 0) {
        results.push({
          year: year.toString(),
          label: i === 0 ? 'Hoy' : year.toString(),
          balance: Math.round(runningBalance),
        });
      }
    }
    return results;
  };

  const projectionData = calculateProjections();
  const finalBalance = projectionData.length > 0 ? projectionData[projectionData.length - 1].balance : 0;
  const totalGrowth = finalBalance - (data?.balance || 0);

  const addScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScenarioName || !newScenarioAmount) return;

    const scenario: Scenario = {
      id: Math.random().toString(36).substr(2, 9),
      name: newScenarioName,
      amount: parseFloat(newScenarioAmount),
      year: parseInt(newScenarioYear.toString()),
      type: newScenarioType,
      enabled: true
    };

    setScenarios([...scenarios, scenario]);
    setNewScenarioName('');
    setNewScenarioAmount('');
  };

  const toggleScenario = (id: string) => {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const handleExportProjections = () => {
    const csvRows = [
      ['Año', 'Patrimonio Proyectado'],
      ...projectionData.map(d => [d.year, d.balance])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `proyeccion_financiera_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
        <Loader2 className="animate-spin" size={64} color="var(--accent-primary)" />
      </div>
    );
  }

  const monthlySavings = data.income - data.expenses;

  return (
    <div className="animate-fade-in">
      <header className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Planificación & Proyecciones</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Modelado inteligente de tu futuro financiero.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleExportProjections}
            style={{ 
              background: 'var(--bg-tertiary)', 
              color: 'var(--text-primary)', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </header>

      {/* Primary Stats */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ flex: 1, borderTop: '4px solid var(--accent-primary)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Patrimonio Estimado ({new Date().getFullYear() + projectionYears})</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0', color: 'var(--text-primary)' }}>
            {formatAmount(finalBalance)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: totalGrowth >= 0 ? 'var(--accent-secondary)' : 'var(--accent-danger)', fontSize: '0.875rem', fontWeight: '600' }}>
            <TrendingUp size={16} />
            Crecimiento de {formatAmount(totalGrowth)}
          </div>
        </div>

        <div className="glass-card" style={{ flex: 1, borderTop: '4px solid var(--accent-warning)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Capacidad de Ahorro Mensual</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0' }}>
            {formatAmount(monthlySavings)}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {data.income > 0 ? ((monthlySavings / data.income) * 100).toFixed(1) : 0}% de tus ingresos totales
          </div>
        </div>

        <div className="glass-card" style={{ flex: 1, borderTop: '4px solid var(--accent-secondary)' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Parámetros de Simulación</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rentabilidad</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input 
                  type="number" 
                  value={annualRate} 
                  onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
                  style={{ width: '50px', padding: '0.2rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', textAlign: 'right', fontWeight: 'bold', color: 'var(--accent-primary)' }}
                />
                <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>%</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Plazo (Años)</div>
              <select 
                value={projectionYears} 
                onChange={(e) => setProjectionYears(parseInt(e.target.value))}
                style={{ background: 'transparent', border: 'none', padding: '0.2rem 0', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {[5, 10, 15, 20, 30].map(y => <option key={y} value={y}>{y} años</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Main Chart */}
        <div className="glass-card" style={{ flex: 2 }}>
          <div className="flex-between" style={{ marginBottom: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Trayectoria de Capital</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Basado en interés compuesto y ahorros programados.</p>
            </div>
            <Target size={24} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
          </div>
          
          <div style={{ height: '420px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                  tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                  formatter={(val: any) => [formatAmount(val), 'Patrimonio']}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="var(--accent-primary)" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scenarios Sidebar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="var(--accent-warning)" />
              Eventos Significativos
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {scenarios.map((s) => (
                <div key={s.id} style={{ 
                  padding: '1rem', 
                  background: s.enabled ? 'var(--bg-tertiary)' : 'var(--bg-color)', 
                  borderRadius: '12px', 
                  border: '1px solid var(--border-color)',
                  opacity: s.enabled ? 1 : 0.6,
                  transition: 'all 0.2s'
                }}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{s.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="checkbox" 
                        checked={s.enabled} 
                        onChange={() => toggleScenario(s.id)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }} 
                      />
                      <button 
                        onClick={() => deleteScenario(s.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>{s.year} • {s.type === 'one-time' ? 'Una vez' : 'Recurrente'}</span>
                    <span style={{ color: s.amount >= 0 ? 'var(--accent-secondary)' : 'var(--accent-danger)', fontWeight: 'bold' }}>
                      {s.amount >= 0 ? '+' : ''}{formatAmount(s.amount)}
                    </span>
                  </div>
                </div>
              ))}
              {scenarios.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  No hay eventos simulados.
                </div>
              )}
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

            <form onSubmit={addScenario} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Añadir Nuevo Impacto</h4>
              <input 
                type="text" 
                placeholder="Ej: Inversión, Gasto Extra..." 
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                required
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="number" 
                  placeholder="Monto" 
                  value={newScenarioAmount}
                  onChange={(e) => setNewScenarioAmount(e.target.value)}
                  style={{ flex: 1.5 }}
                  required
                />
                <input 
                  type="number" 
                  value={newScenarioYear}
                  onChange={(e) => setNewScenarioYear(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select 
                  value={newScenarioType} 
                  onChange={(e) => setNewScenarioType(e.target.value as any)}
                  style={{ flex: 1, fontSize: '0.8rem' }}
                >
                  <option value="one-time">Único</option>
                  <option value="recurring">Recurrente (Anual)</option>
                </select>
                <button type="submit" className="btn-primary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plus size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2.5rem', background: 'linear-gradient(135deg, rgba(47, 129, 247, 0.05) 0%, transparent 100%)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ background: 'rgba(47, 129, 247, 0.1)', padding: '1rem', borderRadius: '12px' }}>
          <Lightbulb color="var(--accent-primary)" />
        </div>
        <div>
          <h4 style={{ marginBottom: '0.25rem' }}>Nota de Simulación</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Estas proyecciones son estimaciones matemáticas basadas en tus datos actuales y parámetros de mercado. 
            El rendimiento real puede variar según la inflación, cambios en el estilo de vida y volatilidad de inversiones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Projections;
