import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertCircle,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { securityDebtAPI } from '../services/api';
import { SecurityDebtData } from '../types';

const SEVERITY_COLORS = {
  critical: '#B63A21',
  high: '#F95738',
  medium: '#F8CB5D',
  low: '#22c55e'
};

const SecurityDebtDashboard: React.FC = () => {
  const [debtData, setDebtData] = useState<SecurityDebtData | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await securityDebtAPI.getDashboard();
      setDebtData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await securityDebtAPI.analyzeDebt(debtData);
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || !debtData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dc-blue-500"></div>
      </div>
    );
  }

  const severityPieData = [
    { name: 'Critical', value: debtData.bySeverity.critical, color: SEVERITY_COLORS.critical },
    { name: 'High', value: debtData.bySeverity.high, color: SEVERITY_COLORS.high },
    { name: 'Medium', value: debtData.bySeverity.medium, color: SEVERITY_COLORS.medium },
    { name: 'Low', value: debtData.bySeverity.low, color: SEVERITY_COLORS.low },
  ];

  const ageData = [
    { name: '<30 days', value: debtData.byAge.lessThan30Days, color: '#22c55e' },
    { name: '30-60 days', value: debtData.byAge.thirtyTo60Days, color: '#f59e0b' },
    { name: '60-90 days', value: debtData.byAge.sixtyTo90Days, color: '#ea580c' },
    { name: '>90 days', value: debtData.byAge.moreThan90Days, color: '#dc2626' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dc-gray-900 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-dc-blue-500" />
            Security Debt Insights
          </h2>
          <p className="text-dc-gray-500 mt-1">
            AI-powered analysis of your security debt over time
          </p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="px-6 py-3 bg-dc-blue-500 hover:bg-dc-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              AI Insights
            </>
          )}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-dc-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <AlertCircle className="w-8 h-8 text-severity-critical" />
            <span className="text-severity-critical text-sm flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> +5.8%
            </span>
          </div>
          <div className="text-3xl font-bold text-dc-gray-900 mt-3">{debtData.totalVulnerabilities}</div>
          <div className="text-dc-gray-500 text-sm">Total Vulnerabilities</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-dc-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <Clock className="w-8 h-8 text-severity-high" />
            <span className="text-severity-high text-sm flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> Critical
            </span>
          </div>
          <div className="text-3xl font-bold text-dc-gray-900 mt-3">{debtData.byAge.moreThan90Days}</div>
          <div className="text-dc-gray-500 text-sm">Older than 90 days</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-dc-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <Target className="w-8 h-8 text-severity-medium" />
            <span className="text-severity-critical text-sm flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4" /> -30%
            </span>
          </div>
          <div className="text-3xl font-bold text-dc-gray-900 mt-3">{debtData.fixRate.current}</div>
          <div className="text-dc-gray-500 text-sm">Monthly Fix Rate</div>
          <div className="text-xs text-dc-gray-400 mt-1">Target: {debtData.fixRate.target}</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-dc-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <DollarSign className="w-8 h-8 text-severity-low" />
            <span className="text-dc-gray-500 text-sm">Estimated</span>
          </div>
          <div className="text-3xl font-bold text-dc-gray-900 mt-3">
            ${(debtData.estimatedCost.dollarAmount / 1000).toFixed(0)}K
          </div>
          <div className="text-dc-gray-500 text-sm">Cost to Remediate</div>
          <div className="text-xs text-dc-gray-400 mt-1">{debtData.estimatedCost.hours} hours</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-white rounded-xl p-6 border border-dc-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-dc-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-dc-blue-500" />
            Vulnerability Trend (6 Months)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={debtData.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#0078D4" 
                fill="#0078D4" 
                fillOpacity={0.1}
                name="Total"
              />
              <Area 
                type="monotone" 
                dataKey="new" 
                stroke="#F95738" 
                fill="#F95738" 
                fillOpacity={0.1}
                name="New"
              />
              <Area 
                type="monotone" 
                dataKey="fixed" 
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.1}
                name="Fixed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-xl p-6 border border-dc-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-dc-gray-900 mb-4">Severity Distribution</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={severityPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {severityPieData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-dc-gray-600">{item.name}</span>
                  <span className="text-dc-gray-900 font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-white rounded-xl p-6 border border-dc-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-dc-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-severity-high" />
          Aging Analysis
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ageData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" />
            <YAxis type="category" dataKey="name" stroke="#6B7280" width={100} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {ageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-severity-high">
            ⚠️ You have <span className="font-bold">{debtData.byAge.moreThan90Days} vulnerabilities</span> older 
            than 90 days, including <span className="font-bold text-severity-critical">{debtData.bySeverity.critical} critical</span> ones 
            that need immediate attention.
          </p>
        </div>
      </div>

      {/* AI Prediction */}
      <div className="bg-gradient-to-r from-dc-blue-50 to-dc-blue-100 rounded-xl p-6 border border-dc-blue-200">
        <h3 className="text-xl font-semibold text-dc-gray-900 mb-3">🔮 AI Prediction</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-dc-gray-500 text-sm">Accumulation Rate</div>
            <div className="text-2xl font-bold text-severity-critical">
              20% faster
            </div>
            <div className="text-dc-gray-400 text-sm">than remediation</div>
          </div>
          <div>
            <div className="text-dc-gray-500 text-sm">Projected Q2 Vulnerabilities</div>
            <div className="text-2xl font-bold text-severity-high">
              {debtData.projectedQ2}
            </div>
            <div className="text-dc-gray-400 text-sm">at current pace</div>
          </div>
          <div>
            <div className="text-dc-gray-500 text-sm">To Stabilize</div>
            <div className="text-2xl font-bold text-severity-low">
              35/month
            </div>
            <div className="text-dc-gray-400 text-sm">fixes required</div>
          </div>
        </div>
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-xl p-6 border border-dc-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-dc-gray-900 mb-4">AI Analysis Results</h3>
          <pre className="whitespace-pre-wrap text-dc-gray-700 text-sm bg-dc-gray-50 p-4 rounded-lg overflow-x-auto">
            {typeof analysis === 'object' && analysis.raw 
              ? analysis.raw 
              : JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SecurityDebtDashboard;
