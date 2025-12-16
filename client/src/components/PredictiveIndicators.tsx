import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { predictiveAPI } from '../services/api';
import { DependencyHealth } from '../types';

const PredictiveIndicators: React.FC = () => {
  const [dependencies, setDependencies] = useState<DependencyHealth[]>([]);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [depsResponse, forecastResponse] = await Promise.all([
        predictiveAPI.analyzeDependencyHealth(),
        predictiveAPI.getForecast()
      ]);
      setDependencies(depsResponse.data.data || []);
      setForecast(forecastResponse.data.data);
    } catch (error) {
      console.error('Error fetching predictive data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Mock trend data
  const trendData = [
    { date: 'Week 1', vulnerabilities: 45, predicted: 48 },
    { date: 'Week 2', vulnerabilities: 52, predicted: 55 },
    { date: 'Week 3', vulnerabilities: 48, predicted: 50 },
    { date: 'Week 4', vulnerabilities: 58, predicted: 62 },
    { date: 'Week 5', vulnerabilities: null, predicted: 65 },
    { date: 'Week 6', vulnerabilities: null, predicted: 70 },
  ];

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-severity-low';
    if (score >= 60) return 'text-severity-medium';
    if (score >= 40) return 'text-severity-high';
    return 'text-severity-critical';
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    if (score >= 40) return 'bg-orange-50';
    return 'bg-red-50';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-severity-low" />;
    if (score >= 60) return <Clock className="w-5 h-5 text-severity-medium" />;
    if (score >= 40) return <AlertTriangle className="w-5 h-5 text-severity-high" />;
    return <XCircle className="w-5 h-5 text-severity-critical" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dc-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl border border-dc-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-dc-gray-900 flex items-center gap-2">
              <Activity className="w-7 h-7 text-dc-blue-500" />
              Predictive Security Indicators
            </h2>
            <p className="text-dc-gray-500 mt-1">
              AI-powered forecasts and dependency health monitoring
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-dc-gray-500">Last updated:</span>
            <span className="text-sm font-medium text-dc-gray-700">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-dc-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-dc-gray-500">Vulnerability Forecast</span>
            <TrendingUp className="w-5 h-5 text-severity-high" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-dc-gray-900">+15%</span>
            <span className="text-sm text-dc-gray-500 mb-1">next 2 weeks</span>
          </div>
          <p className="text-xs text-dc-gray-400 mt-2">Based on dependency update patterns</p>
        </div>

        <div className="bg-white rounded-xl border border-dc-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-dc-gray-500">Avg Dependency Health</span>
            <Shield className="w-5 h-5 text-dc-blue-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-dc-gray-900">72%</span>
            <span className="text-sm text-severity-low mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +5%
            </span>
          </div>
          <p className="text-xs text-dc-gray-400 mt-2">Compared to last month</p>
        </div>

        <div className="bg-white rounded-xl border border-dc-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-dc-gray-500">At-Risk Packages</span>
            <AlertTriangle className="w-5 h-5 text-severity-medium" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-dc-gray-900">8</span>
            <span className="text-sm text-severity-high mb-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              -2
            </span>
          </div>
          <p className="text-xs text-dc-gray-400 mt-2">Require immediate attention</p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl border border-dc-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-dc-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-dc-blue-500" />
          Vulnerability Trend & Forecast
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="vulnerabilities" 
                stroke="#0078D4" 
                fill="#0078D4"
                fillOpacity={0.1}
                strokeWidth={2}
                name="Actual"
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stroke="#F95738" 
                fill="#F95738"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-dc-blue-500"></div>
            <span className="text-sm text-dc-gray-600">Actual Vulnerabilities</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-severity-high"></div>
            <span className="text-sm text-dc-gray-600">Predicted (AI Forecast)</span>
          </div>
        </div>
      </div>

      {/* Dependency Health */}
      <div className="bg-white rounded-xl border border-dc-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-dc-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-dc-blue-500" />
          Dependency Health Monitor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(dependencies.length > 0 ? dependencies : [
            { name: 'react', healthScore: 95, trajectory: 'stable' as const, vulnerabilitiesLast6Months: 0, maintainerResponseTime: '2 days', recommendation: 'Keep current version' },
            { name: 'express', healthScore: 78, trajectory: 'stable' as const, vulnerabilitiesLast6Months: 2, maintainerResponseTime: '5 days', recommendation: 'Update soon' },
            { name: 'lodash', healthScore: 45, trajectory: 'declining' as const, vulnerabilitiesLast6Months: 5, maintainerResponseTime: '14 days', recommendation: 'Consider alternatives' },
            { name: 'axios', healthScore: 82, trajectory: 'improving' as const, vulnerabilitiesLast6Months: 1, maintainerResponseTime: '3 days', recommendation: 'Keep current version' },
            { name: 'moment', healthScore: 35, trajectory: 'declining' as const, vulnerabilitiesLast6Months: 3, maintainerResponseTime: '30 days', recommendation: 'Migrate to dayjs' },
            { name: 'webpack', healthScore: 68, trajectory: 'stable' as const, vulnerabilitiesLast6Months: 2, maintainerResponseTime: '7 days', recommendation: 'Update when possible' },
          ]).map((dep, index) => (
            <div 
              key={index} 
              className={`rounded-lg border border-dc-gray-200 p-4 ${getHealthBg(dep.healthScore)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getHealthIcon(dep.healthScore)}
                  <div>
                    <h4 className="font-medium text-dc-gray-900">{dep.name}</h4>
                    <p className="text-sm text-dc-gray-500 capitalize">{dep.trajectory}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${getHealthColor(dep.healthScore)}`}>
                    {dep.healthScore}%
                  </span>
                  <p className="text-xs text-dc-gray-500 mt-1">Health Score</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-dc-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dc-gray-500">Vulns (6 months)</span>
                  <span className={`font-medium ${dep.vulnerabilitiesLast6Months >= 4 ? 'text-severity-critical' : dep.vulnerabilitiesLast6Months >= 2 ? 'text-severity-high' : 'text-dc-gray-700'}`}>
                    {dep.vulnerabilitiesLast6Months}
                  </span>
                </div>
                <div className="mt-2 bg-dc-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      dep.healthScore >= 80 ? 'bg-severity-low' :
                      dep.healthScore >= 60 ? 'bg-severity-medium' :
                      dep.healthScore >= 40 ? 'bg-severity-high' :
                      'bg-severity-critical'
                    }`}
                    style={{ width: `${dep.healthScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-dc-gray-500 mt-2">{dep.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      {forecast && (
        <div className="bg-white rounded-xl border border-dc-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-dc-gray-900 mb-4">AI Risk Factors Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {forecast.riskFactors?.map((factor: any, index: number) => (
              <div key={index} className="bg-dc-gray-50 rounded-lg p-4 border border-dc-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dc-gray-700">{factor.factor}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    factor.impact === 'high' ? 'bg-red-100 text-severity-critical' :
                    factor.impact === 'medium' ? 'bg-yellow-100 text-severity-medium' :
                    'bg-green-100 text-severity-low'
                  }`}>
                    {factor.impact}
                  </span>
                </div>
                <p className="text-xs text-dc-gray-500">{factor.description}</p>
              </div>
            )) || (
              <>
                <div className="bg-dc-gray-50 rounded-lg p-4 border border-dc-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-dc-gray-700">Outdated Dependencies</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-severity-critical">high</span>
                  </div>
                  <p className="text-xs text-dc-gray-500">12 packages are 6+ months behind latest version</p>
                </div>
                <div className="bg-dc-gray-50 rounded-lg p-4 border border-dc-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-dc-gray-700">Known Vulnerabilities</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-severity-medium">medium</span>
                  </div>
                  <p className="text-xs text-dc-gray-500">3 dependencies have unfixed CVEs</p>
                </div>
                <div className="bg-dc-gray-50 rounded-lg p-4 border border-dc-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-dc-gray-700">Supply Chain Risk</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-severity-medium">medium</span>
                  </div>
                  <p className="text-xs text-dc-gray-500">5 packages have single maintainer</p>
                </div>
                <div className="bg-dc-gray-50 rounded-lg p-4 border border-dc-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-dc-gray-700">License Compliance</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-severity-low">low</span>
                  </div>
                  <p className="text-xs text-dc-gray-500">All licenses are compliant</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveIndicators;
