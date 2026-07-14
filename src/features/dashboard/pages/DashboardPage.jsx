
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, AreaChart, Area, RadialBarChart, RadialBar, } from 'recharts';
import { Building2, Users, TrendingUp, Award, ArrowUpRight, ArrowDownRight } 
from 'lucide-react';
import { departmentsAPI, mockDepartments, employeesFullAPI, mockEmployees }
 from '../../../api.js';
import './dashboard.css';

const COLORS = {
  primary:  '#1a4b8c',
  light:    '#2563b0',
  accent:   '#e8a020',
  success:  '#16a34a',
  danger:   '#dc2626',
  muted:    '#8a96ad',
  blue1:    '#1a4b8c',
  blue2:    '#2563b0',
  blue3:    '#3b82f6',
  blue4:    '#93c5fd',
  green:    '#22c55e',
  yellow:   '#f59e0b',
  red:      '#ef4444',
};

function KpiCard({ icon: Icon, value, label, sub, trend, color }) {
  const up = trend >= 0;
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: color + '18', color }}>
        <Icon size={22} />
      </div>
      <div className="kpi-body">
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
        {sub !== undefined && (
          <div className={`kpi-trend ${up ? 'kpi-trend--up' : 'kpi-trend--down'}`}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}% {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label && <p className="chart-tooltip__label">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const [depts, setDepts]   = useState([]);
  const [emps, setEmps]     = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [d, e] = await Promise.all([
        departmentsAPI.getAll(),
        employeesFullAPI.getAll(),
      ]);
      setDepts(Array.isArray(d) ? d : d.data || []);
      setEmps(Array.isArray(e) ? e : e.data || []);
    } catch {
      setDepts(mockDepartments);
      setEmps(mockEmployees);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return (
    <div className="dash-loading">
      <div className="spinner" />
    </div>
  );

  const totalDepts    = depts.length;
  const totalEmps     = emps.length;
  const activeEmps    = emps.filter(e => e.status === 'active').length;
  const avgAchievement = depts.length
    ? Math.round(depts.reduce((s, d) => s + (d.achievement || 0), 0) / depts.length)
    : 0;

  const deptBarData = depts.map(d => ({
    name:        d.nameAr?.replace('قسم ', '') || d.nameEn,
    موظفون:      d.employeeCount || 0,
    إنجاز:       d.achievement   || 0,
  }));

  const deptPieData = depts.map((d, i) => ({
    name:  d.nameAr?.replace('قسم ', '') || d.nameEn,
    value: d.employeeCount || 0,
    fill:  [COLORS.blue1, COLORS.blue2, COLORS.blue3, COLORS.blue4,
            COLORS.accent, COLORS.success, COLORS.danger][i % 7],
  }));

  const above = depts.filter(d => (d.achievement || 0) > 50).length;
  const below = depts.filter(d => (d.achievement || 0) < 50).length;
  const exact = depts.filter(d => (d.achievement || 0) === 50).length;

  const achievePie = [
    { name: t('dashboard.above50'), value: above, fill: COLORS.success },
    { name: t('dashboard.below50'), value: below, fill: COLORS.red },
    { name: t('dashboard.exactly50'), value: exact, fill: COLORS.yellow },
  ].filter(d => d.value > 0);

  const areaData = depts.map(d => {
    const deptEmps = emps.filter(e => String(e.departmentId) === String(d.id));
    return {
      name:    d.nameAr?.replace('قسم ', '') || d.nameEn,
      نشطون:   deptEmps.filter(e => e.status === 'active').length,
      غيرنشط:  deptEmps.filter(e => e.status !== 'active').length,
    };
  });

  const radialData = [...depts]
    .sort((a, b) => (b.achievement || 0) - (a.achievement || 0))
    .slice(0, 5)
    .map((d, i) => ({
      name:  d.nameAr?.replace('قسم ', '') || d.nameEn,
      value: d.achievement || 0,
      fill:  [COLORS.blue1, COLORS.blue2, COLORS.blue3, COLORS.accent, COLORS.success][i],
    }));

  const topDepts = [...depts].sort((a, b) => (b.achievement || 0) - (a.achievement || 0));

  return (
    <div className="dashboard">

      <div className="page-top" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-sub">{t('dashboard.subtitle')}</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard
          icon={Building2}
          value={totalDepts}
          label={t('dashboard.totalDepts')}
          trend={8} sub="هذا الشهر"
          color={COLORS.primary}
        />
        <KpiCard
          icon={Users}
          value={totalEmps}
          label={t('dashboard.totalEmps')}
          trend={12} sub="هذا الشهر"
          color={COLORS.blue3}
        />
        <KpiCard
          icon={TrendingUp}
          value={activeEmps}
          label={t('dashboard.activeEmps')}
          trend={5} sub="هذا الشهر"
          color={COLORS.success}
        />
        <KpiCard
          icon={Award}
          value={`${avgAchievement}%`}
          label={t('dashboard.avgAchievement')}
          trend={avgAchievement >= 50 ? 3 : -2} sub="مقارنة بالشهر"
          color={avgAchievement >= 50 ? COLORS.success : COLORS.danger}
        />
      </div>

      <div className="dash-row">

        <div className="dash-card dash-card--wide">
          <div className="dash-card__header">
            <h3 className="dash-card__title">{t('dashboard.deptPerformance')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptBarData} margin={{ top: 8, right: 16, left: -10, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Cairo', fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: 12 }} />
              <Bar dataKey="موظفون" fill={COLORS.blue2} radius={[4,4,0,0]} />
              <Bar dataKey="إنجاز"  fill={COLORS.accent} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title">{t('dashboard.empsByDept')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={deptPieData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {deptPieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                wrapperStyle={{ fontFamily: 'Cairo', fontSize: 11 }}
                iconType="circle" iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="dash-row">

        {/* Area Chart — نشط/غير نشط */}
        <div className="dash-card dash-card--wide">
          <div className="dash-card__header">
            <h3 className="dash-card__title">{t('dashboard.empDistribution') || 'توزيع الموظفين'}</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={areaData} margin={{ top: 8, right: 16, left: -10, bottom: 8 }}>
              <defs>
                <linearGradient id="gradActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={COLORS.success} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradInactive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={COLORS.danger} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: 'Cairo', fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Cairo', fontSize: 12 }} />
              <Area type="monotone" dataKey="نشطون"  stroke={COLORS.success} fill="url(#gradActive)"   strokeWidth={2} />
              <Area type="monotone" dataKey="غيرنشط" stroke={COLORS.danger}  fill="url(#gradInactive)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title">{t('dashboard.achievementStatus')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={achievePie}
                cx="50%" cy="50%"
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
                labelLine={false}
              >
                {achievePie.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="dash-row">

        <div className="dash-card">
          <div className="dash-card__header">
            <h3 className="dash-card__title">{t('dashboard.topDepts')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <RadialBarChart
              cx="50%" cy="50%"
              innerRadius="20%" outerRadius="90%"
              data={radialData}
              startAngle={180} endAngle={0}
            >
              <RadialBar
                minAngle={15}
                background={{ fill: 'var(--surface-2)' }}
                dataKey="value"
                label={{ position: 'insideStart', fill: '#fff', fontSize: 11 }}
              />
              <Legend
                iconType="circle" iconSize={8}
                wrapperStyle={{ fontFamily: 'Cairo', fontSize: 11 }}
              />
              <Tooltip content={<ChartTooltip />} formatter={(v) => `${v}%`} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <div className="dash-card dash-card--wide">
          <div className="dash-card__header">
            <h3 className="dash-card__title">{t('dashboard.topDepts')}</h3>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('dashboard.dept')}</th>
                  <th>{t('dashboard.manager')}</th>
                  <th>{t('dashboard.empCount')}</th>
                  <th>{t('dashboard.achievement')}</th>
                </tr>
              </thead>
              <tbody>
                {topDepts.map((d, i) => {
                  const val = d.achievement || 0;
                  const [bg, color] =
                    val < 50  ? ['#fee2e2','#b91c1c'] :
                    val === 50 ? ['#fef9c3','#854d0e'] :
                                 ['#dcfce7','#15803d'];
                  return (
                    <tr key={d.id}>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{d.nameAr}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.nameEn}</div>
                      </td>
                      <td>
                        <div className="manager-cell">
                          <span className="manager-avatar" style={{ width: 26, height: 26, fontSize: 11 }}>
                            {d.manager?.[0] || '؟'}
                          </span>
                          {d.manager}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                        {d.employeeCount || 0}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          background: bg, color,
                          fontWeight: 700, fontSize: 12,
                          padding: '3px 10px', borderRadius: 6,
                        }}>
                          {val}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

export default DashboardPage;
