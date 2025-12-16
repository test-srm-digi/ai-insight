import React, { useState } from 'react';
import {
  Download,
  FileText,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader,
  Eye,
  FileDown
} from 'lucide-react';
import { reportsAPI } from '../services/api';

interface Report {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'executive' | 'vulnerability' | 'compliance' | 'trend' | 'dependency';
}

const ReportCenter: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [generating, setGenerating] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);

  const reports: Report[] = [
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'High-level overview of security posture for leadership',
      icon: <Shield className="w-6 h-6" />,
      type: 'executive'
    },
    {
      id: 'vulnerability',
      name: 'Vulnerability Report',
      description: 'Detailed list of all vulnerabilities with remediation steps',
      icon: <AlertTriangle className="w-6 h-6" />,
      type: 'vulnerability'
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Security compliance status and audit findings',
      icon: <CheckCircle className="w-6 h-6" />,
      type: 'compliance'
    },
    {
      id: 'trend',
      name: 'Trend Analysis',
      description: 'Historical security trends and predictions',
      icon: <TrendingUp className="w-6 h-6" />,
      type: 'trend'
    },
    {
      id: 'dependency',
      name: 'Dependency Health Report',
      description: 'Status of all dependencies and recommended updates',
      icon: <Clock className="w-6 h-6" />,
      type: 'dependency'
    }
  ];

  const generateReport = async (report: Report) => {
    setSelectedReport(report);
    setGenerating(true);
    setReportContent(null);

    try {
      let response;
      switch (report.type) {
        case 'executive':
          response = await reportsAPI.generateExecutiveSummary(undefined, true);
          break;
        case 'vulnerability':
          response = await reportsAPI.generateVulnerabilityReport(undefined, true);
          break;
        case 'compliance':
          response = await reportsAPI.generateActionPlan();
          break;
        case 'trend':
          response = await reportsAPI.generateSecurityDebtReport();
          break;
        case 'dependency':
          response = await reportsAPI.generateDependencyHealthReport();
          break;
        default:
          response = await reportsAPI.generateExecutiveSummary();
      }
      
      // Handle the response - ensure we get a string
      const data = response.data;
      let content: string;
      
      if (typeof data === 'string') {
        content = data;
      } else if (typeof data.content === 'string') {
        content = data.content;
      } else if (typeof data.report === 'string') {
        content = data.report;
      } else if (data.content && typeof data.content === 'object') {
        // Convert structured report to readable markdown
        content = formatReportToMarkdown(data.content);
      } else if (data.report && typeof data.report === 'object') {
        content = formatReportToMarkdown(data.report);
      } else {
        content = JSON.stringify(data, null, 2);
      }
      
      setReportContent(content);
    } catch (error) {
      console.error('Error generating report:', error);
      setReportContent('Error generating report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const formatReportToMarkdown = (obj: any): string => {
    let md = '';
    
    if (obj.title) {
      md += `# ${obj.title}\n\n`;
    }
    if (obj.generatedAt) {
      md += `*Generated: ${new Date(obj.generatedAt).toLocaleString()}*\n\n`;
    }
    if (obj.release) {
      md += `**Release:** ${obj.release}\n\n`;
    }
    if (obj.riskOverview) {
      md += `## Risk Overview\n\n`;
      if (typeof obj.riskOverview === 'object') {
        Object.entries(obj.riskOverview).forEach(([key, value]) => {
          md += `- **${key}:** ${value}\n`;
        });
      } else {
        md += `${obj.riskOverview}\n`;
      }
      md += '\n';
    }
    if (obj.vulnerabilitySummary) {
      md += `## Vulnerability Summary\n\n`;
      if (typeof obj.vulnerabilitySummary === 'object') {
        Object.entries(obj.vulnerabilitySummary).forEach(([key, value]) => {
          md += `- **${key}:** ${value}\n`;
        });
      } else {
        md += `${obj.vulnerabilitySummary}\n`;
      }
      md += '\n';
    }
    if (obj.keyFindings && Array.isArray(obj.keyFindings)) {
      md += `## Key Findings\n\n`;
      obj.keyFindings.forEach((finding: any, i: number) => {
        if (typeof finding === 'string') {
          md += `${i + 1}. ${finding}\n`;
        } else {
          md += `${i + 1}. ${JSON.stringify(finding)}\n`;
        }
      });
      md += '\n';
    }
    if (obj.recommendations && Array.isArray(obj.recommendations)) {
      md += `## Recommendations\n\n`;
      obj.recommendations.forEach((rec: any, i: number) => {
        if (typeof rec === 'string') {
          md += `${i + 1}. ${rec}\n`;
        } else {
          md += `${i + 1}. ${JSON.stringify(rec)}\n`;
        }
      });
      md += '\n';
    }
    if (obj.aiAnalysis) {
      md += `## AI Analysis\n\n${obj.aiAnalysis}\n\n`;
    }
    
    // Fallback: include any other top-level keys
    const handledKeys = ['title', 'generatedAt', 'reportType', 'release', 'riskOverview', 'vulnerabilitySummary', 'keyFindings', 'recommendations', 'aiAnalysis', 'footer'];
    Object.entries(obj).forEach(([key, value]) => {
      if (!handledKeys.includes(key) && value) {
        md += `## ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}\n\n`;
        if (typeof value === 'string') {
          md += `${value}\n\n`;
        } else {
          md += `${JSON.stringify(value, null, 2)}\n\n`;
        }
      }
    });
    
    return md || JSON.stringify(obj, null, 2);
  };

  const downloadReport = () => {
    if (!reportContent || !selectedReport) return;
    
    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport.id}-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = () => {
    if (!reportContent || !selectedReport) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${selectedReport.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; line-height: 1.6; color: #1a1a1a; }
            h1 { color: #0078D4; border-bottom: 2px solid #0078D4; padding-bottom: 10px; }
            h2 { color: #005a9e; margin-top: 30px; }
            h3 { color: #003f6f; }
            pre { background: #f6f8fa; padding: 15px; border-radius: 6px; overflow-x: auto; }
            code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #0078D4; color: white; }
            tr:nth-child(even) { background: #f6f8fa; }
            .severity-critical { color: #B63A21; font-weight: bold; }
            .severity-high { color: #F95738; font-weight: bold; }
            .severity-medium { color: #d97706; font-weight: bold; }
            .severity-low { color: #22c55e; font-weight: bold; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="border-bottom: none; margin-bottom: 5px;">DigiCert | RSI</h1>
            <p style="color: #666;">Release Security Intelligence Report</p>
          </div>
          ${reportContent.replace(/\n/g, '<br>').replace(/#{1,3}\s/g, '<h2>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            Generated by RSI on ${new Date().toLocaleString()}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-dc-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-dc-blue-500" />
          Report Center
        </h2>
        <p className="text-dc-gray-500 mt-1">
          Generate and download security intelligence reports
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-dc-gray-900">Available Reports</h3>
          <div className="space-y-3">
            {reports.map((report) => (
              <button
                key={report.id}
                onClick={() => generateReport(report)}
                disabled={generating}
                className={`w-full bg-white border rounded-xl p-4 text-left hover:border-dc-blue-300 hover:shadow-md transition-all group ${
                  selectedReport?.id === report.id ? 'border-dc-blue-500 ring-2 ring-dc-blue-100' : 'border-dc-gray-200'
                } disabled:opacity-50`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    selectedReport?.id === report.id ? 'bg-dc-blue-500 text-white' : 'bg-dc-blue-50 text-dc-blue-500 group-hover:bg-dc-blue-100'
                  }`}>
                    {report.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-dc-gray-900 group-hover:text-dc-blue-600 transition-colors">
                      {report.name}
                    </h4>
                    <p className="text-sm text-dc-gray-500 mt-1">
                      {report.description}
                    </p>
                  </div>
                  {generating && selectedReport?.id === report.id && (
                    <Loader className="w-5 h-5 text-dc-blue-500 animate-spin" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report Preview */}
        <div className="bg-white rounded-xl border border-dc-gray-200 shadow-sm overflow-hidden">
          <div className="bg-dc-gray-50 px-6 py-4 border-b border-dc-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-dc-gray-500" />
              <span className="font-medium text-dc-gray-700">Report Preview</span>
            </div>
            {reportContent && !generating && (
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadReport}
                  className="px-3 py-1.5 bg-dc-gray-100 hover:bg-dc-gray-200 text-dc-gray-700 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Markdown
                </button>
                <button
                  onClick={downloadAsPDF}
                  className="px-3 py-1.5 bg-dc-blue-500 hover:bg-dc-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  PDF
                </button>
              </div>
            )}
          </div>
          
          <div className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
            {generating ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader className="w-10 h-10 text-dc-blue-500 animate-spin mb-4" />
                <p className="text-dc-gray-600">Generating report with AI...</p>
                <p className="text-sm text-dc-gray-400 mt-1">This may take a few moments</p>
              </div>
            ) : reportContent ? (
              <pre className="whitespace-pre-wrap text-sm text-dc-gray-800 font-mono leading-relaxed">
                {reportContent}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 bg-dc-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-dc-gray-400" />
                </div>
                <p className="text-dc-gray-600 font-medium">No report selected</p>
                <p className="text-sm text-dc-gray-400 mt-1">
                  Select a report type from the left to generate
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-dc-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dc-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-dc-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dc-gray-900">5</p>
              <p className="text-sm text-dc-gray-500">Report Types</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-dc-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-severity-low" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dc-gray-900">AI-Powered</p>
              <p className="text-sm text-dc-gray-500">Report Generation</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-dc-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dc-gray-900">PDF & MD</p>
              <p className="text-sm text-dc-gray-500">Export Formats</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-dc-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dc-gray-900">Real-time</p>
              <p className="text-sm text-dc-gray-500">Data Analysis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCenter;
