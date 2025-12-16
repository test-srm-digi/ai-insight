import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Brain,
  RefreshCw
} from 'lucide-react';
import { riskAnalysisAPI } from '../services/api';
import { RiskScore } from '../types';

const RiskAnalysis: React.FC = () => {
  const [riskScore, setRiskScore] = useState<RiskScore | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchRiskScore();
  }, []);

  const fetchRiskScore = async () => {
    try {
      const response = await riskAnalysisAPI.getRiskScore('v2.3.4');
      setRiskScore(response.data.data);
    } catch (error) {
      console.error('Error fetching risk score:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await riskAnalysisAPI.analyzeRelease();
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-severity-low';
    if (score >= 60) return 'text-severity-medium';
    if (score >= 40) return 'text-severity-high';
    return 'text-severity-critical';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    if (score >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case 'GO': return 'bg-green-100 text-green-800 border-green-200';
      case 'CONDITIONAL GO': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'NO-GO': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-dc-gray-100 text-dc-gray-800 border-dc-gray-200';
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dc-gray-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-dc-blue-500" />
            Release Risk Analysis
          </h2>
          <p className="text-dc-gray-500 mt-1">
            AI-powered security assessment for release v2.3.4
          </p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={analyzing}
          className="px-4 py-2 bg-dc-blue-500 hover:bg-dc-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
          {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </button>
      </div>

      {/* Risk Score Card */}
      <div className="bg-white rounded-xl border border-dc-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getScoreBg(riskScore?.overallScore || 65)} flex items-center justify-center shadow-lg`}>
              <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(riskScore?.overallScore || 65)}`}>
                  {riskScore?.overallScore || 65}
                </span>
                <span className="text-dc-gray-500 text-sm">Risk Score</span>
              </div>
            </div>
            <div className={`mt-4 px-4 py-2 rounded-full font-semibold border ${getRecommendationStyle(riskScore?.recommendation || 'CONDITIONAL GO')}`}>
              {riskScore?.recommendation || 'CONDITIONAL GO'}
            </div>
          </div>

          {/* Vulnerability Breakdown */}
          <div className="space-y-4">
            <h3 className="font-semibold text-dc-gray-900">Vulnerability Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-severity-critical"></div>
                  <span className="text-dc-gray-700">Critical</span>
                </div>
                <span className="font-bold text-severity-critical">{riskScore?.breakdown.criticalVulns || 3}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-severity-high"></div>
                  <span className="text-dc-gray-700">High</span>
                </div>
                <span className="font-bold text-severity-high">{riskScore?.breakdown.highVulns || 8}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-severity-medium"></div>
                  <span className="text-dc-gray-700">Medium</span>
                </div>
                <span className="font-bold text-yellow-600">{riskScore?.breakdown.mediumVulns || 15}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-severity-low"></div>
                  <span className="text-dc-gray-700">Low</span>
                </div>
                <span className="font-bold text-severity-low">{riskScore?.breakdown.lowVulns || 12}</span>
              </div>
            </div>
          </div>

          {/* Trend Comparison */}
          <div className="space-y-4">
            <h3 className="font-semibold text-dc-gray-900">vs Previous Release</h3>
            <div className="bg-dc-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {(riskScore?.comparison.percentChange || -5) < 0 ? (
                  <TrendingDown className="w-5 h-5 text-severity-low" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-severity-high" />
                )}
                <span className={`text-2xl font-bold ${(riskScore?.comparison.percentChange || -5) < 0 ? 'text-severity-low' : 'text-severity-high'}`}>
                  {Math.abs(riskScore?.comparison.percentChange || 5)}%
                </span>
              </div>
              <p className="text-dc-gray-600 text-sm">
                {(riskScore?.comparison.percentChange || -5) < 0 ? 'Improved' : 'Increased'} risk since v2.3.3
              </p>
            </div>
            <div className="text-sm text-dc-gray-500">
              <div className="flex justify-between">
                <span>Previous Score:</span>
                <span className="font-medium text-dc-gray-700">{riskScore?.comparison.previousRelease || 70}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-xl border border-dc-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-dc-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-dc-blue-500" />
          Executive Summary
        </h3>
        <div className="prose max-w-none text-dc-gray-700">
          <p className="mb-4">
            Release <strong>v2.3.4</strong> has been analyzed for security vulnerabilities. 
            The overall risk score is <strong className={getScoreColor(riskScore?.overallScore || 65)}>
            {riskScore?.overallScore || 65}/100</strong>, indicating a <strong>{riskScore?.severity || 'moderate'}</strong> risk level.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-severity-critical mt-0.5 flex-shrink-0" />
              <span><strong>{riskScore?.breakdown.criticalVulns || 3} critical vulnerabilities</strong> require immediate attention before release.</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-severity-high mt-0.5 flex-shrink-0" />
              <span><strong>{riskScore?.breakdown.highVulns || 8} high-severity issues</strong> should be addressed within 7 days.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-severity-low mt-0.5 flex-shrink-0" />
              <span>Risk has <strong>improved by 5%</strong> compared to the previous release.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl border border-dc-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-dc-gray-900 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-dc-blue-500" />
          AI-Powered Insights
        </h3>
        {analysis ? (
          <div className="space-y-4">
            <div className="bg-dc-blue-50 border border-dc-blue-200 rounded-lg p-4">
              <p className="text-dc-gray-800">{analysis}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-dc-gray-50 rounded-lg p-4 border border-dc-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-severity-critical" />
                <span className="font-medium text-dc-gray-900">Critical Finding</span>
              </div>
              <p className="text-sm text-dc-gray-600">
                CVE-2024-1234 in lodash affects authentication flow. Exploit available in the wild.
                Upgrade to lodash@4.17.21 immediately.
              </p>
            </div>
            <div className="bg-dc-gray-50 rounded-lg p-4 border border-dc-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-severity-high" />
                <span className="font-medium text-dc-gray-900">Supply Chain Risk</span>
              </div>
              <p className="text-sm text-dc-gray-600">
                3 transitive dependencies have known vulnerabilities. Review dependency tree for axios and moment.
              </p>
            </div>
            <div className="bg-dc-gray-50 rounded-lg p-4 border border-dc-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-dc-blue-500" />
                <span className="font-medium text-dc-gray-900">Positive Trend</span>
              </div>
              <p className="text-sm text-dc-gray-600">
                Security debt has decreased by 15% this sprint. Team is addressing vulnerabilities faster than new ones are discovered.
              </p>
            </div>
            <div className="bg-dc-gray-50 rounded-lg p-4 border border-dc-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-severity-low" />
                <span className="font-medium text-dc-gray-900">Quick Win Available</span>
              </div>
              <p className="text-sm text-dc-gray-600">
                Updating express from 4.18.0 to 4.18.2 will resolve 2 high and 3 medium vulnerabilities with minimal risk.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recommendation */}
      <div className={`rounded-xl p-6 border ${
        riskScore?.recommendation === 'GO' ? 'bg-green-50 border-green-200' :
        riskScore?.recommendation === 'NO-GO' ? 'bg-red-50 border-red-200' :
        'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            riskScore?.recommendation === 'GO' ? 'bg-green-100' :
            riskScore?.recommendation === 'NO-GO' ? 'bg-red-100' :
            'bg-yellow-100'
          }`}>
            {riskScore?.recommendation === 'GO' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : riskScore?.recommendation === 'NO-GO' ? (
              <XCircle className="w-6 h-6 text-red-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              riskScore?.recommendation === 'GO' ? 'text-green-800' :
              riskScore?.recommendation === 'NO-GO' ? 'text-red-800' :
              'text-yellow-800'
            }`}>
              Release Recommendation: {riskScore?.recommendation || 'CONDITIONAL GO'}
            </h3>
            <p className={`mt-1 ${
              riskScore?.recommendation === 'GO' ? 'text-green-700' :
              riskScore?.recommendation === 'NO-GO' ? 'text-red-700' :
              'text-yellow-700'
            }`}>
              {riskScore?.recommendation === 'GO' 
                ? 'This release meets security standards and is cleared for deployment.'
                : riskScore?.recommendation === 'NO-GO'
                ? 'Critical vulnerabilities must be resolved before this release can proceed.'
                : 'This release can proceed with conditions. Address critical vulnerabilities within 48 hours post-release.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
