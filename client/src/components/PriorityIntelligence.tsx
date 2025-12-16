import React, { useState, useEffect } from 'react';
import {
  Zap,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  ArrowRight,
  Package,
  Shield,
  Target,
  Lightbulb
} from 'lucide-react';
import { priorityAPI } from '../services/api';
import { ActionPlan } from '../types';

const PriorityIntelligence: React.FC = () => {
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchActionPlan();
  }, []);

  const fetchActionPlan = async () => {
    try {
      const response = await priorityAPI.getActionPlan('v2.3.4');
      setActionPlan(response.data.actionPlan);
    } catch (error) {
      console.error('Error fetching action plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const runPriorityAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await priorityAPI.analyzePriority();
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error('Error running priority analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
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
            <Target className="w-7 h-7 text-dc-blue-500" />
            Contextual Priority Intelligence
          </h2>
          <p className="text-dc-gray-500 mt-1">
            AI-generated action plan with prioritized remediation steps
          </p>
        </div>
        <button
          onClick={runPriorityAnalysis}
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
              <Zap className="w-5 h-5" />
              Generate AI Plan
            </>
          )}
        </button>
      </div>

      {/* Summary Card */}
      {actionPlan && (
        <div className="bg-gradient-to-r from-dc-blue-50 to-dc-blue-100 rounded-xl p-6 border border-dc-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-dc-blue-500" />
            <h3 className="text-xl font-semibold text-dc-gray-900">Action Plan for Release {actionPlan.releaseId}</h3>
          </div>
          <p className="text-dc-gray-600">{actionPlan.summary}</p>
          <div className="flex gap-4 mt-4 text-sm">
            <span className="text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> {actionPlan.actions.urgent.length} Urgent
            </span>
            <span className="text-orange-400 flex items-center gap-1">
              <Clock className="w-4 h-4" /> {actionPlan.actions.highPriority.length} High Priority
            </span>
            <span className="text-yellow-400 flex items-center gap-1">
              <Package className="w-4 h-4" /> {actionPlan.actions.medium.length} Medium
            </span>
            <span className="text-gray-400 flex items-center gap-1">
              <Eye className="w-4 h-4" /> {actionPlan.actions.monitor.length} Monitor
            </span>
          </div>
        </div>
      )}

      {/* URGENT Section */}
      {actionPlan?.actions.urgent && actionPlan.actions.urgent.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-severity-critical flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            URGENT - Fix Before Release
          </h3>
          {actionPlan.actions.urgent.map((item: any) => (
            <div 
              key={item.id}
              className="bg-red-50 border border-red-200 rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-severity-critical text-white text-xs px-2 py-1 rounded font-bold">
                      CRITICAL
                    </span>
                    <span className="text-dc-gray-900 font-semibold">{item.id}</span>
                    <span className="text-dc-gray-400">in</span>
                    <span className="text-dc-blue-600 font-mono">{item.package}</span>
                  </div>
                  <p className="text-dc-gray-600 mb-3">{item.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-dc-gray-500">Current:</span>
                      <span className="text-severity-critical ml-2 font-mono">{item.currentVersion}</span>
                    </div>
                    <div>
                      <span className="text-dc-gray-500">Fix:</span>
                      <span className="text-severity-low ml-2 font-mono">{item.fixVersion}</span>
                    </div>
                    <div>
                      <span className="text-dc-gray-500">Time:</span>
                      <span className="text-dc-gray-900 ml-2">{item.estimatedHours}h</span>
                    </div>
                    <div>
                      <span className="text-dc-gray-500">Affects:</span>
                      <span className="text-dc-gray-900 ml-2">{item.affectedModule}</span>
                    </div>
                  </div>

                  <div className="bg-red-100 p-3 rounded-lg mb-4">
                    <span className="text-severity-critical font-semibold">⚠️ Risk if ignored: </span>
                    <span className="text-red-700">{item.riskIfIgnored}</span>
                  </div>

                  <button 
                    onClick={() => toggleExpand(item.id)}
                    className="text-dc-blue-500 hover:text-dc-blue-600 flex items-center gap-1 text-sm"
                  >
                    {expandedItems.has(item.id) ? 'Hide' : 'Show'} fix steps
                    <ArrowRight className={`w-4 h-4 transform transition-transform ${
                      expandedItems.has(item.id) ? 'rotate-90' : ''
                    }`} />
                  </button>

                  {expandedItems.has(item.id) && item.fixSteps && (
                    <div className="mt-4 space-y-2">
                      {item.fixSteps.map((step: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 text-dc-gray-600">
                          <span className="bg-dc-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                            {index + 1}
                          </span>
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HIGH PRIORITY Section */}
      {actionPlan?.actions.highPriority && actionPlan.actions.highPriority.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-severity-high flex items-center gap-2">
            <Clock className="w-5 h-5" />
            HIGH PRIORITY - Fix Within 48 Hours Post-Release
          </h3>
          {actionPlan.actions.highPriority.map((item: any) => (
            <div 
              key={item.id}
              className="bg-orange-50 border border-orange-200 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-severity-high text-white text-xs px-2 py-1 rounded font-bold">
                  HIGH
                </span>
                <span className="text-dc-gray-900 font-semibold">{item.id}</span>
                <span className="text-dc-gray-400">in</span>
                <span className="text-dc-blue-600 font-mono">{item.package}</span>
              </div>
              <p className="text-dc-gray-600 mb-3">{item.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-dc-gray-500">Current:</span>
                  <span className="text-severity-high ml-2 font-mono">{item.currentVersion}</span>
                </div>
                <div>
                  <span className="text-dc-gray-500">Fix:</span>
                  <span className="text-severity-low ml-2 font-mono">{item.fixVersion}</span>
                </div>
                <div>
                  <span className="text-dc-gray-500">Time:</span>
                  <span className="text-dc-gray-900 ml-2">{item.estimatedHours}h</span>
                </div>
                <div>
                  <span className="text-dc-gray-500">Affects:</span>
                  <span className="text-dc-gray-900 ml-2">{item.affectedModule}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MEDIUM Section */}
      {actionPlan?.actions.medium && actionPlan.actions.medium.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-severity-medium flex items-center gap-2">
            <Package className="w-5 h-5" />
            MEDIUM - Address in Next Sprint
          </h3>
          {actionPlan.actions.medium.map((item: any, index: number) => (
            <div 
              key={index}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-severity-medium text-black text-xs px-2 py-1 rounded font-bold">
                  GROUPED
                </span>
                <span className="text-dc-gray-900 font-semibold">{item.ids?.join(', ')}</span>
              </div>
              <p className="text-dc-gray-600 mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {item.packages?.map((pkg: string) => (
                  <span key={pkg} className="bg-dc-gray-100 text-dc-gray-700 px-2 py-1 rounded text-sm font-mono">
                    {pkg}
                  </span>
                ))}
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-dc-gray-500">Time:</span>
                  <span className="text-dc-gray-900 ml-2">{item.estimatedHours}h</span>
                </div>
                <div>
                  <span className="text-dc-gray-500">Exploit Probability:</span>
                  <span className="text-severity-low ml-2">{item.exploitProbability}</span>
                </div>
              </div>
              <div className="mt-3 text-dc-gray-500 text-sm">
                💡 {item.notes}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MONITOR Section */}
      {actionPlan?.actions.monitor && actionPlan.actions.monitor.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-dc-gray-500 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            MONITOR - No Immediate Action Required
          </h3>
          <div className="bg-white border border-dc-gray-200 rounded-xl p-5">
            <div className="space-y-3">
              {actionPlan.actions.monitor.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-dc-gray-200 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-dc-gray-500 font-mono">{item.id}</span>
                    <span className="text-dc-gray-400">in</span>
                    <span className="text-dc-gray-700 font-mono">{item.package}</span>
                  </div>
                  <span className="text-dc-gray-500 text-sm">{item.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {actionPlan?.quickWins && actionPlan.quickWins.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-severity-low flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5" />
            Quick Wins - Easy Fixes with High Impact
          </h3>
          <div className="space-y-3">
            {actionPlan.quickWins.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between bg-white border border-dc-gray-200 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-severity-low" />
                  <div>
                    <span className="text-dc-gray-900 font-mono">{item.package}</span>
                    <span className="text-dc-gray-500 text-sm ml-2">{item.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-dc-gray-500 text-sm">{item.estimatedMinutes} min</span>
                  <span className="bg-green-100 text-severity-low px-3 py-1 rounded-full text-sm">
                    {item.riskReduction} risk reduction
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Analysis Results */}
      {analysis && (
        <div className="bg-white border border-dc-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-dc-gray-900 mb-4">AI Priority Analysis</h3>
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

export default PriorityIntelligence;
